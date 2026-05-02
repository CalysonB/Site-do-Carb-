# Documentação da API (REST)

A API do CARB é servida na porta `3000` (padrão) sob o prefixo `/api`.

## 🔑 Autenticação
Alguns endpoints requerem um token JWT no Header `Authorization`.
- **Formato:** `Bearer <token>`

---

## 📂 Endpoints

### 1. Administração
| Método | Path | Descrição | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin/login` | Autentica o admin e retorna um JWT. | N/A |

### 2. Ouvidoria
| Método | Path | Descrição | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ouvidoria` | Aluno envia uma sugestão. | Pública |
| `GET` | `/api/ouvidoria` | Lista todas as sugestões enviadas. | **Admin** |

### 3. Notícias
| Método | Path | Descrição | Auth |
| :--- | :--- | :--- | :--- |
| `DELETE` | `/api/noticias/:id` | Remove uma notícia do feed. | **Admin** |

### 4. Upload de Arquivos
| Método | Path | Descrição | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload de imagens (Webhook Seguro). | **API Key** |

---

## ⚠️ Códigos de Erro
- `400 Bad Request`: Parâmetros ausentes ou inválidos.
- `401 Unauthorized`: Token inválido ou expirado.
- `403 Forbidden`: API Key incorreta ou falta de permissão.
- `500 Internal Server Error`: Erro inesperado no servidor.
