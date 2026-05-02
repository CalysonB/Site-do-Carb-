# Specs: Migrate to pnpm

## Requirements

### R1: Lockfile Transition
- All `package-lock.json` files MUST be removed.
- All `pnpm-lock.yaml` files MUST be generated and committed.

### R2: Dependency Integrity
- The project MUST remain functional after the migration.
- Existing tests (`npm run test`) MUST pass using `pnpm test`.

### R3: Developer Experience
- Documentation MUST be updated to point to `pnpm` instead of `npm`.

## Scenarios

### Scenario 1: Clean Installation
- **Given** I am in a fresh clone of the repo.
- **When** I run `pnpm install`.
- **Then** all dependencies MUST be correctly linked and the app MUST run.
