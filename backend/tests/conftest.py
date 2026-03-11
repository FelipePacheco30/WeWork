import os
from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.infra.db.models import Base
from app.infra.db.session import get_db_session
from app.main import app


def _build_test_database_url() -> str:
    configured = os.getenv("TEST_DATABASE_URL")
    if configured:
        return configured
    return "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture()
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    db_url = _build_test_database_url()
    engine = create_async_engine(db_url, future=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session
    await engine.dispose()


@pytest_asyncio.fixture()
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def _override_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    app.dependency_overrides[get_db_session] = _override_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as http_client:
        yield http_client
    app.dependency_overrides.clear()


@pytest.fixture()
def sample_payload() -> dict:
    return {
        "nome": "Maria Teste",
        "email": "maria.teste@empresa.com",
        "cargo": "QA",
        "departamento": "Tecnologia",
        "telefone": "(11) 91111-2222",
        "data_inicio": "2025-01-01",
        "data_vencimento_contrato": "2026-01-01",
        "status": "ativo",
        "observacoes": "Profissional de teste",
    }
