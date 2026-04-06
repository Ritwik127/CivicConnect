import enum
import random
import string
import uuid
from datetime import datetime

from sqlalchemy import Index, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID
from geoalchemy2 import Geography

from database import db


def _uuid():
    return uuid.uuid4()


def _random_code(prefix: str, length: int = 8) -> str:
    token = "".join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"{prefix}-{token}"


def generate_tracking_code() -> str:
    return _random_code("ISS")


def generate_task_code() -> str:
    return _random_code("TSK")


class TimestampMixin:
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
    deleted_at = db.Column(db.DateTime)


class RoleType(enum.Enum):
    CITIZEN = "citizen"
    WORKER = "worker"
    SUPERVISOR = "supervisor"
    DEPARTMENT_HEAD = "department_head"
    ADMIN = "admin"
    SYSTEM = "system"


class UserStatus(enum.Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    INVITED = "invited"
    INACTIVE = "inactive"


class IssueSource(enum.Enum):
    AUTHENTICATED = "authenticated"
    ANONYMOUS = "anonymous"
    SYSTEM = "system"


class IssuePriority(enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class IssueStatus(enum.Enum):
    OPEN = "open"
    ACKNOWLEDGED = "acknowledged"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"
    CLOSED = "closed"


class TaskStatus(enum.Enum):
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"
    RESOLVED = "resolved"


class WorkerAvailabilityStatus(enum.Enum):
    AVAILABLE = "available"
    ON_DUTY = "on_duty"
    OFF_DUTY = "off_duty"
    ON_LEAVE = "on_leave"


class NotificationType(enum.Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    CRITICAL = "critical"


class MessageChannel(enum.Enum):
    DIRECT = "direct"
    TASK = "task"
    ISSUE = "issue"
    SYSTEM = "system"


class AuditStatus(enum.Enum):
    SUCCESS = "success"
    FAILED = "failed"
    PENDING = "pending"


class MediaKind(enum.Enum):
    IMAGE = "image"
    VIDEO = "video"
    DOCUMENT = "document"


class Role(TimestampMixin, db.Model):
    __tablename__ = "roles"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    name = db.Column(db.Enum(RoleType), unique=True, nullable=False)
    label = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    permissions = db.Column(JSONB, default=dict, nullable=False)

    users = db.relationship("User", back_populates="role", lazy=True)


class Zone(TimestampMixin, db.Model):
    __tablename__ = "zones"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    code = db.Column(db.String(32), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False, unique=True)
    city = db.Column(db.String(120))
    state = db.Column(db.String(120))
    country = db.Column(db.String(120), default="India", nullable=False)
    geojson = db.Column(JSONB)
    geom = db.Column(
        Geography(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True)
    )
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    departments = db.relationship("DepartmentZone", back_populates="zone", lazy=True)
    users = db.relationship("User", back_populates="zone", lazy=True)
    issues = db.relationship("Issue", back_populates="zone", lazy=True)
    circles = db.relationship("Circle", back_populates="zone", lazy=True)
    wards = db.relationship("Ward", back_populates="zone", lazy=True)


class Department(TimestampMixin, db.Model):
    __tablename__ = "departments"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    code = db.Column(db.String(32), unique=True, nullable=False, index=True)
    name = db.Column(db.String(150), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    head_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"))
    sla_hours = db.Column(db.Integer, nullable=False, default=48)
    email = db.Column(db.String(255))
    phone = db.Column(db.String(32))
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    head = db.relationship("User", foreign_keys=[head_user_id], lazy=True)
    users = db.relationship(
        "User",
        back_populates="department",
        lazy=True,
        foreign_keys="User.department_id",
    )
    zones = db.relationship(
        "DepartmentZone",
        back_populates="department",
        cascade="all, delete-orphan",
        lazy=True,
    )
    categories = db.relationship("IssueCategory", back_populates="department", lazy=True)
    issues = db.relationship("Issue", back_populates="department", lazy=True)


class DepartmentZone(TimestampMixin, db.Model):
    __tablename__ = "department_zones"
    __table_args__ = (
        UniqueConstraint("department_id", "zone_id", name="uq_department_zone"),
    )

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    department_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("departments.id", ondelete="CASCADE"),
        nullable=False,
    )
    zone_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("zones.id", ondelete="CASCADE"),
        nullable=False,
    )

    department = db.relationship("Department", back_populates="zones", lazy=True)
    zone = db.relationship("Zone", back_populates="departments", lazy=True)


class Team(TimestampMixin, db.Model):
    __tablename__ = "teams"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    code = db.Column(db.String(32), unique=True, nullable=False, index=True)
    name = db.Column(db.String(120), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    department_id = db.Column(UUID(as_uuid=True), db.ForeignKey("departments.id"), index=True)
    zone_id = db.Column(UUID(as_uuid=True), db.ForeignKey("zones.id"), index=True)
    lead_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"))
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    department = db.relationship("Department", lazy=True)
    zone = db.relationship("Zone", lazy=True)
    lead = db.relationship("User", foreign_keys=[lead_user_id], lazy=True)
    members = db.relationship(
        "User",
        back_populates="team",
        lazy=True,
        foreign_keys="User.team_id",
    )
    tasks = db.relationship("Task", back_populates="team", lazy=True)


class Circle(TimestampMixin, db.Model):
    __tablename__ = "circles"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    code = db.Column(db.String(32), unique=True, index=True)
    name = db.Column(db.String(120), nullable=False, unique=True, index=True)
    zone_id = db.Column(UUID(as_uuid=True), db.ForeignKey("zones.id"), index=True)
    geojson = db.Column(JSONB)
    geom = db.Column(
        Geography(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True)
    )
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    zone = db.relationship("Zone", back_populates="circles", lazy=True)
    wards = db.relationship("Ward", back_populates="circle", lazy=True)


class User(TimestampMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    employee_code = db.Column(db.String(32), unique=True, index=True)
    full_name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    phone = db.Column(db.String(32), unique=True)
    password_hash = db.Column(db.String(255))
    avatar_url = db.Column(db.String(500))
    status = db.Column(
        db.Enum(UserStatus),
        nullable=False,
        default=UserStatus.ACTIVE,
        index=True,
    )
    role_id = db.Column(UUID(as_uuid=True), db.ForeignKey("roles.id"), nullable=False, index=True)
    department_id = db.Column(UUID(as_uuid=True), db.ForeignKey("departments.id"), index=True)
    zone_id = db.Column(UUID(as_uuid=True), db.ForeignKey("zones.id"), index=True)
    team_id = db.Column(UUID(as_uuid=True), db.ForeignKey("teams.id"), index=True)
    availability_status = db.Column(
        db.Enum(WorkerAvailabilityStatus),
        nullable=False,
        default=WorkerAvailabilityStatus.AVAILABLE,
        index=True,
    )
    email_alerts = db.Column(db.Boolean, nullable=False, default=True)
    sms_alerts = db.Column(db.Boolean, nullable=False, default=False)
    push_alerts = db.Column(db.Boolean, nullable=False, default=True)
    last_login_at = db.Column(db.DateTime)

    role = db.relationship("Role", back_populates="users", lazy=True)
    department = db.relationship(
        "Department",
        back_populates="users",
        foreign_keys=[department_id],
        lazy=True,
    )
    zone = db.relationship("Zone", back_populates="users", lazy=True)
    team = db.relationship("Team", back_populates="members", foreign_keys=[team_id], lazy=True)
    reported_issues = db.relationship(
        "Issue",
        back_populates="reporter",
        foreign_keys="Issue.reporter_user_id",
        lazy=True,
    )
    assigned_tasks = db.relationship(
        "Task",
        back_populates="worker",
        foreign_keys="Task.worker_id",
        lazy=True,
    )
    notifications = db.relationship("Notification", back_populates="user", lazy=True)
    sent_messages = db.relationship(
        "Message",
        back_populates="sender",
        foreign_keys="Message.sender_id",
        lazy=True,
    )
    received_messages = db.relationship(
        "Message",
        back_populates="recipient",
        foreign_keys="Message.recipient_id",
        lazy=True,
    )
    sessions = db.relationship("UserSession", back_populates="user", lazy=True)
    issue_comments = db.relationship("IssueComment", back_populates="user", lazy=True)
    task_proofs = db.relationship("TaskProof", back_populates="uploader", lazy=True)


class IssueCategory(TimestampMixin, db.Model):
    __tablename__ = "issue_categories"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    slug = db.Column(db.String(80), unique=True, nullable=False, index=True)
    label = db.Column(db.String(120), nullable=False, index=True)
    description = db.Column(db.Text)
    icon = db.Column(db.String(80))
    default_priority = db.Column(
        db.Enum(IssuePriority),
        nullable=False,
        default=IssuePriority.MEDIUM,
    )
    department_id = db.Column(UUID(as_uuid=True), db.ForeignKey("departments.id"))
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    department = db.relationship("Department", back_populates="categories", lazy=True)
    issues = db.relationship("Issue", back_populates="category", lazy=True)


class Issue(TimestampMixin, db.Model):
    __tablename__ = "issues"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    tracking_code = db.Column(
        db.String(40),
        unique=True,
        nullable=False,
        index=True,
        default=generate_tracking_code,
    )
    title = db.Column(db.String(200))
    description = db.Column(db.Text, nullable=False)
    source = db.Column(
        db.Enum(IssueSource),
        nullable=False,
        default=IssueSource.AUTHENTICATED,
        index=True,
    )
    category_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("issue_categories.id"),
        nullable=False,
        index=True,
    )
    reporter_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    reporter_name = db.Column(db.String(150))
    reporter_phone = db.Column(db.String(32))
    reporter_email = db.Column(db.String(255))
    department_id = db.Column(UUID(as_uuid=True), db.ForeignKey("departments.id"), index=True)
    zone_id = db.Column(UUID(as_uuid=True), db.ForeignKey("zones.id"), index=True)
    ward_id = db.Column(UUID(as_uuid=True), db.ForeignKey("wards.id"), index=True)
    priority = db.Column(
        db.Enum(IssuePriority),
        nullable=False,
        default=IssuePriority.MEDIUM,
        index=True,
    )
    status = db.Column(
        db.Enum(IssueStatus),
        nullable=False,
        default=IssueStatus.OPEN,
        index=True,
    )
    address = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Float, index=True)
    longitude = db.Column(db.Float, index=True)
    location = db.Column(Geography(geometry_type="POINT", srid=4326, spatial_index=True))
    ai_confidence = db.Column(db.Float, index=True)
    ai_tags = db.Column(JSONB, default=list, nullable=False)
    ai_summary = db.Column(db.Text)
    target_resolution_at = db.Column(db.DateTime)
    acknowledged_at = db.Column(db.DateTime)
    resolved_at = db.Column(db.DateTime)
    closed_at = db.Column(db.DateTime)

    category = db.relationship("IssueCategory", back_populates="issues", lazy=True)
    reporter = db.relationship(
        "User",
        back_populates="reported_issues",
        foreign_keys=[reporter_user_id],
        lazy=True,
    )
    department = db.relationship("Department", back_populates="issues", lazy=True)
    zone = db.relationship("Zone", back_populates="issues", lazy=True)
    ward = db.relationship("Ward", back_populates="issues", lazy=True)
    media = db.relationship(
        "IssueMedia",
        back_populates="issue",
        cascade="all, delete-orphan",
        lazy=True,
    )
    status_history = db.relationship(
        "IssueStatusHistory",
        back_populates="issue",
        cascade="all, delete-orphan",
        lazy=True,
    )
    assignments = db.relationship(
        "IssueAssignment",
        back_populates="issue",
        cascade="all, delete-orphan",
        lazy=True,
    )
    tasks = db.relationship("Task", back_populates="issue", cascade="all, delete-orphan", lazy=True)
    notifications = db.relationship("Notification", back_populates="issue", lazy=True)
    comments = db.relationship(
        "IssueComment",
        back_populates="issue",
        cascade="all, delete-orphan",
        lazy=True,
    )
    duplicate_links = db.relationship(
        "DuplicateIssue",
        foreign_keys="DuplicateIssue.issue_id",
        back_populates="issue",
        cascade="all, delete-orphan",
        lazy=True,
    )
    duplicate_of_links = db.relationship(
        "DuplicateIssue",
        foreign_keys="DuplicateIssue.duplicate_of_id",
        back_populates="duplicate_of",
        cascade="all, delete-orphan",
        lazy=True,
    )


class IssueMedia(TimestampMixin, db.Model):
    __tablename__ = "issue_media"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    issue_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("issues.id", ondelete="CASCADE"),
        nullable=False,
    )
    uploaded_by_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    kind = db.Column(db.Enum(MediaKind), nullable=False, default=MediaKind.IMAGE)
    stage = db.Column(db.String(32), nullable=False, default="reported")
    file_name = db.Column(db.String(255))
    file_url = db.Column(db.String(1000), nullable=False)
    content_type = db.Column(db.String(100))
    file_size = db.Column(db.BigInteger)
    metadata_json = db.Column(JSONB, default=dict, nullable=False)

    issue = db.relationship("Issue", back_populates="media", lazy=True)


class Ward(TimestampMixin, db.Model):
    __tablename__ = "wards"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    code = db.Column(db.String(32), unique=True, index=True)
    name = db.Column(db.String(120), nullable=False, unique=True, index=True)
    zone_id = db.Column(UUID(as_uuid=True), db.ForeignKey("zones.id"), index=True)
    circle_id = db.Column(UUID(as_uuid=True), db.ForeignKey("circles.id"), index=True)
    geojson = db.Column(JSONB)
    geom = db.Column(
        Geography(geometry_type="MULTIPOLYGON", srid=4326, spatial_index=True)
    )
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    zone = db.relationship("Zone", back_populates="wards", lazy=True)
    circle = db.relationship("Circle", back_populates="wards", lazy=True)
    issues = db.relationship("Issue", back_populates="ward", lazy=True)


class IssueStatusHistory(TimestampMixin, db.Model):
    __tablename__ = "issue_status_history"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    issue_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("issues.id", ondelete="CASCADE"),
        nullable=False,
    )
    actor_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    from_status = db.Column(db.Enum(IssueStatus))
    to_status = db.Column(db.Enum(IssueStatus), nullable=False, index=True)
    note = db.Column(db.Text)
    is_system_generated = db.Column(db.Boolean, default=False, nullable=False)

    issue = db.relationship("Issue", back_populates="status_history", lazy=True)


class IssueAssignment(TimestampMixin, db.Model):
    __tablename__ = "issue_assignments"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    issue_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("issues.id", ondelete="CASCADE"),
        nullable=False,
    )
    department_id = db.Column(UUID(as_uuid=True), db.ForeignKey("departments.id"), index=True)
    assigned_by_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    assigned_to_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    note = db.Column(db.Text)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    unassigned_at = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True, nullable=False)

    issue = db.relationship("Issue", back_populates="assignments", lazy=True)


class Task(TimestampMixin, db.Model):
    __tablename__ = "tasks"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    task_code = db.Column(
        db.String(40),
        unique=True,
        nullable=False,
        index=True,
        default=generate_task_code,
    )
    issue_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("issues.id", ondelete="CASCADE"),
        nullable=False,
    )
    department_id = db.Column(UUID(as_uuid=True), db.ForeignKey("departments.id"), index=True)
    team_id = db.Column(UUID(as_uuid=True), db.ForeignKey("teams.id"), index=True)
    worker_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    supervisor_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(
        db.Enum(TaskStatus),
        nullable=False,
        default=TaskStatus.ASSIGNED,
        index=True,
    )
    priority = db.Column(
        db.Enum(IssuePriority),
        nullable=False,
        default=IssuePriority.MEDIUM,
        index=True,
    )
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    started_at = db.Column(db.DateTime)
    submitted_at = db.Column(db.DateTime)
    approved_at = db.Column(db.DateTime)
    due_at = db.Column(db.DateTime)
    resolution_notes = db.Column(db.Text)
    proof_submitted = db.Column(db.Boolean, default=False, nullable=False)
    proof_verified = db.Column(db.Boolean, default=False, nullable=False)

    issue = db.relationship("Issue", back_populates="tasks", lazy=True)
    team = db.relationship("Team", back_populates="tasks", lazy=True)
    worker = db.relationship("User", back_populates="assigned_tasks", foreign_keys=[worker_id], lazy=True)
    messages = db.relationship("Message", back_populates="task", lazy=True)
    proofs = db.relationship(
        "TaskProof",
        back_populates="task",
        cascade="all, delete-orphan",
        lazy=True,
    )


class Notification(TimestampMixin, db.Model):
    __tablename__ = "notifications"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    issue_id = db.Column(UUID(as_uuid=True), db.ForeignKey("issues.id"), index=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    type = db.Column(db.Enum(NotificationType), nullable=False, default=NotificationType.INFO, index=True)
    is_read = db.Column(db.Boolean, default=False, nullable=False, index=True)
    read_at = db.Column(db.DateTime)
    payload = db.Column(JSONB, default=dict, nullable=False)

    user = db.relationship("User", back_populates="notifications", lazy=True)
    issue = db.relationship("Issue", back_populates="notifications", lazy=True)


class Message(TimestampMixin, db.Model):
    __tablename__ = "messages"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    sender_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False, index=True)
    recipient_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    task_id = db.Column(UUID(as_uuid=True), db.ForeignKey("tasks.id"), index=True)
    channel = db.Column(db.Enum(MessageChannel), nullable=False, default=MessageChannel.DIRECT, index=True)
    body = db.Column(db.Text, nullable=False)
    attachment_url = db.Column(db.String(1000))
    is_read = db.Column(db.Boolean, default=False, nullable=False, index=True)
    read_at = db.Column(db.DateTime)

    sender = db.relationship("User", back_populates="sent_messages", foreign_keys=[sender_id], lazy=True)
    recipient = db.relationship(
        "User",
        back_populates="received_messages",
        foreign_keys=[recipient_id],
        lazy=True,
    )
    task = db.relationship("Task", back_populates="messages", lazy=True)


class AuditLog(db.Model):
    __tablename__ = "audit_logs"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    actor_user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    actor_name = db.Column(db.String(150))
    actor_role = db.Column(db.String(80), index=True)
    action = db.Column(db.String(80), nullable=False, index=True)
    target_type = db.Column(db.String(80))
    target_id = db.Column(db.String(80))
    details = db.Column(db.Text)
    status = db.Column(db.Enum(AuditStatus), nullable=False, default=AuditStatus.SUCCESS, index=True)
    ip_address = db.Column(db.String(64))
    metadata_json = db.Column(JSONB, default=dict, nullable=False)


class AnalyticsSnapshot(db.Model):
    __tablename__ = "analytics_snapshots"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    metric_key = db.Column(db.String(120), nullable=False, index=True)
    scope = db.Column(db.String(80), nullable=False, default="global")
    scope_id = db.Column(db.String(80))
    period = db.Column(db.String(40), nullable=False, default="daily")
    value = db.Column(db.Float, nullable=False)
    dimensions = db.Column(JSONB, default=dict, nullable=False)


class SystemSetting(TimestampMixin, db.Model):
    __tablename__ = "system_settings"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    key = db.Column(db.String(120), unique=True, nullable=False)
    value = db.Column(JSONB, nullable=False)
    value_type = db.Column(db.String(40), nullable=False, default="json")
    description = db.Column(db.Text)
    is_public = db.Column(db.Boolean, default=False, nullable=False)


class UserSession(db.Model):
    __tablename__ = "user_sessions"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    user_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    revoked_at = db.Column(db.DateTime)
    ip_address = db.Column(db.String(64))
    user_agent = db.Column(db.String(500))
    refresh_token_jti = db.Column(db.String(120), unique=True)

    user = db.relationship("User", back_populates="sessions", lazy=True)


class TaskProof(TimestampMixin, db.Model):
    __tablename__ = "task_proofs"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    task_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("tasks.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    file_url = db.Column(db.String(1000), nullable=False)
    uploaded_by = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), nullable=False, index=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    notes = db.Column(db.Text)

    task = db.relationship("Task", back_populates="proofs", lazy=True)
    uploader = db.relationship("User", back_populates="task_proofs", lazy=True)


class IssueComment(TimestampMixin, db.Model):
    __tablename__ = "issue_comments"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    issue_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("issues.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey("users.id"), index=True)
    message = db.Column(db.Text, nullable=False)

    issue = db.relationship("Issue", back_populates="comments", lazy=True)
    user = db.relationship("User", back_populates="issue_comments", lazy=True)


class DuplicateIssue(db.Model):
    __tablename__ = "duplicate_issues"
    __table_args__ = (
        UniqueConstraint("issue_id", "duplicate_of_id", name="uq_duplicate_issue_pair"),
    )

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    issue_id = db.Column(UUID(as_uuid=True), db.ForeignKey("issues.id"), nullable=False, index=True)
    duplicate_of_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("issues.id"),
        nullable=False,
        index=True,
    )
    confidence = db.Column(db.Float, index=True)

    issue = db.relationship("Issue", foreign_keys=[issue_id], back_populates="duplicate_links", lazy=True)
    duplicate_of = db.relationship(
        "Issue",
        foreign_keys=[duplicate_of_id],
        back_populates="duplicate_of_links",
        lazy=True,
    )


class DepartmentMetrics(db.Model):
    __tablename__ = "department_metrics"

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=_uuid)
    department_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("departments.id"),
        nullable=False,
        index=True,
    )
    issues_resolved = db.Column(db.Integer, default=0, nullable=False)
    avg_resolution_time = db.Column(db.Float)
    satisfaction_score = db.Column(db.Float)
    calculated_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
