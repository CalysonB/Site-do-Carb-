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

## [2026-02-20] - Estabilização de Infraestrutura e Filtro de Conteúdo

### 🏗️ Infraestrutura e Banco de Dados
- **Capacidade de Upload (Nginx):** Aumentado `client_max_body_size` para **50MB** no `nginx.conf`, permitindo o envio de e-mails com fotos em alta resolução.
- **Expansão de Conteúdo (DB):** Alterado tipo da coluna `conteudo` no banco de dados para **LONGTEXT** (via Sequelize `TEXT('long')`), suportando até 4GB de texto/imagens embutidas.
- **Resiliência de Conectividade:** Adicionado pooling e aumentado `connectTimeout` para **60s** no `database.js`, evitando desconexões durante processamentos pesados.

### 🛡️ Segurança e Moderacão
- **Filtro de Profanidades:** Implementação de utilitário `contentFilter.js` que censura automaticamente palavrões e linguagem imprópria em notícias publicadas via Webhook.
- **Pentest de Segurança:** Realização de testes de penetração bem-sucedidos contra XSS, Bypass de Chave, Envenenamento de Arquivo e Ataques de Negação de Serviço (DoS).
- **Relatório de Auditoria:** Criação do `security_audit.md` detalhando todas as defesas do sistema.

### 📧 Automação de E-mail (GAS)
- **Correção de Duplicação:** Script atualizado para remover automaticamente a imagem de capa do corpo do e-mail, evitando que a foto apareça duas vezes na notícia.
- **Limpeza de Código:** Remoção de emojis e caracteres especiais do script para evitar erros de sintaxe no editor do Google Apps Script.
- **Arquivamento Automático:** Adicionada função para arquivar o e-mail no Gmail após a publicação bem-sucedida, mantendo a caixa de entrada limpa.

### 🎨 Frontend e UI
- **Ajuste Mobile:** Correção de sobreposição do botão de menu com o título da sidebar em dispositivos móveis.
- **Favicon:** Adicionado favicon padrão para eliminar erro 404 no console do navegador.
## [2026-02-21] - Suíte de Testes e Cobertura 100%
*(Trabalho antecipado para garantir estabilidade)*

### 🧪 QA e Qualidade de Código
- **Implementação de Testes:** Criação de suíte completa usando **Jest** e **Supertest**.
- **Cobertura Lógica de 100%:** Validação de todos os modelos, utilitários (`contentFilter`) e rotas da API.
- **Ambiente de Teste Isolado:** Configuração do `database.js` e `server.js` para usar SQLite em memória durante os testes, prevenindo interferência em dados reais.
- **Mocking de Sistema:** Simulação de falhas críticas (disco cheio, erro de DB) para garantir resiliência 500 no Webhook.
- **Padronização de Módulos:** Downgrade do `file-type` para v16 para compatibilidade total com o ambiente de testes Node.js.
