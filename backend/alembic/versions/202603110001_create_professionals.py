"""create professionals

Revision ID: 202603110001
Revises:
Create Date: 2026-03-11
"""

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

# revision identifiers, used by Alembic.
revision = "202603110001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")
    op.create_table(
        "professionals",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            nullable=False,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column("nome", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("cargo", sa.String(length=80), nullable=False),
        sa.Column("departamento", sa.String(length=80), nullable=False),
        sa.Column("telefone", sa.String(length=20), nullable=False),
        sa.Column("data_inicio", sa.Date(), nullable=False),
        sa.Column("data_vencimento_contrato", sa.Date(), nullable=False),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="ativo"),
        sa.Column("observacoes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.CheckConstraint(
            "status in ('ativo', 'inativo', 'licencia')",
            name="ck_professionals_status",
        ),
        sa.CheckConstraint(
            "data_vencimento_contrato >= data_inicio",
            name="ck_professionals_dates",
        ),
    )
    op.create_index("ix_professionals_email", "professionals", ["email"], unique=True)
    op.create_index("ix_professionals_nome", "professionals", ["nome"])
    op.create_index("ix_professionals_cargo", "professionals", ["cargo"])
    op.create_index("ix_professionals_departamento", "professionals", ["departamento"])
    op.create_index("ix_professionals_status", "professionals", ["status"])
    op.create_index("ix_professionals_data_inicio", "professionals", ["data_inicio"])
    op.create_index(
        "ix_professionals_data_vencimento_contrato", "professionals", ["data_vencimento_contrato"]
    )
def downgrade() -> None:
    op.drop_index("ix_professionals_data_vencimento_contrato", table_name="professionals")
    op.drop_index("ix_professionals_data_inicio", table_name="professionals")
    op.drop_index("ix_professionals_status", table_name="professionals")
    op.drop_index("ix_professionals_departamento", table_name="professionals")
    op.drop_index("ix_professionals_cargo", table_name="professionals")
    op.drop_index("ix_professionals_nome", table_name="professionals")
    op.drop_index("ix_professionals_email", table_name="professionals")
    op.drop_table("professionals")
