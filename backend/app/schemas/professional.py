from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from app.domain.models.professional import ProfessionalStatus


class ProfessionalBase(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    email: EmailStr
    cargo: str = Field(min_length=2, max_length=80)
    departamento: str = Field(min_length=2, max_length=80)
    telefone: str = Field(min_length=8, max_length=20)
    data_inicio: date
    data_vencimento_contrato: date
    status: ProfessionalStatus = ProfessionalStatus.ATIVO
    observacoes: str | None = Field(default=None, max_length=5000)

    @field_validator("telefone")
    @classmethod
    def sanitize_phone(cls, value: str) -> str:
        cleaned = "".join(ch for ch in value if ch.isdigit() or ch in "+-() ")
        return cleaned.strip()

    @model_validator(mode="after")
    def validate_dates(self) -> "ProfessionalBase":
        if self.data_vencimento_contrato < self.data_inicio:
            raise ValueError("data_vencimento_contrato deve ser maior ou igual a data_inicio")
        if self.data_vencimento_contrato < date.today():
            raise ValueError("data_vencimento_contrato não pode ser uma data passada")
        return self


class ProfessionalCreate(ProfessionalBase):
    pass


class ProfessionalReplace(ProfessionalBase):
    pass


class ProfessionalUpdate(BaseModel):
    nome: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None
    cargo: str | None = Field(default=None, min_length=2, max_length=80)
    departamento: str | None = Field(default=None, min_length=2, max_length=80)
    telefone: str | None = Field(default=None, min_length=8, max_length=20)
    data_inicio: date | None = None
    data_vencimento_contrato: date | None = None
    status: ProfessionalStatus | None = None
    observacoes: str | None = Field(default=None, max_length=5000)

    @field_validator("telefone")
    @classmethod
    def sanitize_phone(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = "".join(ch for ch in value if ch.isdigit() or ch in "+-() ")
        return cleaned.strip()


class ProfessionalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    nome: str
    email: EmailStr
    cargo: str
    departamento: str
    telefone: str
    data_inicio: date
    data_vencimento_contrato: date
    status: ProfessionalStatus
    observacoes: str | None
    created_at: datetime
    updated_at: datetime


class ProfessionalListResponse(BaseModel):
    items: list[ProfessionalRead]
    total: int
    page: int
    page_size: int
