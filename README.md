# Rei da Catira

SPA de classificados de carros antigos desenvolvida em React e Vite, sem backend. Os anúncios de exemplo são definidos no frontend e os anúncios criados pelo usuário ficam no `localStorage` do navegador.

## Executar localmente

Requisitos: Node.js 22 e npm.

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 5173
```

Aplicação disponível em `http://127.0.0.1:5173/`.

## Comandos

| Comando | Função |
|---|---|
| `npm run lint` | Executa análise estática ESLint e impede warnings |
| `npm test` | Executa os testes Vitest |
| `npm run test:coverage` | Executa testes e gera relatório de cobertura |
| `npm run build` | Gera o artefato de produção em `dist/` |
| `npm run preview` | Serve localmente o artefato gerado |

## Pipeline

O fluxo em `.github/workflows/ci.yml` é executado em commits na `main`, pull requests para a `main` e manualmente.

```text
Commit ou PR
  -> checkout
  -> setup Node.js 22
  -> npm ci
  -> ESLint
  -> Vitest + cobertura
  -> npm audit
  -> Gitleaks
  -> build Vite
  -> artefato dist/
  -> deploy no GitHub Pages
```

Pull requests e commits na `main` executam todas as validações. O deploy somente ocorre em push direto ou merge para `main`. Qualquer falha em lint, testes, cobertura, auditoria relevante ou secret scan impede o job de build e o deploy.

## Qualidade e testes

- **Vitest + Testing Library:** valida listagens iniciais, busca, estados vazios e abertura de detalhes.
- **Cobertura:** os testes geram texto, LCOV e HTML em `coverage/`. Falhas são aplicadas com thresholds mínimos de statements 60%, branches 40%, functions 60% e lines 60%.
- **ESLint:** valida JavaScript/JSX e regras de Hooks do React.

## Segurança

- **CodeQL:** workflow semanal e em pushes/PRs para identificar vulnerabilidades SAST em JavaScript/TypeScript.
- **npm audit:** verifica vulnerabilidades conhecidas das dependências com severidade `high` ou superior.
- **Gitleaks:** verifica o repositório e seu histórico em busca de credenciais e padrões de segredo.
- **Secret scanning do GitHub:** deve ser habilitado nas configurações do repositório (`Settings > Security > Secret scanning`) como controle adicional da plataforma.
- **Cadeia de suprimentos:** `npm ci` usa o `package-lock.json`; os workflows usam Actions fixadas em tags públicas e o build ocorre em ambiente efêmero.

Não existem credenciais no código. O projeto não usa secrets ou variáveis para funcionar. Os únicos arquivos e diretórios locais gerados são ignorados pelo Git: `node_modules/`, `dist/`, `coverage/` e arquivos `.env`.

## Artefato e publicação

O artefato é a pasta `dist/`, produzida pelo Vite após todas as validações. Ela contém `index.html`, JavaScript, CSS e referências a recursos estáticos. O workflow envia `dist/` com `actions/upload-pages-artifact@v3` e publica com `actions/deploy-pages@v4`.

O valor de `VITE_BASE=/spa-ci-project/` corresponde ao caminho do projeto publicado no GitHub Pages. Após o primeiro deploy, habilite Pages em `Settings > Pages > Source: GitHub Actions`.
