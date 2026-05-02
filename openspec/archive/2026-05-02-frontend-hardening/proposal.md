# Proposal: Frontend Hardening & Environment Refactor

## Goal
Improve frontend security hygiene and enable environment-based configuration to remove hardcoded URLs and secrets.

## Scope
- **Environment**: Implement `.env` files for both Frontend (Vite) and Backend.
- **Security Hygiene**:
  - Add `maxLength` to all user inputs (Ouvidoria).
  - Standardize `rel="noopener noreferrer"` in all external links.
  - Refactor axios calls to use a base URL from environment variables.

## Technical Approach
1. **Env Files**: Create `.env` and `.env.example` files.
2. **Global Config**: Use `import.meta.env` in the frontend.
3. **Input Protection**: Apply constraints to the Ouvidoria textarea to prevent large payload attacks.
4. **Link Audit**: Fix remaining insecure links in `Acervo.jsx`.

## Risks
- Incorrectly configured environment variables might break connectivity between Frontend and Backend.
