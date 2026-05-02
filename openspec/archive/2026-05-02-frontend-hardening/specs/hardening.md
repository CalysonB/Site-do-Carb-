# Specification: Frontend Hygiene & Portability

## 1. Environment Configuration
- **Requirement**: The Frontend MUST NOT contain hardcoded API URLs (like `http://localhost:3000`).
- **Requirement**: Use `VITE_API_URL` environment variable for all API requests.

## 2. Interface Constraints
- **Requirement**: The `Ouvidoria` textarea MUST have a `maxLength` of 2000 characters.
- **Requirement**: Form submission MUST be disabled or ignored if the length exceeds the limit.

## 3. Safe Navigation
- **Requirement**: ALL links with `target="_blank"` MUST include `rel="noopener noreferrer"`.

## 4. Backend CORS Portability
- **Requirement**: The Backend `CORS_ORIGIN` must be configurable via environment variables to support production domains.
