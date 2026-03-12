import uuid
from datetime import date, datetime

from sqlalchemy import Date, DateTime, Enum, String, Text, Uuid, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.domain.models.professional import ProfessionalStatus


class Base(DeclarativeBase):
    pass


class ProfessionalORM(Base):
    __tablename__ = "professionals"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    cargo: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    departamento: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    telefone: Mapped[str] = mapped_column(String(20), nullable=False)
    data_inicio: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    data_vencimento_contrato: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    status: Mapped[ProfessionalStatus] = mapped_column(
        Enum(
            ProfessionalStatus,
            name="professional_status",
            native_enum=False,
            values_callable=lambda enum_cls: [item.value for item in enum_cls],
        ),
        nullable=False,
        default=ProfessionalStatus.ATIVO,
        index=True,
    )
    observacoes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
