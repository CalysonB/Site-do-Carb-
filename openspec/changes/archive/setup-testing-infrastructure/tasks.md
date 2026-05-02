# Tasks: Setup Testing Infrastructure

## Phase 1: Infrastructure Setup

### 1.1 Backend Dependencies
- [x] Install `vitest`, `supertest`, `tsx`, `typescript`, `@types/node`, `@types/express`, `@types/supertest`.
- [x] Create `backend/tsconfig.json`.
- [x] Create `backend/vitest.config.ts`.

### 1.2 Frontend Dependencies
- [x] Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `@playwright/test`, `typescript`.
- [x] Create `frontend/tsconfig.json`.
- [x] Initialize Playwright: `npx playwright install chromium`.
- [x] SWAP to `@vitejs/plugin-react-swc` to fix encoding issues.

## Phase 2: Backend Refactoring

### 2.1 Separate App and Server
- [x] Create `backend/src/app.js` (copy logic from `server.js`).
- [x] Modify `backend/server.js` to import and listen to `app`.
- [x] Convert backend to ESM (`type: module`).

## Phase 3: Implementation of Initial Tests

### 3.1 Backend Integration Test
- [x] Create `backend/tests/api.test.js`.
- [x] Implement test for `POST /api/ouvidoria`.

### 3.2 Frontend Component Test
- [x] Create `frontend/src/App.test.jsx`.
- [x] Implement a basic component test.

### 3.3 E2E Test
- [x] Create `frontend/tests/basic.spec.js`.
- [x] Implement a basic Playwright flow.

## Phase 4: Verification

### 4.1 Run all suites
- [x] Run `npm run test` in backend.
- [x] Run `npm run test` in frontend.
- [ ] Run `npx playwright test` (Optional/Manual due to display requirements).
- [x] Run `npm run typecheck` (Backend & Frontend).
