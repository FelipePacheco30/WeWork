# WeWork

Sistema completo de cadastro de profissionais com frontend em React + Vite e backend em FastAPI, pronto para desenvolvimento local com Docker e deploy no Render.

## Arquitetura

- `frontend/`: interface web responsiva, acessivel e tipada com TypeScript.
- `backend/`: API REST com FastAPI em camadas inspiradas em Clean Architecture:
  - `domain`: entidades e contratos
  - `application`: DTOs e casos de uso
  - `infrastructure`: banco, repositorios e persistencia
  - `interfaces`: controllers/rotas HTTP
- `api_spec.yaml`: especificacao OpenAPI sincronizada com a implementacao da API.
- `docker-compose.dev.yml`: stack local com `db`, `backend` e `frontend`.
- `render.yaml`: blueprint de deploy no Render (web services + postgres).

## File Tree (resumo)

```txt
.
├─ api_spec.yaml
├─ docker-compose.dev.yml
├─ render.yaml
├─ scripts/
│  ├─ bootstrap-dev.sh
│  └─ bootstrap-dev.ps1
├─ backend/
│  ├─ app/
│  │  ├─ application/
│  │  ├─ domain/
│  │  ├─ infrastructure/
│  │  ├─ interfaces/
│  │  ├─ config.py
│  │  ├─ logging_config.py
│  │  ├─ main.py
│  │  └─ seed.py
│  ├─ alembic/
│  ├─ tests/
│  ├─ scripts/export_openapi.py
│  ├─ pyproject.toml
│  └─ Dockerfile
└─ frontend/
   ├─ public/
   │  ├─ logo.svg
   │  └─ favicon.svg
   ├─ src/
   │  ├─ components/
   │  ├─ hooks/
   │  ├─ pages/
   │  ├─ services/
   │  └─ types/
   ├─ package.json
   └─ Dockerfile
```

## Um Comando (bootstrap dev)

Linux/macOS:

```bash
sh scripts/bootstrap-dev.sh
```

Windows PowerShell:

```powershell
.\scripts\bootstrap-dev.ps1
```

Esse comando sobe Postgres + API + Frontend e aplica migration + seed automaticamente.

## Execucao Manual

1) Copie variaveis:

```bash
cp .env.example .env
```

2) Suba via Docker:

```bash
docker compose -f docker-compose.dev.yml up --build
```

3) Acesse:
- Frontend: `http://localhost:5173`
- Backend docs: `http://localhost:8000/docs`
- Healthcheck: `http://localhost:8000/health`

## Requests/Responses de Exemplo

### Criar profissional

`POST /professionals`

Request:

```json
{
  "nome": "Ana Souza",
  "email": "ana.souza@empresa.com",
  "cargo": "Engenheira de Software",
  "departamento": "Tecnologia",
  "data_inicio": "2025-01-10",
  "data_vencimento_contrato": "2026-01-10",
  "telefone": "11999990001",
  "observacoes": "Especialista em APIs",
  "status": "ativo"
}
```

Response `201`:

```json
{
  "id": 1,
  "nome": "Ana Souza",
  "email": "ana.souza@empresa.com",
  "cargo": "Engenheira de Software",
  "departamento": "Tecnologia",
  "data_inicio": "2025-01-10",
  "data_vencimento_contrato": "2026-01-10",
  "telefone": "11999990001",
  "observacoes": "Especialista em APIs",
  "status": "ativo"
}
```

### Listar com filtros

`GET /professionals?nome=ana&vencendo_em_dias=30`

Response `200`:

```json
[
  {
    "id": 1,
    "nome": "Ana Souza",
    "email": "ana.souza@empresa.com",
    "cargo": "Engenheira de Software",
    "departamento": "Tecnologia",
    "data_inicio": "2025-01-10",
    "data_vencimento_contrato": "2026-01-10",
    "telefone": "11999990001",
    "observacoes": "Especialista em APIs",
    "status": "ativo"
  }
]
```

### Export CSV

`GET /professionals/export/csv?departamento=Tecnologia`

Response `200` com `Content-Type: text/csv`.

## Testes e Qualidade

Backend:

```bash
cd backend
pip install .[dev]
ruff check .
black --check .
isort --check .
pytest -q
```

Frontend:

```bash
cd frontend
npm install
npm run lint
npm run test
npm run build
```

## Migrations e Seed

```bash
cd backend
alembic upgrade head
python -m app.seed
python scripts/export_openapi.py
```

## Deploy no Render

Este repositorio inclui `render.yaml` com:
- `wework-backend` (Web Service Docker)
- `wework-frontend` (Web Service Docker)
- `wework-db` (PostgreSQL)

No Render, conecte o repositorio e use Blueprint Deploy.

## CI (GitHub Actions)

Pipeline em `.github/workflows/ci.yml`:
- Backend: install, lint (ruff/black/isort), tests (pytest)
- Frontend: install, lint (eslint), tests (vitest), build (vite)

## Seguranca Basica

- CORS configurado por variavel de ambiente (`ALLOWED_ORIGINS`).
- Rate-limit basico em middleware (`BasicRateLimitMiddleware`).
- Validacao de entrada com Pydantic.
- Sem secrets hardcoded no codigo; uso de `.env`.

## Historico de commits sugerido

Exemplos de mensagens:
- `feat(backend): implementa CRUD e filtros de profissionais`
- `feat(frontend): cria dashboard responsivo com formulario e tabela`
- `chore(devops): adiciona docker-compose, render blueprint e CI`
- `test: adiciona testes unitarios e de integracao`
- `docs: escreve README e guia de deploy`
