# Design: Security Architecture Improvements

## Backend Middleware Pipeline
Old Pipeline:
1. Helmet/JSON/CORS
2. Routes (Admin, Ouvidoria, Upload)
3. Limiter (Applied too late!)

New Pipeline:
1. Helmet/JSON/CORS
2. **Rate Limiting (Global /api)**
3. **News Routes (CRUD)**
4. Admin/Ouvidoria Routes
5. Upload (API Key Protected)

## News Content Rendering
Instead of `dangerouslySetInnerHTML`, we will split the content string by the `[FOTO]` tag and render parts as React elements.

```javascript
// Logic
const partes = conteudo.split('[FOTO]');
return (
  <>
    {partes[0]}
    {imagem && <img src={imagem} />}
    {partes[1]}
  </>
);
```

## Global Error Handler
Implement a centralized wrapper or standard helper to sanitize error messages before sending them to the client.
