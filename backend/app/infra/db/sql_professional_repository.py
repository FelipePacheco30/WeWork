from __future__ import annotations

from datetime import date, timedelta
from uuid import UUID

from sqlalchemy import and_, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.exceptions import ConflictError
from app.domain.models.professional import Professional, ProfessionalStatus
from app.infra.db.models import ProfessionalORM
from app.repositories.professional_repository import ProfessionalRepository


class SQLProfessionalRepository(ProfessionalRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    @staticmethod
    def _to_domain(model: ProfessionalORM) -> Professional:
        status = model.status
        if model.data_vencimento_contrato < date.today():
            status = ProfessionalStatus.INATIVO
        return Professional(
            id=model.id,
            nome=model.nome,
            email=model.email,
            cargo=model.cargo,
            departamento=model.departamento,
            telefone=model.telefone,
            data_inicio=model.data_inicio,
            data_vencimento_contrato=model.data_vencimento_contrato,
            status=status,
            observacoes=model.observacoes,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    async def create(self, professional: Professional) -> Professional:
        model = ProfessionalORM(
            nome=professional.nome,
            email=professional.email,
            cargo=professional.cargo,
            departamento=professional.departamento,
            telefone=professional.telefone,
            data_inicio=professional.data_inicio,
            data_vencimento_contrato=professional.data_vencimento_contrato,
            status=professional.status,
            observacoes=professional.observacoes,
        )
        self.session.add(model)
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("email já cadastrado") from exc
        await self.session.refresh(model)
        return self._to_domain(model)

    async def get_by_id(self, professional_id: UUID) -> Professional | None:
        row = await self.session.get(ProfessionalORM, professional_id)
        if row is None:
            return None
        return self._to_domain(row)

    async def get_filter_options(self) -> tuple[list[str], list[str]]:
        cargos_stmt = select(ProfessionalORM.cargo).distinct().order_by(ProfessionalORM.cargo)
        deps_stmt = select(ProfessionalORM.departamento).distinct().order_by(ProfessionalORM.departamento)
        cargos = (await self.session.execute(cargos_stmt)).scalars().all()
        deps = (await self.session.execute(deps_stmt)).scalars().all()
        return ([c for c in cargos if c], [d for d in deps if d])

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
        include_inactive: bool = False,
    ) -> tuple[list[Professional], int]:
        conditions = []
        if not include_inactive:
            conditions.append(ProfessionalORM.status != ProfessionalStatus.INATIVO)
        if q:
            term = f"%{q}%"
            conditions.append(or_(ProfessionalORM.nome.ilike(term), ProfessionalORM.email.ilike(term)))
        if cargo:
            conditions.append(ProfessionalORM.cargo.in_(cargo))
        if departamento:
            conditions.append(ProfessionalORM.departamento.in_(departamento))
        if start_from:
            conditions.append(ProfessionalORM.data_inicio >= start_from)
        if start_to:
            conditions.append(ProfessionalORM.data_inicio <= start_to)
        if contract_due_within_days is not None:
            limit = date.today() + timedelta(days=contract_due_within_days)
            conditions.append(ProfessionalORM.data_vencimento_contrato <= limit)
            conditions.append(ProfessionalORM.data_vencimento_contrato >= date.today())

        where_clause = and_(*conditions) if conditions else None
        count_stmt = select(func.count(ProfessionalORM.id))
        list_stmt = select(ProfessionalORM).order_by(ProfessionalORM.created_at.desc())
        if where_clause is not None:
            count_stmt = count_stmt.where(where_clause)
            list_stmt = list_stmt.where(where_clause)

        total = int((await self.session.execute(count_stmt)).scalar_one())
        list_stmt = list_stmt.offset((page - 1) * page_size).limit(page_size)
        rows = (await self.session.execute(list_stmt)).scalars().all()
        return [self._to_domain(row) for row in rows], total

    async def replace(self, professional_id: UUID, professional: Professional) -> Professional | None:
        row = await self.session.get(ProfessionalORM, professional_id)
        if row is None:
            return None
        row.nome = professional.nome
        row.email = professional.email
        row.cargo = professional.cargo
        row.departamento = professional.departamento
        row.telefone = professional.telefone
        row.data_inicio = professional.data_inicio
        row.data_vencimento_contrato = professional.data_vencimento_contrato
        row.status = professional.status
        row.observacoes = professional.observacoes
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("email já cadastrado") from exc
        await self.session.refresh(row)
        return self._to_domain(row)

    async def patch(self, professional_id: UUID, updates: dict) -> Professional | None:
        row = await self.session.get(ProfessionalORM, professional_id)
        if row is None:
            return None
        for key, value in updates.items():
            setattr(row, key, value)
        try:
            await self.session.commit()
        except IntegrityError as exc:
            await self.session.rollback()
            raise ConflictError("email já cadastrado") from exc
        await self.session.refresh(row)
        return self._to_domain(row)

    async def soft_delete(self, professional_id: UUID) -> bool:
        row = await self.session.get(ProfessionalORM, professional_id)
        if row is None:
            return False
        row.status = ProfessionalStatus.INATIVO
        await self.session.commit()
        return True

    async def hard_delete(self, professional_id: UUID) -> bool:
        row = await self.session.get(ProfessionalORM, professional_id)
        if row is None:
            return False
        await self.session.delete(row)
        await self.session.commit()
        return True

    async def list_contracts_due_within_days(self, days: int) -> list[Professional]:
        limit = date.today() + timedelta(days=days)
        stmt = (
            select(ProfessionalORM)
            .where(ProfessionalORM.status == ProfessionalStatus.ATIVO)
            .where(ProfessionalORM.data_vencimento_contrato.between(date.today(), limit))
            .order_by(ProfessionalORM.data_vencimento_contrato.asc())
        )
        rows = (await self.session.execute(stmt)).scalars().all()
        return [self._to_domain(row) for row in rows]
