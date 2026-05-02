# Guia de Contribuição

Ficamos felizes que você queira contribuir com o CARB! Para manter o projeto organizado e a qualidade do código alta, siga estas diretrizes.

## 🌿 Fluxo de Git

1.  **Crie uma branch:**
    - `feat/nome-da-funcionalidade` (Para novas features)
    - `fix/nome-do-bug` (Para correções)
    - `docs/ajuste-doc` (Para documentação)
2.  **Trabalhe em batches pequenos:** Commits frequentes e atômicos são melhores que um commit gigante.

## 📝 Padrão de Commits
Utilizamos **Conventional Commits**:
- `feat: adiciona componente de busca`
- `fix: corrige vazamento de memória no login`
- `chore: atualiza dependências do vitest`

## ✅ Testes e Qualidade
Antes de abrir um Pull Request:
1.  Garanta que os testes estão passando: `npm run test` (em ambas as pastas).
2.  Verifique a tipagem: `npm run typecheck`.
3.  Execute o linter: `npm run lint`.

## 🤝 Processo de Pull Request
1.  Abra o PR com uma descrição clara do que foi mudado.
2.  Aguarde a revisão de pelo menos um outro membro do time.
3.  Após a aprovação, o merge será feito na branch `main`.
