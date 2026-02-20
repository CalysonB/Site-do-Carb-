# Site do CARB (Centro Acadêmico Ruy Barbosa)

Bem-vindo ao repositório oficial do Site do CARB. Este projeto é a plataforma digital do Centro Acadêmico, fornecendo notícias, avisos, vagas e acesso ao acervo histórico.

## 🚀 Começando Rápido

Para configurar o ambiente de desenvolvimento (Docker ou Node.js puro), execute o script de automação:

```bash
./setup.sh
```

Este script irá:
1. Detectar se você tem Docker instalado.
2. Se sim, subir os containers (Banco, API, Frontend).
3. Se não, configurar o ambiente Node.js localmente e conectar ao banco (se disponível).

## 🛡️ Segurança e Diretrizes

A segurança é prioridade máxima neste projeto.
Antes de contribuir, **LEIA OBRIGATORIAMENTE**:

- [AI_RULES.md](./AI_RULES.md): A Constituição do projeto. Regras inegociáveis para IAs e Devs.
- [SECURITY_AUDIT.md](./SECURITY_AUDIT.md): Relatório de auditoria e status de segurança.
- [DOCS.md](./DOCS.md): Documentação técnica detalhada da API e Banco de Dados.

### Medidas de Hardening Implementadas
- **Rate Limiting:** Proteção contra DDoS e abuso de API.
- **Helmet:** Cabeçalhos de segurança HTTP.
- **Upload Seguro:** Validação rigorosa de tipos de arquivo (Magic Numbers) para prevenir XSS/Malware.
- **CORS Estrito:** Controle de origens permitidas.

## 🛠️ Tecnologias

- **Backend:** Node.js, Express, Sequelize.
- **Banco de Dados:** MariaDB.
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
- **Infra:** Docker, Docker Compose.

## 📞 Suporte

Dúvidas ou problemas de segurança? Abra uma issue ou contate a diretoria do CARB.
