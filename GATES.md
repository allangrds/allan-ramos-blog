# GATES.md — comando, escopo e linha de base dos portões de qualidade

**O que este arquivo é**: a fonte única do **comando exato**, do **escopo**, da **linha de base
medida** e do **ruído tolerado** de cada portão de qualidade. É normativo para essas quatro
coisas e para mais nada.

**O que este arquivo não é**: não é governança. As **regras** dos oito portões — o que cada um
exige, quando roda, e o que fazer quando um falha — vivem em
[`.specify/memory/constitution.md`](.specify/memory/constitution.md) §Quality Gates e são
alteráveis só por emenda. Este arquivo pode ser atualizado em commit comum, sem emenda e sem
bump de versão, porque o que ele guarda é **medição**, e medição muda quando uma dependência
muda.

**Por que existir**: o bloco de portões chegou a existir em cinco cópias — constituição, spec,
plan, quickstart e tasks — que divergiram em seis pontos medidos. Comando e base passam a ter um
lugar só; os outros documentos referenciam este e não copiam.

**Última medição**: 2026-09-27, na T004 (canal de console do portão 6).

---

## 1. Comando exato por portão

| # | Portão | Comando exato |
|---|---|---|
| 1 | lint | `npm run lint` (= `eslint`) |
| 2 | tipos | `npm run typecheck` (= `tsc --noEmit`) |
| 3 | teste de comportamento | `npm run test` (= `vitest run --project unit --project components`) |
| 4 | teste de story + a11y | `npx vitest run --project storybook` |
| 3+4 | os dois num comando | `npm run test:all` (= `vitest run --reporter=verbose`) — o `--reporter=verbose` é **exigência de US2/AS-2**, não preferência: o reporter padrão só dá totais agregados e nomeia o projeto apenas na linha de falha, e o critério diz que "código de saída zero não basta como evidência". Com ele a saída nomeia `unit`, `components` e `storybook (chromium)` linha por linha |
| 5 | build | `npm run build` (= `next build`) |
| 6 | execução limpa no Next.js | `npm run dev`, depois `npm run build && npm start`, sobre a lista de rotas da §6. O **canal do terminal** é lido na saída do servidor; o **canal do console do navegador** roda por `npm run gate6:console` (= `node scripts/gate6-console.mjs`), que abre as onze rotas em Chromium de perfil limpo via Playwright e sai com código ≠ 0 ao achar `console.error`, `console.warn`, `pageerror`, pedido falho ou overlay de erro do Next.js |
| 7 | teste como entregável | sem comando — é regra de conteúdo da entrega |
| 8 | nenhuma tarefa fecha com portão vermelho | sem comando — é regra de processo |

**Portões 7 e 8 não têm comando, por natureza.** Onde um critério de sucesso falar em "os oito
portões executáveis", leia: os portões 1 a 6 são executáveis por comando; o 7 é verificado pela
presença dos três artefatos exigidos; o 8 é verificado pelo estado dos portões 1 a 7 no momento
em que a tarefa é fechada.

**Bloco que fecha uma tarefa** (portões 1 a 5):

```bash
npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build
```

O encadeamento com `&&` **para na primeira falha** e esconde as seguintes. Isso é aceito: o
Portão 8 exige corrigir antes de seguir, e a ordem é do mais barato para o mais caro. Quem quiser
o quadro completo roda os cinco separadamente.

**Pré-requisito do Portão 4, uma vez por máquina** — sem ele o portão não fica vermelho, fica
**inexecutável**:

```bash
npx playwright install chromium
```

## 2. Escopo de cada comando

- **Portão 1** — `eslint` sem argumento usa `eslint.config.mjs` (flat config) e cobre **todo o
  repositório** exceto `node_modules/`, `.next/`, `out/`, `build/` e `next-env.d.ts`. Stories
  entram, porque `eslint-plugin-storybook` está no config.
- **Portão 2** — `tsc --noEmit` usa o `include` do `tsconfig.json`, que é `**/*.ts`, `**/*.tsx` e
  `**/*.mts`, com `exclude` só de `node_modules`. Portanto o portão **cobre também** stories,
  `src/components/**/*.test.tsx` e `vitest.config.ts`. Consequência para a T001: os matchers de
  `@testing-library/jest-dom` precisam ter tipo visível para o `tsc`, não só para o Vitest — o
  arquivo de setup que os importa está dentro do programa por causa de `**/*.ts`, e é isso que
  torna a ampliação de tipo válida nos arquivos de teste.
- **Portão 3** — projetos `unit` (lógica de `src/lib`, `environment: 'node'`, `tests/unit/**`) e
  `components` (`environment: 'jsdom'`, `src/components/**/*.test.tsx`).
- **Portão 4** — projeto `storybook`, em navegador real via Playwright, incluindo as checagens
  do `@storybook/addon-a11y` com `test: "error"`.

### Fronteira congelada entre o Portão 3 e o Portão 4

`npm run test` **MUST NOT** incluir o projeto `storybook`. Os dois portões são comandos
distintos de propósito: o 3 é rápido e roda em Node/jsdom, o 4 exige navegador e é a única via
das checagens de a11y. Redefinir `test` como `vitest run` fundiria os dois, tornaria o Portão 4
redundante e faria este arquivo mentir sem violar nenhuma outra regra. `test:all` existe
exatamente para quem quer os dois de uma vez, e não substitui a régua de nenhum dos dois.

## 3. Linha de base medida

A base é comparada **por identidade** — arquivo, linha e texto da regra — e nunca por contagem.
Contagem igual não é base igual: um aviso novo somado à remoção do antigo mantém o total em 1 e
passaria.

| Portão | Base | Estado |
|---|---|---|
| 1 lint | exatamente **1** aviso: `src/lib/mdx.tsx:98:5` — `Unused eslint-disable directive (no problems were reported from 'jsx-a11y/alt-text')`. Arquivo congelado por SC-011 desta feature, então o aviso **não pode** ser corrigido aqui. | medido 2026-09-26 |
| 2 tipos | exit 0, zero erro. **Script `typecheck` criado na T001** — o comando subjacente `npx tsc --noEmit` deixa de ser aceito para fechar tarefa (Constituição §Regras de aplicação) | medido 2026-09-27 |
| 3 teste | 4 arquivos / 13 testes no projeto `unit`; **0 no projeto `components`, que passa a existir na T001** e não derruba o comando quando vazio. O encanamento do `components` foi **verificado por execução** na T001, com teste de fumaça descartável: jsdom renderiza React, `@testing-library/react` monta e os matchers de `@testing-library/jest-dom` resolvem. Projeto criado e nunca executado é a mesma classe de erro das 11 stories que nunca tinham rodado | medido 2026-09-27 |
| 4 story | **executável a partir da T001**: 11 arquivos de story, 13 testes, **12 passam e 1 falha** — `PostContent.stories.tsx > Default`, Server Component `async` que não renderiza em story de navegador (§5, defeito aberto). O desbloqueio exigiu **três** coisas, não uma: o binário (`chromium` revisão **1234**; a 1217 instalada não servia — R13), o **upgrade do Storybook a 10.6.0** (o `@storybook/addon-vitest` 10.5.10 falha na interop CJS→ESM com Vitest 4 / Vite 8, em `aria-query` e depois em `lz-string`) e o **import de `src/app/globals.css` em `.storybook/preview.tsx`**, sem o qual as stories renderizam **sem design system** e as réguas de SC-007, SC-008 e SC-009 medem uma página sem estilo | medido 2026-09-27 |
| 5 build | **zero aviso de código**, medido 2026-09-27 (`plan.md` R12, `next build` verde, 33 páginas), comparável **por identidade** — arquivo, linha e texto, nunca por contagem (FR-046a). O único `⚠` é ambiental: `Next.js ignored package-lock.json … outside the current Git repository`, causado por um lockfile de 86 bytes no diretório **pai** do repositório. A T001 **registra** e decide entre §4 (ruído tolerado, com a causa escrita) ou apagar o arquivo órfão — que está fora do repositório, logo não fere SC-011 | medido; a T001 registra |
| 6 terminal | **medido na T004, 2026-09-27, nos dois modos.** Em `dev`: **um** aviso, o do lockfile órfão (§4). Em produção (`npm start`): **dois** — o do lockfile e `⚠ The static directory has been deprecated in favor of the public directory`. O segundo é **pré-existente e do repositório**, não da máquina: `static/` é diretório rastreado desde fev/2024, resquício do blog antigo (`static/admin/config.yml` é config de Netlify CMS). Por ser conteúdo do repo e não da máquina, entra como **linha de base** aqui, não como ruído tolerado em §4. As onze rotas respondem 200 (e 404 na inexistente) nos dois modos, com zero marcador de erro no HTML servido | medido 2026-09-27 |
| 6 console do navegador | **medido na T004, 2026-09-27, nos dois modos, em Chromium de perfil limpo dirigido por Playwright** — contexto novo por rota, `--disable-extensions`, nenhuma extensão carregada, que é o que §6 exige. **Dev e produção deram resultado idêntico**: nove das onze rotas **limpas**, zero `console.error`/`console.warn`, zero `pageerror`, e o badge de devtools do Next.js em `data-error="false" data-status="none"` nas onze. **Zero hydration mismatch em produção** — o risco nomeado desta camada. Duas rotas têm achado, os dois **por identidade**: (a) `/posts/<slug>` — `Access to XMLHttpRequest at 'https://links.services.disqus.com/api/ping' … blocked by CORS policy` mais o `net::ERR_FAILED` do mesmo pedido, disparado pelo `embed.js` de terceiro que o `DisqusComments` injeta; é **conteúdo do repo**, reproduz em qualquer máquina servindo `localhost` (origem não registrada no Disqus) e **nada** que esta feature toca pode influenciá-lo — T002 alterou só `globals.css` e `layout.tsx`; (b) `/rota-que-nao-existe` — `Failed to load resource: the server responded with a status of 404`, que é o **status esperado** da rota 11, definida em §6 como "rota inexistente". Pelo mesmo critério repo-vs-máquina que pôs `static directory deprecated` aqui e o lockfile órfão em §4, os dois entram como **linha de base**, não como ruído tolerado | medido 2026-09-27 |

**Não há mais base marcada `⚠`.** As seis linhas estão medidas; a T004 fechou a última (console do
navegador) em 2026-09-27. "Aviso novo" no portão 6 passa a ter referência, e a comparação é por
identidade — arquivo/rota, texto e regra —, nunca por contagem (FR-046a).

**Método do canal de console, normativo a partir daqui**: o portão foi executado por **Chromium de
perfil limpo via Playwright**, e não por inspeção a olho. Isto satisfaz §6 ("sem extensão ativa,
perfil limpo") de forma mais estrita que uma janela do navegador do autor, porque nenhuma extensão
é carregada e o resultado é coletado por evento (`console`, `pageerror`, `requestfailed`) em vez de
lido na tela. O portão segue sendo o único de verificação não-automatizada por comando de `npm`, e
quem o roda continua obrigado a registrar a evidência no corpo do commit.

## 4. Ruído tolerado — lista fechada

Só o que está aqui não conta como falha. A lista é **fechada**: ruído não listado reprova o
portão. Acrescentar item é decisão do autor, registrada neste arquivo com o motivo.

| Onde | Texto | Motivo |
|---|---|---|
| todo `vitest run` (portões 3, 4 e `test:all`) | `Your Vite config uses features that are unsupported by configLoader: 'native'` | decidido em `research.md` R5: não mexer |
| `next build` (portão 5) | `⚠ Warning: Next.js ignored package-lock.json in …/Repositorios/Pessoal because it is outside the current Git repository` | **Ambiental, não do repositório.** Causa medida: um `package-lock.json` de 86 bytes no diretório **pai** deste repo. Registrá-lo como linha de base descreveria a máquina do autor e falharia em sentido **permissivo** — um aviso de código novo somado ao desaparecimento deste manteria o total e passaria por "base mantida", que é o furo que FR-046a fechou ao trocar contagem por identidade. Decisão da T001: base do portão 5 = **zero**, e este aviso entra aqui. Apagar o arquivo órfão foi **recusado**: está fora do repositório, na máquina do autor |

## 5. Quando um portão falha

A regra está na constituição §Quality Gates, "Falha de portão", e é resumida aqui em uma linha
só para não virar sexta cópia: **corrige-se na própria tarefa, a correção MUST caber no escopo
declarado da feature, e nenhuma tarefa fecha com portão vermelho.** O texto normativo, incluindo
precedência sobre limite de escopo, portão instável e falha por causa externa, é o da
constituição.

## 6. Rotas do Portão 6

Lista normativa, **onze rotas**, abertas nesta ordem, olhando o **terminal** e o **console do
navegador** em cada uma — primeiro em `npm run dev`, depois em `npm run build && npm start`:

**Duas colunas, e a distinção é essencial**: `src/app/**` está congelado na feature
`002-redesign-components`, então nenhuma rota passa a compor um componente **novo** enquanto ela
durar. O que o Portão 6 verifica hoje é a coluna "exercita agora" — os componentes
**re-estilizados**, que as rotas já compõem. A coluna "exercitará" é o alvo da feature das rotas e
**não** é evidência do Portão 6 desta feature; lê-la como se fosse faria o portão afirmar cobertura
que ele não tem.

| # | Rota | Exercita agora (componentes já compostos) | Exercitará após a feature das rotas |
|---|---|---|---|
| 1 | `/` | `Header`, `Hero`, `PostsListing`, `PostCard`, `Footer` | `PostListRow`, `SideRail`, `MobileTabBar` |
| 2 | `/page/2` | `Pagination` em página não-primeira | `Breadcrumb` |
| 3 | `/posts/<slug>` | `Toc`, `CodeBlock`, `CopyButton`, `ShareButtons`, `CopyLinkButton`, `PostContent` — a rota mais densa em Client Components | `ReadingProgress`, `Callout`, `AuthorCard`, `PrevNext`, `LikeCommentBar`, `InlineCode` |
| 4 | `/categorias` | — (a rota existe e renderiza; nenhum componente novo entra nela agora) | `CategoryCard`, `CategoryBadge` |
| 5 | `/categories/<categoria>` | `PostCard`/`PostsListing` em listagem filtrada | `CategoryBadge` |
| 6 | `/tags` | `TagPill` | `EmptyState` |
| 7 | `/tags/<tag>` | `TagPill` ativa em listagem filtrada | — |
| 8 | `/series/<serie>` | listagem da série como está hoje | `SeriesShelf` |
| 9 | `/search` | rota que importa o `SearchBox` **intocado** (SC-013) | `CommandPalette` substitui o `SearchBox` |
| 10 | `/sobre` | a página como está hoje | `Shelf`, `Avatar` grande, `TilList`, `YearArchive` |
| 11 | rota inexistente (ex.: `/rota-que-nao-existe`) | `not-found` | `EmptyState` |

**O que isso significa para a feature de componentes**: o Portão 6 dela é um portão de
**não-regressão** — prova que trocar os tokens e re-estilizar os quinze componentes existentes não
quebrou nenhuma rota, em `dev` e em produção. Ele **não** prova nada sobre os vinte e um
componentes novos, cuja verificação de execução é o Portão 4 (story em navegador real) até que as
rotas os componham.

**Ambiente da inspeção de console**: navegador baseado em Chromium, **sem extensão ativa**
(perfil limpo ou janela sem extensões). Extensão injeta aviso próprio e contamina a leitura. O
overlay de desenvolvimento do Next.js conta como canal de erro junto com o console.

**Evidência**: o Portão 6 é o único verificado à mão. Quem o roda registra no corpo do commit
quais rotas passaram, em `dev` e em produção, e qualquer aviso encontrado. Portão manual sem
registro é afirmação de quem implementou, que a constituição não aceita como verificação.
