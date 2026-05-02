# Specs: Testing Infrastructure

## Requirements

### R1: Backend Test Runner
- The system MUST use **Vitest** as the primary test runner.
- The system MUST be able to run unit tests and integration tests separately.

### R2: Backend Integration Testing
- The system MUST use **Supertest** to simulate HTTP requests to the Express API.
- All core API endpoints (`/api/admin/login`, `/api/ouvidoria`, `/api/upload`) MUST have at least one integration test scenario.

### R3: Frontend Component Testing
- The system MUST use **Vitest** + **React Testing Library** for component testing.
- The system MUST use **jsdom** as the test environment.

### R4: E2E Testing
- The system MUST use **Playwright** for End-to-End testing.
- Scenarios MUST include:
    - User sending a suggestion via the public form.
    - Admin logging in successfully.

### R5: Type Checking
- Both Backend and Frontend MUST use **TypeScript**.
- The `npm run typecheck` command MUST fail if there are any type errors.

### R6: Coverage
- The system MUST report code coverage for both backend and frontend.
- Coverage reports MUST be generated in the `coverage/` directory.

## Scenarios

### Scenario 1: Backend Unit/Integration Test Execution
- **Given** the backend environment is set up.
- **When** I run `npm run test` in the `/backend` directory.
- **Then** all Vitest tests MUST pass.

### Scenario 2: Frontend E2E Test Execution
- **Given** the frontend and backend servers are running.
- **When** I run `npx playwright test` in the `/frontend` directory.
- **Then** the E2E scenarios MUST pass.

### Scenario 3: Type Validation
- **Given** a type error is introduced in a `.ts` or `.tsx` file.
- **When** I run `npm run typecheck`.
- **Then** the command MUST exit with a non-zero code.
