# 🚀 Manual de Entrega - Site do CARB (Versão Final 2.0)

Este documento centraliza todas as informações vitais para a operação, segurança e manutenção do sistema.

**Data de Entrega:** 19/02/2026
**Status:** ✅ Pronto para Produção (Seguro)

---

## 🔑 Credenciais e Segredos

> **⚠️ IMPORTANTE:** Mantenha estas informações seguras. Nunca compartilhe este arquivo publicamente.

### 1. API Key de Segurança (Webhook)
Usada pelo Script de E-mail para postar notícias.
*   **Chave:** `CARB_SECURE_KEY_2026_X9Z`
*   **Onde fica:** `docker-compose.yml` (Variável `API_KEY`) e no Script do Google.

### 2. Banco de Dados (MariaDB)
*   **Usuário Root:** `root`
*   **Senha Root:** `CARB26`
*   **Banco:** `centro_academico`

### 3. Acesso Adminer (Banco de Dados)
*   **URL Local:** http://localhost:8080
*   **Servidor:** `db`
*   **Usuário:** `root`
*   **Senha:** `CARB26`

---

## 📧 Automação de E-mail (Google Apps Script)

O sistema possui um robô que lê e-mails do Gmail e publica no site.

*   **Conta do Robô:** `carbsiteoficial@gmail.com`
*   **Etiqueta Obrigatória:** `SaveToSite`
*   **Remetentes Autorizados:** Apenas `carbsiteoficial@gmail.com` (Auto-envio)
*   **Código do Script:** Veja o arquivo [`DOCS_AUTOMACAO_EMAIL.md`](./DOCS_AUTOMACAO_EMAIL.md) na raiz do projeto.
*   **Link de Deploy:** https://script.google.com (Deve ser configurado na conta acima)

---

## 🛡️ Auditoria de Segurança Realizada

| Vulnerabilidade Identificada       |   Status    | Solução Aplicada                                          |
| :--------------------------------- | :---------: | :-------------------------------------------------------- |
| **XSS (Cross-Site Scripting)**     | ✅ Corrigido | Implementado `DOMPurify` no Frontend para sanitizar HTML. |
| **Upload de Arquivos Maliciosos**  | ✅ Corrigido | Validação via *Magic Numbers* (file-type) no Backend.     |
| **Webhook Público**                | ✅ Corrigido | Exigência de API Key no Header para `/api/upload`.        |
| **DDoS / Brute Force**             | ✅ Mitigado  | `Rate Limit` (100 req/15min) e `Helmet` ativos.           |
| **Postagem por Terceiros (Email)** | ✅ Bloqueado | Whitelist de E-mail configurada no Script GAS.            |

---

## 🚀 Como Iniciar o Projeto

### Modo Recomendado (Docker)
Este comando sobe o Banco, Backend e Frontend (Nginx) de uma vez.
```bash
docker compose up -d --build
```
*   **Acesse o Site:** http://localhost (Porta 80)

### Comandos Úteis
*   **Ver Logs (Backend):** `docker compose logs -f back-end`
*   **Parar Tudo:** `docker compose down`

---

## 📁 Estrutura de Arquivos Importantes
*   `front-end/public/script.js`: Lógica do site (com correção de segurança).
*   `back-end/server.js`: API e regras de negócio.
*   `DOCS_AUTOMACAO_EMAIL.md`: Código do robô de e-mail.
*   `docker-compose.yml`: Configuração da infraestrutura.
