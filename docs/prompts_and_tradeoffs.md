# Prompts e Trade-offs Tecnicos
## Projeto WeWork - Cadastro de Profissionais

## 1. Objetivo

Este documento resume como os prompts foram estruturados para orientar a IA na construcao do sistema WeWork, cobrindo:

- frontend
- backend
- banco de dados
- infraestrutura de execucao/deploy
- testes e documentacao

A estrategia priorizou qualidade de codigo, clareza arquitetural e facilidade de evolucao.

---

## 2. Estrategia de Prompt Engineering

Em vez de um prompt unico e extenso, o projeto foi dividido em prompts especializados por dominio.  
Esse modelo aumentou previsibilidade da geracao, facilitou manutencao e reduziu ambiguidade.

Blocos principais:

- **Master Prompt:** contexto global e criterios de qualidade
- **Backend Prompt:** API, regras de negocio e camadas
- **Database Prompt:** modelagem, migrations e indices
- **Frontend Prompt:** UX, listagem, filtros e formularios
- **DevOps Prompt:** Docker e deploy no Render
- **Testing Prompt:** testes unitarios/integracao
- **Documentation Prompt:** guias tecnicos

---

## 3. Master Prompt (orquestracao)

O prompt principal funcionou como um PRD tecnico: definiu stack, arquitetura e requisitos funcionais.

Decisoes centrais:

- separacao por camadas inspirada em Clean Architecture/DDD
- tipagem forte e validacoes desde a borda da aplicacao
- foco em padronizacao de endpoints e contratos de dados

Estrutura logica adotada:

- Domain
- Application/Services
- Infrastructure/Infra
- Interfaces/API

---

## 4. Backend

### Stack

- Python + FastAPI
- SQLAlchemy (async)
- Alembic
- Pydantic

### Decisoes

- **Repository Pattern** para desacoplar regra de negocio da persistencia
- **Validacao no dominio/servico** para manter consistencia de dados
- **Soft delete e status** para rastreabilidade operacional
- **Endpoint de exclusao definitiva** para casos administrativos

### Trade-offs

- Mais camadas trazem mais robustez, mas aumentam verbosidade inicial
- FastAPI foi preferido a frameworks mais pesados para API-first

---

## 5. Banco de Dados

### Escolhas

- PostgreSQL
- IDs em UUID
- Migrations versionadas com Alembic
- Seed idempotente para ambiente local e producao inicial

### Otimizacoes

- indices para campos de busca e filtros recorrentes
- estrutura preparada para filtros combinados (nome, cargo, departamento, vencimento)

### Trade-off

- UUID gera indices maiores que inteiros, mas melhora distribuicao e seguranca de identificadores publicos

---

## 6. Frontend

### Stack

- React + Vite + TypeScript
- Tailwind CSS
- React Query

### Funcionalidades principais

- cadastro e edicao de profissionais
- listagem paginada com filtros
- destaque visual para contratos vencidos
- exportacao de dados
- acoes agrupadas por menu ("Opcoes" e "Sobre")

### Trade-offs

- React Query simplifica sincronizacao com API, ao custo de curva inicial
- Tailwind acelera UI, exigindo disciplina de padroes visuais

---

## 7. DevOps e Deploy

### Estrategia

- Docker para backend e frontend
- `docker-compose` para ambiente local
- deploy no Render via `render.yaml` (Blueprint)

### Aprendizados aplicados

- alinhar variaveis entre frontend/backend (`VITE_API_URL`, `CORS_ORIGINS`)
- ajustar paths de Docker em monorepo (`dockerfilePath` e `dockerContext`)
- garantir bootstrap do backend com migration + seed no startup de deploy

---

## 8. Testes e Qualidade

- Backend: testes de API e regras de negocio
- Frontend: testes de componentes e fluxo de interacao
- Build de producao validado como criterio de prontidao de deploy

Trade-off: maior cobertura aumenta confianca, mas eleva custo de manutencao de testes em mudancas de interface.

---

## 9. Pensamento Critico e Evolucao

Decisoes foram feitas pensando no estado atual e em crescimento gradual:

- arquitetura simples o suficiente para evoluir sem reescrita completa
- separacao clara de responsabilidades
- base pronta para futuras features (auth, notificacoes, auditoria, dashboards)

Evolucoes recomendadas:

- autenticacao JWT e autorizacao por papeis
- trilha de auditoria de alteracoes
- notificacoes automáticas para contratos proximos do vencimento
- observabilidade (logs estruturados + metricas)

---

## 10. Conclusao

A abordagem modular de prompts elevou a qualidade das entregas e melhorou o controle tecnico sobre o projeto.  
O resultado e um sistema funcional, com boa organizacao interna e caminho claro para evolucao de produto e engenharia.
