# Proposal: Backend 100% Coverage & Bug Fixes

## Goal
Achieve 100% test coverage for the backend application (`app.js`) and fix identified architectural inconsistencies.

## Problems Identified
1. **Inconsistent Deletion**: The `DELETE /api/noticias/:id` route is currently calling `Sugestao.destroy` instead of `Noticia.destroy`.
2. **Missing Coverage**: Current coverage is only 34%, leaving auth, upload, and admin routes vulnerable.
3. **Implicit Error Handling**: Some catch blocks are too generic, which might hide specific issues during testing.

## Proposed Changes
1. **Bug Fix**: Correct the news deletion route to use the `Noticia` model.
2. **Comprehensive Test Suite**:
   - `auth.test.js`: Login success, fail (401), rate limiting.
   - `admin.test.js`: Protected route access (401/403/Success).
   - `upload.test.js`: API Key validation, base64 processing, file extension security.
   - `ouvidoria.test.js`: Listing suggestions, error cases.
3. **Defensive Coding**: Add more specific logging and response handling in `app.js`.

## Tech Stack
- Vitest
- Supertest
- Sequelize Mocks
