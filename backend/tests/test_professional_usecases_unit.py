from datetime import date

import pytest

from app.application.dto import ProfessionalFilter
from app.application.usecases.professional_usecases import ProfessionalUseCases
from app.domain.entities.professional import Professional


class FakeRepository:
    def __init__(self, items: list[Professional]) -> None:
        self.items = items

    async def create(self, professional: Professional) -> Professional:
        professional.id = 1
        return professional

    async def get_by_id(self, professional_id: int) -> Professional | None:
        return next((x for x in self.items if x.id == professional_id), None)

    async def update(self, professional_id: int, professional: Professional) -> Professional | None:
        return professional

    async def delete(self, professional_id: int) -> bool:
        return True

    async def list_filtered(self, **kwargs):
        return self.items


@pytest.mark.asyncio
async def test_export_csv_contains_header_and_rows():
    repo = FakeRepository(
        items=[
            Professional(
                id=10,
                nome="Pessoa A",
                email="a@empresa.com",
                cargo="Dev",
                departamento="Tech",
                data_inicio=date(2025, 1, 1),
                data_vencimento_contrato=date(2026, 1, 1),
                telefone="11999999999",
                observacoes="obs",
                status="ativo",
            )
        ]
    )
    usecases = ProfessionalUseCases(repo)
    csv_text = await usecases.export_csv(ProfessionalFilter())
    assert "id,nome,email,cargo,departamento" in csv_text
    assert "Pessoa A" in csv_text
