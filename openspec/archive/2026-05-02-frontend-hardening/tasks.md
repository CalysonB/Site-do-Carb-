# Tasks: Frontend Hardening & Env Refactor

- [ ] Create/Update `.env` files (Root, Backend, Frontend)
- [ ] Refactor Frontend components to use `VITE_API_URL`:
  - [ ] `Admin.jsx`
  - [ ] `FeedNoticias.jsx`
  - [ ] `Ouvidoria.jsx`
  - [ ] `Acervo.jsx`
- [ ] Fix `Acervo.jsx` links (`rel="noopener noreferrer"`)
- [ ] Add `maxLength={2000}` to `Ouvidoria.jsx` textarea
- [ ] Refactor Backend `app.js` to use `CORS_ORIGIN` env var
- [ ] Verify all functionalities still work with env vars
