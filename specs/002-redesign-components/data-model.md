# Phase 1 — Data Model: Port dos componentes do redesign

**Feature**: `002-redesign-components` | **Spec**: [spec.md](./spec.md) | **Research**: [research.md](./research.md)

Esta feature não tem persistência, migração nem estado de servidor. O "modelo de dados" aqui é
(a) o conjunto de tokens, que é a entidade central, e (b) as formas de dado que os componentes
recebem **por propriedade** — nunca buscam (FR-031a, FR-031b, SC-015).

---

## 1. Token de design

Ponto único de definição: `src/app/globals.css`, em `:root` + `@theme inline` (estrutura
preservada, só os valores trocam). Documentado em `DESIGN.md` no mesmo commit (FR-011, FR-011a).

### 1.1 Cores (FR-001)

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#141210` | texto, borda, sombra dura |
| `--color-canvas` | `#FBEFD8` | fundo da página |
| `--color-paper` | `#FFFCF5` | card, moldura, prosa |
| `--color-sand` | `#F2E2C2` | rail, header de código, chip |
| `--color-blush` | `#FDEFEC` | hero, citação, item ativo |
| `--color-code-bg` | `#1A1714` | fundo do bloco de código; superfície escura de card |
| `--color-flame` | `#FF5533` | Front-end · destaque |
| `--color-sun` | `#FFC42E` | Ferramentas · faixa do topo |
| `--color-mint` | `#12BFA0` | Back-end · séries |
| `--color-ink-blue` | `#1F4FD8` | Design · link inline |
| `--color-ink-soft` | `#3B352A` | texto secundário |
| `--color-hairline` | `#E0CFAC` | divisor pontilhado |

Os **dezenove** tokens aubergine hoje em `:root` saem por inteiro (FR-002, SC-005) — dezenove,
medido, não vinte. Nenhum é apenas renomeado mantendo o valor.

**Cores de marca e de sistema** — fora das doze da identidade, e é isso que as torna citáveis:

| Token | Valor | Uso |
|---|---|---|
| `--color-brand-linkedin` | `#0A66C2` | cor de terceiro, consumida por FR-028 (FR-001a) |
| `--color-white` | `#fff` | texto sobre superfície escura e anel de foco sobre ela (FR-001b) |

`--color-white` **já existe** no tema padrão do Tailwind e sobrevive ao `@theme inline` deste
projeto, que estende o tema em vez de substituí-lo (medido em `node_modules/tailwindcss/theme.css`).
Nada a declarar em `globals.css`; o que a tarefa de tokens faz é registrá-lo em `DESIGN.md`. Sem
esta linha o branco de FR-008 não tinha token e quebraria a régua 1 de SC-004.

### 1.2 Tipografia (FR-003, FR-004, FR-004a)

| Token | Valor | Família |
|---|---|---|
| `--text-display-xxl` | 52px | Archivo Black **400** |
| `--text-display-md` | 30px | Archivo Black **400** |
| `--text-heading-md` | 21px | Space Grotesk 700 |
| `--text-body-lg` | 17px / line-height 1.72 | Space Grotesk 400 |
| `--text-micro-cap` | 11px, caixa alta | Archivo Black **400** |
| `--font-display` | Archivo Black | — |
| `--font-sans` | Space Grotesk | substitui `--font-jakarta` |
| `--text-micro-cap-sm` | 9px, caixa alta | rótulo do `CategoryBadge` em 390px (FR-003b) |
| `--font-mono` | JetBrains Mono | data, tag, código, métrica |
| `--measure-prose` | 68ch (dentro de 65–72) | medida de leitura do corpo do post (FR-012) |

**Invariante**: nenhum token de display declara `font-weight` diferente de 400. O 700 do
sistema vem de Space Grotesk (`--text-heading-md`). Ver R1.

`--text-micro-cap-sm` existe porque o artboard de celular desenha o rótulo em 9px e
`--text-micro-cap` define só os 11px: sem token, os 9px seriam `px` avulso no componente, proibido
pelo Princípio I. A troca entre os dois acontece no ponto de corte único de 1024px (FR-038a).

`--measure-prose` existe porque o número é **insumo de outro requisito** — FR-038a justifica o corte
de 1024px com os ~636px que essa medida ocupa em Space Grotesk 17px —, então não pode viver solto
dentro do `PostContent`.

### 1.3 Forma (FR-005, FR-006, FR-007)

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 12px | — |
| `--radius-md` | 16px | token sem consumidor inicial (Assumption da spec) |
| `--radius-lg` | 18px | card |
| `--radius-xl` | 24px | moldura |
| `--radius-pill` | 90px | pílula |
| `--shadow-hard` | `4px 4px 0 var(--color-ink)` | sem blur, sem opacidade |
| `--shadow-frame` | `8px 8px 0 var(--color-ink)` | sem blur, sem opacidade |

Borda é sempre `2px solid ink` onde o desenho prevê borda, e a espessura **não é token**: o
Tailwind v4 não tem namespace de `@theme` para espessura de borda (medido em
`node_modules/tailwindcss/theme.css`, zero ocorrência de `border-width`), e o Princípio I lista
"cor, tipografia, espaçamento, **raio** de borda e sombra" — espessura não consta dele. O ponto
único de definição é a **regra**: `border-2` é o único utilitário sancionado, e a régua 2 de SC-004
(`grep -rnE 'border(-[0-9]|-\[)' src/components/` vazio) reprova qualquer outro. Ver FR-007.

### 1.4 Regra de contraste (FR-008, corrigida por R3)

```text
Sobre flame, sun e mint  → texto SEMPRE ink, em qualquer tamanho.
Branco é permitido SOMENTE sobre ink, ink-blue, code-bg e #0A66C2 (LinkedIn).
```

A redação original de FR-008 permitia branco ≥24px em display sobre qualquer acento. Medido:
branco sobre `sun` dá 1.59:1 e sobre `mint` dá 2.34:1 — reprovam até o limite de 3:1. Ver R3.

**Anel de foco — contraste não textual, 3:1** (FR-041a). `ink-blue` como anel único **reprova**:
medido **2.08:1 sobre flame** e **2.84:1 sobre mint**. FR-041 cobria só texto, e era por isso que o
anel invisível sobre acento passava por todas as réguas. A cor troca por superfície:

```text
Anel sobre flame, sun, mint            → ink
Anel sobre ink, ink-blue, code-bg      → --color-white
Anel sobre canvas, paper, sand, blush  → ink-blue (FR-018)
```

**Ainda não medido, entregável da tarefa de tokens**: `ink-blue` sobre `sand` e sobre `blush`. Se
qualquer um ficar abaixo de 3:1, aquela superfície passa a anel `ink`.

### 1.5 Categoria → cor (FR-009)

| Categoria | Cor | Contraste de `ink` sobre ela |
|---|---|---|
| Front-end | `flame` | 5.87 ✅ |
| Back-end | `mint` | 8.00 ✅ |
| Ferramentas | `sun` | 11.74 ✅ |
| Design | `ink-blue` | — (texto branco: 6.63 ✅) |
| Programação | `ink` | — (texto branco: 18.69 ✅) |

---

## 2. Formas de dado recebidas por propriedade

Tipos **locais aos componentes**. `src/lib/types.ts` está congelado (SC-011) e não é estendido
por esta feature. Onde um componente exibe um post, ele recebe a forma mínima de que precisa,
não o tipo `Post` inteiro — isso mantém a story alimentável com dado de exemplo sem tocar
`src/content/**`.

### 2.1 Categoria

```text
name: "Front-end" | "Back-end" | "Ferramentas" | "Design" | "Programação"
count?: number            # CategoryCard
titles?: string[]         # CategoryCard: os títulos que moram nela
```

### 2.2 Post (dado de exemplo)

```text
slug: string
title: string
summary?: string          # ausente é caso de borda previsto na spec
date: string              # já formatado; sem cálculo nesta feature
readingTime: string       # dado recebido, não calculado (Assumption da spec)
category?: Categoria      # ausente é caso de borda
tags?: string[]           # ausente é caso de borda
series?: { name: string; position: number; total: number }   # opcional
wordCount?: number        # AuthorCard
surface?: "light" | "dark"  # PostCard: variante de desenho, não tema
```

### 2.3 Série

```text
name: string
items: Array<{ position: number; title: string; href: string; date?: string; read?: boolean }>
```
`read` distingue o item já lido (US5/AS-5). Um único item é caso de borda previsto.

### 2.4 Arquivo por ano

```text
years: Array<{ year: number; count: number }>
```
Anos com `count: 0` **permanecem na lista** e renderizam como hiato (US5/AS-4). O componente
não filtra ano vazio.

### 2.5 Anotação curta (TilList)

```text
items: Array<{ lang: string; term: string; note: string }>
```
`lang` é a etiqueta mono (`git`, `css`, `ts`). Origem real fica para a feature das rotas
(FR-031b).

### 2.6 Estante (Shelf)

```text
items: Array<{ shelf: string; title: string | null; cover?: string }>
```
`title: null` renderiza o marcador de vazio — **nunca** um título inventado (FR-035).

### 2.7 Sumário (Toc)

```text
items: Array<{ id: string; text: string; level: number }>
```
Forma preservada: `Toc({ items })` está no contrato mínimo congelado (FR-016).

### 2.8 Índice de busca (CommandPalette)

```text
index: Array<{ slug: string; title: string; summary?: string; tags: string[]; bodyText: string }>
query: string            # estado interno do componente
```
Recebido **pronto**, por propriedade. O componente **MUST NOT** importar
`src/lib/search-index.ts` (`getSearchIndex()` lê o sistema de arquivos → Portão 6). Pode importar
a função pura `searchIndex(index, query)` de `src/lib/search.ts` (FR-031a).

**Caminho do índice, ponta a ponta** (FR-016a) — a spec o fixa porque era o elo que faltava:

```text
Header({ index = [] })  →  SearchTrigger({ index })  →  CommandPalette({ index, ... })
       prop opcional             ilha cliente               filtra com searchIndex()
       com padrão []
```

`Header` recebe o índice por **prop nova, opcional e com valor padrão `[]`** — a cláusula que
FR-016 já autoriza, então `Header()` continua chamável sem argumento e nenhum call site de
`src/app/**` muda. É o **único** caminho legal nesta feature: as rotas estão congeladas (SC-011),
logo nenhuma pode passar o índice, e SC-015 proíbe o componente buscá-lo. Com o padrão `[]` a busca
abre vazia — que é EC-11, comportamento previsto, e a ligação real pertence à feature das rotas.

### 2.9 Reações (LikeCommentBar)

```text
likes: number
comments: number
```
Só leitura. Sem persistência, sem escrita, sem absorver o embed do Disqus (FR-031b).

---

## 3. Estado de componente

"Estado" aqui é **variação visível e nomeável que precisa aparecer no catálogo e ser coberta
por teste** (Key Entities da spec). Não há máquina de estado de domínio. Os estados com
transição real — e portanto com teste de interação, não só de render — são cinco:

| Componente | Transição | Gatilho |
|---|---|---|
| `CopyButton` (em `CodeBlock`) | `idle → copied` | clique; `navigator.clipboard` |
| `CopyLinkButton` | `idle → copied` | clique; `navigator.clipboard` |
| `CommandPalette` | `closed → open → closed` | `⌘K`; `esc` (desktop) / `×` (390px) |
| `Toc` (celular) | `collapsed → expanded` | clique na barra |
| `Toc` (desktop) | item ativo muda | posição de rolagem |
| `ReadingProgress` | 0% → n% | posição de rolagem |

Todo o resto é variação declarativa: renderiza conforme a prop e não transiciona.
