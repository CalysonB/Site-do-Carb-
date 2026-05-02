# Design: Unified API & Infrastructure Security

## Audit Logger Middleware
A simple higher-order function or a dedicated utility to wrap admin routes and log their effects.

```javascript
const logAcaoAdmin = (acao, recurso, id) => {
    console.log(`[AUDIT LOG] ${new Date().toISOString()} - Admin ${acao} no recurso ${recurso} (ID: ${id})`);
};
```

## Static Content Safety
Use the `express.static` middleware with the `dotfiles: 'ignore'` and `index: false` options.

## Content Length Enforcement
Instead of complex libraries, use simple length checks before Sequelize creation.

```javascript
if (conteudo.length > 10000) return res.status(400).json({ erro: "Conteúdo demasiado longo." });
```

## Route Expansion
Implement a standardized response pattern for the new models to maintain consistency with `Noticia` and `Sugestao`.
