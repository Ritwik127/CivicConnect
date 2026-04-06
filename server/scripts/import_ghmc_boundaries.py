import argparse
import hashlib
import json
import os
import re
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

from dotenv import load_dotenv
from geoalchemy2.elements import WKTElement
from shapely import wkt
from shapely.geometry import MultiPolygon, Polygon, mapping


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

load_dotenv(ROOT_DIR / ".env")

from app import create_app  # noqa: E402
from database import db  # noqa: E402
from models import Circle, Ward, Zone  # noqa: E402


KML_NAMESPACE = {"kml": "http://www.opengis.net/kml/2.2"}


def normalize_code(prefix, value):
    slug = re.sub(r"[^a-z0-9]+", "-", str(value or "").strip().lower()).strip("-")
    digest = hashlib.sha1(str(value or "").encode("utf-8")).hexdigest()[:6]
    max_slug_length = max(1, 32 - len(prefix) - 1 - 1 - len(digest))
    slug = slug[:max_slug_length] if slug else "unknown"
    return f"{prefix}-{slug}-{digest}"


def parse_coordinates(raw_value):
    coordinates = []
    for chunk in (raw_value or "").strip().split():
        lng, lat, *_ = chunk.split(",")
        coordinates.append((float(lng), float(lat)))
    return coordinates


def polygon_from_element(polygon_element):
    outer_text = polygon_element.findtext(".//kml:outerBoundaryIs/kml:LinearRing/kml:coordinates", namespaces=KML_NAMESPACE)
    if not outer_text:
        return None

    shell = parse_coordinates(outer_text)
    holes = []
    for inner in polygon_element.findall(".//kml:innerBoundaryIs", KML_NAMESPACE):
        inner_text = inner.findtext(".//kml:LinearRing/kml:coordinates", namespaces=KML_NAMESPACE)
        ring = parse_coordinates(inner_text)
        if ring:
            holes.append(ring)

    polygon = Polygon(shell=shell, holes=holes)
    if polygon.is_empty:
        return None
    if not polygon.is_valid:
        polygon = polygon.buffer(0)
    return polygon if not polygon.is_empty else None


def multipolygon_from_placemark(placemark):
    polygons = []
    for polygon_element in placemark.findall(".//kml:Polygon", KML_NAMESPACE):
        polygon = polygon_from_element(polygon_element)
        if polygon is not None:
            if isinstance(polygon, Polygon):
                polygons.append(polygon)
            elif isinstance(polygon, MultiPolygon):
                polygons.extend(list(polygon.geoms))

    if not polygons:
        return None

    if len(polygons) == 1:
        merged = polygons[0]
    else:
        multipolygon_wkt = "MULTIPOLYGON ({})".format(
            ", ".join(polygon.wkt[len("POLYGON "):] for polygon in polygons)
        )
        merged = wkt.loads(multipolygon_wkt)

    if not isinstance(merged, (Polygon, MultiPolygon)) or merged.is_empty:
        return None

    return merged


def geometry_to_multipolygon_wkt(geometry):
    if isinstance(geometry, Polygon):
        return f"MULTIPOLYGON ({geometry.wkt[len('POLYGON '):]})"
    return geometry.wkt


def parse_kml_features(kml_path):
    tree = ET.parse(kml_path)
    root = tree.getroot()
    features = []

    for placemark in root.findall(".//kml:Placemark", KML_NAMESPACE):
        geometry = multipolygon_from_placemark(placemark)
        if geometry is None:
            continue

        name = placemark.findtext("kml:name", default="", namespaces=KML_NAMESPACE).strip()
        description = placemark.findtext("kml:description", default="", namespaces=KML_NAMESPACE).strip()
        simple_data = {
            data.attrib.get("name"): (data.text or "").strip()
            for data in placemark.findall(".//kml:SimpleData", KML_NAMESPACE)
        }
        data_fields = {
            data.attrib.get("name"): (data.findtext("kml:value", default="", namespaces=KML_NAMESPACE) or "").strip()
            for data in placemark.findall(".//kml:Data", KML_NAMESPACE)
        }
        features.append(
            {
                "name": name,
                "description": description,
                "simple_data": simple_data,
                "data_fields": data_fields,
                "geometry": geometry,
            }
        )

    return features


def export_geojson(features, output_path):
    payload = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "name": feature["name"],
                    "description": feature["description"],
                    "simple_data": feature["simple_data"],
                    "data_fields": feature["data_fields"],
                },
                "geometry": mapping(feature["geometry"]),
            }
            for feature in features
        ],
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload), encoding="utf-8")


def upsert_zones(zone_features, city, state, country):
    existing_zones = {zone.name: zone for zone in Zone.query.all()}
    zone_records = []

    for feature in zone_features:
        zone = existing_zones.get(feature["name"])
        if zone is None:
            zone = Zone(name=feature["name"])
            db.session.add(zone)
            existing_zones[feature["name"]] = zone

        zone.code = zone.code or normalize_code("ghmc-zone", feature["name"])
        zone.city = city
        zone.state = state
        zone.country = country
        zone.geojson = mapping(feature["geometry"])
        zone.geom = WKTElement(geometry_to_multipolygon_wkt(feature["geometry"]), srid=4326)
        zone.is_active = True
        zone_records.append((zone, feature["geometry"]))

    db.session.flush()
    return zone_records


def extract_feature_name(feature, *candidates):
    for candidate in candidates:
        if candidate == "name":
            value = feature.get("name")
        elif candidate == "description":
            value = feature.get("description")
        else:
            value = feature.get("simple_data", {}).get(candidate) or feature.get("data_fields", {}).get(candidate)
        if value:
            return value.strip()
    return ""


def resolve_zone_for_ward(ward_geometry, zone_records):
    centroid = ward_geometry.representative_point()
    for zone, zone_geometry in zone_records:
        if zone_geometry.contains(centroid) or zone_geometry.touches(centroid):
            return zone
    return None


def upsert_circles(ward_features, zone_records):
    invalid_circles = Circle.query.filter((Circle.name.is_(None)) | (Circle.name == "")).all()
    for circle in invalid_circles:
        db.session.delete(circle)

    existing_circles = {circle.name: circle for circle in Circle.query.all() if circle.name}
    circles = {}

    for feature in ward_features:
        circle_name = extract_feature_name(feature, "CIRCLE")
        if not circle_name:
            continue

        circle = existing_circles.get(circle_name)
        if circle is None:
            circle = Circle(name=circle_name)
            db.session.add(circle)
            existing_circles[circle_name] = circle

        circle.code = circle.code or normalize_code("ghmc-cir", circle_name)
        circle.zone = resolve_zone_for_ward(feature["geometry"], zone_records)
        circle.geojson = circle.geojson or None
        circle.is_active = True
        circles[circle_name] = circle

    db.session.flush()
    return circles


def upsert_wards(ward_features, zone_records, circles):
    invalid_wards = Ward.query.filter((Ward.name.is_(None)) | (Ward.name == "")).all()
    for ward in invalid_wards:
        db.session.delete(ward)

    existing_wards = {ward.name: ward for ward in Ward.query.all()}
    for feature in ward_features:
        ward_name = extract_feature_name(feature, "ward", "WARD", "Name", "name")
        if not ward_name:
            continue

        ward = existing_wards.get(ward_name)
        if ward is None:
            ward = Ward(name=ward_name)
            db.session.add(ward)
            existing_wards[ward_name] = ward

        circle_name = extract_feature_name(feature, "CIRCLE")
        ward.code = ward.code or normalize_code("ghmc-war", ward_name)
        ward.zone = resolve_zone_for_ward(feature["geometry"], zone_records)
        ward.circle = circles.get(circle_name)
        ward.geojson = mapping(feature["geometry"])
        ward.geom = WKTElement(geometry_to_multipolygon_wkt(feature["geometry"]), srid=4326)
        ward.is_active = True


def main():
    parser = argparse.ArgumentParser(description="Import GHMC KML boundaries into PostGIS-backed tables.")
    parser.add_argument("--zones-kml", required=True, help="Path to the GHMC zones KML file.")
    parser.add_argument("--wards-kml", required=True, help="Path to the GHMC wards KML file.")
    parser.add_argument("--export-geojson-dir", help="Optional directory to export converted GeoJSON files.")
    parser.add_argument("--city", default="Hyderabad")
    parser.add_argument("--state", default="Telangana")
    parser.add_argument("--country", default="India")
    args = parser.parse_args()

    zones_path = Path(args.zones_kml)
    wards_path = Path(args.wards_kml)

    zone_features = parse_kml_features(zones_path)
    ward_features = parse_kml_features(wards_path)

    if args.export_geojson_dir:
        export_dir = Path(args.export_geojson_dir)
        export_geojson(zone_features, export_dir / "ghmc_zones.geojson")
        export_geojson(ward_features, export_dir / "ghmc_wards.geojson")

    app = create_app()
    with app.app_context():
        zone_records = upsert_zones(zone_features, args.city, args.state, args.country)
        circles = upsert_circles(ward_features, zone_records)
        upsert_wards(ward_features, zone_records, circles)
        db.session.commit()

    print(
        f"Imported {len(zone_features)} zones and {len(ward_features)} wards "
        f"from {zones_path.name} and {wards_path.name}."
    )


if __name__ == "__main__":
    main()
