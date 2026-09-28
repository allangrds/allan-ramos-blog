# Phase 0 — Research: Port dos componentes do redesign

**Feature**: `002-redesign-components` | **Data**: 2026-09-26 | **Spec**: [spec.md](./spec.md)

Cada item abaixo foi verificado por execução ou leitura real, não por suposição. Onde a
verificação mudou o que a spec dizia, a divergência está registrada como tal.

---

## R1 — As três famílias tipográficas

**Decisão**: Archivo Black (display), Space Grotesk (corpo), JetBrains Mono (mono),
carregadas por `next/font/google` em `src/app/layout.tsx`.

**Pesos a solicitar** — lidos do `<link>` do artboard `Sistema`:

| Família | Papel | Pesos |
|---|---|---|
| Archivo Black | display, micro-cap em caixa alta | **400 apenas** |
| Space Grotesk | corpo, título de card | 400, 500, 600, 700 |
| JetBrains Mono | data, tag, código, métrica | 400, 500, 700 |

**Rationale**: FR-004a já fixava Archivo Black e mandava ler as outras duas dos artboards.
O artboard declara literalmente
`family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700`
e o corpo do documento usa `font-family: "Space Grotesk", sans-serif`.

**Consequência para FR-004a**: Archivo Black tem só o peso 400, confirmado. Como
`--text-heading-md` é "21px / Grotesk 700" e `--text-micro-cap` é "11px / Archivo Black",
o 700 do sistema vem de Space Grotesk, nunca de Archivo Black. Nenhum token de display
pode pedir 700/800 — isso levaria o navegador a sintetizar negrito.

**Alternativas descartadas**: `next/font/local` com arquivos versionados no repo — mais
controle de subset, mas a spec (Dependencies) já fixa "o provedor de fontes já usado no
projeto", que é `next/font/google`.

---

## R2 — Ícones: lucide-react não tem marcas (verificado)

**Decisão**: `lucide-react@^1.48.0` para todo ícone funcional; GitHub e LinkedIn como SVG
oficial de marca, inline, num componente próprio.

**Verificação**: baixei o pacote (`npm pack lucide-react@1.48.0`) e listei
`dist/esm/icons/*.mjs`:

- **2118 ícones** disponíveis.
- **Zero ícones de marca**: `github`, `linkedin`, `twitter` e `facebook` não existem.
- `peerDependencies: react ^16.5.1 || ^17 || ^18 || ^19` — compatível com React 19.2.8.

Todos os ícones funcionais que o inventário pede existem e foram conferidos um a um:
`search`, `link`, `link-2`, `copy`, `check`, `menu`, `x`, `house`, `tag`, `tags`, `layers`,
`user`, `chevron-left`, `chevron-right`, `arrow-left`, `arrow-right`, `arrow-up-right`,
`share-2`, `heart`, `message-circle`, `book`, `book-open`, `clock`, `calendar`, `list`,
`panel-left`, `external-link`, `corner-down-right`.

**Consequência**: a cláusula de escape de FR-028 **é o caminho real, não hipótese**. As duas
marcas entram como `BrandIcon` (ou dois SVG inline dentro de `ShareButtons`/`Footer`), com o
path oficial de cada marca. Isso também vale para o `Footer`, que lista GitHub e LinkedIn.

**Divergência assumida do artboard**: os artboards dizem "ícone pintado, nunca contornado"
(IconButton) e "ícone pintado (sem contorno)" (ShareButtons). Lucide é biblioteca de
**traço**. A decisão de adotar lucide foi tomada pelo autor com esse conflito explicitado, e
FR-019/FR-028 foram reescritos na clarificação. Os ícones vão divergir dos artboards nesse
aspecto — é escolha registrada, não defeito a corrigir.

**Alternativas descartadas**: componente `Icon` com sprite próprio (recomendado na
clarificação, recusado pelo autor); SVG inline solto por componente (duplicação).

---

## R3 — Contraste: a regra da spec está permissiva demais

**Verificação**: calculei WCAG 2.x para todos os pares relevantes da paleta.

**Passam com folga** — nenhum risco:

| Par | Ratio | |
|---|---:|---|
| ink sobre flame | 5.87 | ✅ 4.5 |
| ink sobre sun | 11.74 | ✅ 4.5 |
| ink sobre mint | 8.00 | ✅ 4.5 |
| ink sobre canvas | 16.41 | ✅ |
| ink sobre paper | 18.24 | ✅ |
| ink sobre sand | 14.62 | ✅ |
| ink sobre blush | 16.67 | ✅ |
| ink-soft sobre canvas | 10.67 | ✅ |
| ink-soft sobre paper | 11.86 | ✅ |
| ink-blue sobre canvas | 5.82 | ✅ |
| ink-blue sobre paper | 6.47 | ✅ |
| ink-blue sobre sand | 5.19 | ✅ |
| branco sobre ink | 18.69 | ✅ |
| branco sobre ink-blue | 6.63 | ✅ |
| branco sobre LinkedIn `#0A66C2` | 5.69 | ✅ |
| `#F2E9D8` sobre code-bg | 14.81 | ✅ |

**Reprovam** — e um deles a spec permite hoje:

| Par | Ratio | 4.5:1 | 3:1 (≥24px) |
|---|---:|---|---|
| branco sobre flame | 3.18 | ❌ | ✅ |
| **branco sobre sun** | **1.59** | ❌ | **❌** |
| **branco sobre mint** | **2.34** | ❌ | **❌** |
| ink sobre code-bg | 1.05 | ❌ | ❌ |

**Decisão**: a regra "texto branco é permitido apenas a partir de 24px em peso display, ou
sobre ink e ink-blue" (FR-008) **é permissiva demais e precisa ser estreitada**. Branco sobre
`sun` (1.59) e sobre `mint` (2.34) reprova até o limite relaxado de 3:1. A regra operacional
correta:

> Branco só sobre `ink`, `ink-blue`, `code-bg` e `#0A66C2`. Sobre `flame`, `sun` e `mint` o
> texto é **sempre `ink`**, em qualquer tamanho. Branco sobre `flame` é aceitável apenas
> ≥24px e nunca é necessário — use `ink`.

**Onde isso morde no inventário**: `FeaturedPostCard` ("título em display sobre o acento",
FR-025) e `CategoryBadge` (cinco cores). Nos dois, o texto **MUST** ser `ink`. Se alguém puser
branco no título do FeaturedPostCard sobre `sun` ou `mint`, o `addon-a11y` reprova — e está
certo em reprovar.

**Ação**: virou item de aceitação por camada no plano (§ Verificação de contraste), não
sugestão.

---

## R4 — Portão 4 não roda hoje: falta o browser do Playwright

**Verificação**: `npx vitest run --project storybook` falha antes de executar um único teste:

```text
Test Files  (11)
     Tests  no tests
    Errors  1 error
error during close Error: browserType.launch: Executable doesn't exist at
/Users/.../ms-playwright/chromium_headless_shell-1234/chrome-headless-shell
Looks like Playwright was just installed or updated.
Please run the following command to download new browsers:
    npx playwright install
```

**Decisão**: `npx playwright install chromium` é o **primeiro passo bloqueante** da tarefa de
infraestrutura, antes de qualquer script ou componente. A constituição e a spec tratavam o
Portão 4 como "falta um script"; na verdade falta o binário do navegador. Sem ele o portão não é
só vermelho, é inexecutável.

**Incógnita que a tarefa 1 resolve**: as 11 stories existentes são descobertas (o projeto vê
11 arquivos), mas nunca rodaram. Se alguma reprovar depois de `a11y.test` virar `"error"`
(FR-043c), consertá-la entra na tarefa 1 — é pré-requisito do baseline verde, não dívida para
o fim.

---

## R5 — Baseline dos outros portões (medido)

| Portão | Comando | Estado hoje |
|---|---|---|
| 1 lint | `npx eslint` | **1 warning pré-existente** (ver abaixo) |
| 2 typecheck | `npx tsc --noEmit` | ✅ exit 0, zero erro |
| 3 unit | `npx vitest run --project unit` | ✅ 4 arquivos, 13 testes |
| 4 storybook | `npx vitest run --project storybook` | ❌ inexecutável (R4, diagnóstico refinado em R13) |
| 5 build | `npm run build` | ✅ verde, **zero aviso de código** (medido em R12) |

**O warning de lint é intocável**:

```text
src/lib/mdx.tsx
  98:5  warning  Unused eslint-disable directive
       (no problems were reported from 'jsx-a11y/alt-text')
```

Está em `src/lib/**`, congelado por SC-011 e pela seção Out of Scope. O Portão 1 pede "zero erro
e zero warning **novo**" — então esse warning é a **linha de base declarada**, e "novo"
significa "além deste". A tarefa 1 registra a contagem exata (1) para que a comparação seja
objetiva em toda tarefa seguinte.

**Ruído adicional, não bloqueante**: todo `vitest run` imprime
`Your Vite config uses features that are unsupported by configLoader: 'native'` porque
`vitest.config.ts` usa ESM e é carregado como CJS. Não é erro nem warning de lint/teste.
Corrigir exigiria `"type": "module"` no `package.json` (efeito colateral amplo num app Next)
ou renomear para `vitest.config.mts`. **Decisão: não mexer** — fora do escopo desta feature e
não reprova nenhum portão. Fica registrado para não ser confundido com regressão.

---

## R6 — Onde rodam os testes de componente colocados

**Contexto**: a clarificação fixou dois níveis de teste (story + comportamento) e colocação na
pasta do componente (`src/components/<Nome>/<Nome>.test.tsx`). O projeto `unit` atual roda em
`environment: 'node'` e inclui apenas `tests/unit/**/*.test.ts` — não renderiza React e não
enxerga `.tsx`.

**Decisão**: adicionar um **terceiro project** ao `vitest.config.ts`, chamado `components`:

```text
name: 'components'
environment: 'jsdom'
include: ['src/components/**/*.test.tsx']
setupFiles: ['./vitest.setup.components.ts']   # @testing-library/jest-dom
alias: { '@': src }
```

Dependências novas: `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.

**Rationale**: é o caminho convencional e o que menos mexe no que já funciona. O project `unit`
continua em `node` servindo os 4 testes de lógica de `src/lib` sem ganhar peso; o project
`storybook` continua sendo o do navegador real e da a11y. Cada project tem um propósito e um
ambiente, sem project fazendo duas coisas.

**Alternativas descartadas**:

- *Trocar `unit` para jsdom e incluir `.tsx` nele* — arrastaria os 4 testes de lógica de `node`
  para `jsdom` sem motivo, e apagaria a distinção entre teste de lógica e de componente.
- *Rodar os `.test.tsx` no project `storybook`* — aquele project é governado pelo plugin
  `storybookTest`, que descobre **stories**, não arquivos de teste arbitrários. Forçar isso
  significaria um quarto project em modo browser só para esses arquivos: mais lento (sobe
  chromium) e mais complexo que jsdom, sem ganho, já que a renderização em navegador real já
  está coberta pelas stories.

**Complexidade declarada**: um project a mais e três devDependencies a mais do que o mínimo
absoluto. Justificado no plano (§ Complexity Tracking) porque decorre direto da decisão do
autor de ter os dois níveis de teste — não de preferência minha.

**Efeito no Portão 3**: `npm run test` passa a ser
`vitest run --project unit --project components`, para que FR-043b ("o comando do Portão 3 MUST
cobrir esses testes") seja satisfeito. O texto de 1.0.0 do Portão 3 falava só de `unit`. Esta
pesquisa tratou isso como "a intenção é o que vale" — leitura que a constituição **v2.0.0**
passou a proibir explicitamente (§Regras de aplicação). A divergência foi resolvida onde devia:
por **emenda**, e o Portão 3 agora exige a cobertura do teste de componente no próprio texto
normativo.

---

## R7 — O artifact mudou desde que a spec foi escrita

**Verificação**: a spec fixa a versão `1790366735-8b87`. A leitura de hoje devolveu
**`1790377732-ae4b`**.

**Decisão**: trabalhar com `1790377732-ae4b` e registrar a troca. Nada do que li contradiz os
requisitos da spec; as diferenças encontradas são **mais específicas**, não conflitantes, e
estão em R8, R9 e R10. Os artboards continuam sendo os três declarados
(`Sistema`, `Componentes`, `ComponentesMobile`).

**Ação**: a spec deve passar a apontar `1790377732-ae4b`. Se o artifact mudar outra vez durante
a implementação, quem for implementar **MUST** reler os três artboards antes de continuar a
camada em curso, em vez de confiar nesta leitura.

---

## R8 — Avatar: o tamanho grande é responsivo

FR-020 pede "três tamanhos — 32px, 44px e o tamanho grande entre 78px e 108px". Os artboards
resolvem a faixa:

- `Componentes` (desktop): "LG 108 · MD 44 · SM 32"
- `ComponentesMobile`: "44px no post, 78px no Sobre"

**Decisão**: `sm 32` e `md 44` fixos; `lg` é **78px em 390px e 108px no desktop**, pelo mesmo
componente com classe responsiva — não dois componentes nem duas props. Story cobre as duas
apresentações (FR-038).

---

## R9 — O alternador de tema dos artboards não é portado

Os artboards mostram um botão de tema (`TopBar`: "Buscar" + avatar + tema;
`MobileHeader`: "Marca, busca e tema"; `Sistema` tem a seção "05 · MODO ESCURO").

**Decisão**: **não portar**. A clarificação fixou tema único, e FR-010 proíbe seletor e
alternador de tema. Portanto:

- `TopBar`/`Header` entrega marca + gatilho do ⌘K + avatar. **Sem botão de tema.**
- A seção "05 · MODO ESCURO" do artboard `Sistema` é ignorada na íntegra.
- O token `code-bg` `#1A1714` sobrevive — é superfície de bloco de código e da variante escura
  de `PostCard`/`PrevNext`, não tema.

Isso é divergência deliberada entre artboard e entrega, já registrada na spec.

---

## R10 — MobileTabBar: 74px confirmado pela fonte mais específica

O artboard `Componentes` (desktop) rotula o bloco do tab bar como "alvo de 62px"; o
`ComponentesMobile` rotula "74PX". A spec já havia decidido 74px por ser a fonte específica do
contexto celular, e a leitura de hoje **confirma** o rótulo `74PX` no artboard mobile.

**Decisão**: 74px por aba, como FR-034 já exige. Nenhuma mudança na spec.

> **Corrigido em R16 (2026-09-27)**: a premissa deste achado está errada. Medido nos artboards de
> página, **74px é a altura da barra e 62px é a altura da aba** — os dois números coexistem no
> mesmo elemento e não são fontes em conflito. A decisão de 74px por aba **permanece**, porque é o
> que FR-034 exige, mas passa a ser **divergência deliberada** em relação ao desenho, não
> resolução de conflito entre artboards. Ver R16 §D-A.

---

## R11 — Fronteira cliente/servidor: estado atual medido

`"use client"` existe hoje em 6 arquivos:
`CopyButton`, `CopyLinkButton`, `DisqusComments`, `Header`, `SearchBox`, `Toc`.

Uso de estado/efeito/handler/API de browser por componente:

| Componente | Sinais encontrados |
|---|---|
| Button | `onClick` (só repassa a prop; não tem estado) |
| CodeBlock | `navigator.`, `onClick`, `useState` — **em `CopyButton.tsx`**, não no `CodeBlock` |
| CopyLinkButton | `navigator.`, `onClick`, `useState` |
| DisqusComments | `document.`, `useEffect`, `useRef`, `window.` |
| Header | `onClick`, `useState` (menu mobile) |
| SearchBox | `onChange`, `useState` |
| Toc | `document.`, `useEffect`, `useState` |

**Observação que importa para o plano**: `CodeBlock` **já** tem a diretiva no menor
componente possível — o cliente é o `CopyButton`, e o `CodeBlock` em volta é Server
Component. Esse é o padrão a repetir nas camadas novas, não algo a corrigir.

**Observação sobre `Button`**: recebe `onClick` opcional por prop e o repassa. Um componente
que apenas **repassa** um handler não precisa de `"use client"` — a diretiva pertence a quem
**cria** o handler. `Button` permanece Server Component. O detalhamento por componente está
no plano (§ Fronteira cliente/servidor).

---

## Incógnitas que sobraram

| # | Incógnita | Quem resolve |
|---|---|---|
| 1 | As 11 stories existentes passam a a11y com `test: "error"`? | Tarefa 1, depois de instalar o chromium |
| 2 | ~~`npm run build` está verde hoje?~~ | **RESOLVIDA em R12** — verde, zero aviso de código |
| 3 | Path SVG oficial de GitHub e LinkedIn | Camada 5 (`ShareButtons`), fonte oficial de cada marca |
| 4 | Base de avisos de console (Portão 6) | **T004** — medir é executar o portão |
| 5 | `ink-blue` sobre `sand` e sobre `blush` atingem 3:1? (FR-041a) | Camada 1, tarefa de tokens |

Nenhuma delas bloqueia o desenho das camadas; todas são resolvidas por execução na primeira
tarefa ou na camada que as usa.

---

## R12 — Portão 5: a base está medida, e o único aviso é do ambiente

**Verificação** (2026-09-27, `npm run build`): build **verde**, 33 páginas geradas, **zero aviso
de código**. O `next build` emite exatamente **um** `⚠`, e ele não é do repositório:

```text
⚠ Warning: Next.js ignored package-lock.json in
  /Users/allanramos/Documents/Pessoal/Repositorios/Pessoal
  because it is outside the current Git repository
```

**Causa medida**: existe um `package-lock.json` de 86 bytes no diretório **pai** do repositório
(`Repositorios/Pessoal/`, datado de 2025-08-29). O arquivo está fora do repositório e fora do
controle de versão; o `next build` o encontra ao subir a árvore e avisa que o ignorou.

**Por que isto importa para FR-046a**: a base do Portão 5 é comparada **por identidade**. Se a
T001 registrasse este aviso como linha de base, a base passaria a descrever a **máquina do
autor**, não o repositório — num checkout limpo, em CI ou em outra pasta, o aviso não aparece, e
a base ficaria imediatamente falsa em sentido permissivo: um aviso de código **novo** somado ao
desaparecimento deste manteria a contagem e poderia passar por "base mantida".

**Decisão**: a linha de base do Portão 5 é **zero aviso**. O aviso do lockfile órfão é ruído de
ambiente e pertence a `GATES.md` §4 (lista fechada de ruído tolerado), com a causa escrita — ou
desaparece apagando o arquivo do diretório pai, que **não** é mudança no repositório e portanto
não fere SC-011. A T001 escolhe entre as duas e registra a escolha.

**Consequência**: a incógnita 2 de "Incógnitas que sobraram" está **resolvida** nesta fase. A
T001 deixa de ter de *medir* a base do Portão 5 e passa a ter de *registrá-la* (zero) e decidir
o destino do aviso de ambiente. A base do Portão 6 (console) continua não medida: ela exige a
caminhada manual pelas onze rotas, que é a própria execução do portão.

---

## R13 — Portão 4: o bloqueio não é "falta o browser", é **revisão de build divergente**

R4 concluiu que faltava o binário do Playwright. A remedição de 2026-09-27 mostra que o
diagnóstico é impreciso, e a imprecisão é uma armadilha:

```text
$ ls ~/Library/Caches/ms-playwright/
chromium-1217   chromium_headless_shell-1217   ffmpeg-1011
```

O browser **está instalado** — na revisão **1217**. O Playwright resolvido pelo projeto procura a
revisão **1234**:

```text
Executable doesn't exist at .../chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/...
```

`npx vitest run --project storybook` continua terminando em `Tests: no tests / Errors: 1`, ou
seja, o Portão 4 segue **inexecutável** — a conclusão prática de R4 não muda, e
`npx playwright install chromium` continua sendo o primeiro passo bloqueante da T001.

**O que muda é a régua de "pronto"**: quem verificar o pré-requisito **listando o diretório de
caches** vai encontrar um `chromium_headless_shell-*` e concluir, errado, que o pré-requisito
está satisfeito. A verificação válida é **executar o portão**, não inspecionar a pasta —
que é a mesma regra da constituição §Regras de aplicação ("os portões são verificados por
execução real"). `GATES.md` §3, linha 4, ganha essa precisão junto com a T001.

---

## R14 — Sete devDependencies flutuam em `"latest"`, e é isso que produziu R13

**Medido** em `package.json`: sete dependências de desenvolvimento estão declaradas como
`"latest"` em vez de um intervalo:

```text
@chromatic-com/storybook   @storybook/addon-mcp   @vitest/browser-playwright
@vitest/coverage-v8        playwright             vite                vitest
```

`"latest"` não é intervalo: cada `npm install` pode resolver uma versão diferente **sem nenhuma
alteração no repositório**. A divergência de revisão de R13 é exatamente esse efeito — o
`playwright` avançou e passou a pedir uma revisão de browser que a máquina não tinha.

**Por que é problema desta feature, e não higiene genérica**: FR-046a define a linha de base dos
portões como comparável **por identidade** — arquivo, linha e texto. Uma base por identidade
pressupõe que a ferramenta que produz a mensagem seja a mesma entre duas execuções. Com sete
ferramentas flutuando, incluindo o **vitest** (portões 3 e 4) e o **eslint-adjacente** cadeia de
build, a base pode mudar de texto sem que ninguém tenha tocado em código, e o Portão 8 passaria a
reprovar tarefas por regressão que não é regressão. O `package-lock.json` segura a resolução
localmente, mas não protege um `npm update`, um checkout novo nem a CI.

**Decisão**: **fixar as sete em intervalo `^` na versão hoje instalada** é entregável da T001, no
mesmo commit dos scripts. Não é refatoração oportunista: é pré-condição de a linha de base
registrada em `GATES.md` §3 significar alguma coisa entre uma tarefa e a seguinte.

**Alternativa descartada** — *deixar como está e registrar o risco*: transferiria para cada tarefa
o custo de distinguir "aviso novo por regressão" de "aviso novo por upgrade silencioso", que é
precisamente a distinção que FR-046a existe para tornar automática. O custo de fixar é uma linha
por dependência, pago uma vez.

---

## R15 — `DESIGN.md` não existe na árvore, mas **existe no índice** do git

**Medido** (2026-09-27):

```text
$ git status --short -- DESIGN.md
AD DESIGN.md          # A = adicionado no índice, D = apagado na árvore de trabalho

$ git show :DESIGN.md | wc -l
57
```

O arquivo está **versionado** (staged, 57 linhas) e ausente do disco. E o conteúdo versionado é a
documentação da **identidade antiga**:

```text
# Design system
Identidade inspirada no site de marketing do Slack (slack.com): aubergine (#4a154b) como cor
primária, tipografia bold com tracking apertado ... Fonte: Plus Jakarta Sans
```

Ele tabula os dezenove tokens aubergine que FR-002 remove e a família `--font-jakarta` que FR-004
remove.

**Por que importa**: FR-011a afirma que o arquivo "**não existe no repositório hoje**". Isso é
verdade para a árvore de trabalho e **falso para o índice**. Três consequências concretas para a
Camada 1:

1. A tarefa de tokens **não cria** `DESIGN.md` do zero — ela **substitui** um arquivo rastreado. O
   commit aparece como modificação, não como adição, e quem esperar `A DESIGN.md` no diff vai
   achar que errou.
2. Enquanto o estado atual do índice não for commitado ou desfeito, um `git checkout -- DESIGN.md`
   **traz de volta** a documentação aubergine. Ela é, literalmente, "entrada em `DESIGN.md` sem
   token correspondente" — violação do Princípio I no instante em que a Camada 1 remover os
   dezenove tokens.
3. O conteúdo antigo é insumo útil, não lixo: a seção "Removidos" que SC-005 autoriza em
   `DESIGN.md` pode ser escrita a partir de `git show :DESIGN.md`, que é o registro fiel do que
   saiu.

**Decisão**: a Camada 1 escreve `DESIGN.md` **por cima** do conteúdo versionado, no mesmo commit
dos tokens (Princípio I exige o mesmo commit). Nenhuma mudança na spec é necessária — FR-011a
exige que o arquivo passe a existir com as entradas dos tokens novos, e isso continua exato. A
imprecisão é sobre o **ponto de partida**, e fica registrada aqui para não virar surpresa no diff.

---

## R16 — Releitura dos artboards para a geração de tarefas: estrutura medida e três divergências

Leitura de 2026-09-27 dos três artboards normativos, versão `1790377732-ae4b`, para dar a cada
tarefa uma referência citável (regra 7 do pedido de `/speckit-tasks`).

### Estrutura medida

`project/Sistema.dc.html` — `01 · CORES`, `02 · TIPOGRAFIA`, `03 · FORMA`, `04 · COMPONENTES`,
`05 · MODO ESCURO` (ignorada, R9), `06 · O QUE MUDA NO CÓDIGO`.

`project/Componentes.dc.html` (1440px), cinco seções e os cards de cada uma:

| Seção | Cards |
|---|---|
| `01 · BASE` | `Button`, `IconButton`, `Avatar`, `CategoryBadge`, `TagPill`, `InlineCode / link` |
| `02 · NAVEGAÇÃO` | `TopBar`, `SideRail`, `Pagination`, `MobileTabBar` |
| `03 · CONTEÚDO` | `PostListRow`, `FeaturedPostCard`, `PostCard`, `CategoryCard`, `Shelf`, `SeriesShelf`, `YearArchive`, `TilList` |
| `04 · DENTRO DO POST` | `CodeBlock`, `Toc`, `ShareButtons`, `Callout`, `AuthorCard`, `LikeCommentBar`, `PrevNext` |
| `05 · BUSCA, VAZIO E RODAPÉ` | `CommandPalette`, `EmptyState`, `Footer` |

`project/ComponentesMobile.dc.html` (390px) cobre **17 dos 36**: `BASE` (Button, IconButton,
Avatar), `NAVEGAÇÃO` (MobileHeader, MobileTabBar, Pagination), `CONTEÚDO` (PostCard,
FeaturedPostCard, CategoryCard, SeriesShelf, Shelf), `DENTRO DO POST` (Toc, CodeBlock,
ShareButtons), `BUSCA, VAZIO E RODAPÉ` (CommandPalette, EmptyState, Footer).

**Consequência para as tarefas**: a apresentação de 390px dos outros 19 não sai do artboard de
componentes. Sai dos artboards de página — `Mobile` (`ÚLTIMOS POSTS` → PostListRow,
`ANOTAÇÕES CURTAS` → TilList), `MobilePost` (`SUMÁRIO` → Toc, e os componentes de leitura),
`MobileSobre` (`NA ESTANTE` → Shelf, Avatar `lg` 78px), `MobileExplorar` (`ARQUIVO POR ANO` →
YearArchive, `CATEGORIAS` → CategoryCard, `TAGS` → TagPill), `MobileTag` e `MobileCategoria`
(CategoryBadge, TagPill em contexto) — ou, quando nem isso existe (`Breadcrumb`, `Kbd`), da regra
de ponto de corte único de 1024px (FR-038a).

**Três componentes não têm card em artboard nenhum**: `Container`, `Hero`, `PostContent`,
`PostsListing`. São re-estilização derivada dos tokens, e as tarefas dizem isso em vez de citar
uma referência que não existe.

**Dois componentes não têm card próprio, mas têm grupo de estado dentro de outro card**: medido,
`BREADCRUMB` e `PROGRESSO DE LEITURA` são grupos **dentro do card `Pagination`**, em
`Componentes.dc.html` → `02 · NAVEGAÇÃO`. `Kbd` é o elemento `<kbd>` dentro dos cards `TopBar` e
`CommandPalette`.

### D-A — `MobileTabBar`: R10 resolveu um conflito que não existe

R10 registrou: "o artboard `Componentes` rotula o bloco do tab bar como 'alvo de 62px'; o
`ComponentesMobile` rotula '74PX'", e decidiu 74 por ser a fonte mais específica do contexto.

**Medido agora, nos artboards de página** (`MobileSerie.dc.html`, `MobileTag.dc.html`):

```text
<nav ... style="height: 74px; padding: 0 4px; ...">      ← a BARRA
  <a ... style="height: 62px; ...">                       ← cada ABA
```

Os dois números coexistem no mesmo elemento: **74 é a barra, 62 é a aba**. Não são fontes em
conflito, são medidas de coisas diferentes — e a descrição do card desktop ("cinco abas, alvo de
62px") está **correta** sobre a aba, enquanto o rótulo `74PX` do mobile está correto sobre a barra.

**Decisão**: FR-034 exige "alvo de toque de **74px** por aba", então **a aba preenche os 74px da
barra**. Isso diverge do artboard, que desenha a aba em 62px com 12px de folga na barra.
Registrado como divergência deliberada. **Não é questão do Princípio IV** — 62px já passa o
mínimo de 44px com folga; é conformidade com a **spec**. Se o autor preferir os 62px do desenho,
o caminho é emendar FR-034, não reinterpretar a tarefa.

### D-B — 34 bordas de 1,5px no mock contra a espessura única de 2px

**Medido**: `border: 1.5px` aparece **19 vezes** em `Componentes.dc.html`, **10** em
`ComponentesMobile.dc.html` e **5** em `Sistema.dc.html` — no `<kbd>`, nas pílulas de tag
pequenas, nos pontos de cor de categoria e nos segmentos da barra de progresso de série.

FR-007 fixa espessura de borda com **valor único no sistema inteiro**, e a régua 2 de SC-004
exige que `grep -rnE 'border(-[0-9]|-\[)' src/components/` devolva **vazio**, sancionando só
`border-2`. Escrever `border-[1.5px]` reprovaria o grep.

**Decisão**: **tudo vira 2px.** A divergência é visualmente pequena e sistemática, e o preço de
não seguí-la seria abrir exceção na única régua automatizável de espessura que a feature tem.
Cobrada na T047.

### D-C — `Avatar`: o rótulo diz 108, o swatch é desenhado em 64

**Medido** no card `Avatar` de `Componentes.dc.html`: o rótulo do grupo é
`LG 108 · MD 44 · SM 32`, e o elemento `lg` renderizado é `width: 64px; height: 64px`.

**Decisão**: vale o **rótulo**, como R8 já havia concluído lendo o rótulo e o `ComponentesMobile`
("44px no post, 78px no Sobre"). O swatch de 64px é compromisso de diagramação do card, que
precisa caber ao lado dos outros dois. Registrado para que ninguém "corrija" o componente para
64px achando que está seguindo o desenho.
