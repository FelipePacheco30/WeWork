from datetime import date

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.usecases.professional_usecases import ProfessionalUseCases
from app.domain.entities.professional import Professional
from app.domain.repositories.professional_repository import ProfessionalRepository
from app.infrastructure.db.models import ProfessionalModel


class ProfessionalSqlAlchemyRepository(ProfessionalRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    @staticmethod
    def _to_entity(model: ProfessionalModel) -> Professional:
        return Professional(
            id=model.id,
            nome=model.nome,
            email=model.email,
            cargo=model.cargo,
            departamento=model.departamento,
            data_inicio=model.data_inicio,
            data_vencimento_contrato=model.data_vencimento_contrato,
            telefone=model.telefone,
            observacoes=model.observacoes,
            status=model.status,
        )

    async def create(self, professional: Professional) -> Professional:
        model = ProfessionalModel(
            nome=professional.nome,
            email=professional.email,
            cargo=professional.cargo,
            departamento=professional.departamento,
            data_inicio=professional.data_inicio,
            data_vencimento_contrato=professional.data_vencimento_contrato,
            telefone=professional.telefone,
            observacoes=professional.observacoes,
            status=professional.status,
        )
        self.session.add(model)
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_entity(model)

    async def get_by_id(self, professional_id: int) -> Professional | None:
        item = await self.session.get(ProfessionalModel, professional_id)
        if not item:
            return None
        return self._to_entity(item)

    async def update(self, professional_id: int, professional: Professional) -> Professional | None:
        model = await self.session.get(ProfessionalModel, professional_id)
        if not model:
            return None
        for field in [
            "nome",
            "email",
            "cargo",
            "departamento",
            "data_inicio",
            "data_vencimento_contrato",
            "telefone",
            "observacoes",
            "status",
        ]:
            setattr(model, field, getattr(professional, field))
        await self.session.commit()
        await self.session.refresh(model)
        return self._to_entity(model)

    async def delete(self, professional_id: int) -> bool:
        model = await self.session.get(ProfessionalModel, professional_id)
        if not model:
            return False
        await self.session.delete(model)
        await self.session.commit()
        return True

    async def list_filtered(
        self,
        nome: str | None,
        cargo: str | None,
        departamento: str | None,
        data_inicio_de: date | None,
        data_inicio_ate: date | None,
        vencendo_em_dias: int | None,
    ) -> list[Professional]:
        conditions = []
        if nome:
            conditions.append(ProfessionalModel.nome.ilike(f"%{nome}%"))
        if cargo:
            conditions.append(ProfessionalModel.cargo.ilike(f"%{cargo}%"))
        if departamento:
            conditions.append(ProfessionalModel.departamento.ilike(f"%{departamento}%"))
        if data_inicio_de:
            conditions.append(ProfessionalModel.data_inicio >= data_inicio_de)
        if data_inicio_ate:
            conditions.append(ProfessionalModel.data_inicio <= data_inicio_ate)
        if vencendo_em_dias is not None:
            limit_date = ProfessionalUseCases.limite_vencimento(vencendo_em_dias)
            conditions.append(ProfessionalModel.data_vencimento_contrato <= limit_date)

        stmt = select(ProfessionalModel).order_by(ProfessionalModel.id.desc())
        if conditions:
            stmt = stmt.where(and_(*conditions))
        rows = await self.session.execute(stmt)
        return [self._to_entity(row) for row in rows.scalars().all()]
