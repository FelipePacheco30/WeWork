import asyncio
from datetime import date, timedelta

from sqlalchemy import select

from app.infrastructure.db.models import ProfessionalModel
from app.infrastructure.db.session import SessionLocal


async def seed() -> None:
    async with SessionLocal() as session:
        existing = await session.execute(select(ProfessionalModel.id).limit(1))
        if existing.scalar_one_or_none():
            return
        today = date.today()
        session.add_all(
            [
                ProfessionalModel(
                    nome="Ana Souza",
                    email="ana.souza@empresa.com",
                    cargo="Engenheira de Software",
                    departamento="Tecnologia",
                    data_inicio=today - timedelta(days=320),
                    data_vencimento_contrato=today + timedelta(days=40),
                    telefone="11999990001",
                    observacoes="Trabalha com APIs.",
                    status="ativo",
                ),
                ProfessionalModel(
                    nome="Carlos Lima",
                    email="carlos.lima@empresa.com",
                    cargo="Analista de Dados",
                    departamento="Dados",
                    data_inicio=today - timedelta(days=200),
                    data_vencimento_contrato=today + timedelta(days=15),
                    telefone="11999990002",
                    observacoes="Foco em BI.",
                    status="ferias",
                ),
            ]
        )
        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
