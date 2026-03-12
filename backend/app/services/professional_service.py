from __future__ import annotations

import csv
from datetime import date
from io import StringIO
from uuid import UUID

from app.domain.exceptions import NotFoundError, ValidationError
from app.domain.models.professional import Professional
from app.repositories.professional_repository import ProfessionalRepository
from app.schemas.professional import (
    ProfessionalCreate,
    ProfessionalListResponse,
    ProfessionalRead,
    ProfessionalReplace,
    ProfessionalUpdate,
)


class ProfessionalService:
    def __init__(self, repository: ProfessionalRepository) -> None:
        self.repository = repository

    async def create(self, payload: ProfessionalCreate) -> ProfessionalRead:
        entity = Professional(id=None, **payload.model_dump())
        created = await self.repository.create(entity)
        return ProfessionalRead.model_validate(created)

    async def get(self, professional_id: UUID) -> ProfessionalRead:
        item = await self.repository.get_by_id(professional_id)
        if item is None:
            raise NotFoundError("profissional não encontrado")
        return ProfessionalRead.model_validate(item)

    async def get_filter_options(self) -> dict:
        cargos, departamentos = await self.repository.get_filter_options()
        return {"cargos": cargos, "departamentos": departamentos}

    async def list(
        self,
        *,
        page: int,
        page_size: int,
        q: str | None,
        cargo: list[str] | None,
        departamento: list[str] | None,
        start_from: date | None,
        start_to: date | None,
        contract_due_within_days: int | None,
    ) -> ProfessionalListResponse:
        cargo_list = [c for c in (cargo or []) if c]
        dep_list = [d for d in (departamento or []) if d]
        items, total = await self.repository.list(
            page=page,
            page_size=page_size,
            q=q,
            cargo=cargo_list if cargo_list else None,
            departamento=dep_list if dep_list else None,
            start_from=start_from,
            start_to=start_to,
            contract_due_within_days=contract_due_within_days,
            include_inactive=True,
        )
        return ProfessionalListResponse(
            items=[ProfessionalRead.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
        )

    async def replace(self, professional_id: UUID, payload: ProfessionalReplace) -> ProfessionalRead:
        entity = Professional(id=professional_id, **payload.model_dump())
        updated = await self.repository.replace(professional_id, entity)
        if updated is None:
            raise NotFoundError("profissional não encontrado")
        return ProfessionalRead.model_validate(updated)

    async def patch(self, professional_id: UUID, payload: ProfessionalUpdate) -> ProfessionalRead:
        current = await self.repository.get_by_id(professional_id)
        if current is None:
            raise NotFoundError("profissional não encontrado")
        updates = payload.model_dump(exclude_unset=True)
        if not updates:
            return ProfessionalRead.model_validate(current)

        start = updates.get("data_inicio", current.data_inicio)
        due = updates.get("data_vencimento_contrato", current.data_vencimento_contrato)
        if due < start:
            raise ValidationError("data_vencimento_contrato deve ser maior ou igual a data_inicio")

        updated = await self.repository.patch(professional_id, updates)
        if updated is None:
            raise NotFoundError("profissional não encontrado")
        return ProfessionalRead.model_validate(updated)

    async def soft_delete(self, professional_id: UUID) -> None:
        ok = await self.repository.soft_delete(professional_id)
        if not ok:
            raise NotFoundError("profissional não encontrado")

    async def export_csv(
        self,
        *,
        q: str | None,
        cargo: list[str] | None,
        departamento: list[str] | None,
        start_from: date | None,
        start_to: date | None,
        contract_due_within_days: int | None,
    ) -> str:
        cargo_list = [c for c in (cargo or []) if c]
        dep_list = [d for d in (departamento or []) if d]
        rows, _ = await self.repository.list(
            page=1,
            page_size=10_000,
            q=q,
            cargo=cargo_list if cargo_list else None,
            departamento=dep_list if dep_list else None,
            start_from=start_from,
            start_to=start_to,
            contract_due_within_days=contract_due_within_days,
            include_inactive=True,
        )
        output = StringIO()
        writer = csv.writer(output)
        writer.writerow(
            [
                "id",
                "nome",
                "email",
                "cargo",
                "departamento",
                "telefone",
                "data_inicio",
                "data_vencimento_contrato",
                "status",
                "observacoes",
                "created_at",
                "updated_at",
            ]
        )
        for row in rows:
            writer.writerow(
                [
                    row.id,
                    row.nome,
                    row.email,
                    row.cargo,
                    row.departamento,
                    row.telefone,
                    row.data_inicio.isoformat(),
                    row.data_vencimento_contrato.isoformat(),
                    row.status.value,
                    row.observacoes or "",
                    row.created_at.isoformat() if row.created_at else "",
                    row.updated_at.isoformat() if row.updated_at else "",
                ]
            )
        return output.getvalue()
