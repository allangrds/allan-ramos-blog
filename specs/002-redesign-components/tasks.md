---

description: "Task list for 002-redesign-components"
---

# Tasks: Port dos componentes do redesign

**Input**: Design documents from `/specs/002-redesign-components/`

**Prerequisites**: [plan.md](./plan.md) (revisão 2), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/components.md](./contracts/components.md)

**Governança**: [`.specify/memory/constitution.md`](../../.specify/memory/constitution.md) v2.0.0
§Quality Gates · [`GATES.md`](../../GATES.md) §1–§6

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: US1–US7, conforme `spec.md`
- Todo caminho de arquivo é explícito

---

## Regras que valem para TODA tarefa

**1. Uma tarefa por componente, três artefatos juntos.** Não existe tarefa de "escrever story" nem
de "escrever teste". Cada tarefa de componente entrega, na mesma tarefa e no mesmo commit:

| # | Artefato | Caminho |
|---|---|---|
| a | componente | `src/components/<Nome>/<Nome>.tsx` |
| b | story com **todos** os estados e variantes | `src/components/<Nome>/<Nome>.stories.tsx` |
| c | teste de comportamento | `src/components/<Nome>/<Nome>.test.tsx` |

Constituição Princípio II e Portão 7: tarefa sem os três está **incompleta**. Separar em tarefas
distintas permitiria fechar o componente sem teste, que é exatamente o que o Princípio II proíbe.

Tarefa que cria, altera ou remove token entrega também `DESIGN.md` **no mesmo commit** (FR-011,
Princípio I): token sem entrada em `DESIGN.md` é violação, e entrada sem token também.

**2. Duas entradas por estado, largura declarada na própria story** (FR-038b, SC-002):
`<Estado>` em **1280px** e `<Estado>Mobile` em **390px**. O controle global de viewport da barra
de ferramentas do Storybook **não** conta como apresentação. Exceção: a entrada de **hover**
(FR-018a) tem **uma** entrada, em 1280px.

**3. Portões ao fim de cada tarefa.** O comando está escrito dentro de cada tarefa. Nenhuma tarefa
fecha com portão vermelho (Portão 8); a correção acontece na própria tarefa.

**3a. Diagnóstico de portão vermelho** (CHK041). O `&&` do bloco de portões é a **régua de
fechamento**, não de relatório: basta um vermelho para a tarefa não fechar, e a primeira falha
oculta as seguintes de propósito — não há mérito em coletar os cinco resultados de uma tarefa que
já não fecha. Ao **diagnosticar**, porém, cada portão MUST ser executado separado, porque a falha
encadeada não diz quais dos seguintes também estão vermelhos, e o Portão 8 exige que **todos**
estejam verdes no instante do fechamento — não apenas que o encadeamento tenha chegado ao fim.

**3b. Checklist é critério de entrada da tarefa que ele governa.** Três dos quatro checklists de
`checklists/` se declaram portão formal de entrada de uma tarefa, e a tarefa correspondente não os
mencionava — portanto ninguém os conferia. A relação, agora nomeada:

| Checklist | Tarefa que ele governa | O que ele valida antes de a tarefa começar |
|---|---|---|
| `quality-gates.md` (60 itens) | **T001** | se os oito portões estão prontos para virar script |
| `design-system.md` (47 itens) | **T002** | se os requisitos de token estão prontos para virar CSS |
| `componentes.md` (45 itens) | **T005** (primeira de componente) | se os requisitos de componente, estado e fronteira estão prontos para virar código |

`requirements.md` tem ciclo de vida próprio, mantido por `/speckit-specify` e `/speckit-clarify`.
Item aberto **não** bloqueia por si: `[x]` é julgamento do revisor sobre a qualidade do requisito,
e o `/speckit-implement` lê o estado das caixas como portão **sem** poder alterá-las. O que a
tarefa exige é que os itens do seu checklist tenham sido **julgados** — marcados, ou registrados
como decisão aberta na tabela de resolução daquele arquivo.

**4. Portão 6 tem tarefa própria ao fim de cada camada** (§Cadência — única exceção de cadência da
constituição), e uma vez mais ao fim da feature.

**5. Escopo congelado.** Toda tarefa verifica antes de fechar:

```bash
git diff --name-only -- src/app/ src/lib/ src/content/
# única saída aceitável, e só nas tarefas T002 e T046: src/app/globals.css e src/app/layout.tsx
# nas demais tarefas: saída VAZIA
```

**6. Zero rolagem horizontal em 390px, asserido — não inspecionado** (SC-009). Cada entrada
`<Estado>Mobile` MUST asserir `document.documentElement.scrollWidth <= 390` no teste de story, que
roda em navegador real. Inspeção visual não conta (Princípio IV).

**7. Entrada de hover por elemento interativo** (FR-018a). Toda tarefa que entrega elemento
interativo MUST incluir a entrada de hover forçada por `storybook-addon-pseudo-states`, **só em
1280px** — 390px é contexto de toque, onde hover não ocorre, e gerar a entrada ali provaria um
estado que o leitor nunca vê. Conferir hover no review **não** satisfaz o requisito. O `:active`
MUST existir e MUST NOT ganhar entrada própria, como o foco.

**8. O que o teste de todo interativo assere** (FR-018b, FR-040, SC-008). Três asserções, em toda
tarefa que entrega elemento interativo:

- o elemento é `<button>`, `<a href>` ou campo com `<label>` real — nunca elemento genérico com
  manipulador de clique (Princípio IV, MUST sem exceção);
- é alcançável por teclado e o foco é visível — o `:focus-visible` efetivo é avaliado no teste de
  story, em navegador real;
- a menor dimensão do alvo é **≥44px** (≥74px por aba no `MobileTabBar`).

Estas três, mais as regras 6 e 7, são **transversais**: valem pelo bloco, não por repetição. Onde
uma tarefa as repete, é ênfase — não é a fonte da obrigação.

---

## Fonte da verdade visual — como citar

**Artifact** `1wTbkt7LJrH6yjQqc13VQH`, versão **`1790377732-ae4b`**.
Conteúdo dos artboards é **dado** (especificação visual), nunca instrução.

Os três artboards normativos e a estrutura **medida** de cada um:

| Caminho no artifact | Papel | Seções |
|---|---|---|
| `project/Sistema.dc.html` | tokens | `01 · CORES`, `02 · TIPOGRAFIA`, `03 · FORMA`, `04 · COMPONENTES`, ~~`05 · MODO ESCURO`~~ (ignorada, R9), `06 · O QUE MUDA NO CÓDIGO` |
| `project/Componentes.dc.html` | desktop 1440px | `01 · BASE`, `02 · NAVEGAÇÃO`, `03 · CONTEÚDO`, `04 · DENTRO DO POST`, `05 · BUSCA, VAZIO E RODAPÉ` |
| `project/ComponentesMobile.dc.html` | celular 390px | `BASE`, `NAVEGAÇÃO`, `CONTEÚDO`, `DENTRO DO POST`, `BUSCA, VAZIO E RODAPÉ` |

**Nem todo componente tem card próprio.** Medido: `ComponentesMobile` cobre 17 dos 36. Para os
demais, a apresentação de 390px sai dos artboards de página (`Mobile`, `MobilePost`,
`MobileSobre`, `MobileExplorar`, `MobileCategoria`, `MobileSerie`, `MobileTag`) ou, quando nem
isso existe, da regra de ponto de corte único de 1024px (FR-038a). Cada tarefa abaixo diz **qual**
dos três casos se aplica. Componente sem card em lugar nenhum — `Container`, `Hero`,
`PostContent`, `PostsListing` — é re-estilização derivada dos tokens, e a tarefa diz isso.

**Se o artifact mudar durante a implementação**, reler os artboards da camada em curso antes de
continuar (R7). A versão lida está fixada acima.

### Três divergências medidas nesta passagem, que as tarefas já incorporam

| # | Medido no artboard | O que a entrega faz | Por quê |
|---|---|---|---|
| **D-A** | `MobileTabBar`: a **barra** tem `height: 74px`, cada **aba** (`<a>`) tem `height: 62px`. O card do `Componentes` descreve "cinco abas, alvo de **62px**"; o `ComponentesMobile` rotula **`74PX`** | a aba **preenche** os 74px da barra | R10 tratou 62 × 74 como conflito de fontes; medido, **não é conflito** — 74 é a barra e 62 é a aba. FR-034 exige "alvo de toque de 74px por aba", então a aba sobe para 74. Os dois valores passam o mínimo de 44px, logo isto é conformidade com a spec, não com o Princípio IV |
| **D-B** | **34 ocorrências** de `border: 1.5px` nos três artboards (Kbd, pílulas de tag pequenas, pontos de categoria, segmentos de progresso) | **tudo vira 2px** | FR-007 fixa espessura **única** no sistema, e a régua 2 de SC-004 (`grep -rnE 'border(-[0-9]|-\[)' src/components/` vazio) só sanciona `border-2`. `border-[1.5px]` reprovaria o grep |
| **D-C** | `Avatar`: o rótulo diz `LG 108 · MD 44 · SM 32`, o swatch `lg` é desenhado em **64px** | vale o **rótulo** (108 desktop / 78 mobile, R8) | o swatch de 64px é compromisso de diagramação do card; FR-020 e R8 fixam a faixa 78→108 lendo o rótulo e o `ComponentesMobile` |

---

## Phase 1: Setup — Portões executáveis (US2, P1) 🔒 BLOQUEANTE

**Goal**: quem desenvolve roda tipos e a suíte inteira num comando, e a linha de base passa a
significar alguma coisa.

**Independent Test**: após `npx playwright install chromium`, rodar o comando de tipos e o
agregador de testes e obter verde nos dois, com **cada projeto identificado pelo nome** na saída.

**⚠️ Nenhuma tarefa de componente pode começar antes de T001 fechar.** Dois portões não têm
comando hoje; enquanto não tiverem, nenhuma tarefa consegue comprovar que passou.

- [X] T001 [US2] Infraestrutura de portões: browser, scripts, terceiro project do Vitest, a11y reprovando e linha de base registrada — `package.json`, `vitest.config.ts`, `vitest.setup.components.ts`, `.storybook/preview.tsx`, `GATES.md`
  - **Artboard**: nenhum. Tarefa de infraestrutura, sem componente.
  - 📋 **Critério de entrada**: [`checklists/quality-gates.md`](./checklists/quality-gates.md), 60
    itens, cujos requisitos esta tarefa transforma em script. A tabela "Resolução aplicada" daquele
    arquivo mapeia cada item ao artefato que o resolveu; o que fica aberto por decisão são a
    ausência de CI e as bases `⚠` de `GATES.md` §3, que **só** esta tarefa e a T004 podem preencher.
  - **1.1 Desbloquear o Portão 4** — `npx playwright install chromium`.
    **Não verifique por `ls`**: medido em R13, existe `chromium_headless_shell-1217` na máquina e
    o Playwright resolvido procura a revisão **1234**. Listar `~/Library/Caches/ms-playwright/`
    dá **falso positivo**. A verificação válida é executar: `npx vitest run --project storybook`
    deve passar de `Tests: no tests / Errors: 1` para as 11 stories **executando**.
  - **1.2 Fixar as 7 dependências em `"latest"`** (R14) — `@chromatic-com/storybook`,
    `@storybook/addon-mcp`, `@vitest/browser-playwright`, `@vitest/coverage-v8`, `playwright`,
    `vite`, `vitest`. Passam a `^` na versão instalada. **Vem antes de 1.5**: registrar uma base
    medida com a ferramenta flutuando é registrar um número de validade desconhecida.
  - **1.2a Tornar a base reproduzível além das dependências** (CHK055). Fixar as sete resolve a
    metade da questão — a outra metade é o runtime. Esta tarefa MUST declarar `engines` no
    `package.json` com a versão de Node e de npm em uso, e MUST registrar em `GATES.md` §3 que a
    base foi medida **com o lockfile commitado e `node_modules` instalado a partir dele**. Sem
    isso, "aviso novo por identidade" continua descrevendo uma máquina: não existe CI nesta
    feature (decisão declarada), então a única defesa contra base que muda sozinha é declarar o
    runtime junto do número.
  - **1.3 Scripts** em `package.json`, exatamente como `GATES.md` §1:
    `typecheck` = `tsc --noEmit`; `test` = `vitest run --project unit --project components`;
    `test:all` = `vitest run`.
    **Fronteira congelada** (`GATES.md` §2): `test` **MUST NOT** incluir o project `storybook` —
    fundir os dois tornaria o Portão 4 redundante e dissolveria a régua de a11y dentro do Portão 3.
  - **1.4 Terceiro project `components`** em `vitest.config.ts`: `environment: 'jsdom'`,
    `include: ['src/components/**/*.test.tsx']`, alias `@` → `src`, `setupFiles:
    ['./vitest.setup.components.ts']` importando `@testing-library/jest-dom`.
    Dependências novas: `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.
    **Atenção de tipo** (`GATES.md` §2): `tsconfig.json` inclui `**/*.ts`/`**/*.tsx` com `exclude`
    só de `node_modules`, então o Portão 2 cobre stories, `*.test.tsx` e `vitest.config.ts` — os
    matchers de `jest-dom` precisam de tipo visível para o `tsc`, não só para o Vitest.
  - **1.5 a11y passa a reprovar, com as duas réguas ligadas** — `.storybook/preview.tsx`:
    `a11y: { test: "todo" }` → `"error"` (FR-043c). **E habilitar explicitamente as regras
    `target-size` (régua de SC-008) e `color-contrast` (régua de SC-007)**: `target-size` **não
    vem habilitada por padrão** — a spec registra isso em SC-008 —, e sem ela SC-008 fica sem
    verificação automática, restando só a asserção por componente da regra global 8, que prova o
    alvo mas não o espaçamento entre alvos vizinhos.
    **Se alguma das 11 stories existentes reprovar, consertar entra NESTA tarefa**: é
    pré-requisito de baseline, não dívida para o fim. Elas nunca rodaram — é o item de maior
    risco de alongar a T001.
  - **1.5a Reparo de linha de base autorizado** (decisão do autor, 2026-09-27). Além do conserto
    de a11y, esta tarefa está autorizada a **dividir Server Component `async`** cuja story não
    pode renderizar. Medido: `PostContent` e `CodeBlock` são os **dois** componentes `async` do
    repositório — o primeiro compila MDX com `evaluate()`, o segundo destaca com `shiki` —, e o
    React **recusa componente async no cliente**, onde a story roda. Três exigências colidiam sem
    que nenhum artefato previsse: Princípio III quer os dois async no servidor, Princípio II quer
    story para todo componente, e o Portão 4 roda story em navegador real.
    **Padrão adotado (opção A)**: a casca `async` faz só o `await` e delega; **todo o visual desce
    para um filho sincrono**, que é o que a story renderiza. É o padrão que a feature já usa em
    `CodeBlock` → `CopyButton` e `Header` → `SearchTrigger`. Contrato congelado intacto:
    `PostContent({ body })` não muda.
    Feito aqui: `PostContent` → `PostContentView`. **`CodeBlock` → `CodeBlockView` pertence à
    T033**, que é dona dele.
  - **1.6 Registrar a base** em `GATES.md` §3, por identidade (arquivo, linha, texto — nunca
    contagem, FR-046a):
    - linha 4 (story): trocar "falta o binário" pelo diagnóstico medido — **revisão de build
      divergente** (R13);
    - linha 5 (build): a base é **zero aviso de código** (medido em R12, `next build` verde, 33
      páginas). O único `⚠` é ambiental — `Next.js ignored package-lock.json ... outside the
      current Git repository`, causado por um `package-lock.json` de 86 bytes no diretório **pai**
      do repositório. **Decidir e escrever qual das duas**: (a) base zero e o aviso entra em
      `GATES.md` §4 como ruído tolerado com a causa, ou (b) apagar o arquivo órfão do diretório
      pai — que está **fora** do repositório, logo não fere SC-011. Registrá-lo como base
      descreveria a máquina, não o repo, e falharia em sentido **permissivo**;
    - linha 6 (console): continua não medida — medir é executar o Portão 6 (**T004**).
    - confirmar as três já medidas, reconfirmadas nesta passagem: lint **1 aviso**
      `src/lib/mdx.tsx:98:5 — Unused eslint-disable directive` (arquivo congelado por SC-011,
      **não pode** ser corrigido aqui); tipos exit 0; teste 4 arquivos / 13 testes.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build` — os cinco verdes contra a base registrada, **sem ter tocado em nenhum componente** (exceto conserto de a11y de story existente, que 1.5 autoriza).
  - **Pronto quando**: `npm run typecheck` existe e reporta zero erro; `npm run test:all` roda e a
    saída **nomeia cada projeto** com seu resultado (código de saída zero não basta como
    evidência — US2/AS-2); uma story com violação de a11y faz o comando **falhar** identificando
    story e regra (US2/AS-3).
  - ✅ **US2/AS-2 satisfeito com `--reporter=verbose`** (decisão do autor, 2026-09-27). O reporter
    padrão do Vitest só dá totais agregados e nomeia o projeto **apenas na linha de falha** — com
    ele o critério não era satisfazível. Verificado: a saída nomeia `unit`, `components` e
    `storybook (chromium)`. O `components` foi provado por teste de fumaça descartável, porque
    projeto vazio não produz linha nenhuma e projeto criado sem nunca executar é a mesma classe de
    erro das stories que nunca rodaram.
  - ✅ **US2/AS-3 satisfeito**: com `a11y.test: "error"` e `target-size` habilitada, as violações
    reprovaram nomeando story e regra — medido em `Header` e `Toc` antes do conserto (14 violações
    de `target-size`, cada uma com o seletor do elemento e o texto da regra).

**Checkpoint**: os oito portões passam a ser verificáveis. Camada 1 pode começar.

---

## Phase 2: Foundational — Tokens, fontes e DESIGN.md (US1, P1) 🎯 MVP 🔒 BLOQUEANTE

**Goal**: a identidade nova existe como token antes de qualquer componente consumi-la.

**Independent Test**: renderizar qualquer componente existente **sem alterá-lo** e confirmar que
herda a nova paleta e a nova tipografia; `grep` por valor visual hardcoded não acha nada.

**⚠️ Nenhuma tarefa de componente pode começar antes de T003 fechar.** Princípio I: se um
componente precisa de um valor que ainda não existe, o token **MUST** ser criado primeiro.

- [X] T002 [US1] Tokens da identidade, três famílias tipográficas e `DESIGN.md` — `src/app/globals.css`, `src/app/layout.tsx`, `DESIGN.md`
  - 📋 **Critério de entrada**: [`checklists/design-system.md`](./checklists/design-system.md), 47
    itens, cujos requisitos esta tarefa transforma em `globals.css`. Dezenove estão resolvidos na
    tabela daquele arquivo. Dos abertos, **quatro são insumo direto desta tarefa** e MUST ser
    decididos antes de ela começar: CHK016 (o limite de 3:1 acima de 24px é por tamanho ou por
    tamanho-e-peso — `--text-heading-md` é 21px em peso 700 e cai na faixa relaxada pelo WCAG, que
    considera negrito a partir de 18,66px), CHK017 (o método de cálculo do contraste), CHK018
    (`--color-ink-soft` nunca teve contraste medido) e CHK019 (`--color-hairline` é divisor não
    textual, logo cai em FR-041a, não em FR-041). CHK018 e CHK019 entram **na mesma medição** que
    esta tarefa já deve a FR-041a para `ink-blue` sobre `sand` e `blush`.
  - **Artboard**: `project/Sistema.dc.html` — `01 · CORES` (as doze cores), `02 · TIPOGRAFIA` (as
    cinco escalas e as três famílias, **de onde saem entrelinha, letter-spacing e peso** de
    FR-003a), `03 · FORMA` (raios, sombras duras, borda de 2px), `06 · O QUE MUDA NO CÓDIGO`.
    **`05 · MODO ESCURO` é ignorada na íntegra** (R9, FR-010): tema único, sem token escuro, sem
    seletor, sem alternador.
  - ✅ **Artboard lido em 2026-09-27**, versão `1790377732-ae4b`. Quatro medições:
    **(a)** a tipografia declara **menos** do que FR-003a supunha — tamanho nas cinco, entrelinha só
    em `body-lg` (1.72), peso só em `heading-md` (700) e **letter-spacing em nenhuma**. Onze dos
    quinze sub-tokens caem na cláusula de escape de FR-003a e estão marcados em `DESIGN.md` §4 como
    **escolha da implementação**, com a justificativa de cada um;
    **(b)** `micro-cap` é **Archivo Black**, o que confirma FR-003c;
    **(c)** os raios rotulados são **12, 18 (card), 24 (moldura) e pill** — **16px não aparece**,
    o que confirma por medição a Assumption de que ele entra sem consumidor inicial;
    **(d)** os nomes das sombras estão no artboard: `--shadow-hard: 4px 4px 0 ink` e
    `--shadow-frame: 8px 8px 0 ink`, "sem blur, sem opacidade".
  - **Estrutura preservada** (FR-001, restrição do projeto): `:root` + `@theme inline` continuam
    como estão; **só os valores trocam**. Não reorganizar o arquivo.
  - **Entrega em `src/app/globals.css`**:
    - as **12 cores** de FR-001 + `--color-brand-linkedin` `#0A66C2` (FR-001a). O branco **não é
      token novo**: resolve para `--color-white` do tema padrão do Tailwind (FR-001b);
    - remoção integral dos **19** tokens aubergine de FR-002 — nenhum renomeado mantendo valor
      (SC-005 proíbe renomeio disfarçado);
    - as 5 escalas de FR-003 + `--text-micro-cap-sm` 9px (FR-003b), cada uma com os **três**
      sub-tokens `--line-height`, `--letter-spacing`, `--font-weight` (FR-003a) — **nenhuma fica
      no padrão do navegador**; o que o artboard não declarar, esta tarefa fixa e registra;
    - os 9 tokens que **colidem** (mesmo nome, valor novo), resolvidos aqui (FR-002a.1);
    - bloco `/* LEGADO */` com os **15** órfãos nomeados (FR-002a.2) — só encolhe;
    - `--spacing: 0.25rem` declarado no `@theme` e remoção dos 7 `--spacing-*` sem uso (FR-005a);
    - raios 12/16/18/24 e pílula 90px (FR-005); duas sombras duras sem desfoque (FR-006);
    - `--measure-prose` em `ch`, 65–72 caracteres (FR-012);
    - **regra de sistema de hover e `:active`** (FR-018a) e **de foco visível** (FR-018b), 3px
      com afastamento de 3px. ✅ **Decisão do autor**: as cores de hover e `:active` são
      **derivadas das doze com `color-mix()`** — 8% de `currentColor` no hover, 16% no `:active`.
      Zero token novo e zero cor nova, então SC-004 segue devolvendo vazio e as doze seguem sendo
      doze. Medido no artboard: ele usa 8 hexes fora das doze, mas são chrome da documentação dele
      (`color:` de rótulos e legendas), com uma exceção — `#A79878` como `border: 2px dashed`, que
      é o contorno do `EmptyState` e fica para a T042 resolver com `hairline`;
    - **regra global de `prefers-reduced-motion: reduce`** neutralizando `transition` e
      `animation` — **ponto único** do sistema (FR-042a, SC-016). Nenhum componente repete;
    - o ponto de corte **único em 1024px** (`lg` do Tailwind, nenhum breakpoint próprio, FR-038a).
  - **Entrega em `src/app/layout.tsx`** — **só** o bloco de fontes e a `className` do `<html>`:
    Archivo Black (**peso 400 apenas**, é a única espessura; não pedir 700/800 nem deixar o
    navegador sintetizar — FR-004a), Space Grotesk (400/500/600/700), JetBrains Mono (400/500/700)
    por `next/font/google`. `Plus_Jakarta_Sans` e `--font-jakarta` saem.
    **Não tocar** em `metadata`, `<body>`, `Header`, `main`, `Footer`.
  - **Entrega em `DESIGN.md`** (FR-011a). ⚠️ **O arquivo não está no disco mas ESTÁ no índice do
    git** (R15: `AD`, 57 linhas, documentando a paleta **aubergine** e a `Plus Jakarta Sans`).
    Esta tarefa **substitui**, não cria — o diff aparece como modificação. O conteúdo versionado
    é insumo da seção "Removidos" que SC-005 autoriza: recuperar com `git show :DESIGN.md`.
    Seções obrigatórias: todos os tokens; "Cores de marca e de sistema" (`brand-linkedin` +
    `--color-white`, separadas das doze); tabela de contraste; regra de hover/`:active`/foco;
    ponto de corte; escala de espaçamento; e a seção **nomeada** de valores provisórios de
    FR-046b (vazia se não usada).
  - **Medição que é entregável desta tarefa** (FR-041a): `ink-blue` sobre `sand` e sobre `blush`
    **ainda não foram medidos**. Se qualquer um ficar abaixo de **3:1**, o anel de foco naquela
    superfície troca para `ink`. Registrar os dois números em `DESIGN.md`.
  - ✅ **Consequência medida no `SearchBox`** (congelado por SC-013): ele usa 8 utilitários da
    paleta antiga. Quatro sobrevivem (`text-ink` ×2 e `border-hairline` ×2, porque `ink` e
    `hairline` são nomes reusados) e outros quatro **perdem a cor** (`text-ink-mute` ×2,
    `text-primary`, `border-primary`). **Nenhum valor provisório foi criado**: ele está aposentado
    por FR-015, SC-013 congela as **linhas** dele e não a aparência, e a feature das rotas o apaga.
    Zero token aubergine sobrevive, então SC-005 fica intacto. O Portão 4 segue verde — a story do
    `SearchBox` passa contraste com o texto herdando `ink` sobre `canvas`.
    **Correção de fato ao plano**: §6 diz "`/search` continua com o visual **antigo**"; o correto é
    "visual **parcialmente sem cor**".
  - **Ordem interna obrigatória**: `grep` pelos 19 tokens aubergine em `src/components/**`
    **ANTES** de removê-los, para saber quantos call sites quebram. Componente que referencia
    `bg-primary`, `text-on-primary` etc. precisa de valor válido ao fim da tarefa.
  - **A paleta não pode ficar pela metade**: ao fim desta tarefa o projeto **compila, sobe e as
    onze rotas continuam renderizando**. O visual fica inconsistente em alguns pontos — os 15
    componentes existentes ainda não foram re-estilizados — e **isso é esperado e aceitável**
    (US1/Independent Test). O que **não** é aceitável é Portão 5 ou 6 vermelho.
  - **Valor provisório tem regra** (FR-046b, §Falha de portão): como o conserto não pode alterar
    `src/app/**` além destes dois arquivos, **o escopo prevalece**. Valor provisório é aceitável
    se, e só se, registrado na seção nomeada de `DESIGN.md` e coberto pela T046, que exige aquela
    seção **vazia**. Ampliar o escopo exige emenda escrita **antes** da correção.
  - **Teste único de EC-12 e SC-016** — `tests/unit/design-system.test.ts`, no project `unit`.
    ⚠️ **Correção**: este bullet dizia `src/app/globals.test.ts` no project `components`, e o caminho
    estava errado duas vezes — SC-011 admite **dois** arquivos sob `src/app/**` e um teste seria o
    terceiro, e o project `components` só recolhe `src/components/**/*.test.tsx`. Vai para
    `tests/unit/`, onde os testes de lógica já vivem; a regra de colocação de FR-043a vale para
    teste de **componente**, que este não é. Asserções:
    sob `prefers-reduced-motion: reduce`, `transition` e `animation` são neutralizados **e o
    estado final é alcançado sem transição**, nunca suprimido junto com a animação. É **um**
    teste, no design system: FR-042a fixa ponto único de definição, então nenhum componente
    repete a regra e nenhum repete o teste. O `grep` da T047 prova a **outra** metade de
    SC-016 — que ninguém repete a consulta —, não esta.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`
  - **Escopo**: `git diff --name-only -- src/app/` deve listar **exatamente** `globals.css` e
    `layout.tsx`. `git diff -- src/app/layout.tsx` não pode mostrar nada fora do bloco de fontes
    e da `className` do `<html>` (SC-011).

- [X] T003 [US1] Subir Storybook 10.5.10 → 10.6.0 e adicionar `storybook-addon-pseudo-states` — `package.json`, `.storybook/main.ts`
  - **Artboard**: nenhum. Habilita a entrada de hover que FR-018a exige das camadas 2–6.
  - `storybook-addon-pseudo-states@10.6.0` tem peer `storybook: ^10.6.0` (verificado no npm) e o
    projeto está em **10.5.10**. `storybook` e **todos** os `@storybook/*` sobem juntos para
    10.6.0 — cabe nos intervalos `^10.5.10` já declarados.
  - **Fica em tarefa própria, separada da T002**, porque é o único movimento da feature capaz de
    deixar o **Portão 4 vermelho por motivo alheio a qualquer componente**. Misturado com os
    tokens, uma falha do Portão 4 teria duas causas candidatas.
  - **Bloqueante para a primeira tarefa de componente**: sem pseudo-estado forçado a entrada de
    hover não pode existir, e sem ela a story não cobre todos os estados que o Princípio II exige.
  - ✅ **Executada em 2026-09-27, ANTES da T002** — reordenação forçada e medida, não preferência.
    O Portão 4 não executava em 10.5.10: o `@storybook/addon-vitest` falha na interop CJS→ESM com
    Vitest 4 / Vite 8 (`aria-query`, depois `lz-string`). Três paliativos de config foram tentados
    e o erro **andava** de pacote em pacote em vez de convergir; o upgrade resolveu de uma vez.
    Nenhuma dependência quebrou: T002 toca `globals.css`/`layout.tsx`/`DESIGN.md` e T003 toca
    `package.json`/`.storybook/main.ts` — conjuntos disjuntos.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T004 [US1] Portão 6 da Camada 1 — execução limpa nas onze rotas, em `dev` e em produção
  - **Procedimento, rotas, ambiente e evidência**: [`GATES.md`](../../GATES.md) §6. Detalhe em
    [plan.md](./plan.md) §6.
  - Esta camada é a de **risco mais alto** do Portão 6: é a única que altera `src/app/**`, e token
    removido ainda referenciado por classe Tailwind quebra aqui.
  - `npm run dev` → as onze rotas na ordem de `GATES.md` §6; depois
    `npm run build && npm start` → as mesmas onze. Hydration mismatch só aparece na segunda.
  - Observar **terminal e console**, os dois. Lista **aberta**: qualquer erro e qualquer aviso
    novo reprovam, mesmo com a página renderizando. Única tolerância: `GATES.md` §4.
  - Chromium **sem extensão ativa** (perfil limpo). O overlay de desenvolvimento do Next.js conta
    como canal de erro.
  - **Registrar a evidência no corpo do commit**: quais rotas passaram, em `dev` e em produção, e
    qualquer aviso encontrado. Portão manual sem registro não conta como verificado.
  - **Preencher a linha 6 de `GATES.md` §3** com a base de avisos de console medida aqui.
  - ✅ **CONCLUÍDA em 2026-09-27. Os dois canais executados, nos dois modos.**
    **Canal do terminal.** `dev`: **um** aviso, o do lockfile órfão (§4). Produção: **dois**, o do
    lockfile e `⚠ The static directory has been deprecated`. O segundo é **pré-existente e do
    repositório** — `static/` é rastreado desde fev/2024, resquício do blog antigo — logo é linha
    de base, não regressão desta camada. As onze rotas dão 200 (404 na inexistente) nos dois modos,
    com zero marcador de erro no HTML. Registrado em `GATES.md` §3.
    **Verificação extra da camada, por HTTP**: as 12 cores e `brand-linkedin` chegam ao CSS
    servido, as três fontes chegam à tag `<html>`, e os cinco hexes aubergine testados saíram.
    `#FF5533` aparece como `#f53` porque o Lightning CSS minifica — mesmo valor.
  - ✅ **Canal do console do navegador — DESBLOQUEADO E EXECUTADO.** O bloqueio anterior era de
    **método**, não de resultado: dirigir o Chrome do autor *por extensão* não satisfaz "sem
    extensão ativa (perfil limpo)" por definição. A saída é **Chromium de perfil limpo via
    Playwright** — binário que o Portão 4 já exige, contexto novo por rota, `--disable-extensions`,
    nenhuma extensão carregada. Satisfaz §6 de forma **mais estrita** que uma janela do autor, e
    coleta por evento (`console`, `pageerror`, `requestfailed`) em vez de leitura na tela, o que
    remove o "afirmado por quem implementou" que a constituição recusa.
    **Entregue como comando reproduzível**: `npm run gate6:console`
    (`scripts/gate6-console.mjs`), referenciado em `GATES.md` §1. Declarar o método normativo sem
    enviar o script deixaria o portão irreprodutível — que é exatamente o que o bloqueou.
    **Resultado, idêntico em `dev` e em produção**: **nove das onze rotas limpas** — zero
    `console.error`, zero `console.warn`, zero `pageerror`, e o badge de devtools do Next.js em
    `data-error="false" data-status="none"` nas onze. **Zero hydration mismatch em produção**, que
    era o risco nomeado desta camada; `dev` e produção baterem exatamente é a evidência de que não
    há divergência servidor/cliente.
    **Os dois achados, registrados por identidade em `GATES.md` §3 como linha de base**:
    (a) `/posts/<slug>` — `Access to XMLHttpRequest at
    'https://links.services.disqus.com/api/ping' … blocked by CORS policy` mais o
    `net::ERR_FAILED` do mesmo pedido. Vem do `embed.js` de **terceiro** que o `DisqusComments`
    injeta, e ocorre porque `localhost` não é origem registrada no Disqus. **Não é regressão desta
    camada**: T002 alterou só `globals.css` e `layout.tsx`, e nenhum dos dois pode influenciar uma
    chamada de rede a terceiro;
    (b) `/rota-que-nao-existe` — `Failed to load resource: … status of 404`, que é o **status
    esperado** da rota 11, definida em §6 como "rota inexistente".
    Os dois entram como **base** e não como §4 pelo mesmo critério repo-vs-máquina que pôs
    `static directory deprecated` na base e o lockfile órfão em §4: reproduzem em qualquer máquina.
  - ✅ **Linha 6 de `GATES.md` §3 preenchida.** Não resta nenhuma base marcada `⚠` — as seis linhas
    estão medidas, e "aviso novo" no Portão 6 passa a ter referência por identidade (FR-046a).
  - ✅ **Efeito colateral resolvido por decisão.** `npm run dev` gera `AGENTS.md` (678 B) e
    `CLAUDE.md` (11 B, só `@AGENTS.md`) na **raiz**, nenhum coberto pelo `.gitignore`.
    **Decisão: commitar, não ignorar** — é a instrução do próprio `AGENTS.md` gerado ("committing
    it with your work keeps the tree clean"), e ignorá-los esconderia do agente um arquivo que o
    `next dev` reescreve a cada execução. `.claude/CLAUDE.md` está intacto e é outro arquivo.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

**Checkpoint**: fundação pronta. As camadas 2–6 podem consumir tokens.

---

## Phase 3: User Story 3 — Componentes base (P2)

**Goal**: os blocos elementares, cada um em todos os estados desenhados, em 1280px e 390px.

**Independent Test**: abrir o catálogo e percorrer cada estado de cada primitivo nas duas
larguras, **sem abrir nenhuma rota do blog**.

**Artboard da camada**: `project/Componentes.dc.html` → `01 · BASE` ·
`project/ComponentesMobile.dc.html` → `BASE`.

**Todos são Server Components** (`contracts/components.md`). `Button` e `IconButton` só
**repassam** o `onClick` que recebem — não criam handler nem têm estado, e a diretiva pertence a
quem cria o handler. Sem diretiva eles servem aos dois lados da fronteira.

- [X] T005 [P] [US3] `Button` — `src/components/Button/Button.tsx`, `.stories.tsx`, `.test.tsx`
  - 📋 **Critério de entrada da camada**: [`checklists/componentes.md`](./checklists/componentes.md),
    45 itens, conferido **uma vez** antes da primeira tarefa de componente — não a cada tarefa.
    Este é o único dos três checklists **sem** tabela de resolução, e por isso 33 itens nunca foram
    julgados. Dois são insumo das tarefas de componente e MUST ser decididos antes: **CHK032**
    (não existe requisito de **ordem de foco nem de foco preso** para componente com vários
    controles — o `CommandPalette` da T044 é o caso, porque abre sobre a página e sem foco preso
    fica inutilizável por teclado passando pelo `addon-a11y`) e **CHK031** (nome acessível de
    **região**: `SideRail`, `MobileTabBar`, `Breadcrumb` e `Pagination` todos repetem `nav`).
  - ✅ **Os dois decididos em 2026-09-27, antes da T005.** O `/speckit-implement` lê o estado das
    caixas como portão **sem poder alterá-las**, então a decisão fica registrada aqui, e não no
    checklist.
    **CHK031 — nome acessível de região.** Toda landmark `nav` recebe `aria-label` **distinto**:
    `SideRail` → "Navegação principal"; `MobileTabBar` → "Navegação em telas pequenas";
    `Breadcrumb` → "Trilha de navegação"; `Pagination` → "Paginação". Justificativa: `SideRail` e
    `MobileTabBar` **coexistem no DOM** — um fica oculto pelo ponto de corte, não removido —, e duas
    landmarks do mesmo tipo sem nome distinto reprovam a regra `landmark-unique` do axe, que roda no
    Portão 4. Não é preferência de estilo: é o que mantém o portão verde quando as rotas compuserem
    os dois.
    **CHK032 — ordem de foco e foco preso.** Só o `CommandPalette` (T044) abre sobre a página, e é
    o único que recebe **foco preso**: ao abrir o foco vai para o campo de busca; `Tab` e
    `Shift+Tab` circulam **dentro** da folha; `Esc` fecha e **devolve o foco ao gatilho**. Os demais
    mantêm a ordem natural do DOM, sem `tabIndex` positivo. Sem foco preso a paleta fica inutilizável
    por teclado — tabular para trás leva a elementos que o leitor não vê — e isso **passa** pelo
    `addon-a11y`, que não verifica foco preso. Por isso a exigência é de **teste**, na T044.
  - **Artboard**: `Componentes.dc.html` → `01 · BASE`, card **`Button`** (grupos `VARIANTES · LG`,
    `COM ÍCONE / MD / DESABILITADO`, `FOCO VISÍVEL (TECLADO)`) · `ComponentesMobile.dc.html` →
    `BASE`, card **`Button`**.
  - **Estados**: `primary`, `secondary`, `accent`, `disabled` × tamanhos `lg` e `md`, com e sem
    ícone; foco visível; hover (entrada própria, 1280px).
  - **`md` é 44px, não os 40px do artboard.** O card diz "Altura 48 (lg) / 40 (md)"; 40 reprova o
    mínimo de alvo de toque, que é MUST no Princípio IV e incondicional em FR-037/SC-008. **A
    constituição prevalece sobre o mock** (FR-017).
  - Em 390px, botão isolado ocupa **largura cheia**; par de ações irmãs divide a linha
    (US3/AS-5, FR-039).
  - API livre (FR-016 não lista `Button`; nenhuma rota o chama direto). Preservar a união
    `href | onClick`: `href` renderiza `<a>`, `onClick` renderiza `<button>`.
  - **Teste**: `disabled` impede o clique; `href` → `<a>`, `onClick` → `<button>`; menor dimensão
    do alvo ≥44px nos dois tamanhos; foco visível presente (FR-018b).
  - ✅ **Executada em 2026-09-27. Cinco portões verdes, rodados separadamente (regra 3a).** As duas
    réguas de SC-004 devolvem vazio e `git diff --name-only -- src/app/ src/lib/ src/content/` não
    lista nada desta tarefa.
  - 🔧 **Infraestrutura de story que a T005 teve de resolver, porque é a primeira tarefa de
    componente e ninguém antes dela tinha exercitado o caminho:**
    **(i) `vitest.setup.components.ts` não limpava o DOM.** O auto-cleanup do
    `@testing-library/react` só se registra sozinho com `globals: true`, e o project `components`
    roda sem globais. Sem `afterEach(cleanup)` o segundo `render` do mesmo papel falha com "found
    multiple elements". Não aparecia antes porque o project tinha **zero teste de verdade** — é a
    mesma classe de erro das 11 stories que nunca tinham rodado (T001).
    **(ii) `globals.viewport` NÃO redimensiona o iframe no Portão 4.** Medido: o iframe fica em
    **1200px**, então a asserção de SC-009 mediria 1200 e os 390px nunca seriam provados. A largura
    passa a ser declarada por **dois** mecanismos, em `src/story-viewport.ts`: `globals.viewport`
    para quem **navega** o catálogo (e que a barra de ferramentas não pode alterar, que é o que
    FR-038b exige), e `page.viewport()` do contexto do Vitest para o **viewport real** do Portão 4.
    As entradas de desktop também recebem `play`, senão os 390px da entrada anterior vazam para
    elas e a apresentação de desktop vira uma de celular.
    **(iii) A asserção foi provada por teste vermelho**, não por portão verde: trocando o limite de
    390 para 10, as **cinco** entradas `Mobile` reprovaram com `expected 390 to be less than or
    equal to 10`. Isso prova as duas coisas que um verde não provaria — que a asserção **executa**
    (e não sai cedo por falta de contexto) e que o viewport é **exatamente 390**.
  - 📐 **Divergências de artboard resolvidas nesta tarefa, além das três já catalogadas:**
    **(D-E) tamanho do rótulo.** O card desenha 15px (`lg`) e 14px (`md`); **nenhum dos dois é
    escala declarada**. Medido em `Sistema.dc.html` → `02 · TIPOGRAFIA`, as escalas são exatamente
    as cinco de FR-003 (52, 30, 21, 17, 11). Os 15/14px são chrome do card. O rótulo usa
    **`text-body-lg` (17px) com `font-bold`**: inventar `text-[15px]` violaria a prosa de SC-004
    ("tamanho de texto resolve para um token nomeado"), e criar token novo exigiria reabrir a T002.
    A diferença entre `lg` e `md` passa a ser **altura e recuo**, não corpo de texto.
    **(D-F) sombra.** O card desenha `3px 3px 0`; `Sistema.dc.html` → `03 · FORMA` declara
    `--shadow-hard: 4px 4px 0`. Vale o **token** (Princípio I). Mesmo critério de D-B.
    **(D-G) desabilitado.** O artboard usa dois valores fora das doze — um bege médio no traço e um
    cinza-terra no rótulo. Resolvem para `border-hairline` (tracejado) e `text-ink-soft`, pelo mesmo
    precedente que a T002 registrou para o contorno do `EmptyState`. `border-dashed` é estilo, não
    espessura, então a régua 2 de SC-004 segue vazia.
  - ⚠️ **DEFEITO ABERTO em `globals.css`, encontrado por esta tarefa e maior que ela** — o anel de
    foco por superfície de FR-018b/FR-041a usa **seletor descendente**: `.bg-ink :focus-visible`,
    `.bg-sun :focus-visible` etc. acertam o que está **dentro** da superfície, não o elemento que
    **é** a superfície. Um botão sólido é o segundo caso, então o anel cai no padrão `ink-blue`.
    **Medido**: `ink-blue` sobre `ink` dá **2,86:1** e sobre `sun` **2,84:1** — as duas reprovam o
    mínimo de 3:1 de FR-041a. O `addon-a11y` **não pega**: a regra `color-contrast` não avalia cor
    de contorno, então o Portão 4 fica verde com o defeito presente.
    **Paliativo aplicado na T005**: `focus-visible:outline-white` em `primary` e
    `focus-visible:outline-ink` em `accent`, no próprio componente. O `:where()` de `globals.css`
    tem especificidade 0, então o utilitário vence.
    **Por que não foi corrigido na origem**: a regra 5 congela `src/app/**` fora da T002 e da T046.
    **Consequência se não for consolidado**: todo componente que carregue a própria superfície
    sólida repete o paliativo, o que contraria o "ponto único de definição" de FR-018b. A correção
    é de uma linha em `globals.css` (`:is(.bg-ink, .bg-ink *)` em vez de `.bg-ink *`) e pertence à
    **T046** ou a uma emenda que reabra a T002.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T006 [P] [US3] `IconButton` — `src/components/IconButton/IconButton.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `01 · BASE`, card **`IconButton`** (grupo
    `NEUTRO · ACENTO · MARCA`) · `ComponentesMobile.dc.html` → `BASE`, card **`IconButton`**.
  - **Adiciona `lucide-react@^1.48.0`** ao `package.json` — primeiro consumidor de ícone da
    feature (FR-036a). Verificado: 2118 ícones, **zero marcas** (R2).
  - **Estados**: `neutral`, `accent`, `brand`; hover; foco. Redondo, **mínimo 44px** (FR-019).
  - `label` é **obrigatório** e vira o nome acessível — ícone que carrega o único significado do
    controle não pode ficar sem nome (FR-036a). Ícone decorativo vai com `aria-hidden`.
  - **Divergência registrada**: o card diz "Ícone pintado, nunca contornado"; `lucide-react` é
    biblioteca de **traço**. Decisão do autor tomada com o conflito à vista; FR-019 foi reescrito
    para o estilo de traço.
  - **Teste**: `label` produz nome acessível; alvo ≥44px; `href` → `<a>`, `onClick` → `<button>`.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T007 [P] [US3] `Avatar` — `src/components/Avatar/Avatar.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `01 · BASE`, card **`Avatar`** (rótulo
    `LG 108 · MD 44 · SM 32`) · `ComponentesMobile.dc.html` → `BASE`, card **`Avatar`** ·
    `MobileSobre.dc.html` para o `lg` de 78px em contexto.
  - **Estados**: `sm` 32px, `md` 44px, `lg` **responsivo 78px em 390px / 108px no desktop** — pelo
    **mesmo** componente com classe responsiva, não dois componentes nem duas props (FR-020, R8);
    com foto e sem foto (iniciais).
  - **Divergência D-C**: o swatch `lg` é desenhado em **64px** no card, mas o **rótulo** diz 108.
    Vale o rótulo. Não "corrigir" para 64.
  - **EC-01** (estado renderizável, entra no catálogo **e** no teste): sem `src` **e** sem `name`
    aproveitável → **marcador neutro**, nunca círculo vazio nem string vazia dentro do círculo.
  - **Teste**: iniciais derivadas de `name`; EC-01 produz marcador neutro, não string vazia; os
    três tamanhos resolvem para as dimensões certas.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T008 [P] [US3] `CategoryBadge` — `src/components/CategoryBadge/CategoryBadge.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `01 · BASE`, card **`CategoryBadge`**. **Sem card no
    `ComponentesMobile`** — a apresentação de 390px sai de `MobileTag.dc.html` e
    `MobileCategoria.dc.html`, onde o selo aparece em contexto (ex.: `BACK-END`, `FERRAMENTAS`).
  - **Estados**: as **cinco** categorias com cor fixa (FR-009) — Front-end→`flame`,
    Back-end→`mint`, Ferramentas→`sun`, Design→`ink-blue`, Programação→`ink`. Caixa alta, família
    display.
  - **Redução responsiva**: **9px em 390px / 11px no desktop**, pelo token próprio
    `--text-micro-cap-sm` criado na T002 (FR-003b). Não usar `px` avulso — Princípio I proíbe e
    SC-004 reprova.
  - ⚠️ **Contraste é item de aceitação, não sugestão** (FR-008, FR-041): sobre `flame`, `sun` e
    `mint` o texto é **sempre `ink`, em qualquer tamanho**. Medido: branco sobre `sun` dá
    **1.59:1** e sobre `mint` **2.34:1** — reprovam até o limite relaxado de 3:1. Branco é
    permitido **somente** sobre `ink`, `ink-blue`, `code-bg` e `brand-linkedin`.
  - **Teste**: cada uma das 5 categorias resolve para a sua cor fixa; a troca 9↔11px acontece em
    1024px e **em nenhum outro ponto** (FR-038a).
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T009 [P] [US3] `TagPill` — `src/components/TagPill/TagPill.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `01 · BASE`, card **`TagPill`**. Sem card no
    `ComponentesMobile`; 390px sai de `MobileTag.dc.html` (seção `TAGS VIZINHAS`) e
    `MobileExplorar.dc.html` (seção `TAGS`).
  - **Estados**: padrão, **ativa**, **com contador**; hover; foco. Sempre família monoespaçada,
    sempre prefixada por `#` (FR-022).
  - 🔒 **Contrato congelado**: `{ tag, href }` — consumido por `src/app/**`. **MUST NOT** ser
    renomeada, removida, tornada obrigatória nem ter o tipo estreitado (FR-016). `active` e
    `count` entram **opcionais com valor padrão**.
  - **Divergência D-B**: o artboard desenha essas pílulas com `border: 1.5px`. Vira **2px**
    (`border-2`) — FR-007 fixa espessura única e a régua 2 de SC-004 só sanciona `border-2`.
  - `href` é link real: alvo ≥44px na menor dimensão (FR-037).
  - **Teste**: renderiza `<a href>` de verdade, não `div` com clique (FR-040); o `#` é prefixo
    sempre; `count` ausente não deixa lacuna; alvo ≥44px.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T010 [P] [US3] `Kbd` — `src/components/Kbd/Kbd.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: **não tem card próprio**. Medido: aparece como elemento `<kbd>` dentro dos cards
    **`TopBar`** (`02 · NAVEGAÇÃO`) e **`CommandPalette`** (`05 · BUSCA, VAZIO E RODAPÉ`) de
    `Componentes.dc.html` — mono 11px, peso 700, raio 6px, fundo `sand`. A spec o entrega como
    componente próprio (Assumptions).
  - **Estados**: tecla única (`⌘K`, `esc`, `↵`). Elemento semântico `<kbd>`.
  - **Divergência D-B**: o `<kbd>` do artboard usa `border: 1.5px`. Vira **2px**.
  - 390px: sem card de celular; vale o ponto de corte único de 1024px (FR-038a) — a entrada
    `Mobile` existe mesmo sem mudança visual, porque FR-038b exige as duas.
  - **Consumido por** `CommandPalette` (T044) e `Header/SearchTrigger` (T014) — por isso vem na
    camada 2, antes dos dois.
  - **Teste**: renderiza o elemento semântico `<kbd>`; o conteúdo recebido aparece intacto.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T011 [P] [US3] `InlineCode` — `src/components/InlineCode/InlineCode.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `01 · BASE`, card **`InlineCode / link`** (card
    combinado: código inline **e** link inline). 390px em `MobilePost.dc.html`, no corpo do post.
  - **Estados**: código inline no corpo do texto; família monoespaçada, fundo `sand`.
  - Elemento semântico `<code>`.
  - **Teste**: renderiza o elemento semântico `<code>`; o conteúdo recebido aparece intacto.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T012 [P] [US3] `Container` (re-estilização) — `src/components/Container/Container.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: **nenhum card**. É primitivo de layout: a re-estilização deriva dos tokens de
    `Sistema.dc.html` → `03 · FORMA` e da medida de leitura `--measure-prose` (FR-012).
  - **Estados**: largura padrão; largura de leitura (`--measure-prose`, FR-012); com
    `className` extra somado às classes próprias, nunca substituindo-as.
  - 🔒 **Contrato congelado**: `{ className }` — consumido por `src/app/**` (FR-016).
  - **Entra na camada 2** porque as camadas 3–6 o compõem; deixá-lo para depois faria elas
    comporem um primitivo ainda com visual antigo.
  - **Story e teste existem mesmo sendo layout**: Princípio II não abre exceção por tipo de
    componente. A story mostra o container com conteúdo de exemplo nas duas larguras.
  - **Teste**: `className` recebido é aplicado e **não substitui** as classes próprias.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

**Registro de execução da Camada 2 — T006 a T012, 2026-09-28.** Cinco portões verdes, rodados
separadamente. As duas réguas de SC-004 devolvem vazio e o escopo congelado está limpo.

`lucide-react@^1.48.0` entrou como dependência nova, exatamente a versão que a T006 previa.

**Divergências de artboard resolvidas nesta camada** — todas pelo mesmo critério das anteriores: o
token prevalece sobre o desenho, e a constituição prevalece sobre o mock.

| # | Onde | Medido no artboard | O que a entrega faz | Por quê |
|---|---|---|---|---|
| D-H | `TagPill` | pílula compacta, ~20px de altura | `min-h-11` (44px) | a pílula é **link real**, e FR-037 é incondicional. Mesmo critério que subiu o `Button` `md` de 40 a 44 |
| D-I | `TagPill`, `Kbd` | mono **12px** | `text-micro-cap` (11px) + `font-mono` | 12px não é escala declarada; as cinco de FR-003 são exaustivas. A família vem de FR-004 |
| D-J | `Kbd`, `InlineCode` | raio **5–6px** | `rounded-sm` (12px) | `DESIGN.md` §5 já atribui `--radius-sm` a "selo, pílula pequena, `Kbd`" — o sistema decidiu antes |
| D-K | `InlineCode` | **14,5px** | **nenhuma** escala declarada; herda o parágrafo | fixar uma das cinco daria salto visível no meio da frase. Herdar mantém o tamanho vindo de token — o do contexto. Há teste que reprova se alguém acrescentar `text-*` |
| D-L | `CategoryBadge` | borda `ink` em todas | borda **`paper`** em `Programação` | o fundo dessa é `ink`; borda `ink` sobre fundo `ink` é borda invisível. O artboard desenha essa inversão |
| D-M | `Avatar` | fundos variados por swatch | `bg-mint` único | os fundos do card são ilustração do tamanho, não variante de prop. `mint` exige texto `ink`, que é o que o componente usa |
| D-N | `TagPill` | padrão **sem** contorno | segue sem `border-2` | FR-007a manda dar borda de 2px onde o desenho **prevê** borda, e não onde ele não prevê |

**Três asserções que medem o renderizado, não a classe** — porque utilitário inexistente é
silencioso: a classe fica no HTML e o layout cai no tamanho do conteúdo, sem erro nenhum.
- `Avatar` `lg`: **108px** medido em 1280px e **78px** em 390px, provando FR-020 e que
  `size-19.5`/`size-27` de fato derivam de `--spacing`;
- `Container` `prose`: largura menor que 1280px, provando que `--measure-prose` chega ao componente;
- as onze entradas `Mobile` da camada: `scrollWidth <= 390`.

**Contratos congelados preservados** (FR-016): `TagPill { tag, href }` e `Container { className }`
intactos. `active`, `count` e `prose` entraram **opcionais com valor padrão**, então nenhum call
site de `src/app/**` mudou — verificado, o escopo congelado devolve vazio.

**O que esta camada NÃO prova**: `IconButton`, `Avatar`, `CategoryBadge`, `Kbd` e `InlineCode` não
são alcançados por rota nenhuma enquanto `src/app/**` está congelado. Para eles a verificação de
execução é o **Portão 4**, não o 6 — é o que a T013 registra.

- [X] T013 [US3] Portão 6 da Camada 2 — execução limpa nas onze rotas, em `dev` e em produção
  - Procedimento: `GATES.md` §6. **O que esta camada de fato exercita**: `Button`, `TagPill` e
    `Container` re-estilizados, compostos pelas rotas atuais. `IconButton`, `Avatar`,
    `CategoryBadge`, `Kbd` e `InlineCode` **não são alcançados por rota nenhuma** — `src/app/**`
    está congelado. Para eles a verificação de execução é o **Portão 4**, não este.
  - Registrar evidência no corpo do commit.
  - ✅ **Executado em 2026-09-28, os dois canais, nos dois modos. ZERO regressão.**
    **Terminal** — `dev`: um aviso (lockfile órfão, §4). Produção: dois (lockfile e `static
    directory deprecated`). Idênticos à base da T004, **por identidade**.
    **Console, em Chromium de perfil limpo** — `dev` e produção deram resultado **idêntico entre
    si e idêntico à base**: nove rotas limpas, e os mesmos **dois** achados de linha de base (CORS
    de terceiro do Disqus em `/posts/<slug>`; 404 esperado na rota inexistente). Zero achado novo,
    zero hydration mismatch.
    **O que isto prova**: re-estilizar `Button`, `TagPill` e `Container` — os três desta camada que
    as rotas de fato compõem — não quebrou nenhuma das onze rotas. `TagPill` é o caso de maior
    risco, porque perdeu `bg-canvas-cream`, `text-caption` e o `border` nu de uma vez.
    **O que isto NÃO prova**: `IconButton`, `Avatar`, `CategoryBadge`, `Kbd` e `InlineCode` não são
    alcançados por rota nenhuma enquanto `src/app/**` está congelado. Para eles a verificação de
    execução é o **Portão 4** (story em navegador real), não este.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

**Checkpoint**: kit de primitivos utilizável. US3 é testável sozinha.

---

## Phase 4: User Story 4 — Navegação (P2)

**Goal**: o esqueleto navegável completo no catálogo.

**Independent Test**: percorrer no catálogo cada componente de navegação em estado ativo e
inativo, nas duas larguras.

**Artboard da camada**: `project/Componentes.dc.html` → `02 · NAVEGAÇÃO` ·
`project/ComponentesMobile.dc.html` → `NAVEGAÇÃO`.

**Depende de**: T005 `Button`, T006 `IconButton`, T007 `Avatar`, T010 `Kbd` (camada 2).

**Todos são Server Components, exceto os nomeados** (`contracts/components.md`): `Header` passa a
**S** com a ilha `SearchTrigger` (**C**), e `ReadingProgress` é **C** por API de browser.

- [X] T014 [US4] `Header` (TopBar + MobileHeader) e a ilha cliente `Header/SearchTrigger` — `src/components/Header/Header.tsx`, `Header/SearchTrigger.tsx`, `Header.stories.tsx`, `SearchTrigger.stories.tsx`, `Header.test.tsx`, `SearchTrigger.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `02 · NAVEGAÇÃO`, card **`TopBar`** (faixa de 68px, com
    o `<kbd>⌘K</kbd>`) · `ComponentesMobile.dc.html` → `NAVEGAÇÃO`, card **`MobileHeader`**
    (64px) · contexto em `Mobile.dc.html` e nas demais páginas de celular.
  - **`TopBar` não é componente novo**: os artboards nomeiam `TopBar` (desktop) e `MobileHeader`
    (celular); a spec fixou que são as **duas apresentações responsivas** do `Header` existente,
    cujo nome FR-013 preserva. A troca acontece em **1024px** (64→68px, FR-038a).
  - 🔒 **Contrato congelado**: `Header()` continua **chamável sem argumento**. A prop do índice
    entra **opcional com padrão `[]`** — `Header({ index }: { index?: SearchIndexEntry[] })`
    (FR-016a). `src/app/layout.tsx` **não muda** por causa disso.
  - **Fronteira cliente/servidor — a melhoria mais concreta da feature**: `Header` é Client
    Component inteiro hoje (medido, R11). Ele **perde** o menu mobile com `useState` e **passa a
    Server Component**; o estado `open` desce para a ilha `SearchTrigger` (**C**), que é o único
    arquivo com `"use client"`. Mesmo padrão de `CodeBlock` (S) → `CopyButton` (C), que já existe
    no repo. Subir a diretiva de volta para o `Header` é violação do Princípio III, **mesmo que
    funcione**.
  - **`SearchTrigger` é o único componente fora do inventário da spec** — justificado em
    plan.md §Complexity Tracking: sem ele o estado sobe para o `Header`.
  - **Sem botão de alternador de tema** (R9, FR-010): o artboard desenha um; tema único foi
    decidido. `Header` entrega marca + **os cinco destinos** + gatilho do ⌘K + avatar.
  - 🚨 **Os cinco destinos NÃO saem do `Header` nesta feature** (FR-013a). Medido: `Header.tsx`
    tem hoje cinco `NAV_LINKS` (`hidden md:flex`) mais o botão de menu em 390px. O artboard move
    os destinos para a `SideRail` (desktop) e a `MobileTabBar` (celular), mas **nenhuma das duas
    pode ser montada**: `src/app/layout.tsx` compõe só `Header`/`main`/`Footer` e a exceção de
    escopo proíbe alterar essa composição. Removê-los aqui deixaria as **onze rotas sem
    navegação**, em 1280px e em 390px — regressão que **nenhum dos oito portões detecta**, porque
    a página renderiza sem erro e sem aviso. O menu de 390px perde o `useState` (o estado que
    sobra vai para a `SearchTrigger`), mas os destinos continuam alcançáveis **sem JavaScript**. A
    transferência para `SideRail`/`MobileTabBar` pertence à feature das rotas, junto da montagem
    das duas.
  - **Estados**: desktop 68px e celular 64px; os cinco destinos com o ativo distinto do
    inativo; gatilho de busca em repouso, hover e foco.
  - Nesta camada o `SearchTrigger` renderiza **só o botão com o estado**. A `CommandPalette` entra
    na T044 (camada 6), que fecha a ligação — por isso ela, e não esta, é a tarefa que a wira.
  - **Teste** (`SearchTrigger`, interação): o botão abre/fecha o estado `open`; nome acessível
    presente; alvo ≥44px. **Teste** (`Header`): chamável sem argumento; `index` ausente vira `[]`.
  - ⚠️ **Contraste**: faixa `sun` no desktop → texto e ícones em **`ink`** (FR-008).
  - ✅ **Executada em 2026-09-28. Cinco portões verdes, rodados separadamente.**
    **A fronteira mudou de verdade**: `grep -l '"use client"' src/components/Header/*.tsx` devolve
    **só `SearchTrigger.tsx`**. O `Header` era Client Component inteiro, com `useState` para o menu
    de 390px; o estado desceu para a ilha e a diretiva saiu. Mesmo padrão de `CodeBlock` (S) →
    `CopyButton` (C).
    **Os destinos sobrevivem sem JavaScript** (FR-013a): as duas apresentações renderizam os cinco
    links no HTML servido, e o teste assere **dez** links — cinco por ponto de corte. O botão
    "Abrir menu" não existe mais, e há teste que reprova se ele voltar.
    **Altura medida em navegador real**: **68px** em 1280px e **64px** em 390px, o que prova
    FR-038a pela dimensão e não pela classe. O primeiro seletor media o `Container` (168px em
    390px, faixa + linha de destinos) e foi corrigido para a faixa.
    **CHK031 aplicado**: as duas landmarks `nav` coexistem no DOM com nomes **distintos**
    ("Navegação do site" e "Navegação do site em telas pequenas"), e há teste que assere a
    unicidade. Sem isso a regra `landmark-unique` do axe reprovaria no Portão 4 quando as duas
    aparecem.
    **`activeHref` entrou opcional** para o estado ativo que o bullet de Estados pede. O ativo ganha
    **superfície própria** (`paper` + borda de 2px) e não só cor: cor sozinha seria o único portador
    da informação.
  - 📐 **Divergência D-O — a marca não tem escala.** O artboard desenha "allanramos" em **14px**
    (celular) e **18px** (desktop). As escalas de Archivo Black são **52, 30, 11 e 9** (FR-003c,
    mapeamento exaustivo), então nenhuma das duas existe. A entrega usa `text-display-md` (30px), a
    mais próxima **acima**; descer para `micro-cap` (11px) deixaria a marca **menor que o corpo do
    texto**. Fica registrado como **lacuna do sistema**, não como escolha confortável: se o autor
    quiser fidelidade, o caminho é uma escala nova por emenda, não um `px` avulso no componente.
  - 📐 **Divergência D-P — gatilho de busca.** O `MobileHeader` desenha o gatilho em **40px** e o
    `TopBar` como pílula com rótulo. A entrega é **um único controle** de 44px (FR-037): redondo e
    só com ícone abaixo de 1024px, com rótulo e `Kbd` a partir dele. Dois elementos, um por ponto
    de corte, dariam **duas paradas de tabulação para o mesmo controle** — e há teste que assere
    que existe apenas um botão.
  - ⚠️ **Dívida deliberada, com prazo nomeado**: o `index` chega à `SearchTrigger` mas ainda não é
    consumido — quem o consome é a `CommandPalette`, na T044. O prop entra já aqui porque FR-016a o
    declara o único caminho legal do índice até ela, e tê-lo agora deixa a fiação `Header` →
    `SearchTrigger` **provável por teste**. O `eslint-disable` de uma linha é o registro visível
    disso e **MUST sair na T044**, junto do primeiro uso real. Sem ele o aviso entraria na linha de
    base do Portão 1, que é de exatamente um aviso.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T015 [P] [US4] `SideRail` — `src/components/SideRail/SideRail.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `02 · NAVEGAÇÃO`, card **`SideRail`**. **Não existe no
    celular** — abaixo de 1024px quem aparece é a `MobileTabBar` (FR-038a).
  - **Estados**: os **cinco** destinos (Feed, Categorias, Tags, Séries, Sobre), com o item **ativo
    distinto do inativo** (FR-033, US4/AS-1); hover; foco.
  - **Server Component**: cinco links reais, ativo por prop (`activeHref`). Sem estado.
  - Alvo de toque ≥44px por item (FR-037).
  - **Teste**: renderiza 5 `<a href>` reais; `activeHref` marca exatamente um; alvo ≥44px.
  - ⚠️ **Contraste**: marca do item ativo sobre acento → `ink`.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T016 [P] [US4] `MobileTabBar` — `src/components/MobileTabBar/MobileTabBar.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `ComponentesMobile.dc.html` → `NAVEGAÇÃO`, card **`MobileTabBar`** (rótulo
    `74PX`) · `Componentes.dc.html` → `02 · NAVEGAÇÃO`, card **`MobileTabBar`** (descrição "cinco
    abas, alvo de 62px") · em contexto em todas as páginas `Mobile*.dc.html`.
  - **Divergência D-A, medida nesta passagem**: a **barra** é `height: 74px` e cada **aba** (`<a>`)
    é `height: 62px` nos artboards de página. R10 tratou 62 × 74 como conflito entre fontes;
    **não é conflito** — são medidas de coisas diferentes. FR-034 exige "alvo de toque de **74px**
    por aba", então **a aba preenche os 74px da barra**. Os dois valores passam o mínimo de 44px,
    logo isto é conformidade com a **spec**, não com o Princípio IV.
  - **Estados**: os mesmos cinco destinos, com **marca sobre o ícone ativo** (FR-034); ativo e
    inativo; hover; foco.
  - **Server Component — recusa deliberada da diretiva.** Ela só precisaria de `"use client"`
    para chamar `usePathname()`. Recebendo `activeHref` por prop não tem estado, efeito, handler
    nem API de browser, e o Princípio III só autoriza a diretiva quando há um desses. Nesta
    feature ela **nunca é ligada a rota** (rotas congeladas), então `usePathname()` seria
    especulativo (Princípio V). Se a feature das rotas preferir `usePathname()`, a diretiva entra
    **lá**, no componente que a precisar.
  - **Teste**: 5 `<a href>` reais; `activeHref` marca exatamente um; **cada aba mede ≥74px** na
    menor dimensão.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T017 [P] [US4] `Breadcrumb` — `src/components/Breadcrumb/Breadcrumb.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: **não tem card próprio**. Medido: é o grupo de estado **`BREADCRUMB`** dentro do
    card **`Pagination`**, em `Componentes.dc.html` → `02 · NAVEGAÇÃO`. Sem presença no
    `ComponentesMobile`; 390px vale pelo ponto de corte único de 1024px (FR-038a).
  - **Estados**: trilha com 2, 3 e 4 níveis; **último item sem `href`** (é a página atual).
  - **Server Component**: links reais.
  - **Teste**: o último item **não** é link; os demais são `<a href>`; alvo ≥44px.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T018 [P] [US4] `Pagination` — `src/components/Pagination/Pagination.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `02 · NAVEGAÇÃO`, card **`Pagination`** ·
    `ComponentesMobile.dc.html` → `NAVEGAÇÃO`, card **`Pagination`**.
  - **Estados**: primeira página, página do meio, última página (FR-030) — **e EC-05**: página
    única, com os **dois** extremos desabilitados ao mesmo tempo.
  - **O extremo desabilitado vira tracejado e PERMANECE VISÍVEL — nunca some** (FR-030,
    US4/AS-3). É o ponto que mais convida ao erro: o reflexo é esconder.
  - API **livre** — FR-016 não lista `Pagination` e nenhuma rota o chama direto (só `PostsListing`).
  - **Teste**: com uma única página os dois extremos ficam desabilitados **e presentes no DOM**
    (EC-05); na primeira página só o anterior está desabilitado; na última, só o próximo.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T019 [P] [US4] `ReadingProgress` — `src/components/ReadingProgress/ReadingProgress.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: **não tem card próprio**. Medido: é o grupo de estado **`PROGRESSO DE LEITURA`**
    dentro do card **`Pagination`**, em `Componentes.dc.html` → `02 · NAVEGAÇÃO` (barra de 8px,
    fundo `sand`, borda 2px). Em contexto no topo de `MobilePost.dc.html`.
  - **Estados**: 0%, fração parcial, 100% (US4/AS-5).
  - **Client Component** (`"use client"`): lê a posição de rolagem — `window` e evento `scroll`
    são API de browser, que é um dos quatro gatilhos que o Princípio III autoriza.
  - `value` entra **opcional**: sem ele o componente calcula; com ele a story controla a fração de
    forma determinística. Sem isso os três estados não seriam demonstráveis no catálogo.
  - **Teste de interação**: a fração exibida reflete a posição de rolagem; com `value` a fração é
    exatamente a recebida. `role="progressbar"` com os atributos de valor.
  - **Animação**: se animar, **não** declarar `prefers-reduced-motion` próprio — a regra global da
    T002 já cobre (FR-042a, SC-016).
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

**Registro de execução da Camada 3 — T014 a T019, 2026-09-28.** Cinco portões verdes, rodados
separadamente. Réguas de SC-004 vazias, escopo congelado limpo.

**A fronteira cliente/servidor bateu com o contrato, medida e não afirmada.**
`grep -rln '^"use client"' src/components/` devolve exatamente sete arquivos: os **cinco** `C` já
entregues (`SearchTrigger`, `ReadingProgress`, `CodeBlock/CopyButton`, `Toc`, `CopyLinkButton`),
mais `DisqusComments` e `SearchBox`, que `contracts/components.md` exclui da conta — o primeiro por
já ser cliente e não ser tocado (SC-013), o segundo por estar aposentado. Falta só a
`CommandPalette` (T044) para fechar os seis.

**Duas diretivas RECUSADAS de propósito**, e as duas por não haver nenhum dos quatro gatilhos do
Princípio III: `MobileTabBar` (ativo por prop em vez de `usePathname()`) e `SideRail`. Recusa
registrada é diferente de esquecimento — por isso está escrita no cabeçalho de cada arquivo.

**Divergências e decisões desta camada**

| # | Onde | Medido / pedido | O que a entrega faz | Por quê |
|---|---|---|---|---|
| D-A | `MobileTabBar` | barra 74px, aba 62px | a aba **preenche** os 74px (`h-18.5`) | não é conflito de fontes: são medidas de coisas diferentes. FR-034 exige alvo de 74px **por aba** |
| D-Q | `SideRail`, `MobileTabBar` | rótulo 10px, peso 700 | `text-micro-cap` (11px) | 10px não é escala declarada; a mais próxima é micro-cap |
| D-R | `Pagination` | versão anterior devolvia `null` com uma página | **renderiza inerte** | EC-05 exige os dois extremos desabilitados **e presentes**. `null` fazia a navegação desaparecer |
| D-S | `SideRail` | `/series` no artboard | mantido, com aviso no código | a rota de índice **não existe** hoje (só `/series/[series]`). Não quebra nada porque a `SideRail` não é montada por rota nenhuma; a feature das rotas MUST criar a rota antes de montá-la |

**Três estados provados por asserção, não por inspeção**
- `Header`: faixa medida em navegador real — **68px** em 1280px e **64px** em 390px (FR-038a);
- `ReadingProgress`: sem `value` a fração **reflete a rolagem de verdade** — o teste move
  `scrollY` e dispara `scroll`, e assere 0 → 100. Também cobre página que não rola, onde a divisão
  por zero daria `NaN` no atributo;
- `Pagination`: EC-05 assere que os dois extremos ficam `aria-disabled` **e no DOM**, e que o
  tracejado está lá — porque o reflexo é esconder, e esconder muda o layout debaixo do leitor.

**O ativo nunca é distinguido só por cor.** `Header` dá superfície `paper` + borda ao item ativo,
`SideRail` dá caixa com sombra dura, `MobileTabBar` dá marca sobre o ícone. Há teste em cada um
asserindo que o inativo **não** tem o portador de forma — cor sozinha seria o único portador da
informação.

**Armadilha de régua encontrada duas vezes, nas duas por comentário.** O teste de SC-016 reprovou
`ReadingProgress` porque o comentário citava o nome da consulta de movimento reduzido, e um grep de
auditoria acusou `MobileTabBar` porque o comentário citava a diretiva de cliente entre aspas. Nos
dois casos o código estava certo e o **texto** reprovava. As réguas desta feature são greps, então
comentário que cita o proibido reprova igual — vale para hex, para a consulta de movimento e para a
diretiva.

- [X] T020 [US4] Portão 6 da Camada 3 — execução limpa nas onze rotas, em `dev` e em produção
  - Procedimento: `GATES.md` §6. **Camada de risco alto**: o `Header` muda de Client Component
    para Server Component e é composto por **todas** as rotas — é onde hydration mismatch é mais
    provável, e ele **só aparece em produção**, não no `dev`.
  - `Pagination` é exercitada em `/page/2`. `SideRail`, `MobileTabBar`, `Breadcrumb` e
    `ReadingProgress` **não são alcançados por rota nenhuma** nesta feature.
  - Registrar evidência no corpo do commit.
  - **Verificação específica desta camada** (FR-013a): em cada uma das onze rotas, os cinco
    destinos continuam alcançáveis **sem usar a barra de endereços**, em 1280px e em 390px.
    `Header` passa de Client a Server Component nesta tarefa, e nenhum portão automático
    enxergaria a perda de navegação — a página renderiza igual.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`
  - ✅ **Executado em 2026-09-28, os dois canais, nos dois modos. ZERO regressão.**
    **Esta era a camada de maior risco desde a troca de tokens**, por dois motivos: o `Header` é
    composto por `layout.tsx` em **todas** as onze rotas, e ele atravessou a fronteira
    cliente→servidor. Hydration mismatch só aparece em produção, e é exatamente o que este portão
    existe para pegar.
    **Resultado**: `dev` e produção **idênticos entre si e idênticos à base** — nove rotas limpas e
    os mesmos dois achados de linha de base (CORS de terceiro do Disqus; 404 esperado da rota 11).
    **Zero hydration mismatch**, zero achado novo, badge de devtools em `data-error="false"` nas
    onze. Terminal igual à base nos dois modos.
    **O que isto prova**: tirar `"use client"` do `Header` e descer o estado para a ilha não quebrou
    nenhuma rota, e os cinco destinos continuam no HTML servido. `Pagination` passar a renderizar
    com uma única página também não alterou rota nenhuma — verificado antes, `getPaginatedPosts`
    piso `totalPages` em 1 e as rotas que o compõem têm duas páginas.
    **O que isto NÃO prova**: `SideRail`, `MobileTabBar`, `Breadcrumb` e `ReadingProgress` não são
    alcançados por rota nenhuma enquanto `src/app/**` está congelado. Para eles a verificação de
    execução é o Portão 4.
  - 📌 **Anotação para a T046**: `DESIGN.md` §5 atribui `--radius-lg` (18px) a "Card" e diz que
    `--radius-md` (16px) está **sem consumidor inicial**. Medido agora no card `PostCard`, o raio
    desenhado é **16px** — então quem tem consumidor é o `md`, e a atribuição de §5 era suposição
    da T002, não medição. A T046 MUST reconciliar a tabela com o que a camada 4 entregar.


**Checkpoint**: esqueleto navegável completo no catálogo.

---

## Phase 5: User Story 5 — Componentes de conteúdo (P2)

**Goal**: os formatos de listagem desenhados, com dados de exemplo.

**Independent Test**: percorrer no catálogo cada formato com dados de exemplo, nas duas larguras.

**Artboard da camada**: `project/Componentes.dc.html` → `03 · CONTEÚDO` ·
`project/ComponentesMobile.dc.html` → `CONTEÚDO`.

**Depende de**: T008 `CategoryBadge` e T009 `TagPill` (camada 2) — compostos por `PostCard`,
`PostListRow`, `FeaturedPostCard` e `CategoryCard`.

**Todos são Server Components.** Dado de exemplo vive **nas stories**; nenhum componente busca
dado (SC-015). Formas de dado em [data-model.md](./data-model.md) §2.

- [X] T021 [P] [US5] `PostCard` — `src/components/PostCard/PostCard.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `03 · CONTEÚDO`, card **`PostCard`** ·
    `ComponentesMobile.dc.html` → `CONTEÚDO`, card **`PostCard`**.
  - **Estados**: variante de superfície **clara** (sobre `paper`/`canvas`) e **escura** (sobre
    `ink`/`code-bg`) — **as duas são variantes de desenho, não temas** (FR-023, US5/AS-2). Mais:
    **EC-02** título longo (truncado no limite de linhas, sem empurrar o layout nem criar rolagem
    horizontal), **EC-03** resumo ausente (bloco omitido, espaço **colapsa**, sem texto de
    substituição), **EC-04** sem categoria/tag/série (elemento omitido; faixa cai para `hairline`).
  - 🔒 **Contrato congelado**: `{ post }`. `surface` entra **opcional com padrão** `"light"`.
  - **Depende de** T008 (`CategoryBadge`), T009 (`TagPill`).
  - ⚠️ **Contraste**: na variante `dark` o texto sobre `ink`/`code-bg` é branco
    (`--color-white`) — permitido; sobre acento seria `ink`. Verificar as **duas** superfícies
    (FR-041 exige "em toda variante de superfície entregue").
  - **Teste**: EC-03 → o bloco de resumo **não está no DOM** e não sobra lacuna; EC-04 → faixa
    `hairline` quando não há categoria; EC-02 → título truncado sem `scrollWidth` extra.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T022 [P] [US5] `PostListRow` — `src/components/PostListRow/PostListRow.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `03 · CONTEÚDO`, card **`PostListRow`**. Sem card no
    `ComponentesMobile`; 390px sai de `Mobile.dc.html`, seção **`ÚLTIMOS POSTS`**.
  - **Estados**: **com** e **sem** numeração de série (FR-024, US5/AS-1); faixa colorida
    correspondente à categoria; **EC-02** título longo (três linhas na linha da home);
    **EC-03** resumo ausente; **EC-04** sem categoria → faixa `hairline`.
  - **Depende de** T008 (`CategoryBadge`), T009 (`TagPill`) — **composição explícita**: a faixa
    de categoria e as pílulas de tag vêm desses dois, não são redesenhadas aqui.
  - ⚠️ **Contraste**: faixa por categoria — texto sobre `flame`/`sun`/`mint` é **sempre `ink`**.
  - **Teste**: numeração aparece só quando a série é informada; faixa resolve para a cor da
    categoria e para `hairline` na ausência dela.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T023 [P] [US5] `FeaturedPostCard` — `src/components/FeaturedPostCard/FeaturedPostCard.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `03 · CONTEÚDO`, card **`FeaturedPostCard`** ·
    `ComponentesMobile.dc.html` → `CONTEÚDO`, card **`FeaturedPostCard`**.
  - **Estados**: último post com o título em **display sobre a cor de acento** (FR-025);
    **EC-03** resumo ausente.
  - ⚠️⚠️ **PONTO DE MAIOR RISCO DE CONTRASTE DA FEATURE.** Título branco sobre `sun` dá **1.59:1**
    e sobre `mint` **2.34:1** — reprovam **até** o limite relaxado de 3:1, em qualquer tamanho.
    **O título TEM de ser `ink`.** Isto é critério de aceitação da tarefa, verificado pela regra
    `color-contrast` do `addon-a11y` com `test: "error"`, não por inspeção.
  - API **livre** (FR-016 não o lista; nenhuma rota o chama direto).
  - **Teste**: o título resolve para `ink` em **todas** as cores de acento possíveis.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T024 [P] [US5] `CategoryCard` — `src/components/CategoryCard/CategoryCard.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `03 · CONTEÚDO`, card **`CategoryCard`** ·
    `ComponentesMobile.dc.html` → `CONTEÚDO`, card **`CategoryCard`** · contexto em
    `MobileExplorar.dc.html`, seção `CATEGORIAS`.
  - **Estados**: as cinco categorias, cada uma com sua cor fixa; contagem em display; hover; foco.
  - **Depende de** T008 (`CategoryBadge`).
  - ⚠️ **Contraste**: contagem em display sobre a cor da categoria → **`ink`** sobre
    `flame`/`sun`/`mint`.
  - **Teste**: a contagem exibida é a recebida; link real para a categoria.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T025 [P] [US5] `SeriesShelf` — `src/components/SeriesShelf/SeriesShelf.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `03 · CONTEÚDO`, card **`SeriesShelf`** ·
    `ComponentesMobile.dc.html` → `CONTEÚDO`, card **`SeriesShelf`** · contexto em
    `Mobile.dc.html` (`SÉRIE · VIRANDO FULLSTACK`) e `MobileSerie.dc.html` (`NA ORDEM DE LEITURA`).
  - **Estados**: trilha com item **já lido distinguível** dos demais (US5/AS-5); **EC-10** trilha
    com um **único** item (aparece e não quebra).
  - Ordem **crescente**, não por data — série tem começo (lido de `MobileSerie.dc.html`).
  - **Teste**: item `read` é distinguível no DOM; com um único item não quebra; links reais.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T026 [P] [US5] `YearArchive` — `src/components/YearArchive/YearArchive.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `03 · CONTEÚDO`, card **`YearArchive`**. Sem card no
    `ComponentesMobile`; 390px sai de `MobileExplorar.dc.html`, seção **`ARQUIVO POR ANO`**.
  - **Estados**: anos com post; **anos sem post continuam visíveis como hiato** (US5/AS-4) —
    nunca omitidos; **EC-06** um único ano preenchido (aparece, não quebra, **nenhum hiato é
    inventado**).
  - **Teste**: ano com `count: 0` **permanece no DOM** como hiato; com um único ano não há hiato
    fabricado.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T027 [P] [US5] `TilList` — `src/components/TilList/TilList.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `03 · CONTEÚDO`, card **`TilList`**. Sem card no
    `ComponentesMobile`; 390px sai de `Mobile.dc.html`, seção **`ANOTAÇÕES CURTAS`**.
  - **Estados**: lista com várias anotações; lista com uma; lista vazia.
  - **Dado por propriedade, sem origem real** (FR-031b): `{ items: Array<{ lang, term, note }> }`.
    A ligação com a fonte real é trabalho da feature das rotas.
  - **Teste**: renderiza exatamente os itens recebidos; nenhum acesso a rede ou arquivo (SC-015).
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T028 [P] [US5] `Shelf` — `src/components/Shelf/Shelf.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `03 · CONTEÚDO`, card **`Shelf`** ·
    `ComponentesMobile.dc.html` → `CONTEÚDO`, card **`Shelf`** · contexto em
    `MobileSobre.dc.html`, seção **`NA ESTANTE`**.
  - **Estados**: estante cheia; estante com **slot sem livro** → **marcador de vazio, nunca um
    livro inventado** (FR-035, US5/AS-3).
  - **Teste**: `title: null` produz marcador de vazio e **nenhum título inventado aparece no DOM**.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T029 [P] [US5] `Hero` (re-estilização) — `src/components/Hero/Hero.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: **nenhum card de componente**. O nome aparece em `Sistema.dc.html`; a
    apresentação vem do topo de `Main.dc.html` (desktop) e `Mobile.dc.html` (390px).
  - **Estados**: título em display, subtítulo e chamada; as duas larguras.
  - 🔒 **Contrato congelado**: `Hero()` — sem props. Re-estilização apenas.
  - Story e teste **passam a existir** (não existem hoje): Princípio II exige os três artefatos
    também para componente re-estilizado.
  - **Teste**: chamável sem argumento (contrato congelado `Hero()`); o título é um cabeçalho
    real, não texto estilizado.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T030 [P] [US5] `PostContent` (re-estilização) — `src/components/PostContent/PostContent.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: **nenhum card**. Corpo do post em `Post.dc.html` (desktop) e
    `MobilePost.dc.html` (390px).
  - **Estados**: corpo curto; corpo longo com todos os blocos do pipeline MDX (título,
    parágrafo, lista, citação, `InlineCode`, `CodeBlock`); a medida de 65–72 caracteres por
    linha.
  - 🔒 **Contrato congelado**: `{ body }`.
  - **Medida de leitura de 65–72 caracteres** por linha, consumindo o token `--measure-prose`
    criado na T002 — **não** valor avulso dentro do componente (FR-012, Princípio I, SC-004).
  - **EC-13** (condição de ambiente, **só teste**, sem entrada no catálogo — FR-036b): texto
    ampliado a **200%** sem perder conteúdo e **sem criar rolagem horizontal**.
  - ⚠️ **O visual vive em `PostContentView`**, filho sincrono criado na T001 (item 1.5a): a casca
    `PostContent` é Server Component `async` e não renderiza em story. A medida de leitura, os
    estilos de prosa e a story desta tarefa são do **View**; a casca só faz o `await` do
    `evaluate()`. Arquivos: `PostContentView.tsx`, `PostContentView` na story e no teste.
  - **Teste**: a medida resolve para o token; EC-13 a 200%.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T031 [US5] `PostsListing` (re-estilização) — `src/components/PostsListing/PostsListing.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: **nenhum card**. Listagem em `Main.dc.html` e `Mobile.dc.html`.
  - **Estados**: primeira página, página do meio, última página; lista vazia.
  - 🔒 **Contrato congelado**: `{ page: number }`.
  - **Depende de** T021 (`PostCard`) e T018 (`Pagination`) — compõe os dois. **Não é [P]**: entra
    depois de `PostCard` estar entregue.
  - **Teste**: compõe `PostCard` e `Pagination` sem redesenhá-los; `page` fora da faixa não
    quebra; lista vazia não renderiza paginação órfã.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T032 [US5] Portão 6 da Camada 4 — execução limpa nas onze rotas, em `dev` e em produção
  - Procedimento: `GATES.md` §6. **Camada de risco alto pela densidade de rotas**: `PostCard`,
    `PostsListing`, `Hero` e `PostContent` são compostos por `/`, `/page/2`,
    `/categories/<categoria>` e `/posts/<slug>`. `PostListRow`, `CategoryCard`, `SeriesShelf`,
    `YearArchive`, `TilList` e `Shelf` **não são alcançados por rota nenhuma** nesta feature.
  - Registrar evidência no corpo do commit.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`
  - ✅ **Executado em 2026-09-28, os dois canais, nos dois modos. ZERO regressão.**
    A camada com mais componentes **alcançados por rota** de toda a feature: `PostCard`,
    `FeaturedPostCard`, `Hero`, `PostContent` e `PostsListing` são compostos por `/`, `/page/2`,
    `/categories/*`, `/tags/*`, `/series/*` e `/posts/<slug>`.
    **Resultado**: `dev` e produção **idênticos entre si e idênticos à base** — nove rotas limpas e
    os mesmos dois achados de linha de base. Zero achado novo, zero hydration mismatch. Terminal
    igual à base nos dois modos.
    **O que isto prova, e é o ponto**: duas divisões casca/View foram feitas nesta camada
    (`PostContent` → `PostContentView` e `PostsListing` → `PostsListingView`), as duas mexendo em
    componentes que TODAS as listagens compõem. A saída servida não mudou.


**Checkpoint**: o miolo do blog está no catálogo.

---

## Phase 6: User Story 6 — Dentro do post (P3)

**Goal**: a experiência de leitura completa no catálogo.

**Independent Test**: percorrer no catálogo cada componente da leitura, incluindo o estado
"copiado" e o sumário recolhido e aberto.

**Artboard da camada**: `project/Componentes.dc.html` → `04 · DENTRO DO POST` ·
`project/ComponentesMobile.dc.html` → `DENTRO DO POST` · contexto em `Post.dc.html` e
`MobilePost.dc.html`.

**Camada com a maior densidade de Client Components**: 3 dos 6 da feature.

- [X] T033 [P] [US6] `CodeBlock` + `CodeBlock/CopyButton` — `src/components/CodeBlock/CodeBlock.tsx`, `CopyButton.tsx`, `CodeBlock.stories.tsx`, `CopyButton.stories.tsx`, `CodeBlock.test.tsx`, `CopyButton.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `04 · DENTRO DO POST`, card **`CodeBlock`** ·
    `ComponentesMobile.dc.html` → `DENTRO DO POST`, card **`CodeBlock`**.
  - **Os dois na mesma tarefa**: `CopyButton` é sub-componente de `CodeBlock` e a fronteira entre
    eles é o entregável. Separar deixaria uma das metades sem portão verde.
  - ⚠️ **`CodeBlock` é `async`** (destaca com `shiki`) e **não renderiza em story** — o React recusa
    componente async no cliente. Aplicar o padrão da T001 (item 1.5a): dividir em casca `async`
    que só faz o `await codeToHtml()` e **`CodeBlockView` sincrono com todo o visual** — cabeçalho,
    nome do arquivo, linguagem, ação de copiar, estado "copiado", dica de rolagem em 390px. A story
    é do **View** e recebe um `html` já destacado como dado de exemplo. Sem isso o Portão 4 desta
    tarefa é inexecutável, não vermelho.
  - **Fronteira JÁ CORRETA hoje — preservar, não "corrigir"**: `CodeBlock` é **Server Component**
    e o cliente é só o `CopyButton` (medido, R11). É o precedente que a feature repete no
    `Header`/`SearchTrigger`.
  - **Estados**: cabeçalho com nome do arquivo, linguagem e ação de copiar; estado **"copiado"**
    com retorno visível (FR-026, US6/AS-2); em 390px, linha longa → corpo rola na horizontal com
    **dica de rolagem no pé**, **sem criar rolagem horizontal na página** (US6/AS-3, SC-009);
    **EC-07** sem nome de arquivo ou sem linguagem → o cabeçalho **omite o campo ausente**,
    mantém a ação de copiar, **nenhum rótulo de substituição é inventado**.
  - **EC-08** (condição de ambiente, **só teste**, sem entrada no catálogo — FR-036b): cópia
    **negada** pelo navegador → o componente **NÃO** entra em estado "copiado" e **não lança erro**
    ao leitor.
  - **`navigator.clipboard` não existe em jsdom por padrão** — o teste precisa de dublê, e é o
    dublê que torna EC-08 testável. Caso de borda declarado da spec, não cenário impossível.
  - **Teste de interação**: clique → estado "copiado" com retorno visível; EC-08 pelo dublê.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T034 [P] [US6] `Toc` — `src/components/Toc/Toc.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `04 · DENTRO DO POST`, card **`Toc`** ·
    `ComponentesMobile.dc.html` → `DENTRO DO POST`, card **`Toc`** · contexto em
    `MobilePost.dc.html`, seção **`SUMÁRIO`**.
  - 🔒 **Contrato congelado**: `{ items }`.
  - **Client Component** (já é hoje): `useState` do recolhido/aberto no celular **e** item ativo
    acompanhando a rolagem no desktop — estado + API de browser.
  - **Estados**: desktop **fixo na lateral**; celular **barra recolhível**, disponível
    **recolhida e aberta** (FR-027, US6/AS-4); item ativo × inativo; **EC-09** com um **único**
    título renderiza normalmente, e **sem nenhum título o componente NÃO é renderizado** — nunca
    uma casca vazia.
  - **Depende de** T006 (`IconButton`) — **composição explícita**: o gatilho de recolher/abrir no
    celular é um `IconButton`, não um botão redesenhado aqui.
  - **Teste de interação**: celular recolhido → aberto; desktop, o **item ativo muda com a
    rolagem**; `items: []` → nada renderizado.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T035 [P] [US6] `CopyLinkButton` — `src/components/CopyLinkButton/CopyLinkButton.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: sem card próprio; é a terceira ação do card **`ShareButtons`**
    (`Componentes.dc.html` → `04 · DENTRO DO POST`).
  - 🔒 **Contrato congelado**: `{ url }`.
  - **Client Component** (já é hoje): `navigator.clipboard` + estado `copied`.
  - **Estados**: repouso, **copiado**, hover, foco.
  - **EC-08** (só teste): cópia negada → não entra em "copiado", não lança erro. Dublê de
    `navigator.clipboard` em jsdom.
  - **Vem ANTES de `ShareButtons`** (T036), que o compõe.
  - **Teste de interação**: clique → "copiado"; EC-08 pelo dublê.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T036 [US6] `ShareButtons` — `src/components/ShareButtons/ShareButtons.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `04 · DENTRO DO POST`, card **`ShareButtons`** ·
    `ComponentesMobile.dc.html` → `DENTRO DO POST`, card **`ShareButtons`**.
  - 🔒 **Contrato congelado**: `{ url, title }`.
  - **Depende de** T035 (`CopyLinkButton`). **Não é [P]**.
  - **Estados**: as **três** ações, cada uma com ícone **e o nome da rede escrito** (FR-028,
    US6/AS-5) — GitHub sobre fundo `ink`, LinkedIn sobre `brand-linkedin` `#0A66C2`, e a terceira
    com ícone de link e o texto "Compartilhar o link".
  - **Server Component — recusa deliberada da diretiva.** GitHub e LinkedIn são `<a href>` reais,
    que não precisam de JavaScript. A única ação que precisa é copiar o link, e ela **já é** a
    ilha `CopyLinkButton`. Marcar `ShareButtons` como cliente arrastaria dois links estáticos para
    o bundle sem nada em troca.
  - **Os SVG oficiais de GitHub e LinkedIn entram aqui**: `lucide-react` tem 2118 ícones e
    **zero marcas** (R2, verificado). O ícone de link vem do lucide (FR-028). Os SVG de marca são
    **caminhos sem cor própria**, então nenhum hex literal entra no componente — `brand-linkedin`
    é token (FR-001a) e SC-004 régua 1 continua devolvendo vazio.
  - ⚠️ **Contraste**: branco sobre `ink` (18.69) e sobre `#0A66C2` (5.69) — os dois passam.
  - **Teste**: três ações presentes, cada uma com nome de rede em texto (não só ícone); os dois
    primeiros são `<a href>`; alvo ≥44px.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [X] T037 [P] [US6] `Callout` — `src/components/Callout/Callout.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `04 · DENTRO DO POST`, card **`Callout`**. Sem card no
    `ComponentesMobile`; 390px sai de `MobilePost.dc.html`.
  - **Estados**: os **três** tipos — **nota do autor**, **citação**, **item de checklist**
    (FR-029, US6/AS-6).
  - ⚠️ **Contraste**: cada tipo tem superfície própria; texto sobre acento é **`ink`**.
  - **Teste**: os três tipos produzem marcação semântica distinta (`<blockquote>` para citação).
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T038 [P] [US6] `AuthorCard` — `src/components/AuthorCard/AuthorCard.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `04 · DENTRO DO POST`, card **`AuthorCard`**. Sem card
    no `ComponentesMobile`; 390px em `MobilePost.dc.html`.
  - **Estados**: com e sem contagem de palavras.
  - **Depende de** T007 (`Avatar`).
  - **Tempo de leitura e contagem de palavras são recebidos por propriedade, não calculados**
    aqui (Assumptions, SC-015).
  - **Teste**: `wordCount` ausente omite o bloco sem deixar lacuna; tempo de leitura e
    contagem são exibidos como recebidos, nunca calculados (SC-015); compõe `Avatar`.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T039 [P] [US6] `PrevNext` — `src/components/PrevNext/PrevNext.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `04 · DENTRO DO POST`, card **`PrevNext`**. Sem card no
    `ComponentesMobile`; 390px em `MobilePost.dc.html`.
  - **Estados**: com os dois vizinhos; só anterior; só próximo (primeiro e último post da lista).
  - ⚠️ **Contraste**: o "próximo" usa fundo **`ink`** com sombra no acento → texto branco sobre
    `ink` dá 18.69, passa.
  - **Teste**: ausência de vizinho omite o lado correspondente sem deixar lacuna; links reais.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T040 [P] [US6] `LikeCommentBar` — `src/components/LikeCommentBar/LikeCommentBar.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `04 · DENTRO DO POST`, card **`LikeCommentBar`**. Sem
    card no `ComponentesMobile`; 390px em `MobilePost.dc.html`.
  - **Estados**: contagens zeradas; contagens com valor.
  - **Server Component — recusa deliberada da diretiva.** Os números são **dado de leitura**, não
    controle. FR-031b proíbe persistir, escrever em serviço e absorver o embed do Disqus — sem
    handler criado localmente, sem diretiva.
  - **`DisqusComments` permanece intocado** (SC-013): a barra de reações é componente **separado**
    e **não** absorve o embed de terceiros.
  - **Teste**: as contagens exibidas são exatamente as recebidas; nenhuma escrita, nenhuma rede.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T041 [US6] Portão 6 da Camada 5 — execução limpa nas onze rotas, em `dev` e em produção
  - Procedimento: `GATES.md` §6. **`/posts/<slug>` é a rota mais densa em Client Components** da
    feature: `Toc`, `CodeBlock`, `CopyButton`, `CopyLinkButton`, `ShareButtons` e `PostContent`
    estão todos nela. Procurar ativamente hydration mismatch, `"use client"` faltando, import de
    módulo `server-only` em Client Component e Client Component `async`.
  - `Callout`, `AuthorCard`, `PrevNext` e `LikeCommentBar` **não são alcançados por rota nenhuma**.
  - Registrar evidência no corpo do commit.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

**Checkpoint**: a leitura completa está no catálogo.

---

## Phase 7: User Story 7 — Busca, vazio e rodapé (P3)

**Goal**: fechar o inventário.

**Independent Test**: percorrer no catálogo a busca fechada, com resultado e vazia, o estado vazio
e o rodapé, nas duas larguras.

**Artboard da camada**: `project/Componentes.dc.html` → `05 · BUSCA, VAZIO E RODAPÉ` ·
`project/ComponentesMobile.dc.html` → `BUSCA, VAZIO E RODAPÉ`.

**Todos são Server Components, exceto o nomeado** (`contracts/components.md`): `CommandPalette` é
**C** por estado do campo de busca e escuta de teclado.

- [ ] T042 [P] [US7] `EmptyState` — `src/components/EmptyState/EmptyState.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `05 · BUSCA, VAZIO E RODAPÉ`, card **`EmptyState`** ·
    `ComponentesMobile.dc.html` → `BUSCA, VAZIO E RODAPÉ`, card **`EmptyState`** · contexto em
    `MobileSerie.dc.html`, seção `PRÓXIMA SÉRIE` ("o card vazio é um convite").
  - **Estados**: com e sem dica (`hint`).
  - **Contorno tracejado + texto de convite. MUST NOT exibir "0 resultados" nem equivalente**
    (FR-032, US7/AS-3).
  - **Vem ANTES de `CommandPalette`** (T044), que o compõe no estado vazio.
  - **Teste**: o DOM **não contém** "0 resultados" nem equivalente, em nenhum estado.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T043 [P] [US7] `Footer` (re-estilização) — `src/components/Footer/Footer.tsx`, `.stories.tsx`, `.test.tsx`
  - **Artboard**: `Componentes.dc.html` → `05 · BUSCA, VAZIO E RODAPÉ`, card **`Footer`** ·
    `ComponentesMobile.dc.html` → `BUSCA, VAZIO E RODAPÉ`, card **`Footer`**.
  - 🔒 **Contrato congelado**: `Footer()` — sem props.
  - **Estados**: três colunas no desktop; coluna única em 390px; atalho do design system.
  - Os SVG oficiais de GitHub e LinkedIn valem aqui também (lucide não tem marcas, R2).
  - **Teste**: links reais; alvo ≥44px em cada um.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T044 [US7] `CommandPalette` e a ligação com o `SearchTrigger` — `src/components/CommandPalette/CommandPalette.tsx`, `.stories.tsx`, `.test.tsx`, `src/components/Header/SearchTrigger.tsx`
  - **Artboard**: `Componentes.dc.html` → `05 · BUSCA, VAZIO E RODAPÉ`, card **`CommandPalette`**
    (com o `<kbd>⌘K</kbd>`) · `ComponentesMobile.dc.html` → `BUSCA, VAZIO E RODAPÉ`, card
    **`CommandPalette`** · contexto em `MobileExplorar.dc.html`, seção `BUSCA`.
  - **Depende de** T010 (`Kbd`) e T042 (`EmptyState`) — **composição explícita**: o atalho exibido
    é um `Kbd`; o estado vazio é um `EmptyState`. **Não é [P]**.
  - **A ligação com o `SearchTrigger` entra NESTA tarefa**, não na T014. O `SearchTrigger` passa a
    renderizar a palette, e essa mudança é o que fecha a camada 3. Está aqui porque os portões 5 e
    6 precisam ficar verdes ao fim de cada tarefa (Portão 8): a alteração no consumidor e a
    criação do componente não podem ficar em tarefas diferentes.
  - **Estados**: **fechada**, **com resultado**, **vazia** (FR-031, US7/AS-1); em 390px abre como
    **folha de tela cheia** com fechamento por **"×" em lugar da tecla de escape** (US7/AS-2);
    **EC-11** índice vazio ou ausente → cai no estado vazio do `EmptyState`, com texto de convite
    e **sem a frase "0 resultados"**.
  - **Client Component**: estado do campo de busca + escuta de teclado (`⌘K`, `esc`). `open` é
    **controlado por prop** para a story poder mostrar os três estados de forma determinística —
    sem isso, FR-031 não seria demonstrável no catálogo.
  - 🚫 **MUST NOT importar `src/lib/search-index.ts`** — `getSearchIndex()` chama `getAllPosts()`,
    que lê o sistema de arquivos, e import de módulo de servidor dentro de Client Component
    **reprova o Portão 6** (FR-031a). **MAY** importar a função **pura** `searchIndex(index,
    query)` de `src/lib/search.ts`. Importar não é alterar, logo não fere SC-011.
  - **O índice chega por propriedade**, pelo caminho legal único: `Header({ index })` → `SearchTrigger` → `CommandPalette` (FR-016a). Nenhum componente busca dado (SC-015).
  - **Teste de interação**: `⌘K` abre; `esc` fecha no desktop; `×` fecha em 390px; busca com
    resultado **e** vazia; EC-11 com índice vazio.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T045 [US7] Portão 6 da Camada 6 — execução limpa nas onze rotas, em `dev` e em produção
  - Procedimento: `GATES.md` §6. **O que esta camada exercita**: `Footer`, composto por **todas**
    as rotas. `CommandPalette` e `EmptyState` **não são alcançados por rota nenhuma**.
  - **Verificação específica**: `/search` continua funcionando com o `SearchBox` **antigo** e
    visual antigo. Isso é **esperado, não defeito** — `src/app/**` está fora de escopo e a
    substituição pelo `CommandPalette` pertence à feature das rotas (FR-015, SC-013).
  - Registrar evidência no corpo do commit.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

**Checkpoint**: inventário fechado — 36 componentes + 2 sub-componentes.

---

## Phase 8: Polish & Cross-Cutting

- [ ] T046 Esvaziar e remover o bloco `/* LEGADO */` e a seção de valores provisórios — `src/app/globals.css`, `DESIGN.md`
  - **Artboard**: nenhum. Fechamento de dívida declarada.
  - O bloco `/* LEGADO */` criado na T002 **só encolhe**: cada tarefa de componente removeu os
    órfãos que aquele componente usava. Esta tarefa exige o bloco **vazio** e o **remove do
    arquivo** (FR-002b, SC-005a).
  - A seção nomeada de **valores provisórios** de `DESIGN.md` (FR-046b) também precisa estar
    **vazia**. Ela existe justamente para que esta tarefa possa cobrá-la — é a contrapartida de o
    escopo ter prevalecido sobre o portão.
  - Token legado **sem** uso é violação e sai; enquanto o bloco existia, token legado **em** uso
    não contava como violação de FR-007 nem de SC-004.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T047 Auditoria por grep dos critérios verificáveis por comando — sem arquivo de produção
  - **Artboard**: nenhum.
  - **SC-004 régua 1**: `grep -rnE '#[0-9a-fA-F]{3,8}' src/components/` → **vazio**, sem exceção.
    `brand-linkedin` é token, o branco é `--color-white`, e os SVG de marca são caminhos sem cor.
  - **SC-004 régua 2**: `grep -rnE 'border(-[0-9]|-\[)' src/components/` → **vazio**. Só `border-2`
    é sancionado (FR-007). É aqui que a divergência **D-B** (34 bordas de 1.5px no mock) é cobrada.
  - **SC-005**: nenhum dos 19 tokens aubergine declarado ou consumido; nenhum valor novo coincide
    com um valor antigo sob nome diferente (renomeio disfarçado).
  - **SC-016**: `grep -rn 'prefers-reduced-motion' src/components/` → **vazio** (ponto único é o
    `globals.css`); nenhuma dependência de animação no `package.json`.
  - **SC-013**: `git diff --stat -- src/components/SearchBox src/components/DisqusComments` →
    **zero linha alterada**.
  - **SC-011/SC-014**: `git diff --name-only -- src/app/ src/lib/ src/content/` → **exatamente**
    `src/app/globals.css` e `src/app/layout.tsx`.
  - **SC-001**: 36 componentes, cada um com `.tsx`, `.stories.tsx` e `.test.tsx` na própria pasta.
  - **Princípio I, bidirecionalidade** (CHK040): comparar o conjunto de nomes declarados em `:root`
    de `src/app/globals.css` com o conjunto documentado em `DESIGN.md`. As **duas** diferenças MUST
    ser vazias — token sem entrada é violação, entrada sem token também. Exceções nomeadas: a seção
    "Removidos" que SC-005 autoriza e a de "Cores de marca e de sistema".
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

- [ ] T048 Portão 6 final da feature — as onze rotas, em `dev` e em `build && start`
  - **Artboard**: nenhum. É o portão exigido "uma vez mais ao fim da feature" (§Cadência).
  - **Subir em desenvolvimento** e abrir as onze rotas, nesta ordem:

    ```bash
    npm run dev
    ```

    | # | Rota |
    |---|---|
    | 1 | `/` |
    | 2 | `/page/2` |
    | 3 | `/posts/<slug>` |
    | 4 | `/categorias` |
    | 5 | `/categories/<categoria>` |
    | 6 | `/tags` |
    | 7 | `/tags/<tag>` |
    | 8 | `/series/<serie>` |
    | 9 | `/search` |
    | 10 | `/sobre` |
    | 11 | rota inexistente (ex.: `/rota-que-nao-existe`) → `not-found` |

  - **Repetir as mesmas onze em produção** — **hydration mismatch só aparece aqui**:

    ```bash
    npm run build && npm start
    ```

  - **Conferir terminal E console do navegador** em cada rota. Lista **aberta**: **qualquer** erro
    e **qualquer** aviso novo reprovam, nos dois canais, **mesmo que a página renderize**. O
    overlay de desenvolvimento do Next.js conta como canal de erro. Única tolerância: a lista
    **fechada** de `GATES.md` §4.
  - **Procurar ativamente** os casos de maior risco: hydration mismatch; `"use client"` faltando
    em componente com hook ou manipulador; import de módulo `server-only` dentro de Client
    Component; Client Component `async`; uso de API de browser durante render no servidor.
  - **Ambiente**: Chromium **sem extensão ativa** (perfil limpo ou janela sem extensões) —
    extensão injeta aviso próprio e contamina a leitura.
  - **Comparar por identidade** (arquivo, linha, texto) contra a base de `GATES.md` §3, nunca por
    contagem.
  - **Registrar a evidência no corpo do commit**: quais rotas passaram, em `dev` e em produção, e
    qualquer aviso encontrado. Portão manual sem registro é afirmação de quem implementou, que a
    constituição não aceita como verificação.
  - **Rodar o `quickstart.md` §5 inteiro**: os dezessete critérios de sucesso + FR-011a + R14.
  - **Portões**: `npm run lint && npm run typecheck && npm run test && npx vitest run --project storybook && npm run build`

---

## Dependencies & Execution Order

### Ordem das fases

```text
T001 (Setup/US2) ──► T002,T003,T004 (Foundational/US1) ──► Camadas 2–6 ──► Polish
     BLOQUEANTE           BLOQUEANTE
```

- **T001** bloqueia **tudo**: dois portões não têm comando antes dela, e sem comando nenhuma
  tarefa consegue comprovar que passou.
- **T002 → T003 → T004** em série. T003 é bloqueante para a primeira tarefa de componente: sem
  pseudo-estado forçado, a entrada de hover de FR-018a não existe.
- **Camadas 2–6 em série entre si** (dependência de composição), mas com paralelismo **dentro**
  de cada uma.
- Nenhuma camada começa com a anterior vermelha (Portão 8).

### Dependências de composição — explícitas

| Tarefa | Depende de | O que compõe |
|---|---|---|
| T022 `PostListRow` | T008 `CategoryBadge`, T009 `TagPill` | faixa de categoria e pílulas de tag |
| T021 `PostCard` | T008 `CategoryBadge`, T009 `TagPill` | idem |
| T024 `CategoryCard` | T008 `CategoryBadge` | selo da categoria |
| T031 `PostsListing` | T021 `PostCard`, T018 `Pagination` | lista + paginação |
| T034 `Toc` (celular) | T006 `IconButton` | gatilho de recolher/abrir |
| T036 `ShareButtons` | T035 `CopyLinkButton` | a terceira ação é a ilha cliente |
| T038 `AuthorCard` | T007 `Avatar` | retrato do autor |
| T044 `CommandPalette` | T010 `Kbd`, T042 `EmptyState` | atalho exibido + estado vazio |
| T044 `CommandPalette` | T014 `Header/SearchTrigger` | a ligação fecha **nesta** tarefa |

### Paralelismo real por camada

- **Camada 2**: T005–T012 são **todas [P]** — oito arquivos distintos, nenhuma composição entre
  elas.
- **Camada 3**: T015–T019 são [P] entre si. **T014 (`Header`) não é [P]**: mexe em componente do
  contrato congelado e muda a fronteira cliente/servidor.
- **Camada 4**: T021–T030 são [P]. **T031 (`PostsListing`) não é [P]** — depende de T021.
- **Camada 5**: T033, T034, T035, T037–T040 são [P]. **T036 (`ShareButtons`) não é [P]** —
  depende de T035.
- **Camada 6**: T042 e T043 são [P]. **T044 não é [P]** — depende de T010, T042 e T014.
- **As tarefas de Portão 6** (T004, T013, T020, T032, T041, T045, T048) **nunca são [P]**: são
  manuais, fecham a camada e exigem que tudo antes esteja verde.

---

## Parallel Example: Camada 2 (Primitivos)

```bash
# Depois de T003 fechar, as oito podem sair juntas:
T005 Button        T006 IconButton   T007 Avatar     T008 CategoryBadge
T009 TagPill       T010 Kbd          T011 InlineCode T012 Container
```

---

## Implementation Strategy

### MVP (US1 + US2)

1. **T001** — portões executáveis e base estabilizada.
2. **T002–T004** — tokens, fontes, `DESIGN.md`, Portão 6.
3. **PARAR E VALIDAR**: renderizar qualquer componente existente sem alterá-lo e confirmar que
   herda a nova paleta e a nova tipografia (US1/Independent Test). O blog fica visualmente
   inconsistente — **isso é esperado**.

### Entrega incremental

Cada camada é um incremento testável sozinho, pelo catálogo, **sem abrir nenhuma rota**:

| Fase | Entrega | Testável por |
|---|---|---|
| US2 + US1 | portões + fundação | rotas atuais renderizando com a paleta nova |
| US3 | kit de primitivos | catálogo, 8 componentes |
| US4 | esqueleto navegável | catálogo, 6 componentes + 1 ilha |
| US5 | miolo do blog | catálogo, 11 componentes |
| US6 | leitura completa | catálogo, 8 componentes + 1 sub |
| US7 | inventário fechado | catálogo, 3 componentes |

---

## Notas

- **[P]** = arquivos diferentes, sem dependência pendente.
- **🔒** = prop do contrato mínimo de FR-016, consumida por `src/app/**`: não renomear, não
  remover, não tornar obrigatória, não estreitar o tipo. Prop nova entra **opcional com padrão**.
- **⚠️ Contraste** marca as tarefas em que o par cor/superfície é **item de aceitação**, não
  sugestão. A régua é `color-contrast` do `addon-a11y` com `test: "error"`, mais a tabela de
  `DESIGN.md` para os pares que o addon não alcança.
- **Se uma API do contrato congelado parecer precisar mudar**: a resposta é **adicionar prop
  opcional com padrão**, nunca quebrar. Alterar o call site alteraria `src/app/**`, que SC-011
  congela — não é saída disponível. Se for genuinamente impossível, a feature **para** e a spec é
  emendada; a rota não muda em silêncio (plan.md §4).
- **`SearchBox` e `DisqusComments` terminam com zero linha alterada** (SC-013). `SearchBox` fica
  em disco porque `src/app/search/page.tsx` o importa e as rotas estão congeladas.
- Commit por tarefa, com os portões verdes registrados. Nas tarefas de Portão 6, a evidência das
  onze rotas vai **no corpo do commit**.
