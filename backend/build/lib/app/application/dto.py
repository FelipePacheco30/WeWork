from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ProfessionalInput(BaseModel):
    nome: str = Field(min_length=2, max_length=120)
    email: EmailStr
    cargo: str = Field(min_length=2, max_length=80)
    departamento: str = Field(min_length=2, max_length=80)
    data_inicio: date
    data_vencimento_contrato: date
    telefone: str = Field(min_length=8, max_length=20)
    observacoes: str = Field(default="", max_length=1000)
    status: str = Field(default="ativo", max_length=30)

    @field_validator("status")
    @classmethod
    def normalize_status(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in {"ativo", "inativo", "ferias", "afastado"}:
            raise ValueError("status inválido")
        return value


class ProfessionalOutput(ProfessionalInput):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ProfessionalFilter(BaseModel):
    nome: Optional[str] = None
    cargo: Optional[str] = None
    departamento: Optional[str] = None
    data_inicio_de: Optional[date] = None
    data_inicio_ate: Optional[date] = None
    vencendo_em_dias: Optional[int] = Field(default=None, ge=0, le=365)
