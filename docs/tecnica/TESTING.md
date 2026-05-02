# Guia de Testes e Qualidade

O CARB segue uma filosofia de **Strict TDD** para mudanças críticas e garante a integridade via múltiplas camadas de teste.

## 🧪 Camadas de Teste

### 1. Testes Unitários e Integração (Vitest)
Focam na lógica de negócio e endpoints da API.
- **Backend:** `cd backend && pnpm test`
- **Frontend:** `cd frontend && pnpm test`
- **Global:** `pnpm -r test`

### 2. Testes E2E (Playwright)
Validam fluxos completos do usuário (ex: Login, Envio de Ouvidoria).
- **Comando:** `cd frontend && pnpm test:e2e`

### 3. Type Checking (TypeScript)
Garante que não existem erros de tipagem.
- **Comando:** `pnpm -r typecheck`

## 📊 Cobertura
Buscamos manter uma cobertura mínima de **80%** nos módulos principais.
- **Relatório:** `pnpm -r coverage`

## 🛠️ Ferramentas
- **Runner:** Vitest
- **Transformer:** SWC (Frontend) / TSX (Backend)
- **E2E:** Playwright
- **Assertions:** `@testing-library/react`, `supertest`
