# Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para gerir segredos e configurações específicas de ambiente.

## Backend (`/backend/.env`)

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `PORT` | Porta do servidor. | `3000` |
| `JWT_SECRET`| Segredo para assinar tokens JWT. | `seu_segredo_super_secreto` |
| `DB_NAME` | Nome do banco no MariaDB. | `noticias` |
| `DB_USER` | Usuário do banco. | `root` |
| `DB_PASS` | Senha do banco. | `CARB26` |
| `API_KEY_CARB`| Chave para o webhook de upload. | `chave_de_seguranca_123` |
| `ADMIN_USER` | Nome de usuário do Admin. | `admin` |
| `ADMIN_PASS` | Senha do Admin. | `admin123` |

## Frontend (`/frontend/.env`)

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL`| URL base da API do backend. | `http://localhost:3000/api` |

---
> [!IMPORTANT]
> Nunca versione o arquivo `.env` real no GitHub. Utilize o `.env.example` como base.
