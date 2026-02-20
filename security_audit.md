# 🛡️ Relatório de Auditoria de Segurança: Site do CARB

Este documento detalha as medidas de segurança implementadas para garantir a integridade, disponibilidade e confidencialidade dos dados do site.

## 1. Proteção de Borda (Túnel Ngrok)
- **Cenário**: O site é exposto via Ngrok para permitir automação externa.
- **Proteção**: O túnel é apenas um meio de transporte. A segurança real acontece na aplicação.
- **Status**: ✅ SEGURO (Protegido por API Key).

## 2. Camada de Autenticação (Webhook)
- **Mecanismo**: `x-api-key` (Header Obrigatório).
- **Implementação**: Toda requisição de postagem (`/api/upload`) exige uma chave secreta de 24 caracteres.
- **Prevenção**: Impede que terceiros que descubram a URL do site postem notícias falsas.
- **Status**: 🔐 CRÍTICO/ATIVO.

## 3. Segurança do Servidor (Backend Hardening)
- **Proteção contra Injeção**: Uso de **Sequelize (ORM)** para todas as consultas ao Banco de Dados, eliminando o risco de *SQL Injection*.
- **Cabeçalhos HTTP**: Uso do **Helmet.js** para ocultar a tecnologia do servidor e prevenir ataques de *Clickjacking* e *MIME-sniffing*.
- **Rate Limiting**: Limite de 100 requisições por IP a cada 15 minutos nas rotas de API.
- **Validação de Arquivos**: O servidor usa `file-type` para verificar a "assinatura mágica" das imagens. Mudar a extensão do arquivo não engana o sistema.
- **Status**: ✅ IMPLEMENTADO.

## 4. Segurança do Usuário (Frontend/XSS)
- **Sanitização Ativa**: Implementação do **DOMPurify** no `script.js`.
- **Prevenção**: Mesmo que um invasor consiga inserir um código no banco de dados, o navegador do usuário "limpa" o HTML antes de renderizar.
- **Status**: 🧱 BLINDADO contra XSS.

## 5. Segurança da Infraestrutura (Docker)
- **Isolamento**: O Banco de Dados (MariaDB) **não está exposto** para a internet. Ele só aceita conexões vindas do container do Backend.
- **Credenciais**: Senhas e chaves são passadas como variáveis de ambiente, não estão "escritas" no código-fonte principal.
- **Status**: ✅ SEGURO.

## ⚠️ Recomendações Futuras (Para Produção em Nuvem)
1. **SSL Real**: Quando migrar para um domínio `.org` ou `.com`, substituir o Ngrok por um certificado SSL (HTTPS) definitivo.
2. **Secrets Manager**: Em infraestruturas como AWS ou Google Cloud, usar um gerenciador de segredos para as senhas do banco.
3. **CORS**: No `server.js`, substituir o `origin: '*'` pelo domínio oficial do site para impedir requisições de outros domínios maliciosos.

---
**Conclusão**: O sistema atual segue o princípio de **Zero Trust**. Assumimos que a internet é hostil e validamos cada vírgula que entra no servidor.
