# Specification: Backend Fortification & Model Completion

## 1. Unified Authentication
- **Requirement**: The `/api/upload` endpoint MUST require a valid Admin JWT.
- **Requirement**: The `API_KEY_CARB` will be deprecated for administrative actions.

## 2. Secure Static Serving
- **Requirement**: Files in `/public/uploads` MUST be accessible via `GET /uploads/<filename>`.
- **Requirement**: The server MUST NOT allow execution of scripts in the uploads directory.

## 3. Input Validation (Semantic)
- **Requirement**: News content MUST NOT exceed 10,000 characters.
- **Requirement**: Ouvidoria messages MUST NOT exceed 2,000 characters.
- **Requirement**: Titles for news, jobs, and notices MUST NOT exceed 200 characters.

## 4. Full API CRUD
- **Avisos**: `GET` (public), `POST/DELETE` (admin).
- **Vagas**: `GET` (public), `POST/DELETE` (admin).
- **Acervo**: `GET` (public), `POST/DELETE` (admin).

## 5. Audit Logging
- **Requirement**: Every successful `POST` or `DELETE` action performed by an admin MUST be logged with the action type and target resource ID.
