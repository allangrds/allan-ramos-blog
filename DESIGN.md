# Design system

Fonte única de verdade para as decisões visuais do blog (paleta, tipografia, espaçamento, componentes). Todos os tokens vivem em `src/app/globals.css`, definidos via `@theme inline` do Tailwind v4 — qualquer token novo deve ser adicionado lá, nunca hardcoded em componentes.

Identidade inspirada no site de marketing do Slack (slack.com): aubergine (`#4a154b`) como cor primária, tipografia bold com tracking apertado nos títulos, componentes em formato pill, e rótulos/badges compactos em caixa alta.

## Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#4a154b` | Cor de marca (aubergine), botões primários, links ativos |
| `--color-primary-deep` / `-press` / `-tint` | variações | Estados hover/press e superfícies tingidas |
| `--color-on-primary` | `#ffffff` | Texto sobre fundo primário |
| `--color-ink` / `-mute` | `#1d1d1d` / `#696969` | Texto principal / texto secundário |
| `--color-link-blue` / `-hover` | `#1264a3` / `#3860be` | Links inline no corpo do texto |
| `--color-canvas` | `#ffffff` | Fundo padrão das páginas |
| `--color-canvas-cream` | `#f4ede4` | Fundo de destaque (citações, chips) |
| `--color-canvas-lavender` | `#f9f0ff` | Fundo de seções de destaque (ex.: hero) |
| `--color-surface-aubergine` | `#4a154b` | Fundo do footer |
| `--color-hairline` / `-strong` | `#e6e6e6` / `#000000` | Bordas/divisores |
| `--color-semantic-error` / `-success` | `#cc4117` / `#007a5a` | Estados semânticos |

## Tipografia

Fonte: **Plus Jakarta Sans** (`next/font/google`, variável `--font-jakarta`), exposta como `--font-sans`.

| Token | Tamanho | Peso | Uso |
|---|---|---|---|
| `--text-display-xxl` | 64px | 700 | Headline da hero |
| `--text-display-xl` | 58px | 600 | Reservado para headlines grandes |
| `--text-display-lg` | 50px | 700 | Reservado para headlines grandes |
| `--text-display-md` | 32px | 700 | Título de post em destaque / título da página de post |
| `--text-heading-lg` | 24px | 700 | H1 dentro do corpo de um post |
| `--text-heading-md` | 22px | 600 | Título de post na listagem / H2 do corpo |
| `--text-heading-sm` | 18px | 600 | Wordmark do header / H3 do corpo |
| `--text-body-lg` | 18px | 400 | Subtítulo da hero, resumo do post em destaque |
| `--text-body-md` | 16px | 400 | Corpo de texto padrão |
| `--text-body-strong` | 16px | 700 | H4 do corpo do post |
| `--text-button-lg` / `-md` | 18px / 16px | 700 | Texto de botões (`Button`) |
| `--text-caption` | 14px | 400 | Metadados: datas, chips, links de ação secundários |
| `--text-micro-cap` | 12px | 700 | "Eyebrow labels": badges e rótulos em caixa alta (ex.: "Sumário", "Último post") |

Regra geral: rótulos/metadados/badges usam `--text-caption` ou `--text-micro-cap` (nunca `--text-body-md`); apenas headlines e títulos de conteúdo usam os tamanhos maiores.

## Espaçamento, raio e sombra

- Spacing: `--spacing-xs` (4px) até `--spacing-huge` (28px).
- Radius: `--radius-xs` (2px) até `--radius-xxl` (48px), mais `--radius-pill` (90px) para botões, chips e inputs.
- Shadow: `--shadow-sm/md/lg` para elevação de cards.

> **Cuidado:** `--spacing-xs/sm/md/lg/xl/xxl` reaproveitam os mesmos nomes ("xl", "lg"...) que o Tailwind v4 já usa por padrão para `max-w-*`, `w-*`, `gap-*`, etc. Usar classes como `max-w-xl` ou `gap-lg` nos componentes vai resolver para os valores pequenos definidos acima (ex.: `max-w-xl` virou 20px), não para o tamanho padrão do Tailwind. Prefira classes numéricas do Tailwind (`max-w-2xl`, `gap-4`) como o resto do código já faz — os tokens de spacing acima são só referência semântica, não devem ser usados via utilidades nomeadas.

## Componentes

- **`Button`** (`src/components/Button/Button.tsx`): variantes `primary` (pill sólido `bg-primary`) e `secondary` (pill outline). Tamanhos `lg`/`md`. Renderiza como link (`href`) ou `<button>`. Usado em CTAs (Hero), paginação e ações do header.
- **Chips/pills** (`TagPill`, badge do `FeaturedPostCard`): sempre `rounded-pill` + `--text-caption`/`--text-micro-cap`, nunca corpo de texto padrão.
- **Cards** (`PostCard`, `FeaturedPostCard`): borda hairline + `rounded-xl`/`shadow-md` para o card em destaque; metadados (data) sempre em `--text-caption`.
