# Proposal: Setup Testing Infrastructure

## Intent
Implement a robust testing and quality assurance environment for both backend and frontend to ensure stability, prevent regressions, and enable Strict TDD Mode.

## Scope
- **Backend**:
  - Convert to TypeScript (gradual or full).
  - Setup Vitest for Unit/Integration tests.
  - Setup Supertest for API testing.
  - Setup Code Coverage.
- **Frontend**:
  - Convert to TypeScript.
  - Setup Vitest + React Testing Library for Component tests.
  - Setup Playwright for E2E tests.
  - Setup Code Coverage.
- **Common**:
  - Setup pre-commit hooks (optional, but recommended).

## Technical Approach
1.  **Refactor Backend**: Separate `app.js` (logic) from `server.js` (listen).
2.  **Add TypeScript**: Install `typescript` and initialize `tsconfig.json` in both directories.
3.  **Install Testing Tools**:
    - Backend: `vitest`, `supertest`, `tsx`.
    - Frontend: `vitest`, `@testing-library/react`, `jsdom`, `@playwright/test`.
4.  **Configure Scripts**: Add `test`, `test:ui`, `coverage`, and `typecheck` to `package.json`.

## Risks
- Refactoring `server.js` might cause temporary downtime if not handled correctly.
- TypeScript conversion might surface existing hidden type errors.
- Playwright requires browser installations which might take time.

## Rollback Plan
- Revert changes to `package.json` and delete `openspec/` and `tsconfig.json` files.
- Revert `server.js` refactoring.
