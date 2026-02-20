# 🛡️ Relatório de Auditoria de Segurança - Site do CARB

**Data:** 19/02/2026
**Auditor:** Antigravity (Via `backend-security-coder` & `api-security-best-practices`)
**Status:** 🚨 CRÍTICO - Ação Imediata Necessária

## 📊 Resumo Executivo

A análise do código fonte (`server.js`, `package.json`) revelou que, embora o projeto utilize uma base moderna (Node.js, Express, Sequelize), ele falha em implementar camadas básicas de defesa em profundidade. A aplicação está vulnerável a ataques de negação de serviço (DDoS), Cross-Site Scripting (XSS) via uploads e abusos de API devido à falta de rate limiting e validação estrita.

**Nota de Segurança:** 3/10 (Inseguro para Produção)

---

## 🛑 Vulnerabilidades Identificadas

### 1. Ausência de Rate Limiting (Proteção Anti-DDoS)
*   **Severidade:** 🔴 Alta
*   **Onde:** Todas as rotas (`/api/*`).
*   **Problema:** Não há limite de requisições por IP. Um atacante pode derrubar o banco de dados ou o servidor node enviando milhares de requisições por segundo para `/api/noticias` ou `/api/upload`.
*   **Correção:** Implementar `express-rate-limit` e `rate-limit-redis` (se possível) para limitar requisições abusivas.

### 2. Cabeçalhos de Segurança Ausentes (Helmet)
*   **Severidade:** 🟠 Média
*   **Onde:** Global (`app.js`).
*   **Problema:** A aplicação expõe informações do servidor (`X-Powered-By: Express`) e não define políticas de segurança de conteúdo (CSP), HSTS ou proteção contra clickjacking.
*   **Correção:** Implementar o middleware `helmet`.

### 3. Configuração de CORS Permissiva
*   **Severidade:** 🟠 Média
*   **Onde:** `app.use(cors())` na linha 10 de `server.js`.
*   **Problema:** O CORS está aberto para `*` (qualquer origem). Isso permite que qualquer site malicioso faça requisições para sua API se o usuário estiver autenticado (embora a auth não esteja 100% implementada, é uma má prática).
*   **Correção:** Restringir `origin` apenas aos domínios confiáveis (ex: `localhost`, domínio de produção).

### 4. Vulnerabilidade de Upload de Arquivos (Stored XSS)
*   **Severidade:** 🔴 Alta
*   **Onde:** Rota `/api/upload`.
*   **Problema:**
    *   A sanitização do nome do arquivo (`imagem.nome.replace(...)`) permite pontos (`.`).
    *   Um atacante pode enviar um arquivo chamado `hack.html` com código JS malicioso (`<script>alert('XSS')</script>`).
    *   Ao acessar `site.com/uploads/hack.html`, o script será executado no navegador da vítima.
*   **Correção:**
    *   Validar o **MIME type** do buffer (usando `file-type`).
    *   Forçar a extensão do arquivo salvo para `.jpg` ou `.png` baseada no conteúdo real, ignorando a extensão enviada pelo usuário.
    *   Servir arquivos de upload com cabeçalho `Content-Disposition: attachment` ou `Content-Type: application/octet-stream` para arquivos não-imagem.

### 5. Falta de Validação de Input (Schema Validation)
*   **Severidade:** 🟡 Baixa/Média
*   **Onde:** `/api/upload` (campos `titulo`, `conteudo`).
*   **Problema:** Confia-se que o cliente enviará os tipos corretos. Embora o Sequelize mitigue SQL Injection, a falta de validação de tamanho e tipo antes de chegar ao banco é um desperdício de recursos.
*   **Correção:** Adicionar validação com `zod` ou `joi`.

---

## 🛠️ Plano de Ação (Hardening)

1.  **Instalar Dependências de Segurança:**
    ```bash
    npm install helmet express-rate-limit cors zod file-type
    ```
2.  **Configurar Middlewares de Proteção:**
    *   Adicionar `helmet()` no topo.
    *   Configurar `rateLimit` global e específico para rotas críticas (`/api/upload`).
    *   Configurar `cors({ origin: [...] })`.
3.  **Blindar o Upload:**
    *   Reescrever a lógica de upload para validar o buffer real do arquivo.
    *   Impedir upload de executáveis ou scripts.
4.  **Validar Inputs:**
    *   Criar schemas Zod para as rotas de POST/PUT.

## 📝 Conclusão

A aplicação requer uma refatoração imediata na camada de entrada (`server.js` e middlewares) para atingir um nível aceitável de segurança. A prioridade máxima é o sistema de **Uploads** e o **Rate Limiting**.
