import os
from datetime import datetime, timedelta
from functools import wraps

from dotenv import load_dotenv
from flask import Flask, g, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    current_user,
    get_jwt_identity,
    set_access_cookies,
    unset_jwt_cookies,
    verify_jwt_in_request,
)
from flask_migrate import Migrate
from sqlalchemy.exc import IntegrityError
from sqlalchemy import text
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename

from database import db


load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


def _get_allowed_origins():
    raw_origins = os.getenv("CLIENT_ORIGIN", "http://localhost:5173,http://127.0.0.1:5173")
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


def _get_env_bool(name, default=False):
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    return raw_value.strip().lower() in {"1", "true", "yes", "on"}


def _get_env_int(name, default):
    raw_value = os.getenv(name)
    if raw_value is None:
        return default
    try:
        return int(raw_value)
    except ValueError as exc:
        raise RuntimeError(f"{name} must be an integer") from exc


def _normalize_path(path):
    return path.rstrip("/") or "/"


def _slugify_filename_prefix(value):
    sanitized = "".join(char.lower() if char.isalnum() else "-" for char in str(value or "file"))
    while "--" in sanitized:
        sanitized = sanitized.replace("--", "-")
    return sanitized.strip("-") or "file"


class ApiError(Exception):
    def __init__(self, status_code, code, message, details=None):
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details or {}


def _error_response(status_code, code, message, details=None):
    payload = {
        "error": {
            "code": code,
            "message": message,
        }
    }
    if details:
        payload["error"]["details"] = details
    return jsonify(payload), status_code


def _require_json_payload():
    payload = request.get_json(silent=True)
    if payload is None or not isinstance(payload, dict):
        raise ApiError(400, "invalid_json", "Request body must be a JSON object.")
    return payload


def _normalize_email(value):
    return str(value or "").strip().lower()


def _validate_required_string(payload, field, label=None, max_length=None):
    raw_value = payload.get(field)
    value = str(raw_value or "").strip()
    if not value:
        raise ApiError(400, "validation_error", "Invalid request payload.", {field: [f"{label or field} is required."]})
    if max_length and len(value) > max_length:
        raise ApiError(
            400,
            "validation_error",
            "Invalid request payload.",
            {field: [f"{label or field} must be at most {max_length} characters."]},
        )
    return value


def _validate_optional_string(payload, field, max_length=None):
    if field not in payload or payload.get(field) is None:
        return None
    value = str(payload.get(field)).strip()
    if max_length and len(value) > max_length:
        raise ApiError(
            400,
            "validation_error",
            "Invalid request payload.",
            {field: [f"{field} must be at most {max_length} characters."]},
        )
    return value


def _validate_email(payload, field="email", required=True):
    value = _normalize_email(payload.get(field))
    if not value:
        if required:
            raise ApiError(400, "validation_error", "Invalid request payload.", {field: ["Email is required."]})
        return None
    if "@" not in value or "." not in value.split("@")[-1]:
        raise ApiError(400, "validation_error", "Invalid request payload.", {field: ["Email must be valid."]})
    return value


def _validate_bool(payload, field):
    value = payload.get(field)
    if not isinstance(value, bool):
        raise ApiError(400, "validation_error", "Invalid request payload.", {field: [f"{field} must be a boolean."]})
    return value


def _validate_optional_number(payload, field):
    if field not in payload or payload.get(field) is None:
        return None
    value = payload.get(field)
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ApiError(400, "validation_error", "Invalid request payload.", {field: [f"{field} must be a number."]})
    return value


def _validate_role(payload, role_enum):
    raw_role = str(payload.get("role") or "citizen").strip().lower()
    try:
        return role_enum(raw_role)
    except ValueError as exc:
        allowed_values = ", ".join(role.value for role in role_enum)
        raise ApiError(
            400,
            "validation_error",
            "Invalid request payload.",
            {"role": [f"Role must be one of: {allowed_values}."]},
        ) from exc


def _validate_slug(payload, field):
    value = str(payload.get(field) or "").strip().lower()
    if not value:
        raise ApiError(400, "validation_error", "Invalid request payload.", {field: [f"{field} is required."]})
    return value


def _serialize_notification(notification):
    return {
        "id": str(notification.id),
        "title": notification.title,
        "body": notification.body,
        "type": notification.type.value,
        "is_read": notification.is_read,
        "created_at": notification.created_at.isoformat(),
        "issue_id": str(notification.issue_id) if notification.issue_id else None,
    }


def _serialize_issue(issue):
    return {
        "id": str(issue.id),
        "tracking_code": issue.tracking_code,
        "title": issue.title,
        "description": issue.description,
        "source": issue.source.value,
        "priority": issue.priority.value,
        "status": issue.status.value,
        "address": issue.address,
        "latitude": issue.latitude,
        "longitude": issue.longitude,
        "ai_confidence": issue.ai_confidence,
        "ai_tags": issue.ai_tags,
        "department": issue.department.name if issue.department else None,
        "zone": issue.zone.name if issue.zone else None,
        "ward": issue.ward.name if issue.ward else None,
        "circle": issue.ward.circle.name if issue.ward and issue.ward.circle else None,
        "category": issue.category.label if issue.category else None,
        "created_at": issue.created_at.isoformat(),
        "resolved_at": issue.resolved_at.isoformat() if issue.resolved_at else None,
    }


def _serialize_task(task):
    return {
        "id": str(task.id),
        "task_code": task.task_code,
        "issue_id": str(task.issue_id),
        "title": task.title,
        "description": task.description,
        "status": task.status.value,
        "priority": task.priority.value,
        "worker_id": str(task.worker_id) if task.worker_id else None,
        "supervisor_id": str(task.supervisor_id) if task.supervisor_id else None,
        "department_id": str(task.department_id) if task.department_id else None,
        "due_at": task.due_at.isoformat() if task.due_at else None,
        "assigned_at": task.assigned_at.isoformat() if task.assigned_at else None,
        "started_at": task.started_at.isoformat() if task.started_at else None,
        "submitted_at": task.submitted_at.isoformat() if task.submitted_at else None,
        "approved_at": task.approved_at.isoformat() if task.approved_at else None,
        "resolution_notes": task.resolution_notes,
        "proof_submitted": task.proof_submitted,
        "proof_verified": task.proof_verified,
        "issue_title": task.issue.title if task.issue else None,
        "issue_category": task.issue.category.label if task.issue and task.issue.category else None,
        "issue_address": task.issue.address if task.issue else None,
        "issue_coordinates": {
            "latitude": task.issue.latitude if task.issue else None,
            "longitude": task.issue.longitude if task.issue else None,
        },
        "proofs": [
            {
                "id": str(proof.id),
                "file_url": proof.file_url,
                "notes": proof.notes,
                "uploaded_at": proof.uploaded_at.isoformat() if proof.uploaded_at else None,
            }
            for proof in task.proofs
        ],
        "issue": _serialize_issue(task.issue) if task.issue else None,
    }


def _serialize_department(department):
    return {
        "id": str(department.id),
        "code": department.code,
        "name": department.name,
        "description": department.description,
        "sla_hours": department.sla_hours,
        "email": department.email,
        "phone": department.phone,
        "is_active": department.is_active,
        "head_user_id": str(department.head_user_id) if department.head_user_id else None,
        "zones": [link.zone.name for link in department.zones if link.zone],
    }


def _serialize_user(user):
    return {
        "id": str(user.id),
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "status": user.status.value,
        "role": user.role.name.value if user.role else None,
        "department": user.department.name if user.department else None,
        "zone": user.zone.name if user.zone else None,
        "email_alerts": user.email_alerts,
        "sms_alerts": user.sms_alerts,
        "push_alerts": user.push_alerts,
        "last_login_at": user.last_login_at.isoformat() if user.last_login_at else None,
    }


def create_app():
    app = Flask(__name__)

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set in server/.env")
    jwt_secret_key = os.getenv("JWT_SECRET_KEY") or os.getenv("SECRET_KEY")
    if not jwt_secret_key:
        raise RuntimeError("JWT_SECRET_KEY is not set in server/.env")

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = jwt_secret_key
    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(
        minutes=_get_env_int("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", 60)
    )
    app.config["JWT_ACCESS_COOKIE_NAME"] = os.getenv("JWT_ACCESS_COOKIE_NAME", "civicconnect_access_token")
    app.config["JWT_COOKIE_SECURE"] = _get_env_bool("JWT_COOKIE_SECURE", False)
    app.config["JWT_COOKIE_SAMESITE"] = os.getenv("JWT_COOKIE_SAMESITE", "Lax")
    app.config["JWT_COOKIE_CSRF_PROTECT"] = _get_env_bool("JWT_COOKIE_CSRF_PROTECT", False)
    app.config["JWT_COOKIE_DOMAIN"] = os.getenv("JWT_COOKIE_DOMAIN") or None
    app.config["JWT_COOKIE_PATH"] = os.getenv("JWT_COOKIE_PATH", "/")

    CORS(
        app,
        resources={r"/api/*": {"origins": _get_allowed_origins()}},
        supports_credentials=True,
    )
    db.init_app(app)
    Migrate(app, db)
    jwt = JWTManager(app)

    # Import models after db init setup so SQLAlchemy metadata is registered.
    import models

    User = models.User
    Role = models.Role
    Issue = models.Issue
    Task = models.Task
    Notification = models.Notification
    Department = models.Department
    DepartmentZone = models.DepartmentZone
    AuditLog = models.AuditLog
    AnalyticsSnapshot = models.AnalyticsSnapshot
    SystemSetting = models.SystemSetting
    IssueCategory = models.IssueCategory
    IssueAssignment = models.IssueAssignment
    IssueStatusHistory = models.IssueStatusHistory
    RoleType = models.RoleType
    Team = models.Team
    UserStatus = models.UserStatus
    Ward = models.Ward
    WorkerAvailabilityStatus = models.WorkerAvailabilityStatus
    Zone = models.Zone

    public_api_paths = {
        "/api/health",
        "/api/health/db",
        "/api/public/landing",
        "/api/issues",
        "/api/auth/register",
        "/api/auth/login",
        "/api/issues/anonymous",
    }
    public_api_prefixes = ("/api/issues/track/",)

    @jwt.user_lookup_loader
    def load_jwt_user(_jwt_header, jwt_data):
        identity = jwt_data.get("sub")
        if not identity:
            return None
        return db.session.get(User, identity)

    @jwt.unauthorized_loader
    def handle_missing_jwt(reason):
        return _error_response(401, "authentication_required", "Authentication required.", {"reason": reason})

    @jwt.invalid_token_loader
    def handle_invalid_jwt(reason):
        return _error_response(401, "invalid_token", "Invalid authentication token.", {"reason": reason})

    @jwt.expired_token_loader
    def handle_expired_jwt(_jwt_header, _jwt_payload):
        return _error_response(401, "token_expired", "Authentication token expired.")

    @jwt.revoked_token_loader
    def handle_revoked_jwt(_jwt_header, _jwt_payload):
        return _error_response(401, "token_revoked", "Authentication token revoked.")

    @jwt.user_lookup_error_loader
    def handle_missing_jwt_user(_jwt_header, _jwt_payload):
        return _error_response(401, "invalid_token_user", "Authenticated user no longer exists.")

    @app.errorhandler(ApiError)
    def handle_api_error(error):
        return _error_response(error.status_code, error.code, error.message, error.details)

    @app.errorhandler(404)
    def handle_not_found(_error):
        if request.path.startswith("/api/"):
            return _error_response(404, "not_found", "Resource not found.")
        return _error_response(404, "not_found", "Resource not found.")

    @app.errorhandler(405)
    def handle_method_not_allowed(_error):
        return _error_response(405, "method_not_allowed", "Method not allowed.")

    @app.errorhandler(IntegrityError)
    def handle_integrity_error(_error):
        db.session.rollback()
        return _error_response(409, "conflict", "Request conflicts with existing data.")

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        if isinstance(error, ApiError):
            raise error
        if hasattr(error, "code") and hasattr(error, "description"):
            return _error_response(error.code, "request_error", str(error.description))
        return _error_response(500, "internal_server_error", "An unexpected server error occurred.")

    def issue_access_token_response(user, message="Login success"):
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role.name.value if user.role else None},
        )
        response = jsonify(
            {
                "message": message,
                "access_token_expires_minutes": _get_env_int("JWT_ACCESS_TOKEN_EXPIRES_MINUTES", 60),
                "user": _serialize_user(user),
            }
        )
        set_access_cookies(response, access_token)
        return response

    def clear_access_token_response(message="Logout success"):
        response = jsonify({"message": message})
        unset_jwt_cookies(response)
        return response

    def resolve_current_user(optional=True):
        verify_jwt_in_request(optional=optional)
        if not get_jwt_identity():
            return None
        return current_user

    def is_public_api_path(path):
        normalized_path = _normalize_path(path)
        return normalized_path in public_api_paths or any(
            normalized_path.startswith(prefix) for prefix in public_api_prefixes
        )

    def require_api_auth():
        return resolve_current_user(optional=False)

    def require_roles(*allowed_roles):
        normalized_roles = {
            role.value if isinstance(role, RoleType) else str(role).strip().lower()
            for role in allowed_roles
        }

        def decorator(view_func):
            @wraps(view_func)
            def wrapped(*args, **kwargs):
                user = g.current_user or require_api_auth()
                user_role = user.role.name.value if user and user.role else None
                if user_role not in normalized_roles:
                    raise ApiError(403, "forbidden", "You do not have access to this resource.")
                return view_func(*args, **kwargs)

            return wrapped

        return decorator

    def get_authenticated_user():
        user = g.current_user or require_api_auth()
        if not user:
            raise ApiError(401, "authentication_required", "Authentication required.")
        return user

    def get_authenticated_user_role(user):
        return user.role.name if user and user.role else None

    def get_scoped_user(target_user_id=None, allow_admin_override=False):
        authenticated_user = get_authenticated_user()
        authenticated_role = get_authenticated_user_role(authenticated_user)

        if target_user_id and str(authenticated_user.id) != str(target_user_id):
            if not (allow_admin_override and authenticated_role == RoleType.ADMIN):
                raise ApiError(403, "forbidden", "You do not have access to this resource.")
            scoped_user = db.session.get(User, target_user_id)
            if not scoped_user:
                raise ApiError(404, "not_found", "User not found.")
            return scoped_user

        return authenticated_user

    def resolve_issue_category(category_slug):
        category = IssueCategory.query.filter_by(slug=category_slug, is_active=True).first()
        if category:
            return category

        category = IssueCategory.query.filter_by(label=category_slug.replace("-", " ").title(), is_active=True).first()
        if category:
            return category

        raise ApiError(
            400,
            "validation_error",
            "Invalid request payload.",
            {"category": [f"Unknown issue category '{category_slug}'."]},
        )

    def resolve_issue_zone(payload, reporter=None):
        zone_id = _validate_optional_string(payload, "zone_id")
        zone_code = _validate_optional_string(payload, "zone_code")
        latitude = _validate_optional_number(payload, "latitude")
        longitude = _validate_optional_number(payload, "longitude")

        if zone_id:
            zone = Zone.query.filter_by(id=zone_id, is_active=True).first()
            if not zone:
                raise ApiError(400, "validation_error", "Invalid request payload.", {"zone_id": ["Zone was not found."]})
            return zone

        if zone_code:
            zone = Zone.query.filter_by(code=zone_code, is_active=True).first()
            if not zone:
                raise ApiError(400, "validation_error", "Invalid request payload.", {"zone_code": ["Zone was not found."]})
            return zone

        if latitude is not None and longitude is not None:
            row = db.session.execute(
                text(
                    """
                    SELECT id
                    FROM zones
                    WHERE is_active = true
                      AND geom IS NOT NULL
                      AND ST_Covers(
                        geom::geometry,
                        ST_SetSRID(ST_Point(:lng, :lat), 4326)
                      )
                    ORDER BY name ASC
                    LIMIT 1
                    """
                ),
                {"lng": longitude, "lat": latitude},
            ).first()
            if row:
                return db.session.get(Zone, row.id)

        if reporter and reporter.zone_id:
            return reporter.zone

        return None

    def resolve_issue_ward(payload, zone=None):
        latitude = _validate_optional_number(payload, "latitude")
        longitude = _validate_optional_number(payload, "longitude")

        if latitude is None or longitude is None:
            return None

        query = """
            SELECT id
            FROM wards
            WHERE is_active = true
              AND geom IS NOT NULL
              AND ST_Covers(
                geom::geometry,
                ST_SetSRID(ST_Point(:lng, :lat), 4326)
              )
        """
        params = {"lng": longitude, "lat": latitude}
        if zone is not None:
            query += " AND zone_id = :zone_id"
            params["zone_id"] = zone.id
        query += " ORDER BY name ASC LIMIT 1"

        row = db.session.execute(text(query), params).first()
        if not row:
            return None
        return db.session.get(Ward, row.id)

    ACTIVE_TASK_STATUSES = {
        models.TaskStatus.ASSIGNED,
        models.TaskStatus.IN_PROGRESS,
        models.TaskStatus.SUBMITTED,
    }

    def resolve_assignment_department(category, zone):
        if category.department:
            if zone is None:
                return category.department
            department_zone = DepartmentZone.query.filter_by(
                department_id=category.department_id,
                zone_id=zone.id,
            ).first()
            if department_zone or category.department.is_active:
                return category.department
        return category.department

    def get_assignment_due_at(issue, department):
        now = datetime.utcnow()
        priority_windows = {
            models.IssuePriority.CRITICAL: timedelta(hours=1),
            models.IssuePriority.HIGH: timedelta(hours=24),
            models.IssuePriority.MEDIUM: timedelta(hours=max(department.sla_hours if department else 48, 48)),
            models.IssuePriority.LOW: timedelta(hours=max((department.sla_hours if department else 48) * 2, 72)),
        }
        return now + priority_windows.get(issue.priority, timedelta(hours=48))

    def get_active_task_count(worker):
        return sum(1 for task in worker.assigned_tasks if task.status in ACTIVE_TASK_STATUSES)

    def create_assignment_notification(user, issue, title, body, notification_type=models.NotificationType.INFO):
        if not user:
            return
        db.session.add(
            Notification(
                user_id=user.id,
                issue_id=issue.id,
                title=title,
                body=body,
                type=notification_type,
                payload={
                    "issue_id": str(issue.id),
                    "tracking_code": issue.tracking_code,
                    "status": issue.status.value if issue.status else None,
                },
            )
        )

    def create_assignment_audit(action, issue, actor=None, status=models.AuditStatus.SUCCESS, details=None, metadata=None):
        db.session.add(
            AuditLog(
                actor_user_id=actor.id if actor else None,
                actor_name=actor.full_name if actor else "System",
                actor_role=(actor.role.name.value if actor and actor.role and actor.role.name else "system"),
                action=action,
                target_type="issue",
                target_id=str(issue.id),
                details=details,
                status=status,
                metadata_json=metadata or {},
            )
        )

    def _serialize_worker_profile(user):
        return {
            "id": str(user.id),
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "employee_code": user.employee_code,
            "role": user.role.name.value if user.role else None,
            "department": user.department.name if user.department else None,
            "zone": user.zone.name if user.zone else None,
            "team": user.team.name if user.team else None,
            "availability_status": user.availability_status.value if user.availability_status else None,
            "status": user.status.value if user.status else None,
        }

    def _serialize_task_history(task):
        history = []

        def add_history(event_type, title, timestamp, note=None, actor_user_id=None):
            if not timestamp:
                return
            history.append(
                {
                    "event_type": event_type,
                    "title": title,
                    "note": note,
                    "at": timestamp.isoformat(),
                    "actor_user_id": str(actor_user_id) if actor_user_id else None,
                }
            )

        add_history("task_assigned", "Task assigned", task.assigned_at)
        add_history("task_started", "Task started", task.started_at, actor_user_id=task.worker_id)
        add_history("task_submitted", "Task submitted", task.submitted_at, actor_user_id=task.worker_id)
        add_history("task_approved", "Task approved", task.approved_at, actor_user_id=task.supervisor_id)

        for proof in task.proofs:
            add_history(
                "proof_uploaded",
                "Proof uploaded",
                proof.uploaded_at,
                note=proof.notes,
                actor_user_id=proof.uploaded_by,
            )

        if task.issue and task.issue.status_history:
            for entry in task.issue.status_history:
                add_history(
                    "issue_status",
                    f"Issue moved to {entry.to_status.value.replace('_', ' ')}",
                    entry.created_at,
                    note=entry.note,
                    actor_user_id=entry.actor_user_id,
                )

        history.sort(key=lambda item: item["at"], reverse=True)
        return history[:40]

    def _serialize_worker_task(task, include_history=False):
        payload = _serialize_task(task)
        supervisor = db.session.get(User, task.supervisor_id) if task.supervisor_id else None
        department = db.session.get(Department, task.department_id) if task.department_id else None

        payload["supervisor"] = _serialize_user(supervisor) if supervisor else None
        payload["department"] = {
            "id": str(department.id),
            "name": department.name,
            "code": department.code,
        } if department else None
        payload["team"] = {
            "id": str(task.team.id),
            "name": task.team.name,
            "code": task.team.code,
        } if task.team else None

        if task.issue:
            issue_payload = dict(payload["issue"] or {})
            issue_payload["photos"] = [media.file_url for media in task.issue.media if media.file_url]
            payload["issue"] = issue_payload

        if include_history:
            payload["history"] = _serialize_task_history(task)

        return payload

    def _get_worker_task_for_actor(task_code, actor):
        task = Task.query.filter_by(task_code=task_code).first()
        if not task:
            raise ApiError(404, "not_found", "Task not found.")

        if actor.role and actor.role.name == RoleType.WORKER and str(task.worker_id) != str(actor.id):
            raise ApiError(403, "forbidden", "You do not have access to this task.")

        return task

    def _save_task_proof_file(task, proof_file):
        original_name = secure_filename(proof_file.filename)
        if not original_name:
            raise ApiError(
                400,
                "validation_error",
                "Invalid request payload.",
                {"proof": ["Proof file name is invalid."]},
            )

        upload_root = os.path.join(app.root_path, "static", "task-proofs")
        os.makedirs(upload_root, exist_ok=True)
        file_ext = os.path.splitext(original_name)[1]
        stored_name = f"{_slugify_filename_prefix(task.task_code)}-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}{file_ext}"
        file_path = os.path.join(upload_root, stored_name)
        proof_file.save(file_path)
        return f"/static/task-proofs/{stored_name}"

    def resolve_assignment_supervisor(team, department):
        if team and team.lead and team.lead.role and team.lead.role.name in {
            RoleType.SUPERVISOR,
            RoleType.DEPARTMENT_HEAD,
            RoleType.ADMIN,
        }:
            return team.lead
        if department and department.head:
            return department.head
        return None

    def find_duplicate_issue_worker(issue, category, department):
        duplicate_issue = (
            Issue.query.filter(
                Issue.id != issue.id,
                Issue.ward_id == issue.ward_id,
                Issue.category_id == category.id,
                Issue.status.in_(
                    [
                        models.IssueStatus.OPEN,
                        models.IssueStatus.ACKNOWLEDGED,
                        models.IssueStatus.IN_PROGRESS,
                    ]
                ),
            )
            .order_by(Issue.created_at.desc())
            .first()
        )
        if not duplicate_issue:
            return None

        active_task = (
            Task.query.filter(
                Task.issue_id == duplicate_issue.id,
                Task.worker_id.isnot(None),
                Task.status.in_(list(ACTIVE_TASK_STATUSES)),
            )
            .order_by(Task.created_at.desc())
            .first()
        )
        if not active_task or not active_task.worker:
            return None

        worker = active_task.worker
        if (
            worker.status == UserStatus.ACTIVE
            and worker.availability_status == WorkerAvailabilityStatus.AVAILABLE
            and worker.department_id == (department.id if department else None)
        ):
            return worker
        return None

    def resolve_assignment_team(issue, department, zone):
        team_query = Team.query.filter_by(is_active=True)
        if department:
            team_query = team_query.filter_by(department_id=department.id)
        if zone:
            team_query = team_query.filter_by(zone_id=zone.id)
        if issue and getattr(issue, "team_id", None):
            team_query = team_query.filter_by(id=issue.team_id)
        return team_query.order_by(Team.created_at.asc()).first()

    def eligible_workers_for_issue(issue, department, zone, team=None):
        worker_query = User.query.join(Role).filter(
            Role.name == RoleType.WORKER,
            User.status == UserStatus.ACTIVE,
            User.availability_status == WorkerAvailabilityStatus.AVAILABLE,
        )
        if department:
            worker_query = worker_query.filter(User.department_id == department.id)
        if zone:
            worker_query = worker_query.filter(User.zone_id == zone.id)
        if team:
            worker_query = worker_query.filter(User.team_id == team.id)
        if issue.ward_id and hasattr(User, "ward_id"):
            worker_query = worker_query.filter(User.ward_id == issue.ward_id)

        workers = worker_query.all()
        if not workers and team:
            return eligible_workers_for_issue(issue, department, zone, team=None)
        return workers

    def select_assignee_for_issue(issue, category, department, zone):
        team = resolve_assignment_team(issue, department, zone)
        supervisor = resolve_assignment_supervisor(team, department)
        workload_threshold = _get_env_int("WORKER_ACTIVE_TASK_THRESHOLD", 12)

        duplicate_worker = find_duplicate_issue_worker(issue, category, department)
        if duplicate_worker and get_active_task_count(duplicate_worker) < workload_threshold:
            return team, duplicate_worker, supervisor, "duplicate_match"

        workers = eligible_workers_for_issue(issue, department, zone, team=team)
        if not workers:
            return team, None, supervisor, "no_available_worker"

        candidates = [worker for worker in workers if get_active_task_count(worker) < workload_threshold]
        if not candidates:
            return team, None, supervisor, "workload_threshold_exceeded"

        if issue.priority == models.IssuePriority.CRITICAL:
            assignee = min(candidates, key=lambda worker: (get_active_task_count(worker), worker.created_at))
            return team, assignee, supervisor, "critical_override"

        assignee = min(candidates, key=lambda worker: (get_active_task_count(worker), worker.created_at))
        return team, assignee, supervisor, "least_active_tasks"

    def auto_assign_issue(issue, category, reporter=None):
        zone = resolve_issue_zone(
            {
                "zone_id": str(issue.zone_id) if issue.zone_id else None,
                "latitude": issue.latitude,
                "longitude": issue.longitude,
            },
            reporter=reporter,
        )
        ward = resolve_issue_ward(
            {
                "latitude": issue.latitude,
                "longitude": issue.longitude,
            },
            zone=zone,
        )
        issue.zone_id = zone.id if zone else None
        issue.ward_id = ward.id if ward else issue.ward_id

        department = resolve_assignment_department(category, zone)
        issue.department_id = department.id if department else issue.department_id
        issue.target_resolution_at = get_assignment_due_at(issue, department)

        team, worker, supervisor, assignment_reason = select_assignee_for_issue(
            issue, category, department, zone
        )

        base_note = (
            f"Auto-assignment completed for department {department.name}."
            if department
            else "Auto-assignment attempted without a mapped department."
        )

        if issue.priority == models.IssuePriority.CRITICAL and supervisor:
            create_assignment_notification(
                supervisor,
                issue,
                "Critical issue needs immediate attention",
                f"{issue.tracking_code} requires urgent oversight for {category.label}.",
                notification_type=models.NotificationType.CRITICAL,
            )

        if worker:
            assignment_note = (
                f"{base_note} Assigned to worker using rule: {assignment_reason}. "
                f"Ward={ward.name if ward else 'unresolved'}."
            )
            db.session.add(
                IssueAssignment(
                    issue=issue,
                    department_id=department.id if department else None,
                    assigned_by_user_id=supervisor.id if supervisor else None,
                    assigned_to_user_id=worker.id,
                    note=assignment_note,
                )
            )
            db.session.add(
                IssueStatusHistory(
                    issue=issue,
                    actor_user_id=supervisor.id if supervisor else None,
                    from_status=None,
                    to_status=issue.status,
                    note=assignment_note,
                    is_system_generated=True,
                )
            )
            db.session.add(
                Task(
                    issue=issue,
                    department_id=department.id if department else None,
                    team_id=team.id if team else None,
                    worker_id=worker.id,
                    supervisor_id=supervisor.id if supervisor else None,
                    title=f"Resolve {category.label}",
                    description=issue.description,
                    priority=issue.priority,
                    due_at=issue.target_resolution_at,
                )
            )
            create_assignment_notification(
                worker,
                issue,
                "New civic issue assigned",
                f"{issue.tracking_code} was assigned to you for {category.label}.",
                notification_type=models.NotificationType.INFO,
            )
            if supervisor:
                create_assignment_notification(
                    supervisor,
                    issue,
                    "Issue assigned to worker",
                    f"{issue.tracking_code} was assigned to {worker.full_name}.",
                    notification_type=models.NotificationType.INFO,
                )
            if reporter:
                create_assignment_notification(
                    reporter,
                    issue,
                    "Issue assigned",
                    f"Your issue {issue.tracking_code} has been assigned to the {department.name if department else 'relevant'} team.",
                    notification_type=models.NotificationType.SUCCESS,
                )
            create_assignment_audit(
                "auto_assign_issue",
                issue,
                actor=supervisor,
                details=assignment_note,
                metadata={
                    "department_id": str(department.id) if department else None,
                    "zone_id": str(zone.id) if zone else None,
                    "ward_id": str(ward.id) if ward else None,
                    "team_id": str(team.id) if team else None,
                    "worker_id": str(worker.id),
                    "reason": assignment_reason,
                },
            )
            return {"zone": zone, "ward": ward, "department": department, "team": team, "worker": worker}

        escalation_note = (
            f"{base_note} No eligible worker available for ward {ward.name if ward else 'unresolved'}; "
            "escalated to supervisor and marked pending assignment in audit trail."
        )
        db.session.add(
            IssueAssignment(
                issue=issue,
                department_id=department.id if department else None,
                assigned_by_user_id=supervisor.id if supervisor else None,
                assigned_to_user_id=supervisor.id if supervisor else None,
                note=escalation_note,
            )
        )
        db.session.add(
            IssueStatusHistory(
                issue=issue,
                actor_user_id=supervisor.id if supervisor else None,
                from_status=None,
                to_status=issue.status,
                note=escalation_note,
                is_system_generated=True,
            )
        )
        if supervisor:
            db.session.add(
                Task(
                    issue=issue,
                    department_id=department.id if department else None,
                    team_id=team.id if team else None,
                    worker_id=None,
                    supervisor_id=supervisor.id,
                    title=f"Review pending assignment for {category.label}",
                    description=issue.description,
                    priority=issue.priority,
                    due_at=issue.target_resolution_at,
                )
            )
            create_assignment_notification(
                supervisor,
                issue,
                "Worker assignment pending",
                f"{issue.tracking_code} needs manual assignment because no eligible worker was available.",
                notification_type=models.NotificationType.WARNING,
            )
        if reporter:
            create_assignment_notification(
                reporter,
                issue,
                "Issue received",
                f"Your issue {issue.tracking_code} is awaiting worker assignment.",
                notification_type=models.NotificationType.INFO,
            )
        create_assignment_audit(
            "auto_assign_issue_pending",
            issue,
            actor=supervisor,
            details=escalation_note,
            metadata={
                "department_id": str(department.id) if department else None,
                "zone_id": str(zone.id) if zone else None,
                "ward_id": str(ward.id) if ward else None,
                "team_id": str(team.id) if team else None,
                "reason": assignment_reason,
                "pending_assignment": True,
            },
        )
        return {"zone": zone, "ward": ward, "department": department, "team": team, "worker": None}

    @app.before_request
    def load_current_user():
        g.current_user = None
        if request.path.startswith("/api/"):
            if is_public_api_path(request.path):
                return
            g.current_user = resolve_current_user(optional=True)
            g.current_user = g.current_user or require_api_auth()

    app.issue_access_token_response = issue_access_token_response
    app.clear_access_token_response = clear_access_token_response
    app.resolve_current_user = resolve_current_user
    app.require_roles = require_roles
    app.get_authenticated_user = get_authenticated_user
    app.get_scoped_user = get_scoped_user
    app.auto_assign_issue = auto_assign_issue

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.get("/api/health")
    def api_health():
        return jsonify(
            {
                "status": "ok",
                "service": "civicconnect-server",
                "allowed_origins": _get_allowed_origins(),
            }
        )

    @app.get("/health/db")
    @app.get("/api/health/db")
    def health_db():
        try:
            db.session.execute(text("SELECT 1"))
            return jsonify({"status": "ok", "database": "connected"})
        except Exception as exc:  # pragma: no cover
            return (
                jsonify(
                    {
                        "status": "error",
                        "database": "unreachable",
                        "message": str(exc),
                    }
                ),
                500,
            )

    # Public/common pages
    @app.get("/api/public/landing")
    def public_landing():
        return jsonify(
            {
                "brand": "CivicConnect",
                "hero": {
                    "title": "Report Issues. Track Resolution. Improve City.",
                    "subtitle": "AI-driven civic issue reporting and response platform.",
                },
                "workflows": [
                    "Report issue",
                    "AI route",
                    "Assign worker",
                    "Resolve",
                    "Notify citizen",
                ],
            }
        )

    @app.get("/api/issues")
    def public_issues():
        issues = (
            Issue.query.filter(Issue.latitude.isnot(None), Issue.longitude.isnot(None))
            .order_by(Issue.created_at.desc())
            .limit(250)
            .all()
        )
        return jsonify(
            [
                {
                    "id": str(issue.id),
                    "title": issue.title or (issue.category.label if issue.category else "Civic issue"),
                    "latitude": issue.latitude,
                    "longitude": issue.longitude,
                    "status": issue.status.value,
                    "category": issue.category.slug if issue.category else None,
                }
                for issue in issues
            ]
        )

    @app.post("/api/auth/register")
    def auth_register():
        payload = _require_json_payload()
        name = _validate_required_string(payload, "name", label="Name", max_length=150)
        email = _validate_email(payload)
        password = _validate_required_string(payload, "password", label="Password", max_length=255)
        if len(password) < 8:
            raise ApiError(400, "validation_error", "Invalid request payload.", {"password": ["Password must be at least 8 characters."]})
        role_name = _validate_role(payload, RoleType)
        if role_name != RoleType.CITIZEN:
            raise ApiError(
                403,
                "forbidden_role_registration",
                "Only citizen self-registration is allowed.",
                {"role": ["Government and field worker accounts must be created by an administrator."]},
            )
        role = Role.query.filter_by(name=role_name).first()
        if not role:
            raise ApiError(400, "validation_error", "Invalid request payload.", {"role": ["Requested role is not available."]})

        user = User(
            full_name=name,
            email=email,
            password_hash=generate_password_hash(password),
            role_id=role.id,
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered", "user": _serialize_user(user)}), 201

    @app.post("/api/auth/login")
    def auth_login():
        payload = _require_json_payload()
        email = _validate_email(payload)
        password = _validate_required_string(payload, "password", label="Password", max_length=255)

        user = User.query.filter_by(email=email).first()
        if not user:
            raise ApiError(401, "invalid_credentials", "Invalid credentials.")
        if not user.password_hash or not check_password_hash(user.password_hash, password):
            raise ApiError(401, "invalid_credentials", "Invalid credentials.")
        if user.status != models.UserStatus.ACTIVE:
            raise ApiError(403, "account_inactive", f"Account is {user.status.value}.")

        user.last_login_at = datetime.utcnow()
        db.session.commit()
        return issue_access_token_response(user)

    @app.post("/api/auth/logout")
    def auth_logout():
        require_api_auth()
        return clear_access_token_response()

    @app.get("/api/auth/me")
    def auth_me():
        user = g.current_user or require_api_auth()
        return jsonify({"authenticated": True, "user": _serialize_user(user)})

    @app.post("/api/issues/anonymous")
    def create_anonymous_issue():
        payload = _require_json_payload()
        title = _validate_required_string(payload, "title", label="Title", max_length=255)
        description = _validate_optional_string(payload, "description")
        reporter_name = _validate_optional_string(payload, "reporter_name", max_length=150)
        reporter_email = _validate_email(payload, "reporter_email", required=False)
        reporter_phone = _validate_optional_string(payload, "reporter_phone", max_length=32)
        address = _validate_optional_string(payload, "address", max_length=255) or ""
        latitude = _validate_optional_number(payload, "latitude")
        longitude = _validate_optional_number(payload, "longitude")
        category = IssueCategory.query.first()
        zone = resolve_issue_zone(payload)
        ward = resolve_issue_ward(payload, zone=zone)
        issue = Issue(
            title=title,
            description=description or "",
            source=models.IssueSource.ANONYMOUS,
            category_id=category.id if category else None,
            reporter_name=reporter_name,
            reporter_email=reporter_email,
            reporter_phone=reporter_phone,
            address=address,
            zone_id=zone.id if zone else None,
            ward_id=ward.id if ward else None,
            latitude=latitude,
            longitude=longitude,
        )
        if not issue.category_id:
            raise ApiError(400, "configuration_error", "No issue category exists yet.")
        db.session.add(issue)
        auto_assign_issue(issue, category)
        db.session.commit()
        return jsonify({"message": "Issue submitted", "issue": _serialize_issue(issue)}), 201

    @app.get("/api/issues/track/<tracking_code>")
    def track_issue(tracking_code):
        issue = Issue.query.filter_by(tracking_code=tracking_code).first()
        if not issue:
            raise ApiError(404, "not_found", "Issue not found.")
        return jsonify(_serialize_issue(issue))

    # Citizen pages
    @app.post("/api/user/reports")
    def create_user_report():
        user = get_authenticated_user()
        payload = _require_json_payload()
        category_slug = _validate_slug(payload, "category")
        description = _validate_required_string(payload, "description", label="Description")
        address = _validate_required_string(payload, "address", label="Address", max_length=255)
        title = _validate_optional_string(payload, "title", max_length=200)
        latitude = _validate_optional_number(payload, "latitude")
        longitude = _validate_optional_number(payload, "longitude")

        category = resolve_issue_category(category_slug)
        zone = resolve_issue_zone(payload, reporter=user)
        ward = resolve_issue_ward(payload, zone=zone)
        if not zone:
            raise ApiError(
                400,
                "validation_error",
                "Invalid request payload.",
                {"zone": ["Issue zone could not be determined. Provide zone_code or valid coordinates."]},
            )
        issue = Issue(
            title=title or category.label,
            description=description,
            source=models.IssueSource.AUTHENTICATED,
            category_id=category.id,
            reporter_user_id=user.id,
            reporter_name=user.full_name,
            reporter_email=user.email,
            reporter_phone=user.phone,
            department_id=category.department_id,
            zone_id=zone.id,
            ward_id=ward.id if ward else None,
            priority=category.default_priority,
            address=address,
            latitude=latitude,
            longitude=longitude,
        )
        db.session.add(issue)
        auto_assign_issue(issue, category, reporter=user)
        db.session.commit()
        return jsonify({"message": "Issue submitted", "issue": _serialize_issue(issue)}), 201

    @app.get("/api/user/dashboard")
    def user_dashboard():
        user = get_scoped_user(request.args.get("user_id"), allow_admin_override=True)
        issues = Issue.query.filter_by(reporter_user_id=user.id).order_by(Issue.created_at.desc()).all()
        notifications = (
            Notification.query.filter_by(user_id=user.id)
            .order_by(Notification.created_at.desc())
            .limit(5)
            .all()
        )
        return jsonify(
            {
                "user": _serialize_user(user),
                "stats": {
                    "open": sum(1 for issue in issues if issue.status == models.IssueStatus.OPEN),
                    "in_progress": sum(1 for issue in issues if issue.status == models.IssueStatus.IN_PROGRESS),
                    "resolved": sum(1 for issue in issues if issue.status == models.IssueStatus.RESOLVED),
                },
                "recent_reports": [_serialize_issue(issue) for issue in issues[:5]],
                "notifications": [_serialize_notification(note) for note in notifications],
            }
        )

    @app.get("/api/user/reports")
    def user_reports():
        user = get_scoped_user(request.args.get("user_id"), allow_admin_override=True)
        query = Issue.query.filter_by(reporter_user_id=user.id).order_by(Issue.created_at.desc())
        return jsonify([_serialize_issue(issue) for issue in query.all()])

    @app.get("/api/user/reports/<issue_id>")
    def user_report_details(issue_id):
        user = get_authenticated_user()
        issue = db.session.get(Issue, issue_id)
        if issue is None:
            issue = Issue.query.filter_by(tracking_code=issue_id).first()
        if not issue or (str(issue.reporter_user_id) != str(user.id) and get_authenticated_user_role(user) != RoleType.ADMIN):
            raise ApiError(404, "not_found", "Issue not found.")
        payload = _serialize_issue(issue)
        try:
            latest_assignment = None
            if issue.assignments:
                active_assignments = [assignment for assignment in issue.assignments if assignment.is_active]
                selected_assignment = active_assignments[-1] if active_assignments else issue.assignments[-1]
                assignment_department = db.session.get(Department, selected_assignment.department_id) if selected_assignment.department_id else None
                assignment_user = db.session.get(User, selected_assignment.assigned_to_user_id) if selected_assignment.assigned_to_user_id else None
                latest_assignment = {
                    "id": str(selected_assignment.id),
                    "department_id": str(selected_assignment.department_id) if selected_assignment.department_id else None,
                    "department_name": assignment_department.name if assignment_department else None,
                    "assigned_to_user_id": str(selected_assignment.assigned_to_user_id) if selected_assignment.assigned_to_user_id else None,
                    "assigned_to_user_name": assignment_user.full_name if assignment_user else None,
                    "assigned_at": selected_assignment.assigned_at.isoformat() if selected_assignment.assigned_at else None,
                    "note": selected_assignment.note,
                    "is_active": selected_assignment.is_active,
                }
            latest_task = None
            if issue.tasks:
                selected_task = sorted(issue.tasks, key=lambda task: task.created_at or datetime.min)[-1]
                task_department = db.session.get(Department, selected_task.department_id) if selected_task.department_id else None
                task_worker = db.session.get(User, selected_task.worker_id) if selected_task.worker_id else None
                task_supervisor = db.session.get(User, selected_task.supervisor_id) if selected_task.supervisor_id else None
                latest_task = {
                    "id": str(selected_task.id),
                    "task_code": selected_task.task_code,
                    "status": selected_task.status.value,
                    "department_id": str(selected_task.department_id) if selected_task.department_id else None,
                    "department_name": task_department.name if task_department else None,
                    "worker_id": str(selected_task.worker_id) if selected_task.worker_id else None,
                    "worker_name": task_worker.full_name if task_worker else None,
                    "supervisor_id": str(selected_task.supervisor_id) if selected_task.supervisor_id else None,
                    "supervisor_name": task_supervisor.full_name if task_supervisor else None,
                    "assigned_at": selected_task.assigned_at.isoformat() if selected_task.assigned_at else None,
                    "started_at": selected_task.started_at.isoformat() if selected_task.started_at else None,
                    "submitted_at": selected_task.submitted_at.isoformat() if selected_task.submitted_at else None,
                    "approved_at": selected_task.approved_at.isoformat() if selected_task.approved_at else None,
                }
            payload["history"] = [
                {
                    "id": str(entry.id),
                    "from_status": entry.from_status.value if entry.from_status else None,
                    "to_status": entry.to_status.value,
                    "note": entry.note,
                    "is_system_generated": entry.is_system_generated,
                    "created_at": entry.created_at.isoformat(),
                }
                for entry in issue.status_history
            ]
            payload["latest_assignment"] = latest_assignment
            payload["latest_task"] = latest_task
        except Exception:
            app.logger.exception("Failed to build issue details payload for %s", issue_id)
            payload["history"] = []
            payload["latest_assignment"] = None
            payload["latest_task"] = None
        return jsonify(payload)

    @app.get("/api/user/notifications")
    def user_notifications():
        user = get_scoped_user(request.args.get("user_id"), allow_admin_override=True)
        query = Notification.query.filter_by(user_id=user.id).order_by(Notification.created_at.desc())
        return jsonify([_serialize_notification(note) for note in query.all()])

    @app.get("/api/user/settings")
    def user_settings():
        user = get_scoped_user(request.args.get("user_id"), allow_admin_override=True)
        return jsonify(_serialize_user(user))

    @app.patch("/api/user/settings/<user_id>")
    def update_user_settings(user_id):
        user = get_scoped_user(user_id, allow_admin_override=True)
        payload = _require_json_payload()
        allowed_fields = {"full_name", "phone", "email_alerts", "sms_alerts", "push_alerts"}
        unknown_fields = sorted(set(payload.keys()) - allowed_fields)
        if unknown_fields:
            raise ApiError(
                400,
                "validation_error",
                "Invalid request payload.",
                {"unknown_fields": [f"Unsupported fields: {', '.join(unknown_fields)}."]},
            )
        if "full_name" in payload:
            user.full_name = _validate_required_string(payload, "full_name", label="full_name", max_length=150)
        if "phone" in payload:
            user.phone = _validate_optional_string(payload, "phone", max_length=32)
        if "email_alerts" in payload:
            user.email_alerts = _validate_bool(payload, "email_alerts")
        if "sms_alerts" in payload:
            user.sms_alerts = _validate_bool(payload, "sms_alerts")
        if "push_alerts" in payload:
            user.push_alerts = _validate_bool(payload, "push_alerts")
        db.session.commit()
        return jsonify({"message": "Settings updated", "user": _serialize_user(user)})

    # Worker pages
    @app.get("/api/worker/dashboard")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_dashboard():
        worker = get_authenticated_user()
        if not worker:
            return jsonify({"error": "Worker not found"}), 404

        tasks = Task.query.filter_by(worker_id=worker.id).order_by(Task.created_at.desc()).all()
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        active_statuses = {
            models.TaskStatus.ASSIGNED,
            models.TaskStatus.IN_PROGRESS,
            models.TaskStatus.SUBMITTED,
        }
        completed_statuses = {
            models.TaskStatus.RESOLVED,
            models.TaskStatus.APPROVED,
        }

        today_active_tasks = [
            task
            for task in tasks
            if task.status in active_statuses and task.due_at and task.due_at.date() == now.date()
        ]
        overdue_tasks = [
            task
            for task in tasks
            if task.status in active_statuses and task.due_at and task.due_at < now
        ]
        completed_today_count = sum(
            1
            for task in tasks
            if task.status in completed_statuses and task.updated_at and task.updated_at >= today_start
        )
        unread_notifications_count = Notification.query.filter_by(user_id=worker.id, is_read=False).count()

        stats_payload = {
            "assigned": sum(1 for task in tasks if task.status == models.TaskStatus.ASSIGNED),
            "in_progress": sum(1 for task in tasks if task.status == models.TaskStatus.IN_PROGRESS),
            "submitted": sum(1 for task in tasks if task.status == models.TaskStatus.SUBMITTED),
            "resolved": sum(1 for task in tasks if task.status == models.TaskStatus.RESOLVED),
            "active": sum(1 for task in tasks if task.status in active_statuses),
            "total": len(tasks),
            "today_active": len(today_active_tasks),
            "overdue": len(overdue_tasks),
            "completed_today": completed_today_count,
            "notification_count": unread_notifications_count,
        }

        return jsonify(
            {
                "worker": _serialize_user(worker),
                "profile_summary": _serialize_worker_profile(worker),
                "stats": stats_payload,
                "task_stats": stats_payload,
                "notification_count": unread_notifications_count,
                "today_active_tasks": [_serialize_worker_task(task) for task in today_active_tasks[:10]],
                "overdue_tasks": [_serialize_worker_task(task) for task in overdue_tasks[:10]],
                "tasks": [_serialize_worker_task(task) for task in tasks[:10]],
            }
        )

    @app.get("/api/worker/tasks")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_tasks():
        worker = get_authenticated_user()
        query = Task.query.order_by(Task.created_at.desc())
        if worker and worker.role and worker.role.name == RoleType.WORKER:
            query = query.filter_by(worker_id=worker.id)
        else:
            worker_id = request.args.get("worker_id")
            if worker_id:
                query = query.filter_by(worker_id=worker_id)
        return jsonify([_serialize_worker_task(task) for task in query.all()])

    @app.get("/api/worker/tasks/<task_code>")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_task_details(task_code):
        worker = get_authenticated_user()
        task = _get_worker_task_for_actor(task_code, worker)
        return jsonify(_serialize_worker_task(task, include_history=True))

    @app.post("/api/worker/tasks/<task_code>/start")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_task_start(task_code):
        worker = get_authenticated_user()
        task = _get_worker_task_for_actor(task_code, worker)

        if task.status == models.TaskStatus.RESOLVED:
            raise ApiError(409, "invalid_state", "Resolved tasks cannot be started again.")

        if not task.started_at:
            task.started_at = datetime.utcnow()
        task.status = models.TaskStatus.IN_PROGRESS

        if task.issue and task.issue.status in {models.IssueStatus.OPEN, models.IssueStatus.ACKNOWLEDGED}:
            from_status = task.issue.status
            task.issue.status = models.IssueStatus.IN_PROGRESS
            db.session.add(
                IssueStatusHistory(
                    issue=task.issue,
                    actor_user_id=worker.id,
                    from_status=from_status,
                    to_status=task.issue.status,
                    note=f"Task {task.task_code} started by worker.",
                    is_system_generated=False,
                )
            )

        db.session.commit()
        return jsonify({"message": "Task started.", "task": _serialize_worker_task(task, include_history=True)})

    @app.post("/api/worker/tasks/<task_code>/in-progress")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_task_mark_in_progress(task_code):
        worker = get_authenticated_user()
        task = _get_worker_task_for_actor(task_code, worker)

        if task.status == models.TaskStatus.RESOLVED:
            raise ApiError(409, "invalid_state", "Resolved tasks cannot be moved to in progress.")

        if not task.started_at:
            task.started_at = datetime.utcnow()
        task.status = models.TaskStatus.IN_PROGRESS

        if task.issue and task.issue.status in {models.IssueStatus.OPEN, models.IssueStatus.ACKNOWLEDGED}:
            from_status = task.issue.status
            task.issue.status = models.IssueStatus.IN_PROGRESS
            db.session.add(
                IssueStatusHistory(
                    issue=task.issue,
                    actor_user_id=worker.id,
                    from_status=from_status,
                    to_status=task.issue.status,
                    note=f"Task {task.task_code} marked in progress.",
                    is_system_generated=False,
                )
            )

        db.session.commit()
        return jsonify({"message": "Task moved to in progress.", "task": _serialize_worker_task(task, include_history=True)})

    @app.post("/api/worker/tasks/<task_code>/proof")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_task_submit_proof(task_code):
        worker = get_authenticated_user()
        task = _get_worker_task_for_actor(task_code, worker)

        proof_file = request.files.get("proof")
        if not proof_file or not proof_file.filename:
            raise ApiError(
                400,
                "validation_error",
                "Invalid request payload.",
                {"proof": ["Proof photo or video is required."]},
            )

        proof_notes = str(request.form.get("notes") or request.form.get("resolution_notes") or "").strip() or None
        proof_url = _save_task_proof_file(task, proof_file)

        if task.status == models.TaskStatus.ASSIGNED:
            task.status = models.TaskStatus.IN_PROGRESS
            task.started_at = task.started_at or datetime.utcnow()

        task.proof_submitted = True
        db.session.add(
            models.TaskProof(
                task_id=task.id,
                file_url=proof_url,
                uploaded_by=worker.id,
                notes=proof_notes,
            )
        )

        db.session.commit()
        return jsonify({"message": "Proof submitted.", "task": _serialize_worker_task(task, include_history=True)})

    @app.patch("/api/worker/tasks/<task_code>/resolution-notes")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_task_resolution_notes(task_code):
        worker = get_authenticated_user()
        task = _get_worker_task_for_actor(task_code, worker)
        payload = _require_json_payload()
        resolution_notes = _validate_required_string(
            payload,
            "resolution_notes",
            label="resolution_notes",
            max_length=5000,
        )

        task.resolution_notes = resolution_notes
        if task.status == models.TaskStatus.ASSIGNED:
            task.status = models.TaskStatus.IN_PROGRESS
            task.started_at = task.started_at or datetime.utcnow()

        db.session.commit()
        return jsonify({"message": "Resolution notes submitted.", "task": _serialize_worker_task(task, include_history=True)})

    @app.post("/api/worker/tasks/<task_code>/submit")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_task_submit(task_code):
        worker = get_authenticated_user()
        task = _get_worker_task_for_actor(task_code, worker)

        resolution_notes = str(request.form.get("resolution_notes") or "").strip()
        if not resolution_notes:
            raise ApiError(
                400,
                "validation_error",
                "Invalid request payload.",
                {"resolution_notes": ["Resolution notes are required."]},
            )

        proof_file = request.files.get("proof")
        if not proof_file or not proof_file.filename:
            raise ApiError(
                400,
                "validation_error",
                "Invalid request payload.",
                {"proof": ["Proof photo or video is required."]},
            )

        proof_url = _save_task_proof_file(task, proof_file)

        task.status = models.TaskStatus.SUBMITTED
        task.submitted_at = datetime.utcnow()
        task.started_at = task.started_at or datetime.utcnow()
        task.resolution_notes = resolution_notes
        task.proof_submitted = True

        db.session.add(
            models.TaskProof(
                task_id=task.id,
                file_url=proof_url,
                uploaded_by=worker.id,
                notes=resolution_notes,
            )
        )

        if task.issue:
            if task.issue.status == models.IssueStatus.OPEN:
                task.issue.status = models.IssueStatus.IN_PROGRESS
            db.session.add(
                IssueStatusHistory(
                    issue=task.issue,
                    actor_user_id=worker.id,
                    from_status=task.issue.status,
                    to_status=task.issue.status,
                    note=f"Task {task.task_code} submitted for supervisor review.",
                    is_system_generated=False,
                )
            )

        if task.supervisor_id:
            db.session.add(
                Notification(
                    user_id=task.supervisor_id,
                    issue_id=task.issue_id,
                    title="Task submitted for approval",
                    body=f"{task.task_code} has been submitted by {worker.full_name} for review.",
                    type=models.NotificationType.INFO,
                    payload={"task_code": task.task_code, "task_id": str(task.id)},
                )
            )

        db.session.commit()
        return jsonify({"message": "Task submitted successfully.", "task": _serialize_worker_task(task, include_history=True)})

    @app.get("/api/worker/communications")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_communications():
        worker = get_authenticated_user()
        worker_id = str(worker.id) if worker else None
        query = models.Message.query.order_by(models.Message.created_at.desc())
        if worker_id:
            query = query.filter(
                (models.Message.sender_id == worker_id) | (models.Message.recipient_id == worker_id)
            )
        messages = query.limit(50).all()
        return jsonify(
            [
                {
                    "id": str(message.id),
                    "body": message.body,
                    "channel": message.channel.value,
                    "sender_id": str(message.sender_id),
                    "sender_name": message.sender.full_name if message.sender else None,
                    "recipient_id": str(message.recipient_id) if message.recipient_id else None,
                    "recipient_name": message.recipient.full_name if message.recipient else None,
                    "task_id": str(message.task_id) if message.task_id else None,
                    "task_code": message.task.task_code if message.task else None,
                    "created_at": message.created_at.isoformat(),
                }
                for message in messages
            ]
        )

    @app.post("/api/worker/communications")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_send_communication():
        worker = get_authenticated_user()
        payload = _require_json_payload()
        body = _validate_required_string(payload, "body", label="Message", max_length=5000)
        task_code = _validate_optional_string(payload, "task_code", max_length=40)

        task = None
        recipient_id = None
        channel = models.MessageChannel.DIRECT

        if task_code:
            task = Task.query.filter_by(task_code=task_code).first()
            if not task:
                raise ApiError(404, "not_found", "Task not found.")
            if worker.role and worker.role.name == RoleType.WORKER and str(task.worker_id) != str(worker.id):
                raise ApiError(403, "forbidden", "You do not have access to message on this task.")
            recipient_id = task.supervisor_id if task.supervisor_id and str(task.supervisor_id) != str(worker.id) else None
            channel = models.MessageChannel.TASK

        message = models.Message(
            sender_id=worker.id,
            recipient_id=recipient_id,
            task_id=task.id if task else None,
            channel=channel,
            body=body,
        )
        db.session.add(message)

        if recipient_id:
            db.session.add(
                Notification(
                    user_id=recipient_id,
                    issue_id=task.issue_id if task else None,
                    title="New worker message",
                    body=body[:180],
                    type=models.NotificationType.INFO,
                    payload={
                        "task_code": task.task_code if task else None,
                        "message_id": str(message.id),
                    },
                )
            )

        db.session.commit()
        return jsonify(
            {
                "id": str(message.id),
                "body": message.body,
                "channel": message.channel.value,
                "sender_id": str(message.sender_id),
                "sender_name": worker.full_name,
                "recipient_id": str(message.recipient_id) if message.recipient_id else None,
                "recipient_name": message.recipient.full_name if message.recipient else None,
                "task_id": str(message.task_id) if message.task_id else None,
                "task_code": message.task.task_code if message.task else None,
                "created_at": message.created_at.isoformat(),
            }
        ), 201

    @app.get("/api/worker/notifications")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_notifications():
        return user_notifications()

    @app.get("/api/worker/settings")
    @require_roles(RoleType.WORKER, RoleType.SUPERVISOR, RoleType.DEPARTMENT_HEAD, RoleType.ADMIN)
    def worker_settings():
        return user_settings()

    # Admin pages
    @app.get("/api/admin/dashboard")
    @require_roles(RoleType.ADMIN)
    def admin_dashboard():
        return jsonify(
            {
                "stats": {
                    "active_issues": Issue.query.count(),
                    "active_workers": User.query.filter(User.role.has(name=models.RoleType.WORKER)).count(),
                    "departments": Department.query.count(),
                    "open_tasks": Task.query.filter(Task.status != models.TaskStatus.RESOLVED).count(),
                },
                "recent_issues": [_serialize_issue(issue) for issue in Issue.query.order_by(Issue.created_at.desc()).limit(10).all()],
                "department_overview": [_serialize_department(department) for department in Department.query.order_by(Department.name.asc()).all()],
            }
        )

    @app.get("/api/admin/issues")
    @require_roles(RoleType.ADMIN)
    def admin_issues():
        status = request.args.get("status")
        query = Issue.query.order_by(Issue.created_at.desc())
        if status:
            try:
                query = query.filter_by(status=models.IssueStatus[status.upper()])
            except KeyError:
                return jsonify({"error": f"Invalid issue status '{status}'"}), 400
        return jsonify([_serialize_issue(issue) for issue in query.all()])

    @app.get("/api/admin/issues/<issue_id>")
    @require_roles(RoleType.ADMIN)
    def admin_issue_details(issue_id):
        issue = db.session.get(Issue, issue_id)
        if not issue:
            return jsonify({"error": "Issue not found"}), 404
        return jsonify(
            {
                "issue": _serialize_issue(issue),
                "history": [
                    {
                        "id": str(entry.id),
                        "from_status": entry.from_status.value if entry.from_status else None,
                        "to_status": entry.to_status.value,
                        "note": entry.note,
                        "is_system_generated": entry.is_system_generated,
                        "created_at": entry.created_at.isoformat(),
                    }
                    for entry in issue.status_history
                ],
                "assignments": [
                    {
                        "id": str(assignment.id),
                        "department_id": str(assignment.department_id) if assignment.department_id else None,
                        "assigned_to_user_id": str(assignment.assigned_to_user_id) if assignment.assigned_to_user_id else None,
                        "assigned_at": assignment.assigned_at.isoformat(),
                        "note": assignment.note,
                    }
                    for assignment in issue.assignments
                ],
            }
        )

    @app.get("/api/admin/departments")
    @require_roles(RoleType.ADMIN)
    def admin_departments():
        return jsonify([_serialize_department(department) for department in Department.query.order_by(Department.name.asc()).all()])

    @app.get("/api/admin/departments/<department_id>")
    @require_roles(RoleType.ADMIN)
    def admin_department_details(department_id):
        department = db.session.get(Department, department_id)
        if not department:
            return jsonify({"error": "Department not found"}), 404
        return jsonify(
            {
                "department": _serialize_department(department),
                "users": [_serialize_user(user) for user in department.users],
                "metrics": [
                    {
                        "id": str(metric.id),
                        "issues_resolved": metric.issues_resolved,
                        "avg_resolution_time": metric.avg_resolution_time,
                        "satisfaction_score": metric.satisfaction_score,
                        "calculated_at": metric.calculated_at.isoformat(),
                    }
                    for metric in models.DepartmentMetrics.query.filter_by(department_id=department.id)
                    .order_by(models.DepartmentMetrics.calculated_at.desc())
                    .all()
                ],
            }
        )

    @app.get("/api/admin/users")
    @require_roles(RoleType.ADMIN)
    def admin_users():
        role = request.args.get("role")
        query = User.query.order_by(User.created_at.desc())
        if role:
            try:
                query = query.join(Role).filter(Role.name == models.RoleType[role.upper()])
            except KeyError:
                return jsonify({"error": f"Invalid role '{role}'"}), 400
        return jsonify([_serialize_user(user) for user in query.all()])

    @app.get("/api/admin/analytics")
    @require_roles(RoleType.ADMIN)
    def admin_analytics():
        snapshots = AnalyticsSnapshot.query.order_by(AnalyticsSnapshot.created_at.desc()).limit(50).all()
        return jsonify(
            [
                {
                    "id": str(snapshot.id),
                    "metric_key": snapshot.metric_key,
                    "scope": snapshot.scope,
                    "scope_id": snapshot.scope_id,
                    "period": snapshot.period,
                    "value": snapshot.value,
                    "dimensions": snapshot.dimensions,
                    "created_at": snapshot.created_at.isoformat(),
                }
                for snapshot in snapshots
            ]
        )

    @app.get("/api/admin/audit-logs")
    @require_roles(RoleType.ADMIN)
    def admin_audit_logs():
        logs = AuditLog.query.order_by(AuditLog.created_at.desc()).limit(100).all()
        return jsonify(
            [
                {
                    "id": str(log.id),
                    "created_at": log.created_at.isoformat(),
                    "actor_user_id": str(log.actor_user_id) if log.actor_user_id else None,
                    "actor_name": log.actor_name,
                    "actor_role": log.actor_role,
                    "action": log.action,
                    "target_type": log.target_type,
                    "target_id": log.target_id,
                    "details": log.details,
                    "status": log.status.value,
                    "ip_address": log.ip_address,
                }
                for log in logs
            ]
        )

    @app.get("/api/admin/settings")
    @require_roles(RoleType.ADMIN)
    def admin_settings():
        settings = SystemSetting.query.order_by(SystemSetting.key.asc()).all()
        return jsonify(
            [
                {
                    "id": str(setting.id),
                    "key": setting.key,
                    "value": setting.value,
                    "value_type": setting.value_type,
                    "description": setting.description,
                    "is_public": setting.is_public,
                }
                for setting in settings
            ]
        )

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host=os.getenv("FLASK_HOST", "0.0.0.0"),
        port=int(os.getenv("FLASK_PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG", "true").lower() == "true",
    )
