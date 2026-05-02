# Modelagem de Dados

O projeto utiliza o **Sequelize** como ORM para gerir o banco MariaDB. Abaixo estão as entidades principais.

## 📊 Entidades

### 1. Noticia
Armazena o feed principal de notícias.
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `titulo` | String | Título da notícia. |
| `conteudo` | Text | Conteúdo em texto. |
| `imagem_capa`| String | URL/Caminho da imagem. |
| `upvotes` | Integer | Contador de votos positivos. |

### 2. Sugestao (Ouvidoria)
Canal de comunicação dos alunos.
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `mensagem` | Text | Conteúdo da sugestão. |
| `lida` | Boolean | Status de leitura pelo Admin. |

### 3. Vaga
Oportunidades de emprego/estágio.
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `cargo` | String | Nome da vaga. |
| `escritorio`| String | Local/Empresa. |
| `detalhes` | JSON | Objeto com requisitos e infos extras. |

### 4. Acervo
Documentos oficiais (Atas, Estatutos).
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `titulo` | String | Nome do documento. |
| `arquivo_url`| String | Link para o PDF. |
| `ano` | Integer | Ano de publicação. |

## 🛠️ Configuração
As configurações de conexão residem em `backend/database.js` e as tabelas são sincronizadas em `backend/models.js`.
