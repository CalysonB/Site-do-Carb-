# 🤖 AI_RULES.md - Constituição do Desenvolvimento & IA

> **PARA TODAS AS IAs E DESENVOLVEDORES:**
> Este documento define as REGRAS INEGOCIÁVEIS para trabalhar neste projeto. Ignorar estas regras é proibido.

## 1. 🛡️ Segurança Absoluta (Zero Trust)
*   **Nunca hardcode credenciais:** Senhas, tokens e chaves de API **DEVEM** estar em variáveis de ambiente (`.env`).
*   **Sanitização de Input:** Nunca confie nos dados do usuário. Valide tipos, tamanhos e conteúdo antes de processar.
*   **Privilégio Mínimo:** Processos e bancos de dados devem rodar com o mínimo de permissão necessária.
*   **Gambiarra Zero:** Soluções "temporárias" de segurança são proibidas. Se não for seguro, não implemente.

## 2. 📚 Documentação Viva (Always Up-to-Date)
*   **Regra de Ouro:** Se você alterou o código, **VOCÊ É OBRIGADO** a atualizar a documentação (`DOCS.md`, `README.md`) no mesmo commit.
*   **Explique o "Porquê":** Não documente apenas o que o código faz, mas por que aquela decisão foi tomada.
*   **Mantenha Simples:** Documentação deve ser legível por humanos, não apenas por máquinas. Use Markdown claro e estruturado.

## 3. 🚀 Qualidade de Código (Senior Level)
*   **Código Limpo:** Variáveis com nomes semânticos (`usuarioAtivo` em vez de `u`), funções pequenas e responsabilidade única.
*   **Tratamento de Erros:** Todo bloco crítico (I/O, Rede, Banco) deve ter `try/catch` com logs claros de erro.
*   **Logs Úteis:** Logs devem dizer **o que** aconteceu, **onde** e **o contexto**. Evite `console.log('erro')`.

## 4. 🔄 Infraestrutura & Setup
*   **Agnosticismo:** O sistema deve ser capaz de rodar tanto em Docker (Produção/Dev Avançado) quanto diretamente no Node.js (Dev Rápido/Legado) sem alterações manuais de código. Use scripts de automação (`setup.sh`).
*   **Dependências:** Nunca instale bibliotecas globais se puderem ser locais (`package.json`).

---
**Assinatura:**
*Equipe de Engenharia & IAs do Projeto Site do CARB*
