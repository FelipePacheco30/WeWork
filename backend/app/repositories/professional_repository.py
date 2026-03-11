from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import date
from uuid import UUID

from app.domain.models.professional import Professional


class ProfessionalRepository(ABC):
    @abstractmethod
    async def create(self, professional: Professional) -> Professional:
        raise NotImplementedError

    @abstractmethod
    async def get_by_id(self, professional_id: UUID) -> Professional | None:
        raise NotImplementedError

    @abstractmethod
    async def list(
        self,
        *,
        page: int,
        page_size: int,
        q: str | None,
        cargo: str | None,
        departamento: str | None,
        start_from: date | None,
        start_to: date | None,
        contract_due_within_days: int | None,
        include_inactive: bool = False,
    ) -> tuple[list[Professional], int]:
        raise NotImplementedError

    @abstractmethod
    async def replace(self, professional_id: UUID, professional: Professional) -> Professional | None:
        raise NotImplementedError

    @abstractmethod
    async def patch(self, professional_id: UUID, updates: dict) -> Professional | None:
        raise NotImplementedError

    @abstractmethod
    async def soft_delete(self, professional_id: UUID) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def list_contracts_due_within_days(self, days: int) -> list[Professional]:
        raise NotImplementedError
