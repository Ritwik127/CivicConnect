"""add teams and worker metadata

Revision ID: a5c6f7d8e9b0
Revises: 9021ed58f840
Create Date: 2026-03-31 13:25:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "a5c6f7d8e9b0"
down_revision = "9021ed58f840"
branch_labels = None
depends_on = None


workeravailabilitystatus = sa.Enum(
    "AVAILABLE",
    "ON_DUTY",
    "OFF_DUTY",
    "ON_LEAVE",
    name="workeravailabilitystatus",
)


def upgrade():
    bind = op.get_bind()
    workeravailabilitystatus.create(bind, checkfirst=True)

    op.create_table(
        "teams",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("code", sa.String(length=32), nullable=False),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("department_id", sa.UUID(), nullable=True),
        sa.Column("zone_id", sa.UUID(), nullable=True),
        sa.Column("lead_user_id", sa.UUID(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["department_id"], ["departments.id"]),
        sa.ForeignKeyConstraint(["lead_user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("teams", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_teams_code"), ["code"], unique=True)
        batch_op.create_index(batch_op.f("ix_teams_name"), ["name"], unique=True)

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.add_column(sa.Column("employee_code", sa.String(length=32), nullable=True))
        batch_op.add_column(sa.Column("team_id", sa.UUID(), nullable=True))
        batch_op.add_column(
            sa.Column(
                "availability_status",
                workeravailabilitystatus,
                nullable=False,
                server_default="AVAILABLE",
            )
        )
        batch_op.create_index(batch_op.f("ix_users_employee_code"), ["employee_code"], unique=True)
        batch_op.create_index(batch_op.f("ix_users_team_id"), ["team_id"], unique=False)
        batch_op.create_index(batch_op.f("ix_users_availability_status"), ["availability_status"], unique=False)
        batch_op.create_foreign_key("fk_users_team_id_teams", "teams", ["team_id"], ["id"])

    with op.batch_alter_table("tasks", schema=None) as batch_op:
        batch_op.add_column(sa.Column("team_id", sa.UUID(), nullable=True))
        batch_op.create_index(batch_op.f("ix_tasks_team_id"), ["team_id"], unique=False)
        batch_op.create_foreign_key("fk_tasks_team_id_teams", "teams", ["team_id"], ["id"])


def downgrade():
    with op.batch_alter_table("tasks", schema=None) as batch_op:
        batch_op.drop_constraint("fk_tasks_team_id_teams", type_="foreignkey")
        batch_op.drop_index(batch_op.f("ix_tasks_team_id"))
        batch_op.drop_column("team_id")

    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_constraint("fk_users_team_id_teams", type_="foreignkey")
        batch_op.drop_index(batch_op.f("ix_users_availability_status"))
        batch_op.drop_index(batch_op.f("ix_users_team_id"))
        batch_op.drop_index(batch_op.f("ix_users_employee_code"))
        batch_op.drop_column("availability_status")
        batch_op.drop_column("team_id")
        batch_op.drop_column("employee_code")

    with op.batch_alter_table("teams", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_teams_name"))
        batch_op.drop_index(batch_op.f("ix_teams_code"))

    op.drop_table("teams")

    bind = op.get_bind()
    workeravailabilitystatus.drop(bind, checkfirst=True)
