# Contrato dos componentes

**Feature**: `002-redesign-components` | **Spec**: [../spec.md](../spec.md)

A interface pública desta feature é o conjunto de props dos 36 componentes. Este arquivo é o
contrato: assinatura, fronteira cliente/servidor com justificativa, e nível de teste.

## Legenda

- **🔒 CONGELADO** — prop consumida por `src/app/**`. **MUST NOT** ser renomeada, removida,
  tornada obrigatória nem ter o tipo estreitado (FR-016). `src/app/**` está congelado por
  SC-011; quebrar isso reprova o Gate 5.
- **S** = Server Component (sem diretiva). **C** = Client Component (`"use client"`).
- **Teste**: `story` = render + variantes + a11y na story. `story+interação` = também teste de
  interação. Todo componente tem **além disso** um `<Nome>.test.tsx` colocado na sua pasta
  (FR-043, FR-043a).

---

## Camada 1 — Tokens, fontes e documentação

Sem componente. Entrega `src/app/globals.css` (valores trocados, estrutura `:root` +
`@theme inline` preservada), `src/app/layout.tsx` (as três fontes por `next/font/google`) e
`DESIGN.md` criado.

`src/app/globals.css` e `src/app/layout.tsx` são a **exceção única e declarada** ao
congelamento de `src/app/**` (seção Out of Scope da spec). Nenhum outro arquivo sob `src/app/**`
é tocado.

---

## Camada 2 — Primitivos

| Componente | Assinatura | S/C | Por quê | Teste |
|---|---|---|---|---|
| `Button` | `{ variant?: "primary"\|"secondary"\|"accent", size?: "lg"\|"md", disabled?: boolean, icon?: ReactNode, fullWidth?: boolean, className?: string, children }` + união `href` \| `onClick`/`type` — `lg` 48px, `md` **44px** (não os 40px do artboard: 40 reprova o Princípio IV, FR-037 e SC-008) | **S** | Só **repassa** o `onClick` que recebe; não cria handler nem tem estado. A diretiva pertence a quem cria o handler. Sem diretiva ele serve aos dois lados. | story |
| `IconButton` | `{ icon: LucideIcon, label: string, variant?: "neutral"\|"accent"\|"brand", size?: number }` + união `href` \| `onClick` | **S** | Mesmo motivo do `Button`. `label` é obrigatório: vira o nome acessível (FR-036a). | story |
| `Avatar` | `{ name: string, src?: string, size?: "sm"\|"md"\|"lg" }` | **S** | Render puro. `lg` é responsivo: 78px em 390px, 108px no desktop (R8). Sem `src` → iniciais de `name`. | story |
| `CategoryBadge` | `{ category: Categoria }` | **S** | Render puro. Cor fixa por categoria (FR-009); texto sempre `ink`. | story |
| `TagPill` | 🔒 `{ tag: string, href: string }` + `{ active?: boolean, count?: number }` | **S** | Render puro; `href` é link real. `tag` e `href` são contrato congelado. | story |
| `Kbd` | `{ children }` | **S** | Render puro. Mono. | story |
| `InlineCode` | `{ children }` | **S** | Render puro. Mono. | story |
| `Container` | 🔒 `{ className?: string, children }` | **S** | Render puro. `className` é contrato congelado. | story |

**Nota sobre `Avatar` sem nome utilizável** (caso de borda da spec): sem `src` e sem `name`
aproveitável, renderiza o marcador neutro — nunca string vazia dentro do círculo.

---

## Camada 3 — Navegação

| Componente | Assinatura | S/C | Por quê | Teste |
|---|---|---|---|---|
| `Header` | 🔒 `({ index })` — `index?: SearchIndexEntry[]`, padrão `[]`; **chamável sem argumento**, que é o que o contrato congela | **S** | Composto por partes; a interação vive na ilha cliente abaixo. A prop opcional é o único caminho legal do índice até o `CommandPalette` (FR-016a). | story |
| `Header/SearchTrigger` | `{ index }` — recebido do `Header`, nunca buscado (SC-015) | **C** | Botão "Buscar" + `CommandPalette` compartilham o estado `open`. Ilha mínima que mantém `Header` no servidor. Mesmo padrão de `CodeBlock/CopyButton`, que já existe no repo. | story+interação |
| `SideRail` | `{ activeHref?: string }` | **S** | Cinco links reais; o ativo vem por prop. Sem estado. | story |
| `MobileTabBar` | `{ activeHref?: string }` | **S** | **Ver nota abaixo.** Links reais, ativo por prop, 74px por aba (FR-034, R10). | story |
| `Breadcrumb` | `{ items: Array<{ label: string, href?: string }> }` | **S** | Links reais. Último item sem `href`. | story |
| `Pagination` | assinatura atual preservada (**não** é contrato congelado: FR-016 não o lista e nenhuma rota o chama direto, então a API é livre — o 🔒 anterior contradizia spec e plano) | **S** | Links reais. Extremo desabilitado vira tracejado e **permanece visível** (FR-030). | story |
| `ReadingProgress` | `{ value?: number }` | **C** | Lê a posição de rolagem (`window`/`scroll`). Sem `value`, calcula; com `value`, a story controla. | story+interação |

**Nota — `MobileTabBar` é Server Component, contra a expectativa inicial.** Foi listada como
candidata óbvia a cliente. Ela só precisaria de `"use client"` para chamar `usePathname()`.
Recebendo `activeHref` por prop ela não tem estado, efeito, handler nem API de browser — e o
Princípio III só autoriza a diretiva quando há um desses. Nesta feature ela nunca é ligada a
rota (as rotas estão fora de escopo), então usar `usePathname()` seria especulativo
(Princípio V). Se a feature das rotas preferir `usePathname()`, a diretiva entra lá, no
componente que a precisar.

**Nota — o alternador de tema dos artboards não entra.** `TopBar` e `MobileHeader` mostram um
botão de tema; tema único foi decidido na clarificação e FR-010 proíbe alternador. O `Header`
entrega marca + gatilho do ⌘K + avatar (R9).

**Nota — `TopBar` não é um componente novo.** Os artboards nomeiam `TopBar` (desktop, 68px) e
`MobileHeader` (celular, 64px); a spec fixou que são as duas apresentações responsivas do
`Header` já existente, cujo nome é preservado (FR-013) e cuja assinatura `Header()` é contrato
congelado.

---

## Camada 4 — Conteúdo

| Componente | Assinatura | S/C | Por quê | Teste |
|---|---|---|---|---|
| `PostCard` | 🔒 `{ post }` + `{ surface?: "light"\|"dark" }` | **S** | Render puro. `surface` é variante de **desenho**, não tema (FR-023). `post` é contrato congelado. | story |
| `PostListRow` | `{ post }` | **S** | Render puro. Faixa colorida = categoria. Com e sem numeração de série (FR-024). | story |
| `FeaturedPostCard` | assinatura atual preservada | **S** | Render puro. Título em display sobre o acento — **texto sempre `ink`** (R3). | story |
| `CategoryCard` | `{ category: { name, count, titles } }` | **S** | Render puro. Contagem em display. | story |
| `SeriesShelf` | `{ series: Série }` | **S** | Links reais. Item lido distinguível (US5/AS-5). | story |
| `YearArchive` | `{ years: Array<{ year, count }> }` | **S** | Render puro. Ano com `count: 0` permanece como hiato (US5/AS-4). | story |
| `TilList` | `{ items: Array<{ lang, term, note }> }` | **S** | Render puro; dado por prop (FR-031b). | story |
| `Shelf` | `{ items: Array<{ shelf, title: string\|null }> }` | **S** | Render puro. `title: null` → marcador de vazio, nunca livro inventado (FR-035). | story |
| `PostsListing` | 🔒 `{ page: number }` | **S** | Contrato congelado. Re-estilização apenas. | story |
| `Hero` | 🔒 `()` — sem props | **S** | Contrato congelado. Re-estilização apenas. | story |
| `PostContent` | 🔒 `{ body }` | **S** | Contrato congelado. Medida de 65–72 caracteres por linha (FR-012). | story |

---

## Camada 5 — Dentro do post

| Componente | Assinatura | S/C | Por quê | Teste |
|---|---|---|---|---|
| `CodeBlock` | assinatura atual preservada | **S** | **Já está correto hoje**: o cliente é só o `CopyButton`. Cabeçalho com arquivo, linguagem e copiar; dica de rolagem em 390px (FR-026). | story |
| `CodeBlock/CopyButton` | `{ text: string }` | **C** | `navigator.clipboard` + estado `copied`. Já é cliente. | story+interação |
| `Toc` | 🔒 `{ items }` | **C** | `useState` (recolhido/aberto no celular) + rolagem para o item ativo no desktop. Já é cliente. | story+interação |
| `ShareButtons` | 🔒 `{ url, title }` | **S** | GitHub e LinkedIn são links reais; a terceira ação compõe o `CopyLinkButton`, que já é a ilha cliente. Mantém `ShareButtons` no servidor. | story |
| `CopyLinkButton` | 🔒 `{ url }` | **C** | `navigator.clipboard` + estado `copied`. Já é cliente. | story+interação |
| `Callout` | `{ kind: "note"\|"quote"\|"checklist", title?: string, children }` | **S** | Render puro. Os três tipos (FR-029). | story |
| `AuthorCard` | `{ name, date, readingTime, wordCount? }` | **S** | Render puro; tempo e contagem recebidos, não calculados. | story |
| `PrevNext` | `{ prev?, next? }` | **S** | Links reais. O "próximo" usa fundo `ink` e sombra no acento. | story |
| `LikeCommentBar` | `{ likes: number, comments: number }` | **S** | **Só leitura.** Sem persistência, sem escrita, sem absorver o Disqus (FR-031b). Sem handler → sem diretiva. | story |

**Ícones de marca**: `github` e `linkedin` **não existem** em `lucide-react` (2118 ícones, zero
marcas — verificado em R2). As duas entram como SVG oficial de cada marca. Vale também para o
`Footer`.

---

## Camada 6 — Busca, vazio e rodapé

| Componente | Assinatura | S/C | Por quê | Teste |
|---|---|---|---|---|
| `CommandPalette` | `{ open: boolean, onOpenChange: (open: boolean) => void, index }` | **C** | Estado do campo de busca + escuta de teclado (`⌘K`, `esc`). `open` controlado por prop para a story poder mostrar fechada / com resultado / vazia de forma determinística (FR-031). | story+interação |
| `EmptyState` | `{ title: string, hint?: string }` | **S** | Render puro. Contorno tracejado; **MUST NOT** exibir "0 resultados" nem equivalente (FR-032). | story |
| `Footer` | 🔒 `()` — sem props | **S** | Links reais. Três colunas + atalho do design system. | story |

**`CommandPalette` MUST NOT importar `src/lib/search-index.ts`** — `getSearchIndex()` chama
`getAllPosts()`, que lê o sistema de arquivos; import de módulo de servidor em Client Component
reprova o Gate 6. **MAY** importar a função pura `searchIndex(index, query)` de
`src/lib/search.ts` (FR-031a). Importar não é alterar, logo não fere SC-011.

---

## Fora do inventário

| Componente | Estado |
|---|---|
| `SearchBox` | **Intocado, zero linha alterada** (FR-015, SC-013). Fica em disco porque `src/app/search/page.tsx` o importa e rotas estão fora de escopo. Não recebe story nem teste. A remoção pertence à feature das rotas. |
| `DisqusComments` | **Intocado, zero linha alterada** (SC-013). |

---

## Resumo da fronteira cliente/servidor

**6 Client Components entre os 38 que esta feature entrega**, todos folha ou quase-folha:

`Header/SearchTrigger`, `ReadingProgress`, `CodeBlock/CopyButton`, `Toc`, `CopyLinkButton`,
`CommandPalette`. `DisqusComments` também é cliente, mas **não conta**: já era, não é tocado
(SC-013) e está fora do inventário — somá-lo dava o "7" que divergia das seis linhas `C` da tabela.

**Os outros 32 são Server Components** — 32 + 6 = 38, que são os 36 do inventário mais os
sub-componentes `CodeBlock/CopyButton` e `Header/SearchTrigger`. Três casos em que a diretiva foi
**deliberadamente recusada**, por não haver estado, efeito, handler criado localmente nem API
de browser:

1. `MobileTabBar` — ativo por prop em vez de `usePathname()`.
2. `ShareButtons` — compõe o `CopyLinkButton`, que é a ilha.
3. `LikeCommentBar` — números são dados de leitura, não controles.

E dois em que a diretiva fica no filho, não no pai:

- `CodeBlock` (S) → `CopyButton` (C) — padrão que **já existe** no repo.
- `Header` (S) → `SearchTrigger` (C) — mesmo padrão, aplicado ao gatilho do ⌘K.
