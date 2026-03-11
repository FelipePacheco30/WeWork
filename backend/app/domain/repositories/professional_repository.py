from abc import ABC, abstractmethod
from collections.abc import Iterable
from datetime import date

from app.domain.entities.professional import Professional


class ProfessionalRepository(ABC):
    @abstractmethod
    async def create(self, professional: Professional) -> Professional:
        raise NotImplementedError

    @abstractmethod
    async def get_by_id(self, professional_id: int) -> Professional | None:
        raise NotImplementedError

    @abstractmethod
    async def update(self, professional_id: int, professional: Professional) -> Professional | None:
        raise NotImplementedError

    @abstractmethod
    async def delete(self, professional_id: int) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def list_filtered(
        self,
        nome: str | None,
        cargo: str | None,
        departamento: str | None,
        data_inicio_de: date | None,
        data_inicio_ate: date | None,
        vencendo_em_dias: int | None,
    ) -> Iterable[Professional]:
        raise NotImplementedError
