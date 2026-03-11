"""create professionals

Revision ID: 202603110001
Revises:
Create Date: 2026-03-11
"""

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = "202603110001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "professionals",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("nome", sa.String(length=120), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("cargo", sa.String(length=80), nullable=False),
        sa.Column("departamento", sa.String(length=80), nullable=False),
        sa.Column("data_inicio", sa.Date(), nullable=False),
        sa.Column("data_vencimento_contrato", sa.Date(), nullable=False),
        sa.Column("telefone", sa.String(length=20), nullable=False),
        sa.Column("observacoes", sa.Text(), nullable=False, server_default=""),
        sa.Column("status", sa.String(length=30), nullable=False, server_default="ativo"),
    )
    op.create_index("ix_professionals_nome", "professionals", ["nome"])
    op.create_index("ix_professionals_email", "professionals", ["email"], unique=True)
    op.create_index("ix_professionals_cargo", "professionals", ["cargo"])
    op.create_index("ix_professionals_departamento", "professionals", ["departamento"])
    op.create_index("ix_professionals_data_inicio", "professionals", ["data_inicio"])
    op.create_index(
        "ix_professionals_data_vencimento_contrato", "professionals", ["data_vencimento_contrato"]
    )
    op.create_index("ix_professionals_status", "professionals", ["status"])


def downgrade() -> None:
    op.drop_table("professionals")
