# WeWork - Prompts Especializados e Trade-offs

## 1) Frontend Prompt

Objetivo: entregar UI moderna, responsiva e acessivel para CRUD e filtros.

Escolhas:
- React + Vite + TypeScript para produtividade e tipagem forte.
- Tailwind CSS para velocidade de composicao e consistencia visual.
- `useProfessionals` centralizando estado e efeitos de listagem.

Trade-offs:
- Sem biblioteca global de estado para manter simplicidade (menos boilerplate).
- Formularios em estado local sem `react-hook-form` para reduzir dependencias.

## 2) Backend Prompt

Objetivo: API robusta com validacao, filtros, export CSV e observabilidade.

Escolhas:
- FastAPI + Pydantic v2 para validacao de entrada/saida.
- SQLAlchemy 2.0 async com repositores e usecases.
- Inversao de dependencia via construtor/factory de `UseCases`.

Trade-offs:
- Rate-limit em memoria (simples) ao inves de Redis (mais robusto).
- Regras de negocio concentradas no application layer; dominio propositalmente enxuto.

## 3) Database Prompt

Objetivo: esquema relacional versionado e dados iniciais.

Escolhas:
- PostgreSQL para ambiente de producao.
- Alembic para migrations versionadas.
- Seed script idempotente para ambiente local.

Trade-offs:
- Seed simples via script Python (rapido de manter) versus ferramenta dedicada de fixtures.

## 4) DevOps Prompt

Objetivo: reproducibilidade local, CI e deploy no Render.

Escolhas:
- Dockerfiles separados para frontend e backend.
- `docker-compose.dev.yml` com stack completa.
- GitHub Actions com lint/test/build.
- `render.yaml` (Blueprint) para provisionar servicos.

Trade-offs:
- Frontend servido em modo dev no compose local (mais rapido para iterar).
- Em producao Render usa Docker build completo.

## 5) Seguranca Basica

- CORS restrito por configuracao.
- Sem secrets no repositorio.
- Validacao de input com limites de campos.
- Middleware de rate-limit como camada inicial de protecao.

## 6) Evolucoes recomendadas

- Autenticacao/autorizacao (JWT + RBAC).
- Rate-limit distribuido com Redis.
- Auditoria de alteracoes por usuario.
- Background jobs para automacoes de contrato.
