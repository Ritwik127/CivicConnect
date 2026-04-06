"""add ghmc boundary tables

Revision ID: b6d4c2e1f9a3
Revises: a5c6f7d8e9b0
Create Date: 2026-04-03 15:30:00.000000

"""
from alembic import op
import geoalchemy2
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "b6d4c2e1f9a3"
down_revision = "a5c6f7d8e9b0"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "zones",
        sa.Column(
            "geom",
            geoalchemy2.Geography(
                geometry_type="MULTIPOLYGON",
                srid=4326,
                from_text="ST_GeogFromText",
                name="geography",
            ),
            nullable=True,
        ),
    )
    op.create_index("ix_zones_geom", "zones", ["geom"], unique=False, postgresql_using="gist")

    op.create_table(
        "circles",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("code", sa.String(length=32), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("zone_id", sa.UUID(), nullable=True),
        sa.Column("geojson", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column(
            "geom",
            geoalchemy2.Geography(
                geometry_type="MULTIPOLYGON",
                srid=4326,
                from_text="ST_GeogFromText",
                name="geography",
            ),
            nullable=True,
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("circles", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_circles_code"), ["code"], unique=True)
        batch_op.create_index(batch_op.f("ix_circles_name"), ["name"], unique=True)
        batch_op.create_index(batch_op.f("ix_circles_zone_id"), ["zone_id"], unique=False)
    op.create_index("ix_circles_geom", "circles", ["geom"], unique=False, postgresql_using="gist")

    op.create_table(
        "wards",
        sa.Column("id", sa.UUID(), nullable=False),
        sa.Column("code", sa.String(length=32), nullable=True),
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("zone_id", sa.UUID(), nullable=True),
        sa.Column("circle_id", sa.UUID(), nullable=True),
        sa.Column("geojson", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column(
            "geom",
            geoalchemy2.Geography(
                geometry_type="MULTIPOLYGON",
                srid=4326,
                from_text="ST_GeogFromText",
                name="geography",
            ),
            nullable=True,
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("updated_at", sa.DateTime(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(["circle_id"], ["circles.id"]),
        sa.ForeignKeyConstraint(["zone_id"], ["zones.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("wards", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_wards_code"), ["code"], unique=True)
        batch_op.create_index(batch_op.f("ix_wards_name"), ["name"], unique=True)
        batch_op.create_index(batch_op.f("ix_wards_zone_id"), ["zone_id"], unique=False)
        batch_op.create_index(batch_op.f("ix_wards_circle_id"), ["circle_id"], unique=False)
    op.create_index("ix_wards_geom", "wards", ["geom"], unique=False, postgresql_using="gist")

    with op.batch_alter_table("issues", schema=None) as batch_op:
        batch_op.add_column(sa.Column("ward_id", sa.UUID(), nullable=True))
        batch_op.create_index(batch_op.f("ix_issues_ward_id"), ["ward_id"], unique=False)
        batch_op.create_foreign_key("fk_issues_ward_id_wards", "wards", ["ward_id"], ["id"])


def downgrade():
    with op.batch_alter_table("issues", schema=None) as batch_op:
        batch_op.drop_constraint("fk_issues_ward_id_wards", type_="foreignkey")
        batch_op.drop_index(batch_op.f("ix_issues_ward_id"))
        batch_op.drop_column("ward_id")

    op.drop_index("ix_wards_geom", table_name="wards", postgresql_using="gist")
    with op.batch_alter_table("wards", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_wards_circle_id"))
        batch_op.drop_index(batch_op.f("ix_wards_zone_id"))
        batch_op.drop_index(batch_op.f("ix_wards_name"))
        batch_op.drop_index(batch_op.f("ix_wards_code"))
    op.drop_table("wards")

    op.drop_index("ix_circles_geom", table_name="circles", postgresql_using="gist")
    with op.batch_alter_table("circles", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_circles_zone_id"))
        batch_op.drop_index(batch_op.f("ix_circles_name"))
        batch_op.drop_index(batch_op.f("ix_circles_code"))
    op.drop_table("circles")

    op.drop_index("ix_zones_geom", table_name="zones", postgresql_using="gist")
    op.drop_column("zones", "geom")
