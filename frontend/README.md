# Frontend WeWork

Interface React moderna para cadastro de profissionais, inspirada na estética do WallJobs e adaptada ao contexto WeWork.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- React Query
- React Hook Form + Zod
- Vitest + Testing Library

## Executar localmente

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Aplicação em: `http://localhost:5173`

## Variáveis de ambiente

Arquivo `.env.local.example`:

```env
VITE_API_URL=http://localhost:8000
```

## Fluxos implementados

- Listagem de profissionais com paginação server-side
- Filtros por nome/e-mail, cargo, departamento, data de início e contratos vencendo em X dias
- Ordenação visual por vencimento de contrato na tabela
- Cadastro e edição via modal com validação de formulário
- Ações por linha: visualizar, editar e inativar (soft delete)
- Exportação CSV via endpoint backend (`/api/v1/professionals/export/csv`)
- Página de detalhe do profissional

## Testes

```bash
npm run test
```

Arquivos de teste de exemplo:

- `src/components/FilterBar.test.tsx`
- `src/features/professionals/Form.test.tsx`

## Build

```bash
npm run build
```

## Como validar manualmente

1. Suba backend e frontend
2. Abra a listagem, aplique filtros e navegue entre páginas
3. Crie um novo profissional pelo botão "Novo profissional"
4. Edite e inative um registro
5. Clique em "Exportar CSV" e confirme o download
