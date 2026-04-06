from pathlib import Path
import sys

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

load_dotenv(ROOT_DIR / ".env")

from app import create_app  # noqa: E402
from database import db  # noqa: E402
from models import Department, DepartmentZone, Zone  # noqa: E402


def main():
    app = create_app()
    with app.app_context():
        departments = Department.query.filter_by(is_active=True).order_by(Department.code.asc()).all()
        zones = Zone.query.filter_by(is_active=True).order_by(Zone.name.asc()).all()

        existing_pairs = {
            (str(link.department_id), str(link.zone_id))
            for link in DepartmentZone.query.all()
        }

        created = 0
        for department in departments:
            for zone in zones:
                pair = (str(department.id), str(zone.id))
                if pair in existing_pairs:
                    continue

                db.session.add(
                    DepartmentZone(
                        department_id=department.id,
                        zone_id=zone.id,
                    )
                )
                existing_pairs.add(pair)
                created += 1

        db.session.commit()

        print(
            {
                "departments": len(departments),
                "zones": len(zones),
                "department_zones_created": created,
                "department_zones_total": DepartmentZone.query.count(),
            }
        )


if __name__ == "__main__":
    main()
