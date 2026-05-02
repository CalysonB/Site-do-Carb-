# Design: Testing Infrastructure

## Architecture Decisions

### AD1: Vitest over Jest
- **Rationale**: Faster execution, native ESM support, and better integration with Vite (which the frontend already uses). Using the same runner for both backend and frontend reduces cognitive load.

### AD2: Refactoring Backend Entry Point
- **Rationale**: To test Express routes without starting the actual server (which would block the test process or conflict with ports), we will separate the `express()` app instance into `app.js` and keep `server.listen()` in `server.js`.

### AD3: Gradual TypeScript Adoption
- **Rationale**: We will start by adding `tsconfig.json` and allowing JS files (`allowJs: true`). New tests and critical files will be converted to `.ts`/`.tsx`.

## Component Design

### Backend Structure
- `backend/src/app.ts`: Express application setup.
- `backend/src/server.ts`: Server entry point.
- `backend/tests/`: Directory for unit and integration tests.
- `backend/vitest.config.ts`: Vitest configuration.

### Frontend Structure
- `frontend/vitest.config.ts`: Shared with Vite or separate for tests.
- `frontend/tests/`: E2E and Component tests.
- `frontend/playwright.config.ts`: Playwright configuration.

## Data Flow (Integration Test)
1.  Vitest starts.
2.  Supertest wraps the `app` instance.
3.  Supertest makes a request (e.g., POST `/api/ouvidoria`).
4.  Database is mocked or uses a test instance (to be decided in tasks).
5.  Assertion on the response status and body.
