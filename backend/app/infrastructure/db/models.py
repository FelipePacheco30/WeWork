from datetime import date

from sqlalchemy import Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.infrastructure.db.base import Base


class ProfessionalModel(Base):
    __tablename__ = "professionals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nome: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    cargo: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    departamento: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    data_inicio: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    data_vencimento_contrato: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)
    observacoes: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="ativo", index=True)
