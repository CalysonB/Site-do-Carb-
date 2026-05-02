# Tasks: Migrate to pnpm

## Phase 1: Preparation
- [ ] Create `pnpm-workspace.yaml` in the root.
- [ ] Remove `package-lock.json` from root, `/backend`, and `/frontend`.

## Phase 2: Installation
- [ ] Run `pnpm install` from the root.
- [ ] Verify `pnpm-lock.yaml` generation.

## Phase 3: Validation
- [ ] Run `pnpm -r test` to ensure all suites pass.
- [ ] Run `pnpm -r typecheck`.

## Phase 4: Documentation Update
- [ ] Update `README.md` to use `pnpm` commands.
- [ ] Update `docs/tecnica/TESTING.md`.
