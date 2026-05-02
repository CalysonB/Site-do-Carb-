# Proposal: Ultimate Security Hardening

## Goal
Fix all identified critical vulnerabilities (XSS, Brute Force, Information Leakage, Missing Security Config) and complete the API functionality.

## Scope
- **Root**: Create `.gitignore` to prevent secret leaks.
- **Backend**:
  - Reorder middleware to protect login with Rate Limiting.
  - Implement News CRUD endpoints (GET/POST) with proper Admin verification.
  - Standardize error responses to prevent information leakage.
  - Improve upload security.
- **Frontend**:
  - Remove `dangerouslySetInnerHTML` and implement a safe rendering pattern.
  - Improve error handling in administrative components.

## Technical Approach
1. **Middleware Reordering**: Move `app.use(limiter)` before route definitions.
2. **Sanitization**: Use a whitelist-based approach for news content.
3. **Infrastructure**: Establish `.gitignore` standards for monorepos.
4. **API Completeness**: Add the missing news management logic.

## Risks
- Changes in rendering logic in `FeedNoticias` might affect current layouts.
- Rate limiting might affect legitimate users if configured too aggressively.
