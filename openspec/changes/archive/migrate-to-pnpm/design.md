# Design: pnpm Workspace

## Architecture Decision

### AD1: pnpm Workspaces
- **Rationale**: The project is a monorepo with `backend` and `frontend`. Using pnpm workspaces allows us to run commands across all packages from the root and share dependencies more efficiently.

## Configuration

### pnpm-workspace.yaml
```yaml
packages:
  - 'backend'
  - 'frontend'
```

## Command Mapping
- `npm install` -> `pnpm install`
- `npm run <script>` -> `pnpm <script>`
- `npm run test` -> `pnpm -r test` (runs test in all packages)
