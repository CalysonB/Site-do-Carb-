# Proposal: Migrate to pnpm

## Intent
Replace `npm` with `pnpm` to improve installation speed, save disk space through content-addressable storage, and enforce stricter dependency management.

## Scope
- Removal of `package-lock.json` and `node_modules` in root, `/backend`, and `/frontend`.
- Generation of `pnpm-lock.yaml` files.
- Update of documentation (README) to reflect the tool change.

## Technical Approach
1.  Verify `pnpm` version.
2.  Clean up existing npm artifacts.
3.  Run `pnpm install` in all package directories.
4.  Optionally set up a `pnpm-workspace.yaml` if we want to manage it as a single workspace (highly recommended for monorepos).

## Risks
- Minor differences in how `pnpm` resolves nested dependencies compared to `npm` might cause runtime issues (unlikely but possible).

## Rollback Plan
- Delete `pnpm-lock.yaml` and run `npm install` again to regenerate `package-lock.json`.
