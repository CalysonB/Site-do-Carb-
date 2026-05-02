# Tasks: Backend Fortification & API Completion

- [ ] Update `backend/src/app.js`:
  - [ ] Implement secure static serving for `/uploads`
  - [ ] Refactor `/api/upload` to use JWT (`verificarAdmin`)
  - [ ] Add length validation to all POST routes
  - [ ] Add audit logging to administrative routes
  - [ ] Implement CRUD for `Aviso`
  - [ ] Implement CRUD for `Vaga`
  - [ ] Implement CRUD for `Acervo`
- [ ] Try to remediate `uuid` vulnerability: `pnpm update sequelize`
- [ ] Verify 100% coverage with the new routes
