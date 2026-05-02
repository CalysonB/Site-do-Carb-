# CARB-SITE-TESTE 🚀

Bem-vindo ao repositório oficial do portal **CARB (Centro Acadêmico Rocha Britto)**. Este projeto é uma plataforma full-stack moderna projetada para centralizar notícias, ouvidoria, acervo e oportunidades para a comunidade acadêmica.

## 📌 Visão Geral

O projeto utiliza uma arquitetura desacoplada com um backend robusto em Node.js e um frontend dinâmico em React (Vite), seguindo os mais altos padrões de qualidade e testabilidade.

## 📂 Documentação

Toda a organização do projeto está detalhada na pasta `docs/`. Abaixo estão os principais portais:

### 🏛️ Institucional e Produto
- [Visão do Produto](docs/principal/VISION.md)
- [Roadmap de Entregas](docs/principal/ROADMAP.md)
- [Histórico de Mudanças](docs/principal/CHANGELOG.md)
- [Histórias de Usuário](docs/produto/USER_STORIES.md)

### ⚙️ Guia Técnico
- [Arquitetura do Sistema](docs/tecnica/ARCHITECTURE.md)
- [Modelagem de Dados](docs/tecnica/DATABASE.md)
- [Documentação da API](docs/tecnica/API.md)
- [Infraestrutura e Deployment](docs/tecnica/DEPLOYMENT.md)
- [Segurança e Compliance](docs/tecnica/SECURITY.md)

### 🤝 Colaboração
- [Guia de Contribuição](docs/organizacao/CONTRIBUTING.md)
- [Estrutura do Projeto](docs/organizacao/PROJECT_STRUCTURE.md)
- [Guia de Testes](docs/tecnica/TESTING.md)

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js (v18+)
- pnpm (v10+)
- MariaDB/MySQL

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/CalysonB/CARB-SITE-TESTE.git
    cd CARB-SITE-TESTE
    ```

2.  **Instalar dependências (Monorepo):**
    ```bash
    pnpm install
    ```

3.  **Configurar Backend:**
    ```bash
    cd backend
    cp .env.example .env # Configure suas credenciais
    pnpm start
    ```

4.  **Configurar Frontend:**
    ```bash
    cd ../frontend
    pnpm dev
    ```

## 🛠️ Tecnologias
- **Backend:** Node.js, Express, Sequelize, MariaDB.
- **Frontend:** React, Vite, TailwindCSS (ou Vanilla CSS), Axios.
- **QA:** Vitest, Playwright, TypeScript.
- **Gerenciador:** pnpm Workspaces.

---
Desenvolvido com ❤️ pelo time CARB.
