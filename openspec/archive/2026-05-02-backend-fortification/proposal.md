# Proposal: Backend Fortification & API Completion

## Goal
Establish a unified security model, enable static file serving, and complete the missing API endpoints for all data models.

## Scope
- **Security**:
  - Unify administrative authentication (JWT) for the upload endpoint.
  - Implement length limits for all text inputs in the backend.
  - Implement a basic audit log for administrative actions.
- **Infrastructure**:
  - Securely serve static files from `/public/uploads`.
  - Remediate the `uuid` dependency vulnerability.
- **Functional**:
  - Implement CRUD endpoints for `Aviso`, `Vaga`, and `Acervo`.

## Technical Approach
1. **JWT Unification**: Replace `x-api-key` check in `/api/upload` with the `verificarAdmin` middleware.
2. **Static Middleware**: Use `express.static` with specific helmet configurations.
3. **Logging**: Create a simple utility to log admin actions to the console/database.
4. **CRUD Implementation**: Create a factory-like or standard pattern for the remaining models.
5. **Dependency Management**: Run `pnpm update sequelize` to attempt remediation.

## Risks
- Updating `sequelize` might introduce breaking changes in model definitions.
- Changing the upload authentication will require updates in any external tools currently using the API Key.
