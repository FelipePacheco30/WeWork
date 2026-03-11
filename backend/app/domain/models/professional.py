from dataclasses import dataclass
from datetime import date, datetime
from enum import StrEnum
from uuid import UUID


class ProfessionalStatus(StrEnum):
    ATIVO = "ativo"
    INATIVO = "inativo"
    LICENCIA = "licencia"


@dataclass(slots=True)
class Professional:
    id: UUID | None
    nome: str
    email: str
    cargo: str
    departamento: str
    telefone: str
    data_inicio: date
    data_vencimento_contrato: date
    status: ProfessionalStatus
    observacoes: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
