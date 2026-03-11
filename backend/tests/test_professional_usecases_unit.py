from datetime import date
from uuid import uuid4

import pytest

from app.domain.exceptions import NotFoundError, ValidationError
from app.domain.models.professional import Professional, ProfessionalStatus
from app.schemas.professional import ProfessionalUpdate
from app.services.professional_service import ProfessionalService


class FakeRepository:
    def __init__(self, items: list[Professional]) -> None:
        self.items = items

    async def create(self, professional: Professional) -> Professional:
        professional.id = uuid4()
        return professional

    async def get_by_id(self, professional_id):
        return next((x for x in self.items if x.id == professional_id), None)

    async def replace(self, professional_id, professional: Professional) -> Professional | None:
        return professional if await self.get_by_id(professional_id) else None

    async def patch(self, professional_id, updates: dict) -> Professional | None:
        item = await self.get_by_id(professional_id)
        if item is None:
            return None
        for key, value in updates.items():
            setattr(item, key, value)
        return item

    async def soft_delete(self, professional_id) -> bool:
        item = await self.get_by_id(professional_id)
        if item is None:
            return False
        item.status = ProfessionalStatus.INATIVO
        return True

    async def list(self, **kwargs):
        return self.items, len(self.items)

    async def list_contracts_due_within_days(self, days: int):
        return self.items


@pytest.mark.asyncio
async def test_export_csv_contains_header_and_rows():
    professional_id = uuid4()
    repo = FakeRepository(
        items=[
            Professional(
                id=professional_id,
                nome="Pessoa A",
                email="a@empresa.com",
                cargo="Dev",
                departamento="Tech",
                telefone="11999999999",
                data_inicio=date(2025, 1, 1),
                data_vencimento_contrato=date(2026, 1, 1),
                observacoes="obs",
                status=ProfessionalStatus.ATIVO,
            )
        ]
    )
    service = ProfessionalService(repo)
    csv_text = await service.export_csv(
        q=None,
        cargo=None,
        departamento=None,
        start_from=None,
        start_to=None,
        contract_due_within_days=None,
    )
    assert "id,nome,email,cargo,departamento" in csv_text
    assert "Pessoa A" in csv_text


@pytest.mark.asyncio
async def test_patch_validates_dates():
    professional_id = uuid4()
    repo = FakeRepository(
        items=[
            Professional(
                id=professional_id,
                nome="Pessoa B",
                email="b@empresa.com",
                cargo="Analista",
                departamento="RH",
                telefone="11999999999",
                data_inicio=date(2025, 1, 1),
                data_vencimento_contrato=date(2026, 1, 1),
                observacoes=None,
                status=ProfessionalStatus.ATIVO,
            )
        ]
    )
    service = ProfessionalService(repo)
    with pytest.raises(ValidationError):
        await service.patch(
            professional_id,
            ProfessionalUpdate(
                data_inicio=date(2026, 5, 1),
                data_vencimento_contrato=date(2026, 1, 1),
            ),
        )


@pytest.mark.asyncio
async def test_get_raises_not_found():
    repo = FakeRepository(items=[])
    service = ProfessionalService(repo)
    with pytest.raises(NotFoundError):
        await service.get(uuid4())
