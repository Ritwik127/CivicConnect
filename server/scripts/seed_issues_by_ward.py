import argparse
import random
import sys
import uuid
from pathlib import Path

from dotenv import load_dotenv
from geoalchemy2.elements import WKTElement
from sqlalchemy import text


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

load_dotenv(ROOT_DIR / ".env")

from app import create_app  # noqa: E402
from database import db  # noqa: E402
from models import Department, Issue, IssueCategory, IssueSource, Ward  # noqa: E402


TITLE_TEMPLATES = {
    "pothole": [
        "Deep pothole near main carriageway",
        "Pothole causing traffic slowdown",
        "Dangerous pothole on inner road",
    ],
    "road-damage": [
        "Broken road surface needs repair",
        "Road edge damage near junction",
        "Damaged carriageway affecting commuters",
    ],
    "footpath-damage": [
        "Footpath slabs broken and unsafe",
        "Pedestrian path damaged",
        "Footpath surface cracked badly",
    ],
    "road-sinking": [
        "Road sinking reported near drainage line",
        "Surface subsidence creating hazard",
        "Section of road collapsing",
    ],
    "road-markings": [
        "Lane markings faded and unclear",
        "Zebra crossing markings missing",
        "Road paint indicators need repainting",
    ],
    "speed-breaker": [
        "Damaged speed breaker near school",
        "Speed breaker eroded and unsafe",
        "Missing speed breaker markings",
    ],
    "garbage-overflow": [
        "Garbage overflow near collection point",
        "Overflowing waste pile on roadside",
        "Waste bin overflow spreading litter",
    ],
    "missed-garbage": [
        "Garbage pickup missed in locality",
        "Waste collection skipped for street",
        "Household garbage not collected",
    ],
    "illegal-dumping": [
        "Illegal dumping on vacant stretch",
        "Construction debris dumped openly",
        "Open dumping causing foul smell",
    ],
    "street-cleaning": [
        "Street sweeping not completed",
        "Roadside litter remains uncleared",
        "Public lane not cleaned properly",
    ],
    "dead-animal": [
        "Dead animal removal required urgently",
        "Animal carcass causing sanitation risk",
        "Dead animal reported on roadside",
    ],
    "water-leak": [
        "Water leakage from supply line",
        "Pipeline leak wasting water",
        "Continuous water seepage on street",
    ],
    "no-water": [
        "No water supply in affected area",
        "Residents reporting dry taps",
        "Water supply disruption in locality",
    ],
    "sewer-overflow": [
        "Sewer overflow on residential street",
        "Manhole overflow causing sanitation issue",
        "Sewage spill reported near homes",
    ],
    "drain-blockage": [
        "Blocked drain causing stagnant water",
        "Drain choke reported by residents",
        "Storm drain blocked with debris",
    ],
    "dirty-water": [
        "Contaminated water supply complaint",
        "Dirty water coming from taps",
        "Water quality issue needs inspection",
    ],
    "streetlight-off": [
        "Street light not working at night",
        "Lamp post dark on main lane",
        "Streetlight outage reported",
    ],
    "pole-damage": [
        "Electric pole damaged and leaning",
        "Pole base cracked and unsafe",
        "Utility pole damage needs inspection",
    ],
    "loose-wire": [
        "Loose wire hanging dangerously",
        "Electrical cable exposed near road",
        "Live wire complaint from residents",
    ],
    "transformer-fault": [
        "Transformer fault causing disruption",
        "Electrical transformer sparking",
        "Transformer issue reported nearby",
    ],
    "fallen-tree": [
        "Fallen tree blocking the road",
        "Large branch fallen after weather event",
        "Tree collapse affecting movement",
    ],
    "tree-block": [
        "Tree branches blocking public way",
        "Overhanging tree obstructing vehicles",
        "Tree blockage needs pruning",
    ],
    "park-damage": [
        "Park infrastructure damaged",
        "Play area fixture broken in park",
        "Park pathway and furniture damaged",
    ],
    "overgrowth": [
        "Vegetation overgrowth in public space",
        "Bushes overgrown near walkway",
        "Overgrowth reducing visibility in park",
    ],
    "stray-dogs": [
        "Stray dogs causing repeated nuisance",
        "Dog pack reported in residential lane",
        "Aggressive stray dogs seen in area",
    ],
    "dog-bite": [
        "Dog bite incident reported",
        "Resident injured by stray dog",
        "Urgent dog bite response needed",
    ],
    "injured-animal": [
        "Injured animal needs rescue",
        "Animal hurt on roadside",
        "Rescue required for wounded animal",
    ],
    "animal-nuisance": [
        "Animal nuisance disturbing locality",
        "Repeated nuisance from roaming animals",
        "Public complaint about animal menace",
    ],
    "illegal-building": [
        "Suspected illegal building activity",
        "Unauthorized construction reported",
        "Building violation needs inspection",
    ],
    "encroachment": [
        "Public land encroachment reported",
        "Road margin encroached by structure",
        "Encroachment affecting access",
    ],
    "unsafe-building": [
        "Unsafe building condition reported",
        "Structure appears hazardous",
        "Building safety inspection required",
    ],
    "water-logging": [
        "Water logging after drainage failure",
        "Street water accumulation reported",
        "Water stagnation affecting traffic",
    ],
    "drain-overflow": [
        "Drain overflow near residential area",
        "Overflowing storm drain complaint",
        "Drain spill on road shoulder",
    ],
    "storm-block": [
        "Storm drain blocked with silt",
        "Rainwater outlet blocked",
        "Stormwater passage obstructed",
    ],
    "illegal-parking": [
        "Illegal parking causing obstruction",
        "Vehicles parked in no-parking zone",
        "Improper parking blocking movement",
    ],
    "obstruction": [
        "Obstruction on public road",
        "Civic obstruction affecting access",
        "Unauthorized blockage reported",
    ],
    "nuisance": [
        "Public nuisance complaint received",
        "Repeated nuisance in busy stretch",
        "Local nuisance needs enforcement",
    ],
}


DESCRIPTION_TEMPLATES = [
    "Residents from {ward_name} reported this issue near {landmark}. Immediate inspection is requested.",
    "This complaint was raised in {ward_name} close to {landmark}. The issue has been affecting daily movement and safety.",
    "Multiple citizens in {ward_name} flagged this problem around {landmark}. Please inspect and resolve as per SLA.",
]


LANDMARKS = [
    "the main road junction",
    "the local market area",
    "the bus stop",
    "the school stretch",
    "the colony entrance",
    "the community hall",
    "the inner lane",
    "the ward office road",
]


def parse_args():
    parser = argparse.ArgumentParser(
        description="Seed 10-15 civic issues per department per ward with latitude and longitude."
    )
    parser.add_argument("--min-per-dept-ward", type=int, default=10)
    parser.add_argument("--max-per-dept-ward", type=int, default=15)
    parser.add_argument("--ward-limit", type=int, default=None)
    parser.add_argument("--department-code", action="append", dest="department_codes")
    parser.add_argument("--commit-batch", type=int, default=200)
    return parser.parse_args()


def pick_points_for_ward(ward_id, count):
    rows = db.session.execute(
        text(
            """
            SELECT
              ST_Y((dumped.geom)::geometry) AS latitude,
              ST_X((dumped.geom)::geometry) AS longitude
            FROM (
              SELECT (ST_Dump(ST_GeneratePoints(geom::geometry, :count))).geom
              FROM wards
              WHERE id = :ward_id
                AND geom IS NOT NULL
            ) AS dumped
            """
        ),
        {"ward_id": str(ward_id), "count": count},
    ).mappings().all()

    if rows:
        return [(float(row["latitude"]), float(row["longitude"])) for row in rows]

    fallback = db.session.execute(
        text(
            """
            SELECT
              ST_Y(ST_PointOnSurface(geom::geometry)) AS latitude,
              ST_X(ST_PointOnSurface(geom::geometry)) AS longitude
            FROM wards
            WHERE id = :ward_id
              AND geom IS NOT NULL
            """
        ),
        {"ward_id": str(ward_id)},
    ).mappings().first()

    if fallback:
        return [(float(fallback["latitude"]), float(fallback["longitude"]))] * count

    return []


def title_for_category(category):
    options = TITLE_TEMPLATES.get(category.slug)
    if options:
        return random.choice(options)
    return f"{category.label} reported"


def description_for_issue(ward_name):
    return random.choice(DESCRIPTION_TEMPLATES).format(
        ward_name=ward_name,
        landmark=random.choice(LANDMARKS),
    )


def build_issue(category, department, ward, latitude, longitude):
    title = title_for_category(category)
    description = description_for_issue(ward.name)
    return Issue(
        id=uuid.uuid4(),
        title=title,
        description=description,
        source=IssueSource.SYSTEM,
        category_id=category.id,
        reporter_name="CivicConnect Seeder",
        reporter_email="seeder@civicconnect.local",
        department_id=department.id,
        zone_id=ward.zone_id,
        ward_id=ward.id,
        priority=category.default_priority,
        address=f"{ward.name}, {ward.zone.name if ward.zone else 'GHMC'}",
        latitude=latitude,
        longitude=longitude,
        location=WKTElement(f"POINT({longitude} {latitude})", srid=4326),
        ai_tags=["seeded", department.code.lower(), category.slug],
        ai_summary="Seeded issue for ward-level civic operations testing.",
    )


def main():
    args = parse_args()
    if args.min_per_dept_ward < 1 or args.max_per_dept_ward < args.min_per_dept_ward:
        raise SystemExit("Invalid range. Ensure min >= 1 and max >= min.")

    app = create_app()
    with app.app_context():
        departments_query = Department.query.filter_by(is_active=True).order_by(Department.code.asc())
        if args.department_codes:
            departments_query = departments_query.filter(Department.code.in_(args.department_codes))
        departments = departments_query.all()
        wards_query = Ward.query.filter_by(is_active=True).order_by(Ward.name.asc())
        if args.ward_limit:
            wards_query = wards_query.limit(args.ward_limit)
        wards = wards_query.all()

        if not departments:
            raise SystemExit("No active departments found.")
        if not wards:
            raise SystemExit("No active wards found.")

        categories_by_department = {}
        for department in departments:
            categories = (
                IssueCategory.query.filter_by(department_id=department.id, is_active=True)
                .order_by(IssueCategory.slug.asc())
                .all()
            )
            if not categories:
                raise SystemExit(f"No active categories found for department {department.code}.")
            categories_by_department[department.id] = categories

        created = 0
        auto_assigned = 0
        app_auto_assign_issue = getattr(app, "auto_assign_issue", None)

        for ward_index, ward in enumerate(wards, start=1):
            for department in departments:
                count = random.randint(args.min_per_dept_ward, args.max_per_dept_ward)
                points = pick_points_for_ward(ward.id, count)
                if not points:
                    print(f"Skipping ward {ward.name}: no geometry point available.")
                    continue

                categories = categories_by_department[department.id]
                for issue_index in range(count):
                    latitude, longitude = points[issue_index % len(points)]
                    category = random.choice(categories)
                    issue = build_issue(category, department, ward, latitude, longitude)
                    db.session.add(issue)
                    db.session.flush()

                    if app_auto_assign_issue:
                        app_auto_assign_issue(issue, category, reporter=None)
                        auto_assigned += 1

                    created += 1
                    if created % args.commit_batch == 0:
                        db.session.commit()
                        print(
                            f"Committed {created} issues so far "
                            f"(ward {ward_index}/{len(wards)}, department {department.code})."
                        )

            db.session.commit()
            print(f"Finished ward {ward_index}/{len(wards)}: {ward.name}")

        db.session.commit()
        print(
            {
                "wards_processed": len(wards),
                "departments_processed": len(departments),
                "issues_created": created,
                "issues_auto_assigned": auto_assigned,
            }
        )


if __name__ == "__main__":
    main()
