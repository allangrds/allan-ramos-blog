# Implementation Plan: Port dos componentes do redesign

**Branch**: `002-redesign-components` | **Date**: 2026-09-27 (revisão 2) | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-redesign-components/spec.md`

## Summary

Trocar a fundação visual do blog (paleta aubergine → identidade creme/ink com borda de 2px e
sombra dura) e entregar 36 componentes — 15 re-estilizados e 21 novos — cada um com story, teste
de story e teste de comportamento colocado na própria pasta. Tema único; sem modo escuro. Rotas
em `src/app/**` ficam congeladas, com a exceção declarada de `globals.css` e `layout.tsx`.

A abordagem é **em seis camadas, de baixo para cima**, com os portões 1–5 a cada tarefa e o
Portão 6 ao fim de cada camada — exceção de cadência **nomeada** na Constituição §Cadência
(v2.0.0). Antes de qualquer componente, uma tarefa de infraestrutura torna os portões 2 e 4
executáveis e **estabiliza a linha de base**, sem a qual "aviso novo" não significa nada.
Comando exato, escopo, linha de base e ruído tolerado: [`GATES.md`](../../GATES.md).

**O que mudou na revisão 2** (medições desta passagem de planejamento, todas em 2026-09-27):

| Achado | Efeito |
|---|---|
| **R12** — `next build` está verde com **zero aviso de código**; o único `⚠` vem de um `package-lock.json` órfão no diretório **pai**, fora do repositório | Uma das duas linhas `⚠` de `GATES.md` §3 deixa de ser incógnita. A T001 **registra** (zero), não mede. |
| **R13** — o Portão 4 não está bloqueado por "browser ausente": há `chromium_headless_shell-1217` instalado e o Playwright resolvido pede a revisão **1234** | O comando da T001 não muda; muda a **régua de verificação** — inspecionar a pasta de caches dá falso positivo. |
| **R14** — sete devDependencies declaradas como `"latest"`, incluindo `vitest` e `playwright` | Novo entregável da T001: fixá-las. Base "por identidade" (FR-046a) não é estável enquanto a ferramenta que produz a mensagem flutua. |
| **R15** — `DESIGN.md` está ausente do disco mas **presente no índice do git**, com 57 linhas documentando a identidade aubergine | A Camada 1 **substitui** o arquivo em vez de criá-lo; o conteúdo versionado vira insumo da seção "Removidos" de SC-005. |

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.8, Next.js 16.3.3 (App Router)

**Primary Dependencies**: Tailwind v4 (`@tailwindcss/postcss`), Storybook 10
(`@storybook/nextjs-vite`), Vitest 4, `next/font/google`, `shiki` + `@shikijs/transformers`

**Dependências novas** — cinco, todas verificadas no npm nesta passagem:

| Pacote | Versão | Tipo | Para quê |
|---|---|---|---|
| `lucide-react` | `^1.48.0` | runtime | ícones do sistema (FR-036a). Verificado: 2118 ícones, **zero marcas** (R2) |
| `jsdom` | `^27` | dev | ambiente do project `components` |
| `@testing-library/react` | `^16` | dev | render no teste de comportamento |
| `@testing-library/jest-dom` | `^6` | dev | matchers de DOM |
| `storybook-addon-pseudo-states` | `10.6.0` | dev | entrada de hover forçada (FR-018a). Verificado: peer `storybook: ^10.6.0` |

**Upgrade acoplado**: `storybook-addon-pseudo-states@10.6.0` exige `storybook ^10.6.0` e o projeto
tem **10.5.10**. Verificado no npm que `storybook@10.6.0` existe. Todos os pacotes `@storybook/*`
sobem juntos para 10.6.0 — cabe nos intervalos `^10.5.10` já declarados, mas é movimento próprio
(T003), pelas razões da Camada 1.

**Storage**: N/A — nenhum componente persiste ou busca dado; tudo entra por propriedade (SC-015)

**Testing**: Vitest com **três** projects — `unit` (node, lógica de `src/lib`), `components`
(jsdom, `src/components/**/*.test.tsx`), `storybook` (chromium via Playwright, stories +
`addon-a11y`)

**Target Platform**: navegador moderno; duas apresentações obrigatórias — 1280px e 390px

**Project Type**: aplicação web (Next.js App Router), single project

**Performance Goals**: N/A para esta feature. A restrição operante é de bundle: manter a
diretiva `"use client"` no menor componente possível (Princípio III) — **6 Client Components**
entre as **38 unidades** entregues

**Constraints**: `src/app/**` congelado exceto `globals.css` e `layout.tsx`; `src/lib/**` e
`src/content/**` intocados; contraste 4,5:1 (3:1 acima de 24px) e 3:1 para elemento não textual;
alvo de toque ≥44px; zero rolagem horizontal em 390px; zero valor visual hardcoded

**Scale/Scope**: **38 unidades entregues** = 36 componentes do inventário + os dois
sub-componentes (`CodeBlock/CopyButton`, `Header/SearchTrigger`). 32 Server, 6 Client.
12 tokens de cor + 2 de marca/sistema + 8 de tipografia + 7 de forma + `--measure-prose`.
6 camadas, 2 apresentações por estado, 3 artefatos por componente.

## Constitution Check

*GATE: verificado antes da Fase 0, revisado após a Fase 1, revisado contra a Constituição
v2.0.0 após a auditoria de `checklists/quality-gates.md`, e **revisado de novo nesta passagem**
contra as medições R12–R15.*

| Princípio | Como o plano satisfaz | Status |
|---|---|---|
| **I — Design System como Fonte Única** | Camada 1 entrega tokens antes de qualquer componente, então nenhum componente é escrito antes de os tokens existirem. `DESIGN.md` não está no disco, mas **está no índice do git documentando a paleta aubergine** (R15): a camada 1 o **substitui**, no mesmo commit dos tokens (FR-011a). | ✅ |
| **II — Componente com Story e Teste** | Três artefatos por componente na mesma tarefa: componente, story com todos os estados, teste. `contracts/components.md` fixa o nível de teste de cada uma das 38 unidades. | ✅ |
| **III — Server Component por Padrão** | Fronteira decidida unidade a unidade com justificativa escrita (§3, abaixo). 6 clientes de 38. Três diretivas **recusadas** deliberadamente e duas empurradas para o filho. | ✅ |
| **IV — Acessibilidade Verificada** | `a11y.test` sai de `"todo"` (só reporta — verificado em `.storybook/preview.tsx`) para `"error"` (reprova) na T001. Contraste calculado, não prometido. Alvo ≥44px por contrato. | ✅ |
| **V — Simplicidade** | Nenhum componente fora do inventário da spec, com a exceção justificada de `Header/SearchTrigger`. Sem abstração de uso único. Três complexidades declaradas abaixo. | ⚠️ ver Complexity Tracking |

**Portões de qualidade**: os oito estão endereçados. As **regras** na Constituição v2.0.0
§Quality Gates; o **comando e a base medida** em [`GATES.md`](../../GATES.md). Dois portões não
eram executáveis e a T001 os torna executáveis: o Portão 2 por falta de script, o Portão 4 por
falta de script **e** de browser na revisão correta (R13). Das duas linhas de base `⚠`, a do
Portão 5 está **medida nesta passagem** (R12, zero aviso de código) e a do Portão 6 (console)
permanece com a T001, porque medi-la é executar o portão.

## Project Structure

### Documentation (this feature)

```text
specs/002-redesign-components/
├── plan.md              # este arquivo
├── research.md          # Fase 0 — 16 achados verificados (R16 na passagem de tasks)
├── data-model.md        # Fase 1 — tokens + formas de dado
├── quickstart.md        # Fase 1 — validação executável, procedimento do Portão 6
├── contracts/
│   └── components.md    # Fase 1 — assinatura, fronteira S/C e nível de teste das 38 unidades
├── checklists/
│   ├── requirements.md  # 13/16 (3 itens abertos por decisão)
│   ├── quality-gates.md # 60 itens — originou a emenda 2.0.0 da constituição
│   ├── design-system.md # 47 itens — portão formal de entrada da T002
│   └── componentes.md   # 45 itens — portão formal de entrada da T005
└── tasks.md             # Fase 2 — 48 tarefas, geradas por /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── globals.css          # ALTERADO — tokens (exceção declarada 1 de 2)
│   ├── layout.tsx           # ALTERADO — só o bloco de fontes + className do <html> (2 de 2)
│   └── **/page.tsx          # CONGELADO — 11 rotas, nenhum outro arquivo tocado
├── components/
│   └── <Nome>/
│       ├── <Nome>.tsx
│       ├── <Nome>.stories.tsx
│       └── <Nome>.test.tsx  # NOVO — teste colocado (FR-043a)
├── lib/                     # CONGELADO — import permitido, alteração proibida
└── content/                 # CONGELADO

DESIGN.md                    # SUBSTITUÍDO — ausente do disco, porém no índice com a doc
                             #   aubergine antiga (R15); exigido pelo Princípio I
GATES.md                     # ALTERADO na T001 — §3 linhas 4, 5 e 6; §4 se o ruído for tolerado
vitest.config.ts             # ALTERADO — terceiro project `components`
vitest.setup.components.ts   # NOVO — @testing-library/jest-dom
.storybook/preview.tsx       # ALTERADO — a11y.test: "todo" → "error"
package.json                 # ALTERADO — scripts typecheck/test/test:all; 5 deps novas;
                             #   @storybook/* em 10.6.0; as 7 deps em "latest" fixadas (R14)
tests/unit/                  # INTOCADO — 4 testes de lógica / 13 testes
```

**Structure Decision**: single project, um componente por pasta
(`src/components/<Nome>/<Nome>.tsx` + `.stories.tsx` + `.test.tsx`), que é o padrão já usado no
repo — verificado: 17 pastas, todas nesse formato. O teste entra como terceiro arquivo do mesmo
trio, conforme decidido na clarificação.

**Nota sobre `tests/unit/`**: permanece com os 4 testes de lógica de `src/lib`. A regra de
colocação vale para teste de **componente**, que é o que esta feature entrega. Movê-los exigiria
escrever em `src/lib/**`, congelado por SC-011 — registrado na spec como pendência para quando
`src/lib/**` abrir.

---

## 1 · Tarefa 0 (T001) — Infraestrutura, ANTES de qualquer componente

Uma tarefa, indivisível. **Nenhum componente é tocado nela.** O critério de pronto é baseline
verde medido, não "os scripts existem".

### 1.1 Desbloquear o Portão 4 — e verificar por execução, não por inspeção

```bash
npx playwright install chromium
```

**Bloqueante, vem primeiro.** O Portão 4 hoje não é "vermelho", é **inexecutável**: o vitest
aborta com `Tests: no tests / Errors: 1` antes de rodar um único teste.

**Armadilha medida (R13)**: a máquina **já tem** `chromium_headless_shell-1217` instalado, e o
Playwright resolvido pelo projeto procura a revisão **1234**. Quem verificar o pré-requisito
listando `~/Library/Caches/ms-playwright/` vai encontrar um browser e concluir, errado, que está
satisfeito. A verificação válida é **rodar o portão**:

```bash
npx vitest run --project storybook   # esperado: as 11 stories passam a EXECUTAR
```

Isso é a regra geral da constituição §Regras de aplicação ("verificados por execução real")
aplicada ao caso concreto em que ela é mais fácil de burlar sem perceber.

### 1.2 Scripts (portões 2, 3 e 4)

Os três scripts estão definidos em `GATES.md` §1 e não são repetidos aqui. Dois pontos que são
decisão, não transcrição:

- `test` cobre o project `components` porque o **Portão 3 emendado** (Constituição v2.0.0) exige
  que o comando cubra o teste de componente. Em 1.0.0 o texto dizia só "projeto `unit` verde", e
  este plano vinha reinterpretando esse texto por conta própria — o que a §Regras de aplicação
  agora proíbe. A correção foi feita por **emenda**, que é o caminho previsto.
- A fronteira é **congelada** (`GATES.md` §2): `test` MUST NOT passar a incluir o project
  `storybook`, ou o Portão 4 vira redundante e a régua de a11y se dissolve dentro do Portão 3.
  `test:all` existe para quem quer os dois de uma vez e **não** substitui a régua de nenhum.

### 1.3 Terceiro project do Vitest

`components`: `environment: 'jsdom'`, `include: ['src/components/**/*.test.tsx']`, alias `@`,
`setupFiles` com `@testing-library/jest-dom`. Justificativa e alternativas descartadas em R6 e em
Complexity Tracking.

**Consequência de tipo, já medida** (`GATES.md` §2): o `tsconfig.json` inclui `**/*.ts` e
`**/*.tsx` com `exclude` só de `node_modules`, então o Portão 2 cobre **também** stories,
`*.test.tsx` e `vitest.config.ts`. Os matchers de `jest-dom` precisam ter tipo visível para o
`tsc`, não só para o Vitest.

### 1.4 a11y passa a reprovar

`.storybook/preview.tsx`: `a11y: { test: "todo" }` → `"error"` (verificado: está em `"todo"`
hoje). A checagem **só reporta** — o Princípio IV ("verificada, não prometida") está sem dente.

**Se alguma das 11 stories existentes reprovar, consertar entra nesta tarefa.** É pré-requisito
do baseline, não dívida para o fim (Portão 8). Esta é a incógnita 1 de `research.md`, e é a que
tem maior chance de alongar a T001 — as stories nunca rodaram uma única vez.

### 1.5 Estabilizar a base antes de registrá-la (R14 — novo)

Sete devDependencies estão declaradas como `"latest"`: `@chromatic-com/storybook`,
`@storybook/addon-mcp`, `@vitest/browser-playwright`, `@vitest/coverage-v8`, `playwright`, `vite`,
`vitest`. **Fixá-las em `^` na versão instalada é entregável desta tarefa.**

Não é higiene oportunista, e a ordem importa: FR-046a define a base como comparável **por
identidade** — arquivo, linha e texto. Identidade pressupõe que a ferramenta que emite a mensagem
seja a mesma entre duas execuções. Com `vitest` (portões 3 e 4) e `playwright` flutuando, a base
pode mudar de texto sem ninguém tocar em código, e o Portão 8 passaria a reprovar tarefas por uma
regressão que não é regressão. R13 **já é** esse efeito acontecendo.

Registrar a base (1.6) **antes** de fixar as versões seria registrar um número com validade
desconhecida. Fixar vem primeiro.

### 1.6 Registrar a base

A base vive em [`GATES.md`](../../GATES.md) §3 e **não é copiada aqui** — era essa cópia que fazia
o número "1 warning" existir em quatro lugares sem que nenhum fosse normativo. Estado das seis
linhas depois desta passagem de planejamento:

| Portão | Base | Quem resolve |
|---|---|---|
| 1 lint | **1 aviso**, `src/lib/mdx.tsx:98:5 — Unused eslint-disable directive`. Reconfirmado nesta passagem, byte a byte. Arquivo congelado por SC-011: **não pode** ser corrigido aqui. | ✅ já registrado |
| 2 tipos | `tsc --noEmit` exit 0. Reconfirmado. | ✅ já registrado |
| 3 teste | 4 arquivos / 13 testes em `unit`. Reconfirmado. `components` ainda não existe. | ✅ já registrado |
| 4 story | **inexecutável**; diagnóstico corrigido para "revisão de build divergente" (R13) | T001 corrige o texto |
| 5 build | **zero aviso de código** (medido em R12). O único `⚠` é ambiental | T001 **registra**, não mede |
| 6 console | não medido | T004 — medir é executar o portão |

**O aviso do Portão 5 é uma armadilha, e a decisão é da T001.** O `next build` emite:

```text
⚠ Warning: Next.js ignored package-lock.json in .../Repositorios/Pessoal
  because it is outside the current Git repository
```

A causa é um `package-lock.json` de 86 bytes no diretório **pai** do repositório. Registrá-lo como
linha de base descreveria a **máquina do autor**, não o repositório: em checkout limpo ou em CI ele
não existe, e a base ficaria falsa em sentido **permissivo** — um aviso de código novo somado ao
desaparecimento deste manteria o total e passaria por "base mantida", que é exatamente o furo que
FR-046a fechou ao trocar contagem por identidade. Duas saídas, a T001 escolhe **uma** e escreve
qual:

1. base = **zero**, e o aviso entra em `GATES.md` §4 (ruído tolerado) com a causa escrita; ou
2. apagar o arquivo órfão do diretório pai — que está **fora** do repositório, logo não é mudança
   em `src/app/**` nem em lugar nenhum versionado, e não fere SC-011.

### Critério de pronto da T001

Os cinco portões de comando verdes contra a base registrada, **sem ter tocado em um único
componente** — exceto conserto de a11y de story existente, que 1.4 autoriza nominalmente.

---

## 2 · Ordem de implementação em camadas

Portões 1–5 **a cada tarefa**. Portão 6 **ao fim de cada camada**, em tarefa própria. Nenhuma
camada começa com a anterior vermelha (Portão 8).

A lista do pedido e a lista deste plano diferem em **quatro pontos**, todos por adição e todos
justificados aqui — nenhum componente do pedido saiu:

| Camada | Adição em relação à lista do pedido | Por quê |
|---|---|---|
| 2 | `Container` | Primitivo de layout, contrato congelado (`{ className }`), consumido pelas camadas seguintes. Deixá-lo para depois faria as camadas 3–6 comporem um primitivo ainda com visual antigo. |
| 3 | `Header` (as duas apresentações), `Header/SearchTrigger` | O pedido diz "TopBar". Os artboards nomeiam `TopBar` (desktop 68px) e `MobileHeader` (celular 64px); a spec fixou que são as duas apresentações do `Header` existente, cujo nome FR-013 preserva. `SearchTrigger` é a ilha que mantém `Header` no servidor. |
| 4 | `PostsListing`, `Hero`, `PostContent` | Três dos 15 re-estilizados, todos de conteúdo e todos de contrato congelado. Ficariam órfãos de camada. |
| 5 | `CopyLinkButton` | Contrato congelado, é a ilha cliente que `ShareButtons` compõe. Separá-lo de `ShareButtons` quebraria a tarefa em duas sem ganho. |

### Camada 1 — Tokens, fontes e DESIGN.md

Sem componente. Entrega:

- **`globals.css`** — estrutura `:root` + `@theme inline` **preservada**, só os valores trocam.
  Verificado: hoje o arquivo tem 19 tokens de cor em `:root`, espelhados no `@theme inline`, mais
  15 escalas de texto, 7 raios, 7 espaçamentos e 3 sombras.
  - os 12 tokens de cor da identidade + `--color-brand-linkedin` (FR-001a); `--color-white` é
    reuso do tema padrão do Tailwind, **não** token novo (FR-001b);
  - os **dezenove** tokens aubergine saem por inteiro (FR-002, medido) — nenhum renomeado
    mantendo valor;
  - os **quinze sub-tokens** de entrelinha, espaçamento entre letras e peso das cinco escalas,
    lidos do artboard `Sistema` (FR-003a), mais `--text-micro-cap-sm` (FR-003b);
  - `--spacing: 0.25rem` no `@theme` e a remoção dos sete `--spacing-*` sem uso (FR-005a);
  - `--measure-prose` em `ch` (FR-012), que é insumo da justificativa de FR-038a;
  - o bloco `/* LEGADO */` com os **quinze** órfãos nomeados, que só encolhe (FR-002a);
  - a regra de sistema de **hover e `:active`** (FR-018a) e a de **foco visível** (FR-018b), com
    a cor do anel variando por superfície (FR-041a);
  - a regra global de `prefers-reduced-motion`, **ponto único** de supressão de movimento, com o
    teste único que verifica EC-12 e SC-016 (FR-042a);
  - o **ponto de corte único em 1024px** e as quatro trocas responsivas que dependem dele
    (FR-038a).
- **`layout.tsx`** — Archivo Black (**400 apenas**), Space Grotesk (400/500/600/700), JetBrains
  Mono (400/500/700) por `next/font/google`. `Plus_Jakarta_Sans`/`--font-jakarta` saem. Verificado:
  o diff cabe no bloco de fontes e na `className` do `<html>`; `metadata`, `<body>`, `Header`,
  `main` e `Footer` **não** são tocados.
- **`DESIGN.md`** cobrindo todos os tokens, a regra de hover/foco, a tabela de contraste, o
  ponto de corte, a escala de espaçamento, a seção "Cores de marca e de sistema" e a seção de
  valores provisórios de FR-046b.
  **Atenção (R15)**: o arquivo não está no disco, **mas está no índice do git** (`AD`, 57 linhas)
  e o conteúdo versionado documenta a identidade **aubergine** — os dezenove tokens que FR-002
  remove e a `Plus Jakarta Sans` que FR-004 remove. A tarefa **substitui**, não cria: o diff
  aparece como modificação, e enquanto isso não for commitado um `git checkout -- DESIGN.md`
  ressuscita a documentação antiga, que é "entrada sem token correspondente" — violação do
  Princípio I. O conteúdo antigo serve de insumo para a seção "Removidos" que SC-005 autoriza
  (`git show :DESIGN.md`).
- **T003, tarefa própria ao fim da camada**: `storybook-addon-pseudo-states` e a subida conjunta
  de `storybook` e de todos os `@storybook/*` de 10.5.10 para **10.6.0**. É **bloqueante** para a
  primeira tarefa de componente: sem pseudo-estado forçado, a entrada de hover de FR-018a não pode
  existir, e sem ela a story não cobre todos os estados que o Princípio II exige. Fica isolada
  porque é o único movimento da feature capaz de deixar o Portão 4 vermelho por motivo alheio a
  qualquer componente.
- **T004, tarefa própria**: Portão 6 da camada. §Cadência exige o portão ao fim de **cada**
  camada, e esta não é exceção — é a única que altera `src/app/**` e a de risco **alto**.

**Risco desta camada**: é a única que altera `src/app/**`. Trocar os valores muda o visual de
**todos** os componentes de uma vez, e eles ainda não foram re-estilizados — o blog fica
visualmente inconsistente ao fim da camada 1. Isso é **esperado**: nenhum portão verifica beleza,
e a US1 trata isso como entrega válida. O que **não** é aceitável é Portão 5 ou 6 vermelho.

**Ordem interna importa**: o `grep` pelos tokens aubergine em `src/components/**` tem de vir
**antes** de removê-los, para saber quantos call sites quebram. Componente que referencia
`bg-primary`, `text-on-primary` etc. precisa de valor válido ao fim da camada, mesmo provisório.

**Valor provisório tem regra, não é improviso** (FR-046b, §Falha de portão): como o conserto não
pode alterar `src/app/**` além dos dois arquivos permitidos, o escopo prevalece e o valor
provisório é aceitável — desde que registrado em seção própria e nomeada de `DESIGN.md` e coberto
pela auditoria final, que exige aquela seção **vazia**. Mesma mecânica do bloco `LEGADO`.

**Entregável de medição desta camada**: `ink-blue` sobre `sand` e sobre `blush` ainda **não foram
medidos** (FR-041a). Se qualquer um ficar abaixo de 3:1, o anel de foco naquela superfície troca
para `ink`.

### Camada 2 — Primitivos

`Button`, `IconButton`, `Avatar`, `CategoryBadge`, `TagPill`, `Kbd`, `InlineCode`, `Container`.

`lucide-react` entra aqui, com o `IconButton`, que é o primeiro consumidor.

**Todos Server Components.** `Button` ganha `accent` e `disabled`; a união `href | onClick` atual é
preservada. `Button` `md` vai a **44px**, não aos 40px do artboard — 40 reprova o Princípio IV,
FR-037 e SC-008, e a constituição prevalece sobre o mock.

### Camada 3 — Navegação

`Header` (TopBar 68px / MobileHeader 64px), `Header/SearchTrigger`, `SideRail`, `MobileTabBar`,
`Breadcrumb`, `Pagination`, `ReadingProgress`.

`Header` é a primeira tarefa que mexe num componente **do contrato congelado** com assinatura
`Header()`. Ele perde o menu mobile com `useState` e ganha o gatilho do ⌘K, que vive na ilha
cliente `SearchTrigger` — com isso **`Header` deixa de ser Client Component e passa a Server
Component**. É a melhoria de fronteira mais concreta da feature. A prop `index` entra opcional
com padrão `[]` (FR-016a), então `Header()` continua chamável sem argumento e `layout.tsx` não
muda por causa disso.

`CommandPalette` é da camada 6. Na camada 3 o `SearchTrigger` renderiza o botão com o estado; a
palette entra depois. Alternativa descartada: adiantar `CommandPalette` para a camada 3 —
quebraria a ordem de dependência (a palette usa `Kbd` e `EmptyState`).

### Camada 4 — Conteúdo

`PostCard`, `PostListRow`, `FeaturedPostCard`, `CategoryCard`, `SeriesShelf`, `YearArchive`,
`TilList`, `Shelf`, `PostsListing`, `Hero`, `PostContent`.

**Todos Server Components.** Dado de exemplo vive nas stories (SC-015).

**Ponto de maior risco de contraste da feature**: `FeaturedPostCard` ("título em display sobre o
acento"). Título branco sobre `sun` (1.59:1) ou `mint` (2.34:1) reprova até o limite relaxado de
3:1. **O título tem de ser `ink`.**

### Camada 5 — Dentro do post

`CodeBlock` (+ `CopyButton`), `Toc`, `ShareButtons`, `CopyLinkButton`, `Callout`, `AuthorCard`,
`PrevNext`, `LikeCommentBar`.

Maior densidade de Client Components: **3 dos 6** (`CopyButton`, `Toc`, `CopyLinkButton`).
`CodeBlock` **já tem a fronteira correta** — o cliente é o `CopyButton` — e isso é para
preservar, não corrigir.

Os SVG oficiais de GitHub e LinkedIn entram aqui, porque `lucide-react` não tem ícone de marca
(R2, verificado: 2118 ícones, zero marcas).

### Camada 6 — Busca, vazio e rodapé

`CommandPalette`, `EmptyState`, `Footer`.

`CommandPalette` **fecha a camada 3**: o `SearchTrigger` passa a renderizá-la. É a unidade com
mais interação — `⌘K`, `esc` no desktop, `×` em 390px, folha de tela cheia no celular.

---

## 3 · Fronteira `"use client"` — decidida por unidade

Regra aplicada (Princípio III): a diretiva entra **somente** quando há estado, efeito, handler
criado localmente ou API de browser, e fica no **menor** componente que realmente precisa dela.
A tabela completa, com assinatura de cada unidade, está em
[`contracts/components.md`](./contracts/components.md). O resultado:

### Os 6 Client Components, e o que em cada um exige a diretiva

| Unidade | Camada | O que exige a diretiva |
|---|---|---|
| `Header/SearchTrigger` | 3 | `useState` do `open`, compartilhado entre o botão "Buscar" e a palette |
| `ReadingProgress` | 3 | API de browser: lê a posição de rolagem (`window`, evento `scroll`) |
| `CodeBlock/CopyButton` | 5 | `navigator.clipboard` + estado `copied` — **já é cliente hoje** |
| `Toc` | 5 | `useState` (recolhido/aberto no celular) + item ativo por rolagem — **já é cliente** |
| `CopyLinkButton` | 5 | `navigator.clipboard` + estado `copied` — **já é cliente hoje** |
| `CommandPalette` | 6 | estado do campo de busca + escuta de teclado (`⌘K`, `esc`) |

Os seis do pedido eram `Toc`, `CommandPalette`, `CopyButton`, `ReadingProgress`, `MobileTabBar` e
`ShareButtons`. **Quatro se confirmam.** Os outros dois **não**, e o motivo é o mesmo nos dois —
o que parecia exigir a diretiva não exige, ou exige no filho:

- **`MobileTabBar` → Server.** Ela só precisaria de `"use client"` para chamar `usePathname()`.
  Recebendo `activeHref` por prop não tem estado, efeito, handler nem API de browser, e o
  Princípio III só autoriza a diretiva quando há um desses. Nesta feature ela **nunca é ligada a
  rota** — as rotas estão congeladas —, então `usePathname()` seria especulativo (Princípio V). Se
  a feature das rotas preferir `usePathname()`, a diretiva entra **lá**, no componente que a
  precisar.
- **`ShareButtons` → Server.** GitHub e LinkedIn são links reais (`<a href>`), que não precisam de
  JavaScript. A terceira ação — copiar o link — é a única que precisa, e ela **já existe** como
  `CopyLinkButton`, que já é a ilha cliente. `ShareButtons` compõe a ilha em vez de virar uma.
  Marcá-lo cliente arrastaria dois links estáticos para o bundle sem nada em troca.

### As outras duas recusas deliberadas, e as duas descidas para o filho

- **`LikeCommentBar` → Server.** Números de curtida e comentário são **dados de leitura**, não
  controles. FR-031b proíbe persistir, escrever em serviço ou absorver o Disqus — sem handler, sem
  diretiva.
- **`Button` e `IconButton` → Server.** Eles só **repassam** o `onClick` que recebem; não criam
  handler nem têm estado. A diretiva pertence a quem **cria** o handler. Sem diretiva, os dois
  servem aos dois lados da fronteira, que é o que um primitivo precisa fazer.
- **`CodeBlock` (S) → `CopyButton` (C)** — padrão que **já existe no repo** e que esta feature
  preserva em vez de "corrigir".
- **`Header` (S) → `SearchTrigger` (C)** — o mesmo padrão aplicado ao gatilho do ⌘K. É o que
  transforma `Header`, hoje Client Component inteiro (verificado), em Server Component.

**Contagem**: 32 Server + 6 Client = 38 unidades. `DisqusComments` também é cliente, mas **não
conta**: já era, não é tocado (SC-013) e está fora do inventário.

**Duas proibições que a fronteira impõe**, ambas reprovando o Portão 6 se violadas:

1. `CommandPalette` **MUST NOT** importar `src/lib/search-index.ts` — `getSearchIndex()` chama
   `getAllPosts()`, que lê o sistema de arquivos. **MAY** importar a função pura
   `searchIndex(index, query)` de `src/lib/search.ts` (FR-031a). Importar não é alterar, logo não
   fere SC-011.
2. Nenhum Client Component pode ser `async` nem importar módulo `server-only` (Princípio III).

---

## 4 · Como a re-estilização não quebra as rotas atuais

Regra operante, fixada em FR-016: **o contrato mínimo é congelado.** São as props que
`src/app/**` efetivamente consome:

```text
Container({ className })      CopyLinkButton({ url })     Footer()
Header()                      Hero()                      PostCard({ post })
PostContent({ body })         PostsListing({ page })      ShareButtons({ url, title })
TagPill({ tag, href })        Toc({ items })
```

Essas props **não** são renomeadas, removidas, tornadas obrigatórias nem têm o tipo estreitado.
Prop nova entra **opcional e com valor padrão** — é assim que `Header({ index })` de FR-016a cabe
no contrato sem quebrá-lo: `Header()` continua chamável sem argumento.

`Button`, `FeaturedPostCard`, `Pagination` e `CodeBlock` não são chamados por nenhuma rota — só
por outros componentes ou pelo pipeline MDX — então a API deles é **livre**.

### E se uma API do contrato precisar mesmo mudar?

O pedido pressupõe que, nesse caso, a mudança na rota entra na **mesma tarefa**, porque os portões
5 e 6 têm de ficar verdes ao fim de cada tarefa (Portão 8). A regra de acoplamento está certa e
vale integralmente — **mas nesta feature ela não tem onde ser aplicada**, e é melhor dizer isso
agora do que descobrir na metade da camada 4:

1. Alterar um call site **alteraria `src/app/**`**, violando SC-011 e a seção Out of Scope, que
   admitem exatamente dois arquivos. Não é uma saída disponível — é o **motivo** pelo qual o
   contrato é congelado.
2. Portanto, se durante a implementação um desenho novo parecer exigir quebra de contrato, a
   resposta correta é **adicionar prop opcional com padrão**, não quebrar.
3. Se isso for genuinamente impossível para algum componente, a feature **para** e a spec é
   emendada — a rota não é alterada em silêncio, e o escopo não é ampliado depois do fato
   (Constituição §Falha de portão: ampliar escopo exige emenda **antes** da correção).

**Onde a regra de "mesma tarefa" de fato morde**: não no call site, mas na **composição interna**.
Quando a tarefa do `ShareButtons` mudar a API do `CopyLinkButton`, os dois estão na mesma camada e
a atualização entra na mesma tarefa. Idem `CodeBlock`/`CopyButton` e `Header`/`SearchTrigger`.

**Verificação, a cada tarefa**:

```bash
git diff --name-only -- src/app/ src/lib/ src/content/
# única saída aceitável: src/app/globals.css e src/app/layout.tsx
git diff -- src/app/layout.tsx
# e nele, nada fora do bloco de fontes e da className do <html>
```

---

## 5 · Estratégia de teste por componente

Três artefatos por componente (FR-043), em **dois níveis de teste** que respondem a perguntas
diferentes. O nível de cada unidade está fixado em `contracts/components.md`.

### Nível 1 — Teste de story: as 38 unidades

Roda no project `storybook`, em **chromium real**. Prova o que só a renderização prova:

- render de **cada** estado e variante (FR-036, SC-003) — a régua de SC-003 é a lista de estados
  da tarefa daquele componente em `tasks.md`, não "os estados enumerados na spec", porque 16 dos
  36 não enumeram nenhum;
- as **duas entradas por estado**: `<Estado>` em 1280px e `<Estado>Mobile` em 390px, cada uma
  declarando a própria largura (FR-038b). O controle global de viewport **não** conta;
- a entrada de **hover** por elemento interativo, forçada por `storybook-addon-pseudo-states`
  (FR-018a) — entrada única, só em 1280px (SC-002);
- `addon-a11y` com `test: "error"`, incluindo `color-contrast` (régua de SC-007) e `target-size`
  (régua de SC-008, que **não** vem habilitada por padrão);
- asserção de `document.documentElement.scrollWidth <= 390` em cada entrada `Mobile` (régua de
  SC-009) — inspeção visual não conta.

### Nível 2 — Teste de comportamento: `<Nome>.test.tsx`, as 38 unidades

Roda no project `components` (jsdom), colocado na pasta do componente (FR-043a). Para as **32
unidades declarativas** cobre o que a story não prova por render: que a prop produz a saída certa,
que o caso de borda não explode, que o elemento é o elemento semântico certo.

| Unidade | Asserção que a story não dá |
|---|---|
| `Avatar` | sem `src` e sem `name` aproveitável → marcador neutro, não string vazia (EC-01) |
| `PostCard`, `PostListRow` | resumo ausente → bloco omitido e espaço colapsado, sem texto de substituição (EC-03); sem categoria → faixa cai para `hairline` (EC-04) |
| `Shelf` | `title: null` → marcador de vazio, e **nenhum** título inventado no DOM (FR-035, US5/AS-3) |
| `YearArchive` | ano com `count: 0` **permanece** no DOM como hiato (EC-06) |
| `EmptyState` | o DOM **não contém** "0 resultados" nem equivalente (FR-032) |
| `Pagination` | com uma única página os **dois** extremos ficam desabilitados **e visíveis** (EC-05) |
| `CategoryBadge` | cada uma das 5 categorias resolve para a sua cor fixa (FR-009) |
| `SeriesShelf` | com um único item não quebra (EC-10); item `read` é distinguível |
| `CodeBlock` | sem nome de arquivo ou sem linguagem → campo omitido, ação de copiar mantida (EC-07) |
| `Button` | `disabled` impede o clique; `href` renderiza `<a>`, `onClick` renderiza `<button>` |
| todo interativo | menor dimensão do alvo ≥ 44px (SC-008); foco visível presente (FR-018b) |

### Nível 2b — Teste de interação: as 6 unidades com transição real

As mesmas seis da fronteira cliente, e não por coincidência: **transição de estado é o que
justifica a diretiva e é o que a story estática não prova.**

| Unidade | Interação a provar |
|---|---|
| `CodeBlock/CopyButton` | clique → estado "copiado" com retorno visível; **e** o caminho em que `navigator.clipboard` é negada (EC-08) |
| `CopyLinkButton` | idem |
| `CommandPalette` | `⌘K` abre; `esc` fecha no desktop; `×` fecha em 390px; busca com resultado **e** vazia; índice vazio cai no `EmptyState` sem "0 resultados" (EC-11) |
| `Toc` | celular: recolhido → aberto; desktop: **item ativo muda com a rolagem** |
| `ReadingProgress` | a fração lida reflete a posição de rolagem |
| `Header/SearchTrigger` | o botão abre a palette |

**`navigator.clipboard` não existe em jsdom por padrão.** O teste do `CopyButton` e do
`CopyLinkButton` precisa de dublê — e é o dublê que torna testável o **caminho de falha** (cópia
negada), que é caso de borda declarado da spec (EC-08), não cenário impossível.

### Os 3 casos de ambiente, que **não** viram entrada no catálogo

FR-036b classifica por natureza: caso que é estado renderizável vira entrada **e** teste; caso que
é condição do ambiente vira **só** teste de comportamento. São três:

| Caso | Onde o teste vive |
|---|---|
| EC-08 — cópia negada pelo navegador | `CopyButton.test.tsx`, `CopyLinkButton.test.tsx` |
| EC-12 — `prefers-reduced-motion: reduce` | **teste único do design system** (FR-042a, SC-016) — nenhum componente repete a regra, logo nenhum repete o teste |
| EC-13 — texto a 200% sem perda nem rolagem horizontal | `PostContent` e todo componente com texto em caixa de largura fixa |

---

## 6 · Portão 6 — execução limpa, de forma repetível

**Quando roda**: ao fim de **cada camada**, em **tarefa própria** (T004 para a camada 1, e a
equivalente em cada uma das outras cinco), e **uma vez mais ao fim da feature**. Não roda a cada
tarefa. Essa é a **única exceção de cadência** da constituição, e ela é nomeada lá — não é
liberdade deste plano. O motivo é medido: onze rotas × duas execuções × seis camadas já são 132
aberturas manuais; a cada tarefa seriam quase uma centena por camada, e o custo não compraria
detecção, porque os defeitos que este portão encontra nascem da **composição**, que só existe com
a camada fechada.

**Quais rotas**: as **onze** de `GATES.md` §6, **nessa ordem**, cada uma aberta duas vezes:

```bash
npm run dev                  # as onze, na ordem
npm run build && npm start   # as mesmas onze — hydration mismatch só aparece aqui
```

**O que observar**, nos **dois** canais, com a régua da constituição (lista **aberta**: qualquer
erro e qualquer aviso novo reprovam, mesmo que a página renderize):

| Canal | O que reprova |
|---|---|
| Terminal | qualquer erro; qualquer aviso novo contra a base de `GATES.md` §3 |
| Console do navegador | idem — e o **overlay de desenvolvimento do Next.js** conta como canal de erro |

Os casos de maior risco, que MUST ser procurados ativamente: **hydration mismatch**; `"use client"`
faltando em componente com hook ou handler; import de módulo `server-only` dentro de Client
Component; Client Component `async`; uso de API de browser durante render no servidor. São
**exemplos**, não o limite do que reprova. A única tolerância é a lista **fechada** de `GATES.md`
§4 — hoje um item, o aviso do `configLoader: 'native'` do Vite.

**Ambiente da inspeção**: Chromium **sem extensão ativa** (perfil limpo ou janela sem extensões).
Extensão injeta aviso próprio e contamina a leitura.

**Evidência**: este é o único portão manual. Quem o roda **registra no corpo do commit** quais
rotas passaram, em `dev` e em produção, e qualquer aviso encontrado. Portão manual sem registro é
afirmação de quem implementou, que a constituição não aceita como verificação.

### O que o Portão 6 desta feature prova — e o que não prova

Distinção essencial, e a fonte de erro mais provável na leitura dos resultados: **`src/app/**` está
congelado**, então nenhuma rota passa a compor um componente **novo** enquanto esta feature durar.

| Camada | O que as onze rotas exercitam de fato | Valor do portão nessa camada |
|---|---|---|
| 1 — tokens | todos os 15 componentes existentes, com tokens novos e sem re-estilização | **Alto.** É a única camada que altera `src/app/**`; token removido e ainda referenciado por classe Tailwind quebra aqui |
| 2 — primitivos | `Button`, `TagPill`, `Container` re-estilizados | Médio — não-regressão dos três |
| 3 — navegação | `Header` (rota `/`, todas), `Pagination` (`/page/2`) | **Alto.** `Header` muda de Client para Server Component: é onde hydration mismatch é mais provável |
| 4 — conteúdo | `PostCard`, `PostsListing`, `Hero`, `PostContent`, `FeaturedPostCard` | **Alto.** Densidade de rotas |
| 5 — dentro do post | `Toc`, `CodeBlock`, `CopyButton`, `ShareButtons`, `CopyLinkButton` em `/posts/<slug>` | **Alto.** A rota mais densa em Client Components |
| 6 — busca/vazio | `Footer` (todas as rotas); `/search` com o `SearchBox` **intocado** | Médio — `CommandPalette` e `EmptyState` não são alcançados por rota nenhuma |

**Conclusão a registrar em cada evidência**: o Portão 6 desta feature é um portão de
**não-regressão**. Ele prova que trocar os tokens e re-estilizar os quinze componentes existentes
não quebrou nenhuma rota, em `dev` e em produção. Ele **não** prova nada sobre os vinte e um
componentes novos — a verificação de execução deles é o **Portão 4** (story em navegador real),
até que a feature das rotas os componha. Ler a coluna "exercitará" de `GATES.md` §6 como evidência
faria o portão afirmar cobertura que ele não tem.

**Verificação específica desta feature, junto do portão**: `/search` continua funcionando com o
`SearchBox` antigo e visual antigo. Isso é **esperado**, não defeito (SC-013).

---

## 7 · Verificação de contraste — item de aceitação, não sugestão

**Isto é critério de aceitação de toda tarefa que produz superfície colorida.** Não é sugestão,
não é item de review, e não depende de alguém lembrar de olhar. Valores calculados em R3.

**Passa** — `ink` sobre todos os acentos: flame 5.87, sun 11.74, mint 8.00. Sobre os fundos:
canvas 16.41, paper 18.24, sand 14.62, blush 16.67. `ink-blue` sobre canvas 5.82, paper 6.47.
Branco sobre ink 18.69, ink-blue 6.63, LinkedIn `#0A66C2` 5.69.

**Reprova** — branco sobre flame 3.18 (passaria só ≥24px), **branco sobre sun 1.59**, **branco
sobre mint 2.34**. As duas últimas reprovam **em qualquer tamanho**.

**Regra operante** (idêntica a FR-008, corrigida na fase de planejamento para exatamente esta
régua):

```text
Sobre flame, sun e mint → texto SEMPRE ink, em qualquer tamanho.
Branco SOMENTE sobre ink, ink-blue, code-bg e #0A66C2 (brand-linkedin).
```

### Onde verificar nominalmente, por camada

| Camada | Componente | O par a verificar |
|---|---|---|
| 2 | `CategoryBadge` | as **5** categorias: flame, mint, sun, ink-blue, ink |
| 2 | `Button` | variante `accent` |
| 3 | `Header` | faixa `sun` no desktop |
| 3 | `MobileTabBar`, `SideRail` | marca do item ativo sobre acento |
| 4 | **`FeaturedPostCard`** | **título em display sobre o acento — o ponto de maior risco** |
| 4 | `PostListRow` | faixa por categoria |
| 4 | `PostCard` | variante de superfície `dark` |
| 4 | `CategoryCard` | contagem em display sobre a cor da categoria |
| 5 | `Callout` | os três tipos |
| 5 | `PrevNext` | "próximo" com fundo `ink` |

### Contraste não textual — o anel de foco

FR-041 cobria **só texto**, e era por isso que um anel de foco invisível sobre acento passava por
todas as réguas da feature. **Medido**: `ink-blue` dá **2.08:1 sobre flame** e **2.84:1 sobre
mint** — reprova o mínimo de 3:1 nas duas. A cor do anel troca por superfície (FR-041a), e é
**regra de sistema**, decidida na Camada 1:

```text
Anel sobre flame, sun, mint          → ink
Anel sobre ink, ink-blue, code-bg    → --color-white
Anel sobre canvas, paper, sand, blush → ink-blue
```

**Ainda não medido, entregável da Camada 1**: `ink-blue` sobre `sand` e sobre `blush`. Abaixo de
3:1, aquela superfície troca para `ink`.

### Como a verificação acontece de fato

Três réguas, e nenhuma delas é "olhar":

1. **`color-contrast` do `addon-a11y`**, com `test: "error"`, sobre as **duas** entradas de cada
   estado. Reprova o teste, não reporta.
2. **Tabela de contraste em `DESIGN.md`** para os pares que o addon não alcança — texto sobre
   superfície que a story não compõe.
3. **Item de aceitação nominal na tarefa**, pela tabela acima: a tarefa daquele componente não
   fecha sem o par conferido.

---

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| **Terceiro project do Vitest (`components`) + 3 devDependencies** (`jsdom`, `@testing-library/react`, `@testing-library/jest-dom`) | A clarificação fixou **dois níveis** de teste por componente (story + comportamento) com colocação na pasta do componente. O project `unit` roda em `node` e só inclui `tests/unit/**/*.test.ts` — não renderiza React nem enxerga `.tsx`. Sem um ambiente que renderize, o nível de comportamento não existe. | *Trocar `unit` para jsdom*: arrastaria os 4 testes de lógica de `src/lib` para jsdom sem motivo e apagaria a distinção entre teste de lógica e de componente. *Rodar os `.test.tsx` no project `storybook`*: aquele project é governado pelo plugin `storybookTest`, que descobre **stories**, não arquivos de teste arbitrários; forçar exigiria um quarto project em modo browser, mais lento (sobe chromium) e mais complexo que jsdom, sem ganho — renderização em navegador real já está coberta pelas stories. |
| **`Header/SearchTrigger`, componente fora do inventário da spec** | O botão "Buscar" e o `CommandPalette` compartilham o estado `open`. Sem uma ilha que contenha os dois, o estado sobe para o `Header`, que voltaria a ser Client Component inteiro — exatamente o que o Princípio III proíbe ("subir `use client` para o pai por conveniência é violação, mesmo que funcione"). | *`Header` como Client Component*: viola o Princípio III e joga a subárvore do header no bundle do cliente. *`CommandPalette` gerenciando o próprio `open` e escutando ⌘K global*: o botão da TopBar não teria como abri-la, e a story perderia o controle determinístico dos estados fechada/resultado/vazia que FR-031 exige. O precedente `CodeBlock` (S) → `CopyButton` (C) já existe no repo; isto é o mesmo padrão. |
| **Fixar 7 devDependencies hoje em `"latest"`** (R14) — mexe em `package.json` além do que a feature "precisa" | FR-046a define a linha de base como comparável **por identidade** (arquivo, linha, texto). Identidade pressupõe que a ferramenta que emite a mensagem seja a mesma entre duas execuções. Com `vitest` (portões 3 e 4) e `playwright` flutuando em `"latest"`, a base pode mudar de texto **sem nenhuma alteração no repositório** — e R13 já é esse efeito acontecendo. Sem fixar, a base que a T001 registra tem validade desconhecida e o Portão 8 passaria a reprovar tarefas por regressão que não é regressão. | *Deixar como está e registrar o risco*: transferiria para **cada** tarefa o custo de distinguir "aviso novo por regressão" de "aviso novo por upgrade silencioso" — que é precisamente a distinção que FR-046a existe para tornar automática. O custo de fixar é uma linha por dependência, pago uma vez, na tarefa que já está mexendo em `package.json` para criar os scripts. |

**Não** consideramos complexidade injustificada: `lucide-react` (decisão explícita do autor na
clarificação), `storybook-addon-pseudo-states` + o upgrade acoplado para 10.6.0 (consequência
aceita na clarificação de FR-018a) e a criação de `DESIGN.md` (exigida pelo Princípio I).

---

## Riscos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| As 11 stories existentes reprovarem a11y quando `test` virar `"error"` | Média — **nunca rodaram uma única vez** (o Portão 4 é inexecutável) | Consertar dentro da T001; é baseline, não dívida. É o risco que mais pode alongar a T001 |
| Camada 1 quebrar o Portão 5 ao remover tokens ainda referenciados por classe Tailwind | **Alta** | `grep` dos 19 tokens aubergine em `src/components/**` **antes** de removê-los; valor válido garantido ao fim da camada, provisório se preciso, rastreado em `DESIGN.md` (FR-046b) |
| Branco sobre `sun`/`mint` entrar por engano no `FeaturedPostCard` | Média | Item de aceitação nominal por camada (§7); `addon-a11y` com `color-contrast` reprova |
| Base do Portão 5 registrada com o aviso ambiental do lockfile órfão | **Alta se não decidida** — o aviso aparece em toda build nesta máquina | §1.6 força a decisão na T001: base zero + ruído tolerado, ou apagar o arquivo órfão (fora do repo) |
| Base mudar sozinha por `"latest"` resolver outra versão | Média | Fixar as sete na T001 (R14), **antes** de registrar a base |
| Verificar o pré-requisito do Portão 4 listando a pasta de caches e obter falso positivo | **Alta** — há um `chromium_headless_shell-1217` instalado (R13) | A régua é executar `npx vitest run --project storybook`, nunca `ls` |
| `git checkout` ressuscitar o `DESIGN.md` aubergine que está no índice | Média (R15) | A Camada 1 substitui o arquivo no mesmo commit dos tokens; `DESIGN.md` com token inexistente é violação do Princípio I |
| O artifact mudar outra vez durante a implementação | Média — já mudou uma vez | Reler os três artboards antes de iniciar cada camada; a versão lida está em R7 |
| `navigator.clipboard` ausente em jsdom travar o teste do `CopyButton` | Alta | Dublê no teste; o caminho de falha é EC-08, caso de borda previsto pela spec |
| Portão 6 vermelho só em produção (hydration) e passar batido no `dev` | Média — e a camada 3 é a mais exposta, porque `Header` muda de Client para Server | O procedimento exige as **onze** rotas **duas vezes**: `dev` e `build && start` |

---

## Divergências entre artboard e entrega, registradas

1. **Alternador de tema não é portado** — artboards mostram botão de tema; tema único decidido,
   FR-010 proíbe alternador (R9).
2. **Seção "05 · MODO ESCURO" do artboard `Sistema` ignorada na íntegra** (R9).
3. **Ícones de traço, não pintados** — artboards dizem "ícone pintado, nunca contornado";
   `lucide-react` é biblioteca de traço. Decisão do autor com o conflito à vista (R2).
4. **`MobileTabBar` 74px**, do artboard mobile, contra 62px do artboard desktop (R10).
5. **Marcas GitHub/LinkedIn como SVG oficial**, porque lucide não tem ícone de marca (R2).
6. **`Button` `md` em 44px, não nos 40px do artboard** — 40px reprova o mínimo de alvo de toque,
   MUST no Princípio IV e incondicional em FR-037/SC-008. A constituição prevalece sobre o mock.
7. **Anel de foco muda de cor conforme a superfície**, embora o artboard desenhe um anel só — o
   anel único `ink-blue` reprova 3:1 sobre `flame` (2.08) e `mint` (2.84). FR-041a.
8. **`MobileTabBar`: a aba preenche os 74px da barra**, contra os 62px que o artboard desenha
   dentro de uma barra de 74px. R10 lera 62 × 74 como conflito entre artboards; medido em R16, são
   medidas de coisas diferentes — barra e aba. FR-034 exige 74 por aba, e a spec prevalece sobre o
   desenho. Os dois valores já passam o mínimo de 44px, então isto não é questão do Princípio IV.
9. **Toda borda de 1,5px do mock vira 2px** — 34 ocorrências medidas nos três artboards (`Kbd`,
   pílulas de tag pequenas, pontos de categoria, segmentos de progresso). FR-007 fixa espessura
   única e a régua 2 de SC-004 só sanciona `border-2` (R16 §D-B).
10. **`Avatar` `lg` segue o rótulo (78/108), não o swatch (64px)** — o card rotula
    `LG 108 · MD 44 · SM 32` e desenha o `lg` em 64px, que é compromisso de diagramação (R16 §D-C).
11. **Os cinco destinos ficam no `Header`**, embora o artboard os mova para a `SideRail` e a
    `MobileTabBar`. Nenhuma das duas pode ser montada com `layout.tsx` congelado à composição
    `Header`/`main`/`Footer`, e removê-los do `Header` deixaria as onze rotas sem navegação — sem
    que nenhum dos oito portões percebesse, porque a página renderiza sem erro e sem aviso
    (FR-013a). A transferência pertence à feature das rotas, junto da montagem das duas.
