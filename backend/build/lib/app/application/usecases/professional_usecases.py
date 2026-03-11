from datetime import date, timedelta
from io import StringIO

from app.application.dto import ProfessionalFilter, ProfessionalInput, ProfessionalOutput
from app.domain.entities.professional import Professional
from app.domain.repositories.professional_repository import ProfessionalRepository


class ProfessionalUseCases:
    def __init__(self, repository: ProfessionalRepository) -> None:
        self.repository = repository

    async def create(self, payload: ProfessionalInput) -> ProfessionalOutput:
        entity = Professional(id=None, **payload.model_dump())
        created = await self.repository.create(entity)
        return ProfessionalOutput.model_validate(created)

    async def get(self, professional_id: int) -> ProfessionalOutput | None:
        item = await self.repository.get_by_id(professional_id)
        if not item:
            return None
        return ProfessionalOutput.model_validate(item)

    async def update(self, professional_id: int, payload: ProfessionalInput) -> ProfessionalOutput | None:
        entity = Professional(id=professional_id, **payload.model_dump())
        updated = await self.repository.update(professional_id, entity)
        if not updated:
            return None
        return ProfessionalOutput.model_validate(updated)

    async def delete(self, professional_id: int) -> bool:
        return await self.repository.delete(professional_id)

    async def list_filtered(self, filters: ProfessionalFilter) -> list[ProfessionalOutput]:
        items = await self.repository.list_filtered(
            nome=filters.nome,
            cargo=filters.cargo,
            departamento=filters.departamento,
            data_inicio_de=filters.data_inicio_de,
            data_inicio_ate=filters.data_inicio_ate,
            vencendo_em_dias=filters.vencendo_em_dias,
        )
        return [ProfessionalOutput.model_validate(item) for item in items]

    async def export_csv(self, filters: ProfessionalFilter) -> str:
        items = await self.list_filtered(filters)
        headers = [
            "id",
            "nome",
            "email",
            "cargo",
            "departamento",
            "data_inicio",
            "data_vencimento_contrato",
            "telefone",
            "status",
            "observacoes",
        ]
        out = StringIO()
        out.write(",".join(headers) + "\n")
        for item in items:
            row = [
                str(item.id),
                item.nome,
                item.email,
                item.cargo,
                item.departamento,
                item.data_inicio.isoformat(),
                item.data_vencimento_contrato.isoformat(),
                item.telefone,
                item.status,
                (item.observacoes or "").replace(",", ";").replace("\n", " "),
            ]
            out.write(",".join(row) + "\n")
        return out.getvalue()

    @staticmethod
    def dias_para_vencer(data_vencimento: date) -> int:
        return (data_vencimento - date.today()).days

    @staticmethod
    def limite_vencimento(dias: int) -> date:
        return date.today() + timedelta(days=dias)
