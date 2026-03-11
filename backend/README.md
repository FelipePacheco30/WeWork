# WeWork Backend (FastAPI)

Backend do sistema WeWork com arquitetura inspirada em DDD/Clean Architecture.

## Stack

- Python 3.11+
- FastAPI + Pydantic v2
- SQLAlchemy async 2.x
- Alembic (migrations)
- PostgreSQL
- APScheduler (job periódico de contratos)

## Estrutura

```text
backend/
├─ app/
│  ├─ domain/
│  │  ├─ models/professional.py
│  │  └─ exceptions.py
│  ├─ schemas/professional.py
│  ├─ services/professional_service.py
│  ├─ repositories/professional_repository.py
│  ├─ infra/
│  │  ├─ db/{models.py,session.py,sql_professional_repository.py}
│  │  ├─ email/sender.py
│  │  ├─ events/queue.py
│  │  └─ scheduler/contracts.py
│  ├─ api/
│  │  ├─ dependencies.py
│  │  └─ v1/{health.py,professionals.py}
│  ├─ config.py
│  ├─ logging_config.py
│  └─ main.py
├─ alembic/
├─ tests/
├─ requirements.txt
├─ Dockerfile
├─ docker-compose.dev.yml
└─ .env.example
```

## Variáveis de ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Campos principais:

- `DATABASE_URL`
- `CORS_ORIGINS`
- `CONTRACTS_DUE_WINDOW_DAYS`
- `SCHEDULER_ENABLED`

## Rodando localmente (sem Docker)

```bash
pip install -r requirements.txt
pip install -e ".[dev]"
alembic upgrade head
uvicorn app.main:app --reload
```

Documentação automática:

- Swagger: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

## Rodando com Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Endpoints

Base URL: `/api/v1`

- `POST /professionals`
- `GET /professionals`
- `GET /professionals/{id}`
- `PUT /professionals/{id}`
- `PATCH /professionals/{id}`
- `DELETE /professionals/{id}` (soft delete)
- `GET /professionals/export/csv`
- `GET /health`

## Exemplos cURL

Criar profissional:

```bash
curl -X POST http://localhost:8000/api/v1/professionals \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"Maria Souza",
    "email":"maria.souza@empresa.com",
    "cargo":"QA",
    "departamento":"Tecnologia",
    "telefone":"(11) 91111-2222",
    "data_inicio":"2025-01-10",
    "data_vencimento_contrato":"2026-01-10",
    "status":"ativo",
    "observacoes":"Colaboradora em onboarding"
  }'
```

Listar com filtros:

```bash
curl "http://localhost:8000/api/v1/professionals?page=1&page_size=20&q=maria&contract_due_within_days=30"
```

Patch parcial:

```bash
curl -X PATCH http://localhost:8000/api/v1/professionals/<uuid> \
  -H "Content-Type: application/json" \
  -d '{"departamento":"Qualidade"}'
```

## Testes

Com sqlite em memória (fallback padrão):

```bash
pytest -q
```

Com PostgreSQL de teste:

```bash
export TEST_DATABASE_URL=postgresql+asyncpg://wework:wework@localhost:5432/wework_test
pytest -q
```

Com Testcontainers (opcional):

```bash
pip install "testcontainers[postgres]"
# configure fixture dedicada se quiser rodar container por suíte
pytest -q
```

## Deploy no Render

Opção 1 (Docker):
- Aponte o serviço para `backend/Dockerfile`
- Configure env vars (`DATABASE_URL`, `CORS_ORIGINS`, etc.)
- Start command: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Opção 2 (Native Python):
- Build: `pip install -r requirements.txt && pip install -e .`
- Start: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
