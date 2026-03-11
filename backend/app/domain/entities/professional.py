from dataclasses import dataclass
from datetime import date


@dataclass(slots=True)
class Professional:
    id: int | None
    nome: str
    email: str
    cargo: str
    departamento: str
    data_inicio: date
    data_vencimento_contrato: date
    telefone: str
    observacoes: str
    status: str
