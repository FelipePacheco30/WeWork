import asyncio
from datetime import date, timedelta

from sqlalchemy import select

from app.domain.models.professional import ProfessionalStatus
from app.infra.db.models import ProfessionalORM
from app.infra.db.session import AsyncSessionLocal


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        existing = await session.execute(select(ProfessionalORM.id).limit(1))
        if existing.scalar_one_or_none():
            return
        today = date.today()
        session.add_all(
            [
                ProfessionalORM(
                    nome="Ana Souza",
                    email="ana.souza@empresa.com",
                    cargo="Engenheira de Software",
                    departamento="Tecnologia",
                    telefone="11999990001",
                    data_inicio=today - timedelta(days=320),
                    data_vencimento_contrato=today + timedelta(days=40),
                    observacoes="Trabalha com APIs.",
                    status=ProfessionalStatus.ATIVO,
                ),
                ProfessionalORM(
                    nome="Carlos Lima",
                    email="carlos.lima@empresa.com",
                    cargo="Analista de Dados",
                    departamento="Dados",
                    telefone="11999990002",
                    data_inicio=today - timedelta(days=200),
                    data_vencimento_contrato=today + timedelta(days=15),
                    observacoes="Foco em BI.",
                    status=ProfessionalStatus.LICENCIA,
                ),
            ]
        )
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
