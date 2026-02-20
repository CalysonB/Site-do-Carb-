# Changelog - Site do CARB

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [2026-02-19] - Refatoração do Backend e Infraestrutura

### 🏗️ Arquitetura e Backend
- **Centralização de Modelos:** 
  - Criação do arquivo `back-end/models.js` para definir todos os schemas do Sequelize (`Noticia`, `Aviso`, `Vaga`, `Acervo`) em um único local.
  - Remoção das definições duplicadas que existiam dentro de `server.js`.
  - Atualização do modelo `Noticia` para incluir os campos `upvotes` e `downvotes` nativamente.
  - Refatoração do `server.js` para importar os modelos de `models.js`, tornando o código mais limpo e manutenível.

### 🛡️ Segurança e Configuração
- **Variáveis de Ambiente:**
  - Implementação de suporte a arquivo `.env` via `dotenv`.
  - Atualização de `back-end/database.js` para ler credenciais (`DB_HOST`, `DB_USER`, `DB_PASS`, etc.) de variáveis de ambiente em vez de valores hardcoded (embora valores padrão tenham sido mantidos para facilidade de desenvolvimento local).

### 🐳 Docker e Infraestrutura
- **Correção do Docker Compose:**
  - Ajuste nos volumes do serviço `back-end` para persistir uploads corretamente em `uploads_data`.
  - Remoção de configurações obsoletas de volumes no serviço `front-end` que apontavam para pastas inexistentes (`./web`).
  - Padronização das credenciais do banco de dados entre o container `db` e a aplicação `back-end` (resolvendo conflito de `usuario_node` vs `root`).

### 📝 Documentação e Padronização
- **Criação do `AI_RULES.md`:** Documento de regras estritas para IAs e desenvolvedores, garantindo segurança, qualidade de código e documentação.
- **Script `setup.sh`:** Automação do ambiente de desenvolvimento que suporta tanto Docker quanto Node.js puro.
- **Atualização do `DOCS.md`:** Inclusão do "Guia de Start Rápido" e referência às regras de IA.
- **Modo Standalone (Node.js):** Ajuste no `server.js` para servir arquivos do frontend automaticamente quando rodar fora do Docker.

## [2026-02-19] - Segurança (Hardening) e Automação de E-mail

### 🛡️ Segurança (Backend & Frontend)
- **Proteção do Webhook:** Implementação de chave de API (`x-api-key`) na rota `/api/upload` para impedir postagens não autorizadas.
- **Frontend Anti-XSS:** Adição da biblioteca `DOMPurify` (via CDN) para sanitizar HTML de notícias e vagas antes da renderização.
- **Helmet & Rate Limit:** Configuração de headers de segurança e limitação de requisições no `server.js`.
- **Validação de Arquivos:** Uso de `file-type` para verificar magic numbers de uploads, bloqueando arquivos maliciosos disfarçados.

### ⚡ Performance (Frontend)
- **Batch Rendering:** Otimização do `script.js` para renderizar todas as notícias de uma vez, eliminando *Layout Thrashing*.
- **ES Modules:** Atualização do `index.html` para `type="module"`, permitindo imports modernos de JavaScript.

### 📧 Automação (Google Apps Script)
- **Robô de E-mail:** Script GAS criado para monitorar etiqueta `SaveToSite` no Gmail e publicar automaticamente no site.
- **Segurança de E-mail:** Implementação de Whitelist de remetentes (apenas `carbsiteoficial@gmail.com`) e autenticação via API Key.
- **Manual de Automação:** Criação do `DOCS_AUTOMACAO_EMAIL.md` com o código-fonte e instruções de uso.
