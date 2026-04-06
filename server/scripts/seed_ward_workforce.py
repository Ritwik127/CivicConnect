import hashlib
import re
import uuid
from pathlib import Path
import sys

from dotenv import load_dotenv


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

load_dotenv(ROOT_DIR / ".env")

from app import create_app  # noqa: E402
from database import db  # noqa: E402
from models import (  # noqa: E402
    Department,
    Role,
    RoleType,
    Team,
    User,
    UserStatus,
    Ward,
    WorkerAvailabilityStatus,
)


WORKERS_PER_TEAM = 2


def slugify(value):
    return re.sub(r"[^a-z0-9]+", "-", str(value or "").strip().lower()).strip("-")


def short_code(prefix, *parts):
    digest = hashlib.sha1("|".join(str(part) for part in parts).encode("utf-8")).hexdigest()[:6]
    base = slugify("-".join(str(part) for part in parts))
    max_base = max(1, 32 - len(prefix) - 1 - 1 - len(digest))
    return f"{prefix}-{base[:max_base]}-{digest}"


def build_email(kind, department, ward, index=None):
    ward_slug = slugify(ward.name)[:30] or "ward"
    dept_slug = slugify(department.code)[:12] or "dept"
    suffix = f"-{index}" if index is not None else ""
    return f"{kind}{suffix}.{dept_slug}.{ward_slug}@civicconnect.local"


def build_employee_code(kind, department, ward, index=None):
    suffix = f"-{index}" if index is not None else ""
    return short_code(kind[:3].upper(), department.code, ward.code or ward.name, suffix)


def upsert_user(existing_users, *, email, full_name, role, department, ward, team, employee_code):
    user = existing_users.get(email)
    created = False
    if user is None:
        user = User(id=uuid.uuid4(), email=email)
        db.session.add(user)
        existing_users[email] = user
        created = True

    user.full_name = full_name
    user.employee_code = employee_code
    user.role_id = role.id
    user.department_id = department.id
    user.zone_id = ward.zone_id
    user.team_id = team.id
    user.status = UserStatus.ACTIVE
    user.email_alerts = True
    user.sms_alerts = False
    user.push_alerts = True
    if role.name == RoleType.WORKER:
        user.availability_status = WorkerAvailabilityStatus.AVAILABLE
    else:
        user.availability_status = WorkerAvailabilityStatus.ON_DUTY
    return user, created


def main():
    app = create_app()
    with app.app_context():
        departments = Department.query.filter_by(is_active=True).order_by(Department.code.asc()).all()
        wards = Ward.query.filter_by(is_active=True).order_by(Ward.name.asc()).all()
        roles = {role.name: role for role in Role.query.all()}
        existing_teams = {team.code: team for team in Team.query.all()}
        existing_users = {user.email: user for user in User.query.all()}

        created_teams = 0
        created_users = 0

        for department in departments:
            for ward in wards:
                team_code = short_code("TEAM", department.code, ward.code or ward.name)
                team = existing_teams.get(team_code)
                if team is None:
                    team = Team(id=uuid.uuid4(), code=team_code)
                    db.session.add(team)
                    existing_teams[team_code] = team
                    created_teams += 1

                team.name = f"{department.code} - {ward.name}"
                team.description = f"{department.name} team serving {ward.name}"
                team.department_id = department.id
                team.zone_id = ward.zone_id
                team.is_active = True
                db.session.flush()

                head_email = build_email("head", department, ward)
                head_user, head_created = upsert_user(
                    existing_users,
                    email=head_email,
                    full_name=f"{department.name} Head - {ward.name}",
                    role=roles[RoleType.DEPARTMENT_HEAD],
                    department=department,
                    ward=ward,
                    team=team,
                    employee_code=build_employee_code("HEAD", department, ward),
                )
                if head_created:
                    created_users += 1

                team.lead_user_id = head_user.id

                for worker_index in range(1, WORKERS_PER_TEAM + 1):
                    worker_email = build_email("worker", department, ward, worker_index)
                    _worker_user, worker_created = upsert_user(
                        existing_users,
                        email=worker_email,
                        full_name=f"{department.name} Worker {worker_index} - {ward.name}",
                        role=roles[RoleType.WORKER],
                        department=department,
                        ward=ward,
                        team=team,
                        employee_code=build_employee_code("WRK", department, ward, worker_index),
                    )
                    if worker_created:
                        created_users += 1

        db.session.commit()

        print(
            {
                "teams_created": created_teams,
                "users_created": created_users,
                "teams_total": Team.query.count(),
                "users_total": User.query.count(),
            }
        )


if __name__ == "__main__":
    main()
