from pathlib import Path
import sys

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

load_dotenv(ROOT_DIR / ".env")

from app import create_app  # noqa: E402
from database import db  # noqa: E402
from models import Department, IssueCategory, IssuePriority, Role, RoleType  # noqa: E402


ROLE_SEEDS = [
    {
        "name": RoleType.CITIZEN,
        "label": "Citizen",
        "description": "Reports civic issues",
        "permissions": {"portal": "citizen"},
    },
    {
        "name": RoleType.WORKER,
        "label": "Field Worker",
        "description": "Resolves issues on ground",
        "permissions": {"portal": "worker"},
    },
    {
        "name": RoleType.SUPERVISOR,
        "label": "Supervisor",
        "description": "Coordinates field workers and issue assignment",
        "permissions": {"portal": "worker", "manages_workers": True},
    },
    {
        "name": RoleType.DEPARTMENT_HEAD,
        "label": "Department Head",
        "description": "Oversees department",
        "permissions": {"portal": "admin", "department_scope": True},
    },
    {
        "name": RoleType.ADMIN,
        "label": "Admin",
        "description": "Full system control",
        "permissions": {"portal": "admin", "full_access": True},
    },
    {
        "name": RoleType.SYSTEM,
        "label": "System",
        "description": "Automated services",
        "permissions": {"internal": True},
    },
]


DEPARTMENT_SEEDS = [
    {
        "code": "ROADS",
        "name": "Roads & Infrastructure",
        "description": "Handles potholes, road damage, footpaths, and street repairs.",
        "sla_hours": 48,
    },
    {
        "code": "SWM",
        "name": "Solid Waste Management",
        "description": "Handles garbage collection, waste overflow, and street cleaning.",
        "sla_hours": 24,
    },
    {
        "code": "WATER",
        "name": "Water Supply & Sewerage",
        "description": "Handles water leakage, pipeline issues, and sewerage complaints.",
        "sla_hours": 24,
    },
    {
        "code": "ELECTRIC",
        "name": "Electrical & Street Lighting",
        "description": "Handles street lights and electrical faults.",
        "sla_hours": 24,
    },
    {
        "code": "PARKS",
        "name": "Parks & Urban Forestry",
        "description": "Handles parks, greenery, and fallen tree complaints.",
        "sla_hours": 48,
    },
    {
        "code": "ANIMAL",
        "name": "Animal Control",
        "description": "Handles stray dogs and animal nuisance cases.",
        "sla_hours": 24,
    },
    {
        "code": "TOWN",
        "name": "Town Planning & Building Control",
        "description": "Handles illegal construction and building violations.",
        "sla_hours": 72,
    },
    {
        "code": "DRAIN",
        "name": "Storm Water Drainage",
        "description": "Handles flooding and clogged drain complaints.",
        "sla_hours": 24,
    },
    {
        "code": "ENFORCE",
        "name": "Public Safety & Enforcement",
        "description": "Handles encroachments and civic enforcement violations.",
        "sla_hours": 48,
    },
]


ISSUE_CATEGORY_SEEDS = [
    {
        "slug": "pothole",
        "label": "Pothole",
        "description": "Road surface damage and potholes.",
        "icon": "alert-triangle",
        "default_priority": IssuePriority.HIGH,
        "department_code": "ROADS",
    },
    {
        "slug": "road-damage",
        "label": "Road Damage",
        "description": "Damaged roads, broken dividers, and unsafe surfaces.",
        "icon": "construction",
        "default_priority": IssuePriority.HIGH,
        "department_code": "ROADS",
    },
    {
        "slug": "footpath-damage",
        "label": "Broken Footpath",
        "description": "Broken or unsafe footpaths and sidewalks.",
        "icon": "route",
        "default_priority": IssuePriority.MEDIUM,
        "department_code": "ROADS",
    },
    {
        "slug": "road-sinking",
        "label": "Road Sinking",
        "description": "Road subsidence and collapsing carriageways.",
        "icon": "triangle-alert",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "ROADS",
    },
    {
        "slug": "road-markings",
        "label": "Missing Road Markings",
        "description": "Missing lane markings, zebra crossings, and paint indicators.",
        "icon": "paintbrush",
        "default_priority": IssuePriority.LOW,
        "department_code": "ROADS",
    },
    {
        "slug": "speed-breaker",
        "label": "Speed Breaker Damage",
        "description": "Damaged or missing speed breakers.",
        "icon": "gauge",
        "default_priority": IssuePriority.MEDIUM,
        "department_code": "ROADS",
    },
    {
        "slug": "garbage-overflow",
        "label": "Garbage Overflow",
        "description": "Overflowing garbage bins and accumulated waste.",
        "icon": "trash-2",
        "default_priority": IssuePriority.HIGH,
        "department_code": "SWM",
    },
    {
        "slug": "missed-garbage",
        "label": "Missed Collection",
        "description": "Garbage collection missed on scheduled pickup.",
        "icon": "calendar-x",
        "default_priority": IssuePriority.MEDIUM,
        "department_code": "SWM",
    },
    {
        "slug": "illegal-dumping",
        "label": "Open Dumping",
        "description": "Illegal dumping of waste in public areas.",
        "icon": "trash",
        "default_priority": IssuePriority.HIGH,
        "department_code": "SWM",
    },
    {
        "slug": "street-cleaning",
        "label": "Street Not Cleaned",
        "description": "Street sweeping and cleaning was not completed.",
        "icon": "sparkles",
        "default_priority": IssuePriority.LOW,
        "department_code": "SWM",
    },
    {
        "slug": "dead-animal",
        "label": "Dead Animal Waste",
        "description": "Dead animal remains requiring urgent removal.",
        "icon": "biohazard",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "SWM",
    },
    {
        "slug": "water-leak",
        "label": "Water Leakage",
        "description": "Pipeline leakage and water wastage issues.",
        "icon": "droplets",
        "default_priority": IssuePriority.HIGH,
        "department_code": "WATER",
    },
    {
        "slug": "no-water",
        "label": "No Water Supply",
        "description": "No water supply in the affected area.",
        "icon": "droplet-off",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "WATER",
    },
    {
        "slug": "sewer-overflow",
        "label": "Sewer Overflow",
        "description": "Overflowing sewer lines and sanitation hazards.",
        "icon": "waves",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "WATER",
    },
    {
        "slug": "drain-blockage",
        "label": "Drain Blockage",
        "description": "Blocked drains causing water flow issues.",
        "icon": "circle-slash",
        "default_priority": IssuePriority.HIGH,
        "department_code": "WATER",
    },
    {
        "slug": "dirty-water",
        "label": "Contaminated Water",
        "description": "Dirty or unsafe water supply.",
        "icon": "flask-conical",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "WATER",
    },
    {
        "slug": "streetlight-off",
        "label": "Street Light Not Working",
        "description": "Street light is not functioning.",
        "icon": "lamp",
        "default_priority": IssuePriority.MEDIUM,
        "department_code": "ELECTRIC",
    },
    {
        "slug": "pole-damage",
        "label": "Electric Pole Damage",
        "description": "Damaged electric poles or civic electrical structures.",
        "icon": "utility-pole",
        "default_priority": IssuePriority.HIGH,
        "department_code": "ELECTRIC",
    },
    {
        "slug": "loose-wire",
        "label": "Loose Wires",
        "description": "Loose or exposed electrical wires posing public danger.",
        "icon": "zap",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "ELECTRIC",
    },
    {
        "slug": "transformer-fault",
        "label": "Transformer Issue",
        "description": "Transformer outage or hazardous transformer fault.",
        "icon": "cpu",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "ELECTRIC",
    },
    {
        "slug": "fallen-tree",
        "label": "Fallen Tree",
        "description": "Fallen trees and broken branches in public areas.",
        "icon": "tree-pine",
        "default_priority": IssuePriority.HIGH,
        "department_code": "PARKS",
    },
    {
        "slug": "tree-block",
        "label": "Tree Blocking Road",
        "description": "Tree obstruction blocking roads or footpaths.",
        "icon": "trees",
        "default_priority": IssuePriority.HIGH,
        "department_code": "PARKS",
    },
    {
        "slug": "park-damage",
        "label": "Park Damage",
        "description": "Damage to public parks and recreational spaces.",
        "icon": "leaf",
        "default_priority": IssuePriority.LOW,
        "department_code": "PARKS",
    },
    {
        "slug": "overgrowth",
        "label": "Overgrown Vegetation",
        "description": "Overgrown plants and unmanaged greenery.",
        "icon": "sprout",
        "default_priority": IssuePriority.MEDIUM,
        "department_code": "PARKS",
    },
    {
        "slug": "stray-dogs",
        "label": "Stray Dogs",
        "description": "Complaints related to stray dog presence.",
        "icon": "dog",
        "default_priority": IssuePriority.MEDIUM,
        "department_code": "ANIMAL",
    },
    {
        "slug": "dog-bite",
        "label": "Dog Bite Case",
        "description": "Urgent dog bite incident requiring action.",
        "icon": "siren",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "ANIMAL",
    },
    {
        "slug": "injured-animal",
        "label": "Injured Animal",
        "description": "Injured animal requiring rescue or treatment.",
        "icon": "heart-pulse",
        "default_priority": IssuePriority.HIGH,
        "department_code": "ANIMAL",
    },
    {
        "slug": "animal-nuisance",
        "label": "Animal Nuisance",
        "description": "Animal nuisance in residential or public zones.",
        "icon": "paw-print",
        "default_priority": IssuePriority.LOW,
        "department_code": "ANIMAL",
    },
    {
        "slug": "illegal-building",
        "label": "Illegal Construction",
        "description": "Unauthorized building or construction activity.",
        "icon": "building",
        "default_priority": IssuePriority.HIGH,
        "department_code": "TOWN",
    },
    {
        "slug": "encroachment",
        "label": "Encroachment",
        "description": "Encroachment onto roads, footpaths, or public land.",
        "icon": "shield-alert",
        "default_priority": IssuePriority.HIGH,
        "department_code": "TOWN",
    },
    {
        "slug": "unsafe-building",
        "label": "Unsafe Building",
        "description": "Structurally unsafe building posing public risk.",
        "icon": "building-2",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "TOWN",
    },
    {
        "slug": "water-logging",
        "label": "Water Logging",
        "description": "Severe waterlogging in roads or low-lying areas.",
        "icon": "cloud-rain",
        "default_priority": IssuePriority.CRITICAL,
        "department_code": "DRAIN",
    },
    {
        "slug": "drain-overflow",
        "label": "Drain Overflow",
        "description": "Overflowing storm water drain.",
        "icon": "waves",
        "default_priority": IssuePriority.HIGH,
        "department_code": "DRAIN",
    },
    {
        "slug": "storm-block",
        "label": "Blocked Storm Drain",
        "description": "Storm drain blockage causing backup or pooling.",
        "icon": "circle-slash-2",
        "default_priority": IssuePriority.HIGH,
        "department_code": "DRAIN",
    },
    {
        "slug": "illegal-parking",
        "label": "Illegal Parking",
        "description": "Unauthorized or obstructive parking in public spaces.",
        "icon": "car",
        "default_priority": IssuePriority.MEDIUM,
        "department_code": "ENFORCE",
    },
    {
        "slug": "obstruction",
        "label": "Road Obstruction",
        "description": "Road obstruction affecting mobility or safety.",
        "icon": "octagon-alert",
        "default_priority": IssuePriority.HIGH,
        "department_code": "ENFORCE",
    },
    {
        "slug": "nuisance",
        "label": "Public Nuisance",
        "description": "General public nuisance and civic disturbance complaints.",
        "icon": "megaphone",
        "default_priority": IssuePriority.LOW,
        "department_code": "ENFORCE",
    },
]


def seed_roles():
    existing = {role.name: role for role in Role.query.all()}

    for payload in ROLE_SEEDS:
        role = existing.get(payload["name"])
        if role is None:
            role = Role(name=payload["name"])
            db.session.add(role)

        role.label = payload["label"]
        role.description = payload["description"]
        role.permissions = payload["permissions"]


def seed_departments():
    existing = {department.code: department for department in Department.query.all()}

    for payload in DEPARTMENT_SEEDS:
        department = existing.get(payload["code"])
        if department is None:
            department = Department(code=payload["code"])
            db.session.add(department)

        department.name = payload["name"]
        department.description = payload["description"]
        department.sla_hours = payload["sla_hours"]
        department.is_active = True


def seed_issue_categories():
    departments = {department.code: department for department in Department.query.all()}
    existing = {category.slug: category for category in IssueCategory.query.all()}

    for payload in ISSUE_CATEGORY_SEEDS:
        category = existing.get(payload["slug"])
        if category is None:
            category = IssueCategory(slug=payload["slug"])
            db.session.add(category)

        category.label = payload["label"]
        category.description = payload["description"]
        category.icon = payload["icon"]
        category.default_priority = payload["default_priority"]
        category.department = departments[payload["department_code"]]
        category.is_active = True


def main():
    app = create_app()
    with app.app_context():
        seed_roles()
        seed_departments()
        db.session.flush()
        seed_issue_categories()
        db.session.commit()

        print(
            {
                "roles": Role.query.count(),
                "departments": Department.query.count(),
                "issue_categories": IssueCategory.query.count(),
            }
        )


if __name__ == "__main__":
    main()
