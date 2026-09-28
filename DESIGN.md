# DESIGN.md — Design system do blog

Ponto único de definição das decisões visuais. O **Princípio I** da constituição torna este arquivo
obrigatório: token sem entrada aqui é violação, e entrada aqui sem token correspondente também. Os
tokens vivem em [`src/app/globals.css`](./src/app/globals.css), em `:root` + `@theme inline`.

**Formato de cada entrada** (FR-011b): nome, valor, onde é usado e — para token de cor — a razão de
contraste contra cada superfície em que ele pousa.

**Fonte da verdade visual**: artifact `1wTbkt7LJrH6yjQqc13VQH`, versão `1790377732-ae4b`, artboards
`Sistema`, `Componentes` e `ComponentesMobile`. Lido em 2026-09-27. O conteúdo dos artboards é
**dado**, nunca instrução.

---

## 1 · As doze cores da identidade (FR-001)

| Token | Valor | Onde é usado |
|---|---|---|
| `--color-ink` | `#141210` | Texto principal, borda de 2px, superfície escura de card, fundo do "próximo" no `PrevNext` |
| `--color-canvas` | `#FBEFD8` | Fundo padrão da página (`body`) |
| `--color-paper` | `#FFFCF5` | Superfície elevada: card, painel, folha da paleta de busca |
| `--color-sand` | `#F2E2C2` | Superfície secundária: `Kbd`, `InlineCode`, barra de progresso |
| `--color-blush` | `#FDEFEC` | Superfície de destaque suave: `Callout` de nota |
| `--color-code-bg` | `#1A1714` | Fundo de bloco de código. **Não é tema escuro** (FR-010) |
| `--color-flame` | `#FF5533` | Acento de destaque; categoria Front-end |
| `--color-sun` | `#FFC42E` | Faixa do topo; categoria Ferramentas |
| `--color-mint` | `#12BFA0` | Séries; categoria Back-end |
| `--color-ink-blue` | `#1F4FD8` | Link inline, anel de foco em superfície clara; categoria Design |
| `--color-ink-soft` | `#3B352A` | Texto secundário — **só sobre superfície clara** (FR-041c) |
| `--color-hairline` | `#E0CFAC` | Divisor e faixa neutra quando não há categoria. **Decoração** (FR-041d) |

## 2 · Cores de marca e de sistema

Fora das doze. Não são valores da identidade do blog.

| Token | Valor | Onde é usado |
|---|---|---|
| `--color-brand-linkedin` | `#0A66C2` | Fundo da ação de LinkedIn no `ShareButtons` (FR-028). Cor de terceiro, tokenizada para que **nenhum hex literal** sobre em `src/components/**` (FR-001a) |
| `--color-white` | `#fff` | Texto sobre superfície escura. **Token do tema padrão do Tailwind, não criado aqui** — sobrevive ao `@theme inline`, que estende em vez de substituir (FR-001b) |

---

## 3 · Contraste — medido, não afirmado

Calculado por **luminância relativa WCAG 2.x**; o par é (token de texto, token da superfície
imediata). Nenhum token carrega canal alfa e FR-006 proíbe opacidade nas sombras, então composição
nunca ocorre e o par é sempre determinado (FR-041b).

**negrito** = passa 4,5:1 · ⚠ = passa só como texto grande (3:1) · ✗ = reprova

| texto ╲ superfície | `canvas` | `paper` | `sand` | `blush` | `flame` | `sun` | `mint` | `ink` | `ink-blue` | `code-bg` | `brand-linkedin` |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `ink` | **16.41** | **18.24** | **14.62** | **16.67** | **5.87** | **11.74** | **8.00** | — | 2.82 ✗ | 1.05 ✗ | 3.29 ⚠ |
| `ink-soft` | **10.67** | **11.86** | **9.51** | **10.84** | 3.82 ⚠ | **7.63** | **5.20** | 1.54 ✗ | 1.83 ✗ | 1.47 ✗ | 2.14 ✗ |
| `ink-blue` | **5.82** | **6.47** | **5.19** | **5.91** | 2.08 ✗ | 4.16 ⚠ | 2.84 ✗ | 2.82 ✗ | — | 2.69 ✗ | 1.17 ✗ |
| `white` | 1.14 ✗ | 1.02 ✗ | 1.28 ✗ | 1.12 ✗ | 3.18 ⚠ | 1.59 ✗ | 2.34 ✗ | **18.69** | **6.63** | **17.85** | **5.69** |

**Texto grande** é ≥24px **ou** ≥18,66px em peso ≥700 — a definição do WCAG, que é a mesma que o
`axe-core` implementa. Na escala deste sistema isso alcança um único token: `--text-heading-md`,
21px em peso 700 (FR-041).

### Regras operantes

```text
Sobre flame, sun e mint  → texto SEMPRE ink, em qualquer tamanho.
Branco SOMENTE sobre     → ink, ink-blue, code-bg e brand-linkedin.
Texto secundário         → ink-soft só em superfície clara; em superfície escura, --color-white.
```

`ink-soft` reprova sobre `ink` (1,54) e sobre `code-bg` (1,47) em qualquer tamanho, e sobre `flame`
passa só como texto grande (3,82). Isso alcança nominalmente a variante `dark` do `PostCard` e o
`CodeBlock` (FR-041c).

### Elemento não textual (FR-041a)

Precisa de **3:1** contra a superfície adjacente. O anel de foco troca de cor por isso:

```text
Anel sobre flame, sun, mint            → ink
Anel sobre ink, ink-blue, code-bg      → --color-white
Anel sobre canvas, paper, sand, blush  → ink-blue
```

`ink-blue` reprova como anel sobre `flame` (2,08) e sobre `mint` (2,84). Sobre as quatro superfícies
claras passa — medido em 2026-09-27: canvas 1.35 · paper 1.50 · sand 1.20 · blush 1.37 para `hairline`, e para o anel
`ink-blue`: canvas 5,82 · paper 6,47 · **sand 5,19** · **blush 5,91** (os dois últimos eram a
medição que faltava a FR-041a).

`--color-hairline` é **decoração**, fora de FR-041a — reprova 3:1 nas quatro superfícies claras
(canvas **1.35** · paper **1.50** · sand **1.20** · blush **1.37**). A declaração só é legítima sob a condição de FR-041d: toda estrutura que o
divisor sugere MUST existir na semântica, de modo que removê-lo não perca informação.

---

## 4 · Tipografia

### O que o artboard declara, e o que é escolha desta implementação

FR-003a exige que as cinco escalas declarem os três sub-tokens e que os **valores** sejam lidos do
artboard `Sistema`. O artboard foi lido, e declara **menos do que a spec supunha**: tamanho nas
cinco, entrelinha só em `body-lg`, peso só em `heading-md`, e **letter-spacing em nenhuma**. O que
falta é fixado aqui e marcado como **escolha da implementação**, não como leitura do mock.

| Token | Tamanho | Entrelinha | Letter-spacing | Peso | Família |
|---|---|---|---|---|---|
| `--text-display-xxl` | 52px ᴬ | 1.05 ᴵ | -0.02em ᴵ | 400 ᴰ | Archivo Black ᴬ |
| `--text-display-md` | 30px ᴬ | 1.15 ᴵ | -0.01em ᴵ | 400 ᴰ | Archivo Black ᴬ |
| `--text-heading-md` | 21px ᴬ | 1.3 ᴵ | -0.005em ᴵ | 700 ᴬ | Space Grotesk ᴬ |
| `--text-body-lg` | 17px ᴬ | **1.72 ᴬ** | 0em ᴵ | 400 ᴵ | Space Grotesk ᴬ |
| `--text-micro-cap` | 11px ᴬ | 1 ᴵ | 0.08em ᴵ | 400 ᴰ | Archivo Black ᴬ |
| `--text-micro-cap-sm` | 9px ᴬ | 1 ᴵ | 0.08em ᴵ | 400 ᴰ | Archivo Black ᴬ |

**ᴬ** lido do artboard · **ᴵ** escolha desta implementação · **ᴰ** derivado de FR-004a (Archivo Black
tem uma única espessura, 400 — não é escolha livre)

Justificativa das escolhas ᴵ: entrelinha apertada no display porque 52px com entrelinha de corpo
abre buraco entre linhas; `micro-cap` em 1 porque é rótulo de uma linha; letter-spacing negativo no
display para compensar a largura do Archivo Black, e **positivo** (`0.08em`) no `micro-cap` porque
caixa alta sem tracking fecha demais. `--text-micro-cap-sm` (FR-003b) existe para os 9px de 390px
do `CategoryBadge` não serem `px` avulso; a troca acontece no corte de 1024px e em nenhum outro.

### As três famílias (FR-004, FR-004a, FR-004b, FR-004c)

| Token | Família | Pesos | Papel |
|---|---|---|---|
| `--font-display` | Archivo Black | **400 apenas** | Display e rótulo em caixa alta |
| `--font-sans` | Space Grotesk | 400/500/600/700 | Corpo e título de card. O peso 700 do sistema vem sempre daqui |
| `--font-mono` | JetBrains Mono | 400/500/700 | Data, tag, código e métrica |

Componente MUST NOT pedir peso fora do conjunto de cada família, e o conjunto é exatamente o que
`next/font/google` carrega. **Mecanismo** da proibição de negrito sintético: `font-synthesis: none`
em `globals.css`, ponto único (FR-004b). Carregamento com `display: "swap"` e `adjustFontFallback`
declarados explicitamente (FR-004c); provedor indisponível é falha por causa externa, que **bloqueia**
a tarefa em vez de concluí-la com fonte alternativa.

---

## 5 · Forma

| Token | Valor | Onde é usado |
|---|---|---|
| `--radius-sm` | 12px ᴬ | Selo, pílula pequena, `Kbd` |
| `--radius-md` | 16px | **Sem consumidor inicial.** Consta da identidade pedida e **não aparece rotulado no artboard** — medido em 2026-09-27, os rotulados são 12, 18, 24 e pill. Criado como disponível, por decisão registrada em *Assumptions* |
| `--radius-lg` | 18px ᴬ | Card |
| `--radius-xl` | 24px ᴬ | Moldura, folha da paleta de busca |
| `--radius-pill` | 90px ᴬ | Botão, pílula de tag. Idêntico ao sistema anterior — sobrevive intacto |
| `--shadow-hard` | `4px 4px 0 ink` ᴬ | Sombra padrão. Sem blur, sem opacidade |
| `--shadow-frame` | `8px 8px 0 ink` ᴬ | Moldura de destaque. Sem blur, sem opacidade |

### Espessura de borda — regra, não token (FR-007)

**`border-2` é o único utilitário de espessura sancionado.** O Tailwind v4 **não tem namespace de
`@theme` para espessura de borda** (medido: zero ocorrência de `border-width` em
`node_modules/tailwindcss/theme.css`), logo ela não pode virar token consumível por utilitário. O
ponto único de definição é esta regra. `border`, `border-4` e `border-[…]` são violação, verificável
por `grep -rnE 'border(-[0-9]|-\[)' src/components/` devolvendo vazio (SC-004, régua 2).

O artboard desenha **34 bordas de 1,5px** (`Kbd`, pílulas pequenas, pontos de categoria, segmentos de
progresso). Todas viram 2px: a espessura é única no sistema.

---

## 6 · Espaçamento (FR-005a)

`--spacing: 0.25rem`, declarado no `@theme` de `globals.css`. É a **escala única** de espaçamento do
sistema, e dela derivam os utilitários numéricos (`mt-4`, `py-12`, `gap-2`) que os componentes já
usam. Os sete `--spacing-xs`…`--spacing-huge` do sistema anterior foram removidos por terem **zero
uso** — apelido sem consumidor viola o Princípio V. Nenhum call site mudou.

## 7 · Medida de leitura (FR-012)

`--measure-prose: 68ch` — o meio da faixa de 65–72 caracteres por linha exigida para o corpo do
post. É token, não valor avulso dentro do `PostContent`, porque é **insumo da justificativa** do
ponto de corte: 68ch em Space Grotesk 17px ocupa ~636px, e somado à `SideRail` (~200px) e às
margens exige ~900px de desktop.

## 8 · Ponto de corte responsivo (FR-038a)

**Um único, em 1024px** — o `lg` do Tailwind. **Nenhum breakpoint próprio é criado**, então não há
token: usa-se o prefixo `lg:`. Abaixo dele vale a apresentação de celular, a partir dele a de
desktop. Os quatro valores responsivos do sistema trocam nesse ponto e em nenhum outro:

| Valor | Celular | Desktop |
|---|---|---|
| `Avatar` tamanho `lg` | 78px | 108px |
| `CategoryBadge` rótulo | 9px (`--text-micro-cap-sm`) | 11px (`--text-micro-cap`) |
| `Header` altura | 64px | 68px |
| Navegação | `MobileTabBar` | `SideRail` |

Em 768px a coluna de texto cairia abaixo de 65 caracteres e FR-012 conflitaria com FR-038 — por isso
1024, não 768.

---

## 9 · Estados — regra de sistema, decidida uma vez

### Hover e `:active` (FR-018a)

Derivados das doze com `color-mix()`: hover mistura 8% de `currentColor` no fundo, `:active` 16%.
**Nenhum token novo e nenhuma cor nova** — é o que mantém SC-004 devolvendo vazio e as doze sendo
doze. O hover fica sob `@media (hover: hover)` para não disparar em toque.

O hover tem **entrada própria no catálogo** por elemento interativo, só em 1280px — 390px é contexto
de toque, onde hover não ocorre. O `:active` **não** ganha entrada: é provado por teste e review.

### Foco visível (FR-018b)

Contorno de **3px com afastamento de 3px** em todo elemento interativo, não só no `Button`. A cor
sai da tabela de §3. Não ganha entrada própria no catálogo — é provado por teste nos dois níveis: o
de comportamento assere alcance por teclado e o elemento semântico correto, e o de story, em
navegador real, é onde `:focus-visible` é efetivamente avaliado.

**A regra por superfície cobre dois casos, e o segundo foi corrigido em 2026-09-28.** O seletor é
`:is(.bg-sun, .bg-sun *):focus-visible`, não `.bg-sun :focus-visible`: a forma descendente acerta
só o que está **sobre** a superfície e deixa de fora o elemento que **é** a superfície — todo
controle sólido, como um `Button` `accent`. Esses caíam no padrão `ink-blue`, que dá **2,84:1**
sobre `sun` e **2,86:1** sobre `ink` e reprova o mínimo de 3:1 de FR-041a.

O defeito **não era pego por portão nenhum**: a regra `color-contrast` do `addon-a11y` não avalia
cor de contorno, então o Portão 4 ficava verde com o anel errado. A guarda agora é uma asserção de
`outlineColor` em navegador real, no `play` de `Button.stories.tsx` → `VariantsLg`, e foi validada
por **teste vermelho** — com o seletor antigo ela reprova, com o corrigido passa.

### Alvo de toque

Mínimo de **44px** na menor dimensão, em todo alvo tocável (74px por aba no `MobileTabBar`). Régua:
a regra `target-size` do `addon-a11y`, **habilitada explicitamente** em `.storybook/preview.tsx`
porque não vem ligada por padrão, mais a asserção da menor dimensão no teste de comportamento.

---

## 10 · Movimento reduzido — ponto único (FR-042a, SC-016)

`globals.css` neutraliza `transition` e `animation` sob `prefers-reduced-motion: reduce` para o
sistema inteiro. **Nenhum componente declara a própria consulta** — seriam 36 pontos de manutenção
para uma decisão que é uma.

O estado final é alcançado **sem** transição, nunca suprimido junto com a animação: por isso
`animation-fill-mode: forwards` com duração ~0, e **não** `animation: none`, que abortaria no estado
inicial. Verificado por [`tests/unit/design-system.test.ts`](./tests/unit/design-system.test.ts).

Nenhuma dependência de animação consta do `package.json`. Motion (`motion.dev`) foi avaliada e fica
fora desta feature.

## 11 · Tema único (FR-010, FR-010a)

Não há modo escuro: nenhum token de tema escuro, nenhum seletor (classe, atributo ou
`prefers-color-scheme`) e nenhum alternador. A seção "05 · MODO ESCURO" do artboard `Sistema` é
ignorada na íntegra, e o botão de tema que os artboards desenham **não** é portado.

`color-scheme: light` é declarado. Sem ele, o navegador de quem tem o **sistema operacional** em
modo escuro escurece por conta própria controles de formulário, barras de rolagem e fundo de
`<input>` — quebrando o tema único sem violar nenhum dos três mecanismos proibidos, porque nenhum
deles é código deste repositório. Declarar `light` **não** é seletor de tema: é informar ao
navegador que só existe um.

`code-bg` `#1A1714` e a variante `dark` do `PostCard` são **superfícies escuras dentro do tema
claro**, não temas.

---

## 12 · Bloco `/* LEGADO */` — só encolhe (FR-002a, FR-002b)

Quinze tokens do sistema anterior **sem sucessor** na identidade nova sobrevivem num bloco marcado
`/* LEGADO */` em `globals.css`, para que os componentes ainda não re-estilizados compilem:

`--text-display-xl` · `--text-display-lg` · `--text-heading-lg` · `--text-heading-sm` ·
`--text-body-md` · `--text-body-strong` · `--text-button-lg` · `--text-button-md` ·
`--text-button-cap` · `--text-caption` · `--radius-xs` · `--radius-xxl` · `--shadow-sm` ·
`--shadow-md` · `--shadow-lg`

**Regras do bloco:** só encolhe; cada tarefa de componente remove os que aquele componente deixou de
usar; **token novo MUST NOT ser adicionado**; e a T046 exige o bloco **vazio** e o remove do arquivo.
Enquanto o bloco existe, token legado **em uso** não conta como violação de FR-007 nem de SC-004 —
token legado **sem** uso conta, e sai pela tarefa que o órfãou.

**Nota de estrutura:** FR-002a diz que o bloco fica em `:root`. Estes tokens vivem hoje em
`@theme inline`, e não em `:root`, e FR-001 manda **preservar a estrutura** do arquivo. O bloco foi
criado onde os tokens já estavam. A divergência é de redação da spec, não de comportamento.

---

## 13 · Valores provisórios (FR-046b)

*Vazia.* Esta seção existe para o caso em que corrigir um portão vermelho exigiria alterar arquivo
fora de escopo: o escopo prevalece e o valor provisório é aceitável **se** registrado aqui **e**
coberto pela T046, que exige esta seção vazia antes do fim da feature.

A troca dos tokens não precisou de nenhum: dos 19 aubergine, 12 tinham uso real, e os três nomes
reusados (`ink`, `canvas`, `hairline`) cobrem a maior parte dos call sites.

**Consequência aceita, que não é valor provisório:** `SearchBox` perde a cor em quatro usos
(`text-ink-mute` ×2, `text-primary`, `border-primary`). Ele está **aposentado** por FR-015 — sai do
inventário, não recebe story nem teste — e SC-013 congela as **linhas** dele, não a aparência. A
feature das rotas remove o import e depois o arquivo. Nenhum token aubergine foi mantido vivo para
ele, então SC-005 fica intacto.

## 14 · Mudanças de API (FR-016)

*Vazia.* Toda mudança de API fora do contrato mínimo de FR-016 é registrada aqui, com justificativa.

---

## 15 · Removidos — registro histórico (SC-005)

Os **dezenove** tokens de cor da paleta aubergine anterior, que saíram por inteiro. SC-005 autoriza
esta seção nominalmente: registro histórico **não** conta como ocorrência.

`--color-primary` `#4a154b` · `--color-primary-deep` `#481a54` · `--color-primary-press` `#611f69` ·
`--color-primary-tint` `#592466` · `--color-on-primary` `#ffffff` · `--color-ink` `#1d1d1d` →
reusado com `#141210` · `--color-ink-mute` `#696969` → sucessor `--color-ink-soft` ·
`--color-link-blue` `#1264a3` · `--color-link-hover` `#3860be` · `--color-canvas` `#ffffff` →
reusado com `#FBEFD8` · `--color-canvas-cream` `#f4ede4` · `--color-canvas-lavender` `#f9f0ff` ·
`--color-surface-elev` `#ffffff` · `--color-surface-aubergine` `#4a154b` · `--color-hairline`
`#e6e6e6` → reusado com `#E0CFAC` · `--color-hairline-strong` `#000000` · `--color-semantic-error`
`#cc4117` · `--color-semantic-success` `#007a5a` · `--color-on-aubergine-mute` `#d9bdde`

Também removidos: a família `--font-jakarta` (Plus Jakarta Sans) e os sete `--spacing-*` nomeados,
estes por terem zero uso.

**Três nomes reaparecem com valor diferente** — `ink`, `canvas` e `hairline`. Reusar o nome com
valor novo é permitido e está registrado acima. Nenhum valor novo coincide com um valor antigo sob
nome diferente: não houve renomeio disfarçado (SC-005).
