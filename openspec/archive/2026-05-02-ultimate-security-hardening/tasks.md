# Tasks: Ultimate Security Hardening

- [ ] Create `.gitignore` in the root
- [ ] Refactor `backend/src/app.js`:
  - Move `limiter` to the top
  - Add `GET /api/noticias` (public, paginated)
  - Add `POST /api/noticias` (admin only)
  - Standardize error messages in all `catch` blocks
- [ ] Refactor `frontend/src/components/FeedNoticias.jsx`:
  - Replace `dangerouslySetInnerHTML` with safe rendering
- [ ] Verify security fixes with a manual audit or automated tests
