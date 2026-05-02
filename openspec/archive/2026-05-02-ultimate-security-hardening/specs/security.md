# Specification: Security & Reliability Requirements

## 1. Perimeter Security (Backend)
- **Requirement**: ALL `/api` endpoints must be protected by the `limiter` middleware.
- **Requirement**: Login endpoint must trigger rate limiting after 100 requests.

## 2. Information Protection
- **Requirement**: API must NEVER return stack traces or raw database error messages in the `res.json` payload.
- **Requirement**: Error responses must be standardized as `{ erro: "Mensagem Amigável" }`.

## 3. Input Sanitization (Anti-XSS)
- **Requirement**: Frontend must NOT use `dangerouslySetInnerHTML` for user-provided news content.
- **Requirement**: News content containing the `[FOTO]` tag must be processed using a safe component-based approach.

## 4. API Integrity
- **Requirement**: `GET /api/noticias` must support pagination and return published news.
- **Requirement**: `POST /api/noticias` must require a valid Admin JWT and validate all fields.

## 5. Development Standards
- **Requirement**: `.env`, `node_modules`, and `dist/build` folders must be excluded from Git via `.gitignore`.
