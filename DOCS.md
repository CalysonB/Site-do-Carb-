# Documentação do Projeto: Site do CARB

## 1. Visão Geral
O **Site do CARB** (Centro Acadêmico Ruy Barbosa) é uma aplicação web fullstack projetada para gerenciar notícias, avisos, vagas de emprego e acervo acadêmico. O sistema utiliza uma arquitetura baseada em microsserviços containerizados com Docker, garantindo fácil implantação e escalabilidade.

## 2. Arquitetura Técnica

### Backend (`/back-end`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Banco de Dados:** MariaDB (MySQL compatível)
- **Estrutura:**
  - `server.js`: Ponto de entrada da API, configuração do servidor e rotas.
  - `models.js`: Definição centralizada dos schemas do banco de dados (Noticia, Aviso, Vaga, Acervo).
  - `database.js`: Configuração da conexão com o banco usando variáveis de ambiente.

### Frontend (`/front-end`)
- **Servidor Web:** Nginx (Containerizado)
- **Tecnologia:** HTML5, CSS3, JavaScript (Vanilla ES6+)
- **Estilo:** Design responsivo, inspirado em jornais clássicos (estilo "New York Times").
- **Comunicação:** `fetch` API para consumir o Backend.

### Infraestrutura
- **Docker Compose:** Orquestra os serviços `back-end` (API), `front-end` (Nginx), `db` (MariaDB) e `adminer` (Gestão de DB).
- **Volumes:** Persistência de dados do banco (`mariadb_data`) e uploads (`uploads_data`).

## 3. Configuração e Instalação

### Pré-requisitos
- Docker e Docker Compose instalados.

### Variáveis de Ambiente
Crie um arquivo `.env` na pasta `back-end` (ou configure no seu ambiente de CI/CD) com as seguintes chaves (valores padrão já configurados para desenvolvimento):

```env
DB_HOST=db
DB_USER=root
DB_PASS=CARB26
DB_NAME=centro_academico
DB_DIALECT=mariadb
PORT=3000
```

> **Nota:** O `docker-compose.yml` já injeta essas variáveis automaticamente para o container `back-end`.

### Como Rodar (Start Rápido 🚀)

Para facilitar, use o script de configuração automática que detecta seu ambiente (Docker ou Node puro):

```bash
./setup.sh
```

**Opção Manual (Docker):**
1. **Subir os containers:**
   ```bash
   docker-compose up --build -d
   ```

2. **Acessar a aplicação:**
   - **Frontend (Site):** [http://localhost](http://localhost) (Porta 80)
   - **Backend (API):** Interno na rede Docker (Porta 3000)
   - **Adminer (Gestão DB):** [http://localhost:8080](http://localhost:8080)

## 4. Regras de Desenvolvimento (IMPORTANTE ⚠️)

Todos os desenvolvedores e IAs trabalhando neste projeto **DEVEM** ler e seguir as regras estritas definidas em:

📄 **[AI_RULES.md](./AI_RULES.md)**

Estas regras cobrem:
- Segurança (Zero Trust)
- Qualidade de Código
- Obrigação de Documentação

## 5. Referência da API

### Notícias
- `GET /api/noticias?page=1`: Listar notícias (paginado).
- `POST /api/noticias/:id/voto`: Votar em uma notícia (`{ "tipo": "up" | "down" }`).
- `POST /api/upload`: Webhook para criar notícia via e-mail (com upload de imagem).

### Outros Recursos
- `GET /api/avisos`: Listar avisos acadêmicos.
- `GET /api/vagas`: Listar vagas de estágio/emprego ativas.
- `GET /api/acervo`: Listar arquivos do acervo histórico.

## 5. Estrutura do Banco de Dados

### Tabelas Principais
- **Noticia:** `id`, `titulo`, `conteudo`, `imagem_capa`, `data_postagem`, `upvotes`, `downvotes`.
- **Aviso:** `id`, `titulo`, `mensagem`, `urgente`, `data_validade`.
- **Vaga:** `id`, `cargo`, `escritorio`, `detalhes` (JSON), `link_inscricao`, `ativo`.
- **Acervo:** `id`, `titulo`, `categoria`, `arquivo_url`, `ano`.

## 6. Estrutura de Pastas

```
├── back-end/           # API Node.js
│   ├── models.js       # Definição das tabelas
│   ├── server.js       # Lógica da API e Rotas
│   ├── database.js     # Conexão Sequelize
│   └── public/uploads/ # Armazenamento de arquivos (montado volume)
├── front-end/          # Frontend Estático e Nginx
│   └── public/         # HTML/CSS/JS
└── docker-compose.yml  # Orquestração dos containers
```
