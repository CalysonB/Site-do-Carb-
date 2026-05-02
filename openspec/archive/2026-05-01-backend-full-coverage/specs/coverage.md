# Specification: Backend Coverage Scenarios

## 1. Authentication (/api/admin/login)
- **Scenario: Valid Login**
  - Input: correct user/pass
  - Expected: 200 OK + JWT Token
- **Scenario: Invalid Login**
  - Input: wrong user/pass
  - Expected: 401 Unauthorized

## 2. Protection Middleware (verificarAdmin)
- **Scenario: Missing Token**
  - Expected: 403 Forbidden
- **Scenario: Invalid/Expired Token**
  - Expected: 401 Unauthorized
- **Scenario: Valid Token**
  - Expected: Allow next()

## 3. Ouvidoria (/api/ouvidoria)
- **Scenario: POST - Valid Message**
  - Expected: 200 OK + "sucesso"
- **Scenario: POST - Empty Message**
  - Expected: 400 Bad Request
- **Scenario: GET - Admin Listing**
  - Expected: 200 OK + List of suggestions

## 4. Noticias (/api/noticias/:id)
- **Scenario: DELETE - Admin Success**
  - Expected: 200 OK + removal from DB
- **Scenario: DELETE - Unauthorized**
  - Expected: 403 Forbidden

## 5. Upload (/api/upload)
- **Scenario: Invalid API Key**
  - Expected: 403 Forbidden
- **Scenario: Valid API Key + Invalid Image Extension**
  - Expected: 500 Internal Security Error (due to "Tipo Proibido" throw)
- **Scenario: Valid API Key + Valid Image (Base64)**
  - Expected: 200 OK + File written to uploads/
