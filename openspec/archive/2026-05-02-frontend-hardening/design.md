# Design: Global Configuration & Input Security

## Frontend API Service
Instead of calling `axios` directly everywhere with hardcoded strings, we will create a central axios instance or use a helper to inject the `VITE_API_URL`.

```javascript
// config.js
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## Input Security in Ouvidoria
Apply the `maxLength` attribute to the HTML `textarea` and add a counter (optional) or just the constraint.

```jsx
<textarea 
  maxLength={2000}
  // ...
/>
```

## Link Standardization
Scan and fix `Acervo.jsx` to ensure consistent use of `noopener noreferrer`.

## Backend Env Integration
Update `app.js` to use `process.env.CORS_ORIGIN` for better flexibility.
