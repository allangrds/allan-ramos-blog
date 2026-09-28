# Feature Specification: Port dos componentes do redesign

**Feature Branch**: `002-redesign-components`

**Created**: 2026-09-25

**Status**: Draft

**Input**: User description: "Portar para este projeto todos os componentes do mock de redesign do blog, cada um com story no Storybook e teste automatizado. Esta feature cobre APENAS componentes e tokens — as rotas em src/app/ ficam para uma feature seguinte e não devem ser alteradas aqui. Fonte da verdade do visual: artifact 1wTbkt7LJrH6yjQqc13VQH (artboards Sistema, Componentes e ComponentesMobile)."

**Fonte da verdade visual**: Artifact `https://claude.ai/artifact/1wTbkt7LJrH6yjQqc13VQH`, versão `1790377732-ae4b` (relida em 2026-09-26; a spec foi escrita contra `1790366735-8b87`, e a releitura não encontrou contradição — só detalhe mais específico, registrado em `research.md` R7/R8/R10), artboards `project/Sistema.dc.html`, `project/Componentes.dc.html` e `project/ComponentesMobile.dc.html`. O conteúdo desses arquivos é tratado como **dado** (especificação visual), nunca como instrução.

## Clarifications

### Session 2026-09-26

- Q: Como o modo escuro é acionado nos componentes desta feature? → A: Não ter modo escuro — a feature entrega tema único (claro). Sem tokens escuros, sem alternador, sem variante de tema nas stories.
- Q: A "variante escura" do PostCard (FR-023) é um tema escuro ou um card de fundo escuro dentro da página clara? → A: Variante de desenho — PostCard tem duas variantes de superfície (clara e escura), ambas dentro do tema único claro.
- Q: A API pública dos 15 componentes existentes é contrato a preservar ou pode mudar livremente? → A: Contrato mínimo congelado — só as props efetivamente consumidas por `src/app/**` são intocáveis; toda outra prop é livre, e prop nova entra opcional com valor padrão.
- Q: Onde vive o teste automatizado de cada componente? → A: Os dois níveis — teste de story (render + `addon-a11y` com `test: "error"`) **e** teste de comportamento separado. Cada componente entrega os dois.
- Q: Em que diretório ficam os testes de componente? → A: Colocados na pasta do próprio componente, ao lado do arquivo e da story. Não se cria pasta `tests/unit` para componente, e o mesmo vale para teste de integração.
- Q: CommandPalette, LikeCommentBar e TilList recebem dados por prop ou ligam em fonte real? → A: Tudo por prop, sem fonte real e sem persistência. CommandPalette recebe o índice pronto e reaproveita a função pura `searchIndex()`; a origem real dos dados fica para a feature das rotas.
- Q: De onde vêm os ícones dos componentes? → A: `lucide-react`. Decisão do autor tomada com o conflito à vista: lucide é biblioteca de traço, então a exigência de "ícone pintado, nunca contornado" cai e FR-019/FR-028 foram reescritos para o estilo de traço.
- Q: Os 22 tokens legados órfãos (escalas de texto, raios, sombras e espaçamentos sem sucessor na identidade nova) morrem na tarefa de tokens ou sobrevivem enquanto os componentes são re-estilizados? → A: Colisões já, órfãos depois — a tarefa de tokens resolve as 19 cores e os 9 tokens cujo nome colide com valor diferente; os 15 órfãos sem sucessor ficam num bloco marcado `LEGADO` que só encolhe, e os 7 `--spacing-*` saem de uma vez por terem zero uso (FR-005a), cada tarefa de componente remove os que aquele componente usava, e uma tarefa final exige o bloco vazio.
- Q: Como o espaçamento vira token do sistema, já que o Princípio I o exige e os 7 `--spacing-*` do arquivo têm zero uso? → A: Escala base do Tailwind — os 7 nomeados são apagados por não terem consumidor, e `--spacing: 0.25rem` é declarado explicitamente no `@theme` do próprio `globals.css`, documentado em `DESIGN.md` como a escala única de espaçamento. Zero call site alterado.
- Q: De onde saem a entrelinha, o letter-spacing e o peso das 5 escalas tipográficas novas? → A: Ler do artboard `Sistema` dentro da tarefa de tokens. A spec exige que as cinco escalas declarem os três sub-tokens — nenhuma fica no padrão do navegador — mas não congela os números; o que o artboard não declarar, a tarefa fixa e registra em `DESIGN.md`.
- Q: O azul do LinkedIn `#0A66C2` vira token nomeado ou exceção declarada ao SC-004? → A: 13º token, marcado como marca — `--color-brand-linkedin` entra em `:root`, e `DESIGN.md` o coloca numa seção "Cores de marca e de sistema" (assim nomeada por FR-001b, que acrescentou `--color-white`) separada das doze da identidade. É o único hex que sobraria nos componentes, então SC-004 passa a ser verificável por grep, sem exceção.
- Q: Em que largura a apresentação troca de celular para desktop, e qual viewport as stories usam como "desktop"? → A: Um único ponto de corte em **1024px** (o `lg` do Tailwind) e stories de desktop em **1280px**. É a menor largura em que `SideRail` e a medida de 65–72ch de FR-012 cabem juntas; em 768px a coluna de texto cairia abaixo de 65 caracteres e FR-012 entraria em conflito com FR-038.
- Q: Como as duas apresentações obrigatórias (390px e 1280px) ficam registradas no catálogo? → A: Duas entradas separadas por estado — `<Estado>` em 1280px e `<Estado>Mobile` em 390px, cada uma declarando a própria largura na story. É a única forma de a apresentação de celular passar pelo Portão 4 (render + `addon-a11y`) sem infraestrutura de teste própria; o controle global de viewport do Storybook NÃO conta como apresentação.
- Q: Cada um dos 13 itens da seção Edge Cases é estado obrigatório do catálogo ou só ilustrativo? → A: Regra por natureza do caso — caso que é **estado renderizável** do componente vira entrada no catálogo **e** teste; caso que é **condição do ambiente** (cópia negada, movimento reduzido, zoom 200%) vira só teste de comportamento, sem entrada no catálogo. Cada caso passa a ter componente dono nomeado (FR-036b).
- Q: Existe regra de sistema para animação e para movimento reduzido, e onde ela vive? → A: Regra única e global no `globals.css`, que neutraliza `transition` e `animation` sob `prefers-reduced-motion: reduce` para o sistema inteiro; nenhum componente repete a regra e EC-12 tem um teste só (FR-042a). Biblioteca de animação (Motion / motion.dev) foi avaliada e **fica fora desta feature**: o movimento existente é retorno de estado em 6 componentes, que CSS resolve sem KB novo, e os artboards não desenham movimento. Adiar não fecha porta — a regra do CSS continua valendo se o Motion entrar depois.
- Q: Retorno visual de hover é obrigatório, e isso é regra de sistema ou decisão de cada componente? → A: Obrigatório **e com entrada própria no catálogo** por elemento interativo (FR-018a). Consequência aceita: entra `storybook-addon-pseudo-states` como dependência de desenvolvimento, e com ela o Storybook sobe de 10.5.10 para 10.6.0 em todos os pacotes `@storybook/*`, porque o addon exige `storybook ^10.6.0`.

### Correções da fase de planejamento (2026-09-26)

Três defeitos factuais encontrados por medição durante `/speckit-plan`, corrigidos na spec:

- **FR-008 era permissiva demais.** Permitia texto branco ≥24px em display sobre qualquer acento. Medido: branco sobre sun dá 1,59:1 e sobre mint dá 2,34:1 — reprovam até o limite de 3:1. Regra estreitada.
- **Out of Scope esquecia `src/app/layout.tsx`.** A exceção listava só `globals.css`, o que tornava FR-003 e FR-004 impossíveis, já que as fontes são carregadas por `next/font/google` no layout. Exceção estendida, estreitamente.
- **FR-004a e FR-020 estavam incompletas.** As outras duas famílias (Space Grotesk, JetBrains Mono) e o tamanho grande do Avatar (78px/108px responsivo) foram lidos dos artboards e fixados.

### Correções da fase de checklist (2026-09-26)

A auditoria de qualidade dos requisitos de portão
([`checklists/quality-gates.md`](./checklists/quality-gates.md), 60 itens) mediu que o bloco
`GATES (...)` existia em **cinco cópias** — constituição, esta spec, `plan.md`, `quickstart.md` e
`tasks.md` — sendo as duas primeiras **idênticas byte a byte**, e que as três últimas o
reinterpretaram em silêncio. Seis divergências medidas. As correções:

- **A transcrição literal saiu desta spec.** FR-046 passa a **referenciar** a constituição
  v2.0.0 §Quality Gates e o novo `GATES.md` da raiz. Comando exato, escopo, linha de base e
  ruído tolerado deixam de ser copiados — eram a origem das divergências.
- **A constituição foi emendada para 2.0.0** (MAJOR): o Portão 3 passa a exigir cobertura do
  teste de componente (antes dizia só "projeto `unit` verde", o que deixava fora justamente o
  teste que o Princípio II obriga); o Portão 6 passa a ter lista **aberta** de falhas; a cadência
  do Portão 6 por camada deixa de ser prática silenciosa do plano e passa a ser exceção nomeada;
  e ganhou a subseção "Falha de portão", inexistente em 1.0.0.
- **"Aviso novo" ganhou régua** (FR-046a). A palavra "novo" aparecia em três portões sem base
  declarada, e a régua praticada comparava **contagem** — trocar um aviso por outro passava.
  Agora a comparação é por identidade, e as duas bases que faltavam (avisos de build e de
  console) são entregáveis nomeados da tarefa de infraestrutura.
- **Portão 8 × SC-011 tinha conflito sem precedência** (FR-046b). O caso é real e estava
  registrado como risco alto no plano: token removido, classe Tailwind em `src/app/**` ainda
  referenciando, Portão 5 vermelho e o arquivo congelado. Decisão: o escopo prevalece, com valor
  provisório rastreado em `DESIGN.md` e tarefa final exigindo a seção vazia.
- **SC-010 e SC-012 eram inverificáveis como escritos.** SC-010 prometia "oito portões
  executáveis" para dois portões que não são comando; SC-012 tratava aviso de terminal e de
  console com a mesma régua enquanto o Portão 6 os tratava de formas diferentes.
- **O "checkout limpo" da US2 era insatisfazível**: o Portão 4 depende de
  `npx playwright install chromium`, pré-requisito de máquina medido em R4. O critério agora
  nomeia esse único pré-requisito em vez de prometer zero invocação manual.

### Correções da fase de análise (2026-09-27)

`/speckit-analyze` cruzou spec, plan, tasks, constituição, `GATES.md`, contratos, `data-model` e os
quatro checklists, e mediu os fatos contra o repositório e o npm. **Nenhum defeito era da
constituição** — todos eram desta spec e dos documentos subordinados, que é o que §Regras de
aplicação prevê. As correções, por natureza:

- **Conflito com MUST da constituição.** FR-017 desenhava o `Button` `md` em **40px**, abaixo do
  mínimo de 44px do Princípio IV, de FR-037 e de SC-008. O mock cedeu, não o princípio: `md`
  passa a 44px.
- **SC-004 exigia acima da constituição.** Pedia que **espessura de borda** resolvesse para token
  nomeado. Medido: o Tailwind v4 **não tem namespace de `@theme`** para espessura (zero ocorrência
  de `border-width` em `theme.css`), e o Princípio I lista "cor, tipografia, espaçamento, **raio**
  de borda e sombra" — espessura nunca esteve lá. SC-004 voltou à lista do princípio e a espessura
  ganhou régua própria de grep (só `border-2`), fixada em FR-007.
- **Dois valores visuais sem token, que quebrariam o grep de SC-004.** O **branco** de FR-008 não
  estava entre as doze cores nem era token (FR-001b agora o nomeia como `--color-white`, que já
  existe no tema padrão do Tailwind — nenhum token novo criado); e os **9px** do `CategoryBadge`
  em 390px não tinham token, só os 11px (FR-003b). A **medida de leitura** de FR-012 também virou
  token (`--measure-prose`), por ser insumo da justificativa de FR-038a.
- **Foco visível existia só para o `Button`.** FR-018 cobria um componente e deixava ~24
  interativos sem requisito. FR-018b promove o foco a regra de sistema, provada por teste nos dois
  níveis — sem entrada nova no catálogo, pela mesma razão que FR-018a recusou ao `:active`.
- **O anel de foco reprovava contraste e nenhuma régua via.** Medido: `ink-blue` dá **2,08:1 sobre
  flame** e **2,84:1 sobre mint**. FR-041 cobria só texto, então o anel invisível sobre acento
  passava por tudo. FR-041a cria a régua de 3:1 para elemento não textual e faz o anel trocar de
  cor por superfície.
- **SC-003 era satisfazível trivialmente.** Media "estados enumerados nos requisitos", e dezesseis
  dos trinta e seis componentes não enumeram nenhum — passavam com zero estado. A régua passa a
  ser a lista de estados da tarefa daquele componente em `tasks.md`, que é onde FR-036 vira lista
  finita.
- **SC-007, SC-008 e SC-009 não tinham régua.** Três critérios absolutos verificados só por olho.
  Cada um ganhou método: `color-contrast` e `target-size` do `addon-a11y`, e asserção de
  `scrollWidth` na entrada de 390px.
- **O índice de busca não tinha caminho até o `SearchTrigger`.** `tasks.md` mandava repassar "o
  `index` recebido", mas `Header()` é contrato congelado sem props, as rotas estão congeladas e
  SC-015 proíbe buscar sozinho. FR-016a fixa o único caminho legal — prop opcional com padrão
  `[]`, que é a cláusula que FR-016 já autorizava.
- **A versão do artifact divergia dentro da própria spec** (§Dependencies dizia `1790366735-8b87`
  contra `1790377732-ae4b` no cabeçalho). Unificada.

Fora desta spec, a mesma passagem corrigiu: a ausência de tarefa de Portão 6 para a Camada 1
(`tasks.md`, exigida por §Cadência), a tabela de rotas de `GATES.md` §6 que prometia exercitar
componentes inalcançáveis com `src/app/**` congelado, e cinco contagens divergentes entre plano,
contratos e tarefas.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fundação visual trocada (Priority: P1)

O leitor do blog abre qualquer tela e vê a nova identidade: fundo creme, texto quase-preto, borda de 2px e sombra dura sem desfoque, com as três famílias tipográficas novas. A paleta aubergine sai inteira; nenhum valor visual sobra solto no código. O sistema tem um tema único — não há modo escuro.

**Why this priority**: Todos os outros grupos de componentes consomem esses tokens. Sem a fundação, cada componente portado precisaria de retrabalho. É também a única entrega que sozinha já muda a percepção visual do produto.

**Independent Test**: Renderizar qualquer componente existente sem alterá-lo e confirmar que ele herda a nova paleta e a nova tipografia; buscar no código por valores visuais hardcoded e não encontrar nenhum.

**Acceptance Scenarios**:

1. **Given** o design system publicado, **When** um componente qualquer é renderizado, **Then** todas as suas cores, raios, sombras e tamanhos de texto vêm de tokens nomeados, e nenhum hex literal aparece no componente.
2. **Given** um token novo criado ou alterado, **When** o commit é aberto, **Then** o documento do design system foi atualizado no mesmo commit.

---

### User Story 2 - Portões de qualidade executáveis (Priority: P1)

Quem desenvolve consegue rodar, num comando só, a verificação completa de tipos e a suíte inteira de testes — incluindo os testes de story e as checagens de acessibilidade — sem precisar lembrar de invocações manuais.

**Why this priority**: Dois dos oito portões obrigatórios não têm comando hoje. Enquanto não existirem, nenhuma tarefa consegue comprovar que passou nos portões, e a regra de "não acumular dívida" fica inverificável.

**Independent Test**: Num checkout limpo, após o **único** pré-requisito de máquina — `npx playwright install chromium`, declarado como tal em `GATES.md` §1 —, executar o comando de verificação de tipos e o comando agregador de testes e obter saída verde em ambos, sem nenhuma outra invocação manual de ferramenta.

**Acceptance Scenarios**:

1. **Given** um checkout limpo do projeto, **When** o comando de verificação de tipos é executado, **Then** ele existe, roda e reporta zero erro.
2. **Given** um checkout limpo do projeto, **When** o comando agregador de testes é executado, **Then** ele roda os testes de lógica, os de comportamento de componente e os de story, e a saída identifica **cada projeto pelo nome** com seu próprio resultado — código de saída zero não basta como evidência.
3. **Given** uma story que viola uma regra de acessibilidade, **When** o comando agregador de testes é executado, **Then** ele falha e identifica a story e a regra violada.

---

### User Story 3 - Componentes base (Priority: P2)

Quem constrói telas tem à disposição os blocos elementares do sistema — botão, botão de ícone, avatar, selo de categoria, pílula de tag, tecla e código inline — cada um em todos os estados desenhados, visíveis no catálogo em desktop e em 390px.

**Why this priority**: São os blocos que todos os grupos seguintes reutilizam. Entregues sozinhos, já formam um kit utilizável.

**Independent Test**: Abrir o catálogo de componentes e percorrer cada estado desenhado de cada componente base, em desktop e em 390px, sem abrir nenhuma rota do blog.

**Acceptance Scenarios**:

1. **Given** o botão em variante primária, secundária, de acento e desabilitada, **When** cada uma é exibida, **Then** todas aparecem nos dois tamanhos, com e sem ícone.
2. **Given** o botão recebendo foco por teclado, **When** o foco chega nele, **Then** um contorno visível de 3px na cor de link aparece com afastamento de 3px.
3. **Given** um avatar sem foto, **When** ele é exibido, **Then** mostra as iniciais da pessoa nos três tamanhos previstos.
4. **Given** o selo de categoria, **When** as cinco categorias são exibidas, **Then** cada uma usa a sua cor fixa e o texto sobre ela respeita a regra de contraste.
5. **Given** um botão em 390px, **When** ele é exibido isolado, **Then** ocupa a largura cheia; **And** quando exibido como par de ações irmãs, divide a linha.

---

### User Story 4 - Navegação (Priority: P2)

O leitor se localiza e se move pelo blog: barra do topo, trilha lateral no desktop, barra de abas no celular, paginação, caminho de migalhas e barra de progresso de leitura.

**Why this priority**: Depende dos componentes base. Entregue, dá ao catálogo o esqueleto navegável completo.

**Independent Test**: Percorrer no catálogo cada componente de navegação em estado ativo e inativo, em desktop e em 390px.

**Acceptance Scenarios**:

1. **Given** a trilha lateral, **When** exibida, **Then** mostra os cinco destinos (Feed, Categorias, Tags, Séries, Sobre) com o item ativo distinto do inativo.
2. **Given** a barra de abas no celular, **When** exibida, **Then** mostra os mesmos cinco destinos, cada aba com alvo de 74px, e marca o ícone ativo.
3. **Given** a paginação na primeira página, **When** exibida, **Then** o extremo desabilitado aparece tracejado e continua visível — nunca some.
4. **Given** a paginação na página do meio e na última, **When** exibidas, **Then** cada uma mostra o par de extremos no estado correto.
5. **Given** a barra de progresso de leitura, **When** o post está parcialmente lido, **Then** ela exibe a fração lida.

---

### User Story 5 - Componentes de conteúdo (Priority: P2)

O leitor encontra os posts nos formatos desenhados: linha da home, card de grade, card do último post, card de categoria, estante, trilha de série, arquivo por ano e lista de anotações curtas.

**Why this priority**: É o miolo do blog. Depende dos base, mas não da camada "dentro do post".

**Independent Test**: Percorrer no catálogo cada formato de listagem com dados de exemplo, em desktop e em 390px.

**Acceptance Scenarios**:

1. **Given** a linha da home, **When** exibida com e sem numeração de série, **Then** os dois casos aparecem e a faixa colorida corresponde à categoria.
2. **Given** o card de post, **When** exibido na variante de superfície clara e na escura, **Then** as duas variantes aparecem no catálogo — são variantes de desenho do componente, não temas.
3. **Given** a estante do Sobre com um slot sem livro, **When** exibida, **Then** mostra um marcador de vazio, nunca um livro inventado.
4. **Given** o arquivo por ano, **When** exibido, **Then** os anos sem post continuam visíveis como hiato.
5. **Given** a trilha de série, **When** exibida, **Then** o item já lido é distinguível dos demais.

---

### User Story 6 - Dentro do post (Priority: P3)

Quem lê um post tem bloco de código com cabeçalho e cópia, sumário, botões de compartilhar, destaques, assinatura do autor, barra de reações e par de posts adjacentes.

**Why this priority**: Camada mais profunda; o blog é utilizável sem ela enquanto as anteriores não estiverem prontas.

**Independent Test**: Percorrer no catálogo cada componente da leitura, incluindo o estado "copiado" e o sumário recolhido e aberto.

**Acceptance Scenarios**:

1. **Given** o bloco de código, **When** exibido, **Then** o cabeçalho traz nome do arquivo, linguagem e ação de copiar.
2. **Given** a ação de copiar acionada, **When** a cópia acontece, **Then** o bloco entra em estado "copiado" com retorno visível.
3. **Given** o bloco de código em 390px com linha longa, **When** exibido, **Then** o corpo rola na horizontal e uma dica de rolagem aparece no pé — sem criar rolagem horizontal na página.
4. **Given** o sumário no desktop, **When** exibido, **Then** fica fixo na lateral; **And** em 390px vira barra recolhível, disponível recolhida e aberta.
5. **Given** os botões de compartilhar, **When** exibidos, **Then** cada um traz o seu ícone e o nome da rede escrito, nas três ações previstas.
6. **Given** os destaques, **When** exibidos, **Then** aparecem nos três tipos: nota do autor, citação e item de checklist.

---

### User Story 7 - Busca, vazio e rodapé (Priority: P3)

O leitor busca por posts a partir de um atalho de teclado, encontra convites em vez de mensagens de erro quando não há conteúdo, e tem um rodapé completo.

**Why this priority**: Fecha o inventário. Depende de base e navegação.

**Independent Test**: Percorrer no catálogo a busca fechada, com resultado e vazia, o estado vazio e o rodapé, em desktop e em 390px.

**Acceptance Scenarios**:

1. **Given** a paleta de busca, **When** exibida fechada, com resultado e vazia, **Then** os três estados aparecem no catálogo.
2. **Given** a paleta de busca em 390px, **When** aberta, **Then** ocupa a tela cheia e oferece fechar por "×" em vez da tecla de escape.
3. **Given** uma coleção sem itens, **When** o estado vazio é exibido, **Then** mostra contorno tracejado e um texto de convite; **And** nunca exibe a frase "0 resultados" ou equivalente.

---

### Edge Cases

Cada caso abaixo tem **componente dono** e é classificado por natureza, conforme FR-036b:
**E** = estado renderizável (entrada no catálogo **e** teste); **A** = condição de ambiente
(teste de comportamento apenas, sem entrada no catálogo).

| # | Caso | Dono | Tipo | Comportamento esperado |
|---|------|------|------|------------------------|
| EC-01 | Avatar sem foto **e** sem nome utilizável para derivar iniciais | `Avatar` | E | Marcador neutro, nunca círculo vazio nem string vazia dentro do círculo |
| EC-02 | Título de post longo o suficiente para estourar duas linhas no card e três linhas na linha da home | `PostCard`, `PostListRow` | E | Título truncado no limite de linhas, sem empurrar o resto do layout nem criar rolagem horizontal |
| EC-03 | Resumo de post ausente no frontmatter | `PostCard`, `PostListRow`, `FeaturedPostCard` | E | O bloco de resumo é omitido; o espaço que ele ocupava colapsa, sem deixar lacuna nem texto de substituição |
| EC-04 | Post sem categoria, sem tag ou sem série, exibido nos formatos que reservam espaço para eles | `PostCard`, `PostListRow` | E | Cada elemento ausente é omitido; a faixa de categoria cai para a cor neutra `hairline` quando não há categoria |
| EC-05 | Paginação com uma única página: os dois extremos ficam desabilitados ao mesmo tempo | `Pagination` | E | Os dois extremos aparecem tracejados e permanecem visíveis (FR-030) |
| EC-06 | Arquivo por ano com um único ano preenchido | `YearArchive` | E | O ano aparece e o componente não quebra; nenhum hiato é inventado |
| EC-07 | Bloco de código sem nome de arquivo ou sem linguagem declarada | `CodeBlock` | E | O cabeçalho omite o campo ausente e mantém a ação de copiar; nenhum rótulo de substituição é inventado |
| EC-08 | Ação de copiar acionada onde a cópia não é permitida pelo navegador | `CodeBlock` (`CopyButton`), `CopyLinkButton` | A | O componente NÃO entra em estado "copiado" e não lança erro ao leitor |
| EC-09 | Sumário de post com apenas um título, ou sem nenhum | `Toc` | E | Com um título, renderiza normalmente; sem nenhum, o componente não é renderizado — nunca uma casca vazia |
| EC-10 | Trilha de série com um único item | `SeriesShelf` | E | O item aparece e o componente não quebra |
| EC-11 | Busca acionada antes de o índice estar disponível | `CommandPalette` | E | Índice vazio ou ausente cai no estado vazio de `EmptyState`, com texto de convite e sem a frase "0 resultados" (FR-032) |
| EC-12 | Leitor com preferência de movimento reduzido ativa | todo componente que anima (ver FR-042a) | A | A animação é suprimida; o estado final é alcançado sem transição |
| EC-13 | Texto ampliado pelo leitor a 200% sem perder conteúdo nem criar rolagem horizontal | `PostContent`, e todo componente com texto em caixa de largura fixa | A | Nenhum conteúdo é perdido nem cortado, e nenhuma rolagem horizontal aparece |

## Requirements *(mandatory)*

### Requisitos de design system

- **FR-001**: O sistema MUST expor como token nomeado cada uma das doze cores da nova identidade: ink `#141210`, canvas `#FBEFD8`, paper `#FFFCF5`, sand `#F2E2C2`, blush `#FDEFEC`, code-bg `#1A1714`, flame `#FF5533`, sun `#FFC42E`, mint `#12BFA0`, ink-blue `#1F4FD8`, ink-soft `#3B352A`, hairline `#E0CFAC`.
- **FR-001a**: O sistema MUST expor `--color-brand-linkedin` `#0A66C2` como token, **fora** das doze cores da identidade. `DESIGN.md` MUST documentá-lo numa seção "Cores de marca", separada da paleta própria, deixando claro que é cor de terceiro consumida por FR-028 e não valor da identidade do blog. Com ele tokenizado, **nenhum hex literal permanece em `src/components/**`**: os SVG oficiais de GitHub e LinkedIn são caminhos e não carregam cor própria.
- **FR-001b**: O branco usado como texto sobre superfície escura (FR-008) MUST resolver para o token **`--color-white`** do tema padrão do Tailwind, consumido pelo utilitário `text-white`. **Nenhum token novo é criado** (Princípio V): o token já existe e sobrevive ao `@theme inline` deste projeto, que **estende** o tema padrão em vez de substituí-lo — medido em `node_modules/tailwindcss/theme.css`, `--color-white: #fff`. `DESIGN.md` MUST registrá-lo na mesma seção de FR-001a, agora nomeada "Cores de marca e de sistema", deixando claro que não é uma das doze cores da identidade. Hex literal de branco (`#fff`, `#ffffff`) em componente é violação de SC-004. Sem esta declaração o branco de FR-008 não tinha token: não está entre as doze de FR-001, e `paper` é `#FFFCF5`, não branco.
- **FR-002**: O sistema MUST remover integralmente a paleta aubergine anterior; nenhum token ou valor dela pode permanecer em uso. São **dezenove** tokens de cor declarados em `:root` (medido em `src/app/globals.css`, não vinte como esta spec afirmava antes da correção): `--color-primary`, `--color-primary-deep`, `--color-primary-press`, `--color-primary-tint`, `--color-on-primary`, `--color-ink`, `--color-ink-mute`, `--color-link-blue`, `--color-link-hover`, `--color-canvas`, `--color-canvas-cream`, `--color-canvas-lavender`, `--color-surface-elev`, `--color-surface-aubergine`, `--color-hairline`, `--color-hairline-strong`, `--color-semantic-error`, `--color-semantic-success`, `--color-on-aubergine-mute`. Os **dezenove** saem na mesma tarefa, e todo call site MUST receber um valor válido na mesma tarefa — em particular `--color-ink-mute` (17 usos), cujo sucessor é **`--color-ink-soft`**. Três nomes reaparecem na identidade nova com **valor diferente** (`--color-ink` `#1d1d1d`→`#141210`, `--color-canvas` `#ffffff`→`#FBEFD8`, `--color-hairline` `#e6e6e6`→`#E0CFAC`); reusar o nome com valor novo é permitido e MUST ser registrado em `DESIGN.md`.
- **FR-002a**: Os **trinta e dois** tokens legados **não-cor** hoje em `src/app/globals.css` — 15 escalas de texto, 7 raios, 3 sombras e 7 espaçamentos (medido) — MUST ser tratados em dois grupos, e **trinta e um** deles são efetivamente tratados: `--radius-pill` 90px é idêntico nos dois sistemas e sobrevive intacto.
  1. **Os nove que colidem** (mesmo nome, valor diferente na identidade nova) MUST ser resolvidos na tarefa de tokens, porque um token não pode ter dois valores: `--text-display-xxl` 64→52px, `--text-display-md` 32→30px, `--text-heading-md` 22→21px, `--text-body-lg` 18→17px, `--text-micro-cap` 12→11px, `--radius-sm` 4→12px, `--radius-md` 8→16px, `--radius-lg` 12→18px, `--radius-xl` 16→24px. (`--radius-pill` 90px é idêntico nos dois sistemas e sobrevive intacto.)
  2. **Os quinze órfãos restantes** — sem sucessor nomeado na identidade nova — MUST permanecer num bloco explicitamente marcado `/* LEGADO */` em `:root`, que **só encolhe**: `--text-display-xl`, `--text-display-lg`, `--text-heading-lg`, `--text-heading-sm`, `--text-body-md`, `--text-body-strong`, `--text-button-lg`, `--text-button-md`, `--text-button-cap`, `--text-caption`, `--radius-xs`, `--radius-xxl`, `--shadow-sm`, `--shadow-md` e `--shadow-lg`. Os sete `--spacing-*` **não** entram no bloco: têm zero uso (medido) e são removidos de uma vez pela tarefa de tokens, conforme FR-005a. Cada tarefa de componente MUST remover do bloco os tokens legados que aquele componente deixou de usar, decidindo a substituição com o artboard daquele componente à vista. Nenhum token novo MUST ser adicionado ao bloco.
- **FR-002b**: Ao fim da feature o bloco `/* LEGADO */` MUST estar vazio e MUST ser removido do arquivo. Enquanto ele existir, um token legado ainda em uso **não** conta como violação de FR-007 nem de SC-004; um token legado **sem** uso conta como violação e MUST ser removido pela tarefa que o órfãou.
- **FR-003**: O sistema MUST expor como token a escala tipográfica desenhada: display-xxl 52px, display-md 30px, heading-md 21px, body-lg 17px com entrelinha 1,72, micro-cap 11px, e a família monoespaçada.
- **FR-003a**: Cada uma das cinco escalas MUST declarar explicitamente os três sub-tokens que o arquivo já usa hoje — `--text-<nome>--line-height`, `--text-<nome>--letter-spacing` e `--text-<nome>--font-weight`. Nenhuma escala MUST ficar no padrão do navegador para entrelinha ou espaçamento entre letras; os dois pontos em que a ausência mais aparece são o display de 52px e o `micro-cap`, que é caixa alta. Os **valores** MUST ser lidos do artboard `Sistema` na tarefa de tokens, não fixados por esta spec: o artboard é a fonte da verdade visual e já mudou de versão uma vez (`research.md` R7), então congelar aqui número não lido seria pior. Onde o artboard não declarar um dos três, a tarefa MUST fixar o valor e registrar a decisão em `DESIGN.md` como escolha da implementação, não como leitura do mock. As métricas do sistema atual MUST NOT ser herdadas: foram ajustadas para Plus Jakarta Sans, e Archivo Black e Space Grotesk têm proporções diferentes.
- **FR-003c**: Cada escala de FR-003 MUST declarar a sua família, e o mapeamento é **exaustivo**: `display-xxl` e `display-md` em Archivo Black; `heading-md` e `body-lg` em Space Grotesk; `micro-cap` e `micro-cap-sm` em **Archivo Black** — hoje declarado só em `data-model.md` §1.2, não em FR-003. Data, tag, código e métrica em JetBrains Mono, por FR-004.
- **FR-003b**: A redução responsiva do rótulo do `CategoryBadge` — **9px em 390px contra 11px no desktop** — MUST ter token próprio, **`--text-micro-cap-sm` 9px**, com os mesmos três sub-tokens que FR-003a exige. Sem ele os 9px seriam `px` avulso dentro do componente, o que o Princípio I proíbe e SC-004 reprova; `--text-micro-cap` define só os 11px. A troca acontece no ponto de corte único de FR-038a e em nenhum outro.
- **FR-004**: O sistema MUST expor as três famílias tipográficas com os papéis definidos: display e rótulos em caixa alta, corpo e títulos de card, e monoespaçada para datas, tags, código e métricas. A família anterior (`--font-jakarta`) MUST ser removida.
- **FR-004a**: A família de display é **Archivo Black**, que tem uma única espessura (400). Todo uso de display MUST usar essa espessura e MUST NOT pedir 700 nem 800; o navegador MUST NOT ser levado a sintetizar negrito. Os tokens de display MUST portanto declarar `font-weight: 400`, e o carregamento da fonte MUST solicitar somente o peso 400. As outras duas famílias, lidas dos artboards, são **Space Grotesk** (corpo e título de card, pesos 400/500/600/700) e **JetBrains Mono** (data, tag, código e métrica, pesos 400/500/700). O peso 700 do sistema vem sempre de Space Grotesk — `--text-heading-md` é 21px Grotesk 700 — nunca de Archivo Black.
- **FR-004b**: Componente MUST NOT pedir peso fora do conjunto declarado de cada família — Archivo Black 400; Space Grotesk 400/500/600/700; JetBrains Mono 400/500/700 — e o conjunto é exatamente o que `next/font/google` carrega. A proibição de negrito sintético de FR-004a ganha **mecanismo**: `globals.css` MUST declarar `font-synthesis: none`, ponto único do sistema. Sem ele, "o navegador MUST NOT sintetizar" era resultado desejado sem instrumento; com ele, é regra verificável por grep e por render.
- **FR-004c**: As três famílias MUST ser carregadas com `display: "swap"` e `adjustFontFallback` ativo, **declarados explicitamente** em `layout.tsx` em vez de herdados do padrão do `next/font`. A troca de fonte é aceita; o deslocamento de layout é mitigado pela pilha alternativa com `size-adjust` que o `next/font` gera. Provedor de fontes indisponível é **falha por causa externa** (Constituição §Falha de portão): a tarefa fica **bloqueada**, não concluída com fonte alternativa.
- **FR-005**: O sistema MUST expor como token os raios 12px, 16px, 18px e 24px e o raio de pílula 90px.
- **FR-005a**: O espaçamento do sistema MUST ter ponto único de definição: `--spacing: 0.25rem` (base de 4px) declarado explicitamente no `@theme` de `src/app/globals.css`, do qual derivam os utilitários de escala numérica (`mt-4`, `py-12`, `gap-2`…) já usados pelos componentes. Os sete tokens `--spacing-xs` a `--spacing-huge` hoje declarados MUST ser removidos: têm **zero uso** no código (medido), e manter apelido sem consumidor viola o Princípio V. `DESIGN.md` MUST documentar essa escala como o token de espaçamento do sistema, satisfazendo o Princípio I. Nenhum call site existente muda.
- **FR-006**: O sistema MUST expor como token duas sombras duras, sem desfoque e sem opacidade: deslocamento de 4px e deslocamento de 8px, ambas na cor ink.
- **FR-007**: Todo componente MUST usar borda de 2px sólida na cor ink onde o desenho prevê borda; nenhum componente pode hardcodar valor visual. A espessura tem **valor único no sistema inteiro**, e o Tailwind v4 **não tem namespace de `@theme` para espessura de borda** — medido em `node_modules/tailwindcss/theme.css`, zero ocorrência de `border-width` —, logo ela **não pode** virar token consumível por utilitário. O ponto único de definição é portanto a **regra**: `border-2` é o único utilitário de espessura sancionado, `DESIGN.md` MUST registrá-lo como tal, e qualquer outro (`border`, `border-4`, `border-[…]`) é violação, verificável pela segunda régua de SC-004. Isto **não** afrouxa o Princípio I, cuja lista do que MUST ser token é "cor, tipografia, espaçamento, **raio** de borda e sombra" — espessura de borda não consta dela, e era SC-004 que exigia acima da constituição.
- **FR-007a**: "Onde o desenho prevê borda" MUST ser lido como: **todo bloco que o artboard desenha com contorno** recebe `border-2` na cor `ink`. O critério é verificável pela régua 2 de SC-004 — o grep vazio garante que, **onde** existe borda, ela é `border-2`; e as 34 ocorrências de `border: 1.5px` medidas nos artboards (divergência D-B) sobem a 2px. A régua **não** decide *se* há borda, e isso é deliberado: essa é leitura do artboard, registrada no bullet **Artboard** de cada tarefa.
- **FR-008**: O sistema MUST garantir que texto sobre flame, sun e mint seja **sempre ink, em qualquer tamanho**. Texto branco é permitido SOMENTE sobre ink, ink-blue, code-bg e `brand-linkedin`. A redação anterior permitia branco a partir de 24px em peso display sobre qualquer acento; medição (ver `research.md` R3) mostrou que branco sobre sun dá **1,59:1** e sobre mint dá **2,34:1**, reprovando até o limite relaxado de 3:1. A permissão de branco ≥24px sobre acento MUST NOT existir. Onde o branco é permitido, ele MUST ser o token `--color-white` (FR-001b), nunca hex literal.
- **FR-009**: O sistema MUST associar uma cor fixa a cada categoria: Front-end→flame, Back-end→mint, Ferramentas→sun, Design→ink-blue, Programação→ink.
- **FR-009a**: Categoria **fora das cinco** de FR-009 MUST cair na cor neutra `hairline` e MUST exibir o nome recebido em texto, sem inventar cor nem omitir a categoria. Medido em 2026-09-27: os **10** posts de `src/content` usam exatamente as cinco, então esta é regra de robustez para o conteúdo que a feature das rotas acrescentará, não conserto de defeito ao vivo.
- **FR-009b**: A categoria MUST NOT ser comunicada **apenas por cor** (Princípio IV). As cinco cores também carregam outros papéis no sistema — `flame` destaque, `sun` faixa do topo, `mint` séries, `ink-blue` link inline, `ink` texto e borda —, então a cor não identifica a categoria nem para quem a distingue. Onde a categoria aparece, o nome MUST estar em texto: o `CategoryBadge` já o faz, e a **faixa colorida** do `PostCard` e do `PostListRow`, hoje o único ponto em que só a cor informa, MUST acompanhar o selo ou um nome acessível.
- **FR-010**: O sistema MUST ter tema único (claro). Modo escuro MUST NOT ser implementado nesta feature: nenhum token de tema escuro, nenhum seletor de tema (classe, atributo ou `prefers-color-scheme`) e nenhum alternador de tema. O token `code-bg` `#1A1714` permanece — é a superfície de bloco de código e de variante escura de card dentro do tema claro, não um tema.
- **FR-010a**: `src/app/globals.css` MUST declarar `color-scheme: light`. Sem isso, o navegador de um leitor com o **sistema operacional** em modo escuro escurece por conta própria controles de formulário, barras de rolagem e o fundo de `<input>` — quebrando o tema único de FR-010 **sem violar nenhum** dos três mecanismos que ele proíbe, porque nenhum deles é código deste repositório. Declarar `light` **não** é seletor de tema: é informar ao navegador que só existe um.
- **FR-011**: A documentação do design system MUST ser atualizada no mesmo commit em que qualquer token é criado, alterado ou removido.
- **FR-011a**: O arquivo `DESIGN.md` MUST passar a existir. O Princípio I da constituição o torna obrigatório — token sem entrada nele é violação — mas o arquivo **não existe no repositório hoje**. Criá-lo com as entradas dos tokens de FR-001 a FR-010 é entrega desta feature, e é também onde a ausência da paleta aubergine é registrada.
- **FR-011b**: Cada entrada de `DESIGN.md` MUST conter, nesta ordem: **nome** do token, **valor**, **onde é usado** (papel no sistema) e, para token de cor, a **razão de contraste** contra cada superfície em que ele pousa. Token de cor sem a linha de contraste é entrada incompleta. Sem formato fixo, FR-011a não era executável sem inventar um.
- **FR-012**: A medida de leitura do corpo do post MUST ficar entre 65 e 72 caracteres por linha, e MUST ter **ponto único de definição como token** — `--measure-prose`, em `ch` — em vez de valor avulso dentro do `PostContent` (Princípio I, SC-004). FR-038a depende do número medido (~636px em Space Grotesk 17px) para justificar o ponto de corte de 1024px, então o valor é insumo de outro requisito e não pode viver solto num componente.

### Requisitos de inventário

- **FR-013**: O sistema MUST re-estilizar, preservando o nome do componente e respeitando o contrato mínimo de FR-016, os componentes já existentes: Button, TagPill, PostCard, FeaturedPostCard, Pagination, Footer, Header, Toc, CodeBlock (com CopyButton), ShareButtons, CopyLinkButton, Hero, PostContent, PostsListing e Container.
- **FR-013a**: A re-estilização MUST NOT remover funcionalidade alcançável hoje pelo leitor.
  Enquanto `SideRail` e `MobileTabBar` não estiverem montados — e eles **não podem** ser nesta
  feature, porque `src/app/layout.tsx` só admite alteração no bloco de fontes e na `className` do
  `<html>` —, o `Header` MUST continuar oferecendo os cinco destinos nas duas apresentações. O
  artboard os move para a trilha lateral e a barra de abas, e a entrega **divergirá do mock neste
  ponto**, registrado em *Divergências entre artboard e entrega* do plano. A razão é a mesma de
  FR-017: o mock cede quando obedecê-lo quebra uma régua. Aqui a régua é que **nenhum dos oito
  portões detecta perda de navegação** — a rota renderiza sem erro e sem aviso —, então o
  requisito é o único lugar onde isso fica verificável.
- **FR-014**: O sistema MUST criar os componentes novos: SideRail, MobileTabBar, IconButton, Avatar, CategoryBadge, Breadcrumb, ReadingProgress, PostListRow, CategoryCard, SeriesShelf, YearArchive, TilList, Shelf, Callout, AuthorCard, PrevNext, LikeCommentBar, CommandPalette, EmptyState, Kbd e InlineCode.
- **FR-015**: SearchBox MUST sair do inventário: não é re-estilizado, não recebe story nem teste, e a busca passa integralmente para o CommandPalette. Como `src/app/search/page.tsx` ainda o importa e `src/app/**` está fora de escopo, o arquivo atual MUST permanecer em disco e intocado nesta feature — apagá-lo quebraria a compilação. A remoção efetiva pertence à feature das rotas.
- **FR-016**: O contrato mínimo abaixo — a superfície de props que `src/app/**` efetivamente consome — MUST NOT ter prop renomeada, removida, tornada obrigatória nem com o tipo estreitado, porque `src/app/**` está congelado por SC-011 e qualquer quebra reprova o Portão 5:

  ```text
  Container({ className })        CopyLinkButton({ url })      Footer()
  Header()                        Hero()                       PostCard({ post })
  PostContent({ body })           PostsListing({ page })       ShareButtons({ url, title })
  TagPill({ tag, href })          Toc({ items })
  ```

  Fora desse contrato a API é livre: qualquer outra prop pode ser renomeada, removida ou retipada, inclusive a de Button, FeaturedPostCard, Pagination e CodeBlock, que nenhuma rota chama diretamente. Prop nova MUST entrar opcional e com valor padrão, para que nenhum call site existente precise mudar. Toda mudança de API fora do contrato mínimo MUST ser registrada e justificada em `DESIGN.md`, numa seção "Mudanças de API" — sem destino nomeado, "registrada" não é verificável.

- **FR-016a**: O `Header` MUST receber o índice de busca por **prop nova, opcional e com valor padrão** — `Header({ index }: { index?: SearchIndexEntry[] })`, padrão `[]` — e repassá-lo à ilha cliente `SearchTrigger`, que o repassa ao `CommandPalette` (FR-031a). Isto **não** quebra o contrato mínimo: `Header()` continua chamável sem argumento, nenhum call site de `src/app/**` muda e SC-014 fica intacto — é exatamente a cláusula "prop nova entra opcional e com valor padrão" de FR-016. É também o **único** caminho legal, e a spec o fixa em vez de deixá-lo implícito: `src/app/**` está congelado por SC-011, então nenhuma rota pode passar o índice nesta feature, e SC-015 proíbe o componente buscá-lo por conta própria. Com o padrão `[]`, a busca cai no estado vazio de EC-11 até a feature das rotas ligar a origem real — comportamento previsto, não defeito.

### Requisitos de estados e variantes

- **FR-017**: Button MUST oferecer as variantes primary, secondary, accent e disabled, nos tamanhos lg (48px) e md (**44px**), com e sem ícone. O artboard desenha o `md` em **40px**, e 40px **reprova** o mínimo de alvo de toque — que é MUST no Princípio IV da constituição e é incondicional em FR-037 e SC-008. A constituição prevalece sobre o mock (§Regras de aplicação: divergência de documento subordinado é defeito do subordinado), então o `md` sobe para 44px. Divergência de 4px registrada em *Assumptions*.
- **FR-018**: Button MUST exibir foco visível por teclado: contorno de 3px na cor ink-blue com afastamento de 3px.
- **FR-018a**: Todo elemento interativo MUST ter retorno visual de **hover** e de **`:active`**, e a definição dos dois MUST ser regra de sistema — decidida uma vez junto dos tokens, não por componente. O estado de hover MUST ter **entrada própria no catálogo** para cada elemento interativo, obtida forçando o pseudo-estado; conferir hover só no review não satisfaz este requisito. A entrada de hover existe **somente na apresentação de desktop**: 390px é contexto de toque, onde hover não ocorre, e gerar a entrada ali provaria um estado que o leitor nunca vê — esta é a única exceção a FR-038b. O `:active` MUST existir mas MUST NOT ganhar entrada própria; é provado por teste e review, para não multiplicar o catálogo uma terceira vez.
- **FR-018b**: **Foco visível é regra de sistema, não requisito de um componente.** Todo elemento interativo — não só o `Button` de FR-018 — MUST exibir foco visível por teclado, com a definição decidida uma vez junto dos tokens: contorno de 3px com afastamento de 3px, na cor que FR-041a determina para aquela superfície. O foco MUST ser provado por **teste**, em dois níveis: o teste de comportamento assere que o elemento é alcançável por teclado e é o elemento semântico correto (FR-040); o teste de story, em navegador real, é onde `:focus-visible` é efetivamente avaliado. Como o `:active` de FR-018a, o foco **MUST NOT** ganhar entrada própria no catálogo — provar por teste evita multiplicar o catálogo uma terceira vez, e a entrada separada não compraria detecção que o navegador real já dá. A redação anterior definia foco **apenas para o Button**, deixando sem requisito os ~24 outros componentes interativos (`IconButton`, `TagPill`, `SideRail`, `MobileTabBar`, `Breadcrumb`, `Pagination`, `ShareButtons`, `CopyLinkButton`, `PrevNext`, `SeriesShelf`, `CommandPalette`…).
- **FR-019**: IconButton MUST ser redondo e ter no mínimo 44px. O ícone MUST vir de `lucide-react`, no estilo de traço próprio da biblioteca — a exigência anterior de ícone pintado foi retirada pela decisão de adotar lucide (ver Clarifications).
- **FR-020**: Avatar MUST oferecer três tamanhos: 32px (sm) e 44px (md) fixos, e o tamanho grande (lg) **responsivo — 78px em 390px e 108px no desktop**, pelo mesmo componente, não por dois componentes nem por duas props. MUST exibir iniciais quando não houver foto.
- **FR-021**: CategoryBadge MUST cobrir as cinco categorias, em caixa alta na família display.
- **FR-022**: TagPill MUST oferecer os estados padrão, ativa e com contador, sempre na família monoespaçada e sempre prefixada por `#`.
- **FR-023**: PostCard MUST existir em duas variantes de superfície — clara (sobre paper/canvas) e escura (sobre ink/code-bg) — ambas dentro do tema único claro. São variantes de desenho do componente, não temas.
- **FR-024**: PostListRow MUST existir com e sem numeração de série, com faixa colorida correspondente à categoria.
- **FR-025**: FeaturedPostCard MUST apresentar o último post com o título em display sobre a cor de acento.
- **FR-026**: CodeBlock MUST ter cabeçalho com nome do arquivo, linguagem e ação de copiar, MUST oferecer o estado "copiado" e, em 390px, MUST exibir dica de rolagem horizontal.
- **FR-027**: Toc MUST ter variante fixa de desktop e variante de celular como barra recolhível, disponível nos estados recolhida e aberta.
- **FR-028**: ShareButtons MUST oferecer três ações, cada uma com ícone e o nome da rede escrito: GitHub sobre fundo ink, LinkedIn sobre fundo `brand-linkedin`, e uma terceira ação com ícone de link e o texto "Compartilhar o link". O ícone de link MUST vir de `lucide-react`. As marcas GitHub e LinkedIn MUST usar o SVG oficial de cada marca caso a versão instalada de `lucide-react` não as forneça — lucide depreciou os ícones de marca, e isso MUST ser verificado na instalação; a marca MUST NOT ser substituída por um ícone genérico.
- **FR-029**: Callout MUST oferecer os três tipos: nota do autor, citação e item de checklist.
- **FR-030**: Pagination MUST oferecer os estados de primeira página, página do meio e última página; o extremo desabilitado MUST virar tracejado e MUST permanecer visível.
- **FR-031**: CommandPalette MUST oferecer os estados fechada, com resultado e vazia, MUST ser acionável pelo atalho ⌘K e, em 390px, MUST abrir como folha de tela cheia com fechamento por "×" em lugar da tecla de escape.
- **FR-031a**: CommandPalette MUST receber o índice de busca pronto por propriedade e MUST NOT obtê-lo por conta própria. Ele MUST NOT importar `src/lib/search-index.ts`, porque `getSearchIndex()` chama `getAllPosts()` e lê o sistema de arquivos: import de módulo de servidor dentro de Client Component reprova o Portão 6. A filtragem MAY reaproveitar a função pura `searchIndex(index, query)` de `src/lib/search.ts`, que não tem import de servidor — importar não é alterar e portanto não fere SC-011. O índice permanece exatamente como está; a ligação com a origem real pertence à feature das rotas.
- **FR-031b**: LikeCommentBar MUST receber as contagens de curtida e de comentário por propriedade, MUST NOT persistir nada, MUST NOT escrever em serviço algum e MUST NOT absorver o embed do Disqus. TilList MUST receber as anotações por propriedade. Em nenhum dos dois a origem real do dado entra nesta feature.
- **FR-032**: EmptyState MUST usar contorno tracejado com texto de convite e MUST NOT exibir a frase "0 resultados" nem equivalente.
- **FR-033**: SideRail MUST apresentar os cinco destinos (Feed, Categorias, Tags, Séries, Sobre) nos estados ativo e inativo.
- **FR-034**: MobileTabBar MUST apresentar os mesmos cinco destinos, com marca sobre o ícone ativo e alvo de toque de 74px por aba.
- **FR-035**: Shelf MUST usar marcador de vazio no slot sem livro, nunca um título inventado.
- **FR-036**: Todo estado desenhado nos artboards MUST estar representado no catálogo, mesmo quando não enumerado acima.
- **FR-036a**: Todo ícone do sistema MUST vir de `lucide-react`, com a exceção das marcas de rede prevista em FR-028. O sistema MUST NOT manter caminho SVG solto dentro de componente para ícone que a biblioteca fornece, e MUST NOT introduzir uma segunda fonte de ícones. Cada ícone decorativo MUST ser escondido de tecnologia assistiva, e todo ícone que carrega o único significado de um controle MUST vir acompanhado de nome acessível no elemento interativo.
- **FR-036b**: Todo caso da seção *Edge Cases* MUST ser tratado, e a forma do tratamento é determinada pela natureza do caso. Caso classificado **E** (estado renderizável do componente) MUST aparecer no catálogo como estado próprio — e portanto nas duas entradas de FR-038b — **e** MUST ter teste. Caso classificado **A** (condição do ambiente, que não é estado do componente) MUST ter teste de comportamento e MUST NOT ganhar entrada no catálogo, porque entrada que não pode exibir a condição não prova nada. Nenhum caso MUST ficar sem dono: a tabela de *Edge Cases* nomeia o componente responsável por cada um, e o comportamento esperado ali declarado é critério de aceitação da tarefa daquele componente.

### Requisitos de responsividade e acessibilidade

- **FR-037**: Todo alvo de toque MUST ter no mínimo 44px na menor dimensão. O mínimo é **critério de aceitação de toda tarefa** que entrega elemento interativo, não requisito de dois componentes: vale para `Button` (FR-017, `md` a 44px), `IconButton` (FR-019), `TagPill`, `SideRail`, `MobileTabBar` (FR-034, 74px por aba), `Breadcrumb`, `Pagination`, `ShareButtons`, `CopyLinkButton`, `PrevNext`, `SeriesShelf`, `CommandPalette` e todo outro alvo tocável entregue pela feature. A régua de verificação está em SC-008.
- **FR-038**: Cada componente MUST estar disponível no catálogo em duas apresentações e **somente duas**: **celular em 390px** e **desktop em 1280px**.
- **FR-038b**: Cada estado do catálogo MUST existir como **duas entradas separadas**, uma por largura — `<Estado>` em 1280px e `<Estado>Mobile` em 390px — e cada entrada MUST declarar a própria largura na story. A largura MUST NOT depender do controle global de viewport da barra de ferramentas do Storybook: entrada cuja largura só existe como escolha manual do leitor **não** conta como apresentação entregue, porque o teste de story renderiza cada entrada uma única vez e nunca exercitaria os 390px. Consequência aceita: o número de entradas do catálogo é o dobro do número de estados. **Única exceção**: a entrada de hover de FR-018a, que existe só em 1280px.
- **FR-038a**: O sistema MUST ter **um único ponto de corte responsivo, em 1024px** (o `lg` do Tailwind; nenhum breakpoint próprio é criado). Abaixo dele vale a apresentação de celular, a partir dele a de desktop. Todo valor responsivo MUST trocar nesse ponto e em nenhum outro — `Avatar` tamanho `lg` 78→108px, `CategoryBadge` 9→11px, `Header` 64→68px, e a troca entre `MobileTabBar` e `SideRail`. **Justificativa medida**: a medida de leitura de 65–72 caracteres exigida por FR-012 ocupa ~636px em Space Grotesk 17px; somada à `SideRail` (~200px) e às margens, a apresentação de desktop precisa de ~900px. Em 768px a coluna cairia abaixo de 65 caracteres e FR-012 conflitaria com FR-038.
- **FR-039**: Em 390px o layout MUST ser de coluna única, o botão isolado MUST ocupar largura cheia e a página MUST NOT apresentar rolagem horizontal.
- **FR-040**: Todo elemento interativo MUST ser um botão, um link com destino ou um campo com rótulo real; elementos genéricos com manipulador de clique são proibidos.
- **FR-041**: Todo texto MUST atingir contraste de 4,5:1, aceito 3:1 apenas para **texto grande**, em toda variante de superfície entregue — incluindo a variante escura de card e o fundo de bloco de código. "Texto grande" MUST ser definido como no WCAG e como o `axe-core` o implementa: **≥24px, ou ≥18,66px em peso ≥700**. Na escala desta feature isto alcança um **único** token — `--text-heading-md`, 21px em peso 700. Adotar "só tamanho" tornaria esta spec **mais estrita que a regra `color-contrast`** que SC-007 nomeia como régua, e critério mais estrito que o próprio instrumento não é verificável.
- **FR-041a**: Elemento **não textual** que carrega informação MUST atingir contraste de **3:1** contra a superfície adjacente, e isto vale nominalmente para o **indicador de foco** de FR-018/FR-018b. **Medido**: o anel `ink-blue` dá **2,08:1 sobre flame** e **2,84:1 sobre mint** — reprova nas duas. Logo o anel de foco MUST trocar de cor conforme a superfície, e a regra é de sistema, decidida junto dos tokens e registrada em `DESIGN.md` ao lado da tabela de contraste de texto:

  ```text
  Anel de foco sobre flame, sun e mint        → ink
  Anel de foco sobre ink, ink-blue e code-bg  → --color-white
  Anel de foco sobre canvas, paper, sand, blush → ink-blue (FR-018)
  ```

  Os valores de `ink-blue` sobre `canvas` (5,82) e `paper` (6,47) estão medidos em `research.md` R3; sobre `sand` e `blush` **ainda não**, e a tarefa de tokens MUST medi-los e trocar para `ink` se qualquer um ficar abaixo de 3:1. FR-041 cobria **só texto**, e era por isso que um anel de foco invisível sobre acento passava por todas as réguas da feature.
- **FR-041b**: O contraste MUST ser calculado por **luminância relativa WCAG 2.x**, e o par medido é (token de texto, token da **superfície imediata**) — nunca valor aproximado nem composto. Nenhum dos treze tokens de cor carrega canal alfa e FR-006 proíbe opacidade nas sombras, logo **composição não ocorre** e o par é sempre determinado. Os quatorze valores de `research.md` R3 foram **recalculados nesta régua em 2026-09-27 e reproduzem exatamente**.
- **FR-041c**: `--color-ink-soft` é texto secundário **somente sobre superfície clara**. Medido: paper 11,86, canvas 10,67, blush 10,84, sand 9,51 — passa. Sobre `ink` dá **1,54** e sobre `code-bg` **1,47**, reprovando em qualquer tamanho. Em superfície escura o texto secundário MUST ser `--color-white` (FR-001b), **nunca** `ink-soft`. Alcança nominalmente a variante `dark` do `PostCard` e o `CodeBlock`, que são as duas superfícies escuras entregues.
- **FR-041d**: `--color-hairline` é **decoração**, não elemento informativo, e está **fora** de FR-041a. Medido: 1,35 sobre canvas, 1,50 sobre paper, 1,20 sobre sand, 1,37 sobre blush — reprova 3:1 nas quatro. A declaração só é legítima sob a condição que a torna honesta: **toda estrutura sugerida pelo divisor MUST existir na semântica** (`<ul>`/`<li>`, `<hr>`, nível de cabeçalho), de modo que removê-lo não perca informação — verificável no teste de comportamento. `hairline` MUST NOT ser a única forma de comunicar qualquer informação.
- **FR-042**: As checagens automatizadas de acessibilidade MUST rodar como teste sobre as stories e MUST passar.
- **FR-042a**: A supressão de movimento MUST ter **ponto único de definição**: `src/app/globals.css` MUST neutralizar `transition` e `animation` sob `prefers-reduced-motion: reduce` para o sistema inteiro. Componente MAY animar dentro dessa regra, mas MUST NOT declarar a própria consulta de `prefers-reduced-motion` — a regra global já o cobre, e repeti-la por componente cria 36 pontos de manutenção para uma decisão que é uma. Sob a preferência ativa, o estado final MUST ser alcançado sem transição, nunca suprimido junto com a animação. EC-12 é verificado por **um** teste, no design system, não por componente.

### Requisitos de qualidade *(tratados como requisito funcional desta feature)*

- **FR-043**: Todo componente entregue MUST vir acompanhado, na mesma tarefa, de três artefatos: (a) story cobrindo todos os seus estados e variantes, (b) teste de story, que exercita a renderização de cada estado e sofre as checagens de acessibilidade, e (c) teste de comportamento separado da story. Story sem teste e teste sem story são violação; entregar apenas um dos dois níveis de teste também é.
  Para o componente cuja **transição de estado** é o entregável — os seis Client Components de
  `contracts/components.md`, e são os mesmos seis por construção, porque transição é o que
  justifica a diretiva — o teste de comportamento MUST exercitar a transição, não apenas o
  render. Isto **não** é um terceiro nível de teste: é o que (c) exige quando o componente tem
  estado.
- **FR-043a**: Todo teste de componente MUST ficar colocado na pasta do próprio componente, ao lado do arquivo e da story — `src/components/<Nome>/<Nome>.test.tsx`, seguindo a convenção de pasta por componente que o projeto já usa. O sistema MUST NOT criar pasta `tests/unit` para teste de componente, e a mesma regra de colocação vale para teste de integração entre componentes, que fica na pasta do componente que o integra.
- **FR-043b**: O teste de componente MUST rodar em ambiente capaz de renderizar React. O projeto `unit` atual roda em `environment: 'node'` e inclui somente `tests/unit/**/*.test.ts`, portanto a configuração do Vitest MUST ganhar um terceiro projeto, nomeado `components`, que recolha `src/components/**/*.test.tsx` em ambiente que renderize componente, e o comando do Portão 3 MUST cobrir esses testes. O projeto `storybook` MUST NOT ser absorvido por esse comando — a fronteira entre o Portão 3 e o Portão 4 é congelada (`GATES.md` §2).
- **FR-043c**: As checagens de acessibilidade MUST estar configuradas para **falhar** o teste, não apenas reportar: `.storybook/preview.tsx` está hoje com `a11y: { test: "todo" }`, que só reporta, e MUST passar a `"error"`.
- **FR-044**: O projeto MUST passar a oferecer um comando de verificação de tipos chamado
  `typecheck`, hoje inexistente. A tarefa que **cria** o comando MUST anteceder toda tarefa que
  dependa do Portão 2; até que ele exista, a tarefa MUST usar o comando subjacente equivalente, e
  depois que ele existe o comando subjacente **deixa de ser aceito** para fechar tarefa
  (Constituição §Regras de aplicação).
- **FR-045**: O projeto MUST passar a oferecer um comando único, chamado `test:all`, que execute
  os testes de comportamento de componente e os testes de story, hoje não cobertos pelo comando de
  teste padrão. O Portão 4 MUST continuar existindo como comando próprio: `test:all` é
  conveniência, não substitui a régua de nenhum dos dois portões. O portão de story MUST ainda
  ter o binário de navegador instalado por `npx playwright install chromium` — sem ele o portão
  não fica vermelho, fica **inexecutável**, e portão inexecutável equivale a vermelho para efeito
  do Portão 8.
- **FR-046**: Toda tarefa desta feature MUST satisfazer os oito portões **como definidos em
  `.specify/memory/constitution.md` §Quality Gates (v2.0.0)**, com comando exato, escopo, linha de
  base medida, ruído tolerado e lista de rotas do Portão 6 **como registrados em `GATES.md`**.
  Esta spec **não transcreve** o bloco de portões: a transcrição literal produziu cinco cópias que
  divergiram em seis pontos medidos, e a divergência entre um documento subordinado e a
  constituição é defeito do documento subordinado.
- **FR-046a**: "Aviso novo" MUST ser medido contra uma linha de base registrada em `GATES.md` §3,
  comparada **por identidade** — arquivo, linha e texto da regra — e nunca por contagem, porque
  contagem igual esconde a troca de um aviso por outro. Das duas bases antes não medidas, a do
  `next build` (Portão 5) está **medida** (`plan.md` R12, zero aviso de código) e MUST apenas ser
  **registrada** pela tarefa de infraestrutura; a de **console** (Portão 6) MUST ser medida e
  registrada pela **tarefa de Portão 6 da primeira camada**, porque medi-la é executar o portão —
  exigi-la da tarefa de infraestrutura seria exigir o portão fora da cadência que a constituição
  fixou. Enquanto uma base estiver vazia, "aviso novo" naquele portão não tem referência e o
  critério não é exigível.
- **FR-046b**: Quando corrigir um portão vermelho exigiria alterar arquivo congelado por SC-011, o
  **escopo prevalece**: a correção MUST caber em `src/app/globals.css` e `src/app/layout.tsx`.
  Valor provisório é aceitável se, e só se, (a) registrado em seção própria e nomeada de
  `DESIGN.md` e (b) coberto pela tarefa final que exige aquela seção **vazia** — mesma mecânica do
  bloco `LEGADO` de FR-002a. Ampliar o escopo para fechar um portão exige emenda escrita ao escopo
  **antes** da correção.
- **FR-047**: Nenhuma tarefa pode ser dada por concluída com qualquer portão vermelho; a correção
  acontece na própria tarefa, sem acúmulo para o fim da feature. Portão que não pôde ser executado
  por causa externa **bloqueia** a tarefa em vez de concluí-la, e portão que fica vermelho por
  efeito de tarefa anterior já fechada é responsabilidade da tarefa em curso.

### Key Entities

- **Token de design**: valor visual nomeado (cor, tamanho de texto, raio, sombra, família tipográfica) com um único ponto de definição e um significado de uso.
- **Categoria**: uma das cinco trilhas editoriais do blog, cada uma com cor fixa e contagem de posts.
- **Post (dado de exemplo)**: título, resumo, data, tempo de leitura, categoria, tags e posição opcional em série — usado apenas para alimentar o catálogo.
- **Série**: sequência ordenada de posts, com posição e marcação de item já lido.
- **Estado de componente**: variação visível e nomeável de um componente que precisa aparecer no catálogo e ser coberta por teste.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos 36 componentes do inventário (15 re-estilizados e 21 novos) estão presentes no catálogo, cada um com story, teste de story e teste de comportamento, todos colocados na pasta do componente.
- **SC-002**: 100% dos estados do catálogo têm **duas** entradas, uma em desktop 1280px e uma em 390px, e as duas são renderizadas e submetidas às checagens de acessibilidade na execução do teste de story — nenhuma das duas depende de o leitor trocar o viewport à mão. Excetua-se a entrada de hover de FR-018a, que tem **uma** entrada, em 1280px.
- **SC-003**: 100% dos estados e variantes aparecem no catálogo, **incluindo os dez casos de borda classificados `E`** na tabela de *Edge Cases*; e os três casos classificados `A` têm teste de comportamento. Zero caso de borda fica sem dono e sem tratamento. A régua **não** é "estados enumerados nos requisitos": dezesseis dos trinta e seis componentes não enumeram estado próprio nesta spec (`Header`, `Footer`, `Hero`, `PostContent`, `PostsListing`, `Container`, `CopyLinkButton`, `Breadcrumb`, `ReadingProgress`, `CategoryCard`, `SeriesShelf`, `YearArchive`, `AuthorCard`, `PrevNext`, `Kbd`, `InlineCode`), e sob aquela redação os dezesseis satisfaziam o critério **trivialmente, com zero estado**. A régua é a **lista de estados declarada na tarefa daquele componente em `tasks.md`**, que é onde FR-036 ("todo estado desenhado no artboard, mesmo quando não enumerado") vira uma lista finita e conferível. Estado desenhado no artboard e ausente da lista da tarefa é defeito da tarefa, não licença.
- **SC-004**: Zero valor visual hardcoded em componentes: toda cor, tamanho de texto, entrelinha, espaçamento entre letras, peso, raio e sombra resolve para um token nomeado — **a mesma lista do Princípio I**. Duas réguas, ambas de grep, ambas sem exceção:

  1. `grep -rnE '#[0-9a-fA-F]{3,8}' src/components/` MUST devolver vazio. Não existe exceção legítima: `brand-linkedin` é token (FR-001a), o branco é `--color-white` (FR-001b) e os SVG de marca são caminhos sem cor própria.
  2. `grep -rnE 'border(-[0-9]|-\[)' src/components/` MUST devolver vazio — só `border-2` é sancionado (FR-007).

  **Espessura de borda saiu da lista de tokens**: o Tailwind v4 não tem namespace de `@theme` para ela (medido) e o Princípio I não a inclui, então exigir token era exigir o impossível acima da constituição. Ela é verificada pela régua 2, não por token.
- **SC-005**: Zero uso da paleta anterior no código: nenhum dos **dezenove** tokens aubergine enumerados em FR-002 permanece declarado ou consumido, e nenhum dos doze valores novos coincide com um valor antigo sob nome diferente (renomeio disfarçado). Reusar um **nome** com valor novo é permitido e está enumerado em FR-002. `DESIGN.md` MAY nomear os dezenove numa seção "Removidos", como registro histórico — isso não conta como ocorrência.
- **SC-005a**: Ao fim da feature o bloco `/* LEGADO */` de `src/app/globals.css` está vazio e removido: zero dos quinze tokens órfãos enumerados em FR-002a permanece declarado ou consumido. Os sete `--spacing-*` já saíram na tarefa de tokens (FR-005a) e não chegam ao bloco.
- **SC-006**: As checagens automatizadas de acessibilidade passam em 100% das stories, sem exceção registrada, e estão configuradas para reprovar o teste quando falham — não apenas para reportar.
- **SC-007**: Nenhum texto do sistema fica abaixo de 4,5:1 (ou 3:1 acima de 24px) em nenhuma variante de superfície entregue, e nenhum indicador de foco fica abaixo de 3:1 (FR-041a). **Régua**: a regra `color-contrast` do `addon-a11y`, que roda com `test: "error"` sobre as duas entradas de cada estado (FR-043c), mais a tabela de contraste de `DESIGN.md` para os pares que o addon não alcança — texto sobre superfície que só existe como variante de prop. Contraste afirmado em review sem uma das duas não conta (Princípio IV).
- **SC-008**: Nenhum alvo de toque fica abaixo de 44px na menor dimensão. **Régua**: a regra `target-size` do `addon-a11y` MUST estar habilitada, e o teste de comportamento de cada componente interativo assere a menor dimensão do alvo. Sem régua declarada este critério era inverificável — o `addon-a11y` não checa alvo de toque por padrão.
- **SC-009**: Em 390px nenhuma apresentação do catálogo produz rolagem horizontal. **Régua**: cada entrada `<Estado>Mobile` assere `document.documentElement.scrollWidth <= 390` no teste de story, que roda em navegador real. Inspeção visual não conta.
- **SC-010**: Os oito portões de qualidade passam do estado atual — dois sem comando e um
  inexecutável por falta de binário de navegador — para verdes ao fim da feature. "Executável" é
  definido por natureza do portão: os portões **1 a 6** por comando registrado em `GATES.md` §1; o
  **7** pela presença dos três artefatos exigidos por FR-043 em cada componente; o **8** pelo
  estado dos portões 1 a 7 no instante em que cada tarefa é fechada. Os portões 7 e 8 não têm
  comando por natureza, e isso não conta como portão não executável.
- **SC-011**: Sob `src/app/**`, exatamente dois arquivos são alterados — `globals.css` e `layout.tsx` (este último só no bloco de fontes e na `className` do `<html>`). Zero arquivo sob `src/lib/**` e `src/content/**` é alterado.
- **SC-012**: Zero erro e zero aviso novo no terminal **e** no console do navegador, na execução
  de desenvolvimento e na de produção, sobre as onze rotas de `GATES.md` §6. A régua é a mesma do
  Portão 6, sem assimetria entre os dois canais: erro reprova em qualquer um dos dois, e aviso
  reprova quando é novo em relação à base de `GATES.md` §3. A única tolerância é a lista fechada de
  ruído de `GATES.md` §4.
- **SC-013**: `SearchBox` e `DisqusComments` terminam a feature com zero linha alterada, e a compilação segue verde com a rota de busca intacta.
- **SC-014**: Zero call site em `src/app/**` precisa mudar: o contrato mínimo de FR-016 fica intacto e `npm run build` segue verde sem editar rota alguma.
- **SC-015**: Zero componente desta feature busca dado por conta própria: nenhum deles lê sistema de arquivos, chama rede ou importa módulo de servidor. Todo dado exibido chega por propriedade.
- **SC-016**: A supressão de movimento tem exatamente **um** ponto de definição: zero componente declara a própria consulta de `prefers-reduced-motion`, e zero dependência de animação consta do `package.json` ao fim da feature.

## Out of Scope *(explícito)*

Esta feature **não** inclui, e nenhuma tarefa dela pode tocar:

- Qualquer alteração em `src/app/**`, incluindo layout, páginas e estilos globais de rota.
- Criação, remoção ou alteração de rota.
- Qualquer alteração em `src/lib/**`.
- Qualquer alteração em conteúdo MDX ou em `src/content/**`.
- O backlog de posts e qualquer decisão editorial.
- A aplicação dos componentes portados às telas reais do blog — isso é a feature seguinte.
- Qualquer biblioteca de animação, incluindo Motion (`motion.dev`). O movimento desta feature é retorno de estado em CSS sob a regra de FR-042a; nenhuma dependência de animação entra.

**Exceções necessárias, e só estas duas**:

1. `src/app/globals.css` — o arquivo de tokens do design system vive aqui. Alterá-lo é requisito desta feature (FR-001 a FR-010) e não conta como violação do limite de escopo.
2. `src/app/layout.tsx`, **apenas no bloco de fontes e na `className` do `<html>`**. As fontes são carregadas por `next/font/google` neste arquivo: hoje ele declara `Plus_Jakarta_Sans` com `variable: "--font-jakarta"` e aplica `plusJakartaSans.variable` no `<html>`. Sem tocá-lo, FR-003 e FR-004 são **impossíveis de cumprir** — não existe forma de trocar a família por `next/font/google` de dentro do CSS. A exceção cobre somente: a troca das declarações de fonte e a `className` do `<html>`. MUST NOT ser alterado nada mais nesse arquivo — nem `metadata`, nem a composição de `Header`/`main`/`Footer`, nem a estrutura do `<body>`.

Nenhum outro arquivo sob `src/app/**` pode ser tocado.

## Assumptions

- **Catálogo como entrega**: "story no Storybook" é a forma de catálogo já adotada no projeto; a feature entrega catálogo, não telas.
- **SearchBox aposentado, não apagado**: decisão do autor — sai do inventário do redesign, mas o arquivo fica em disco porque `src/app/search/page.tsx` o importa e rotas estão fora de escopo. A feature das rotas remove o import e só então o arquivo.
- **Dados de exemplo**: os componentes de conteúdo são alimentados por dados de exemplo definidos dentro das próprias stories, sem ler conteúdo MDX real (que está fora de escopo). Nenhum componente desta feature busca dado por conta própria: todo dado entra por propriedade, e a ligação com a origem real é trabalho da feature das rotas.
- **Button `md` em 44px, não 40px**: o artboard desenha 40px, e 40px reprova o mínimo de alvo de toque do Princípio IV, de FR-037 e de SC-008 — três réguas incondicionais. A constituição prevalece sobre o mock e o `md` sobe 4px. Registrado também em *Divergências entre artboard e entrega*.
- **MobileTabBar em 74px**: decisão do autor diante do conflito entre o pedido (62px), o artboard de desktop (62px) e o artboard de celular (74px) — vence a fonte mais específica para o contexto.
- **Header cobre as duas apresentações**: os artboards nomeiam "TopBar" (desktop, faixa de 68px) e "MobileHeader" (celular, 64px). Assume-se que ambos são apresentações responsivas do componente `Header` já existente, preservando o nome pedido.
- **Kbd e InlineCode**: aparecem nos artboards embutidos em outros blocos; são entregues como componentes próprios conforme a lista de novos componentes.
- **Raio de 16px**: consta da identidade pedida mas não aparece rotulado nos artboards; é criado como token disponível ainda que sem consumidor inicial.
- **CategoryBadge em 390px**: o artboard de celular mostra o rótulo em 9px contra 11px no desktop; assume-se redução responsiva do mesmo componente, não um segundo componente.
- **Ícones**: decisão do autor — `lucide-react`, adotada como dependência nova. A decisão foi tomada com o conflito explicitado: lucide é biblioteca de traço, e a identidade pedida dizia "ícone pintado, nunca contornado". O autor escolheu a biblioteca; FR-019 e FR-028 foram reescritos e a exigência de ícone pintado saiu da spec. Duas consequências ficam registradas: o visual dos ícones passa a divergir dos artboards nesse aspecto, e as marcas GitHub e LinkedIn podem não existir na biblioteca (lucide depreciou ícones de marca), caso em que entram como SVG oficial da marca.
- **Baseline de testes**: o projeto tem hoje zero teste de componente — os quatro arquivos em `tests/unit` cobrem apenas lógica de `src/lib` — e 11 de 17 componentes com story (faltam CodeBlock, Container, CopyLinkButton, FeaturedPostCard, Pagination e PostsListing). Portanto esta feature cria a primeira suíte de teste de componente do projeto.
- **Os quatro testes de lógica em `tests/unit` ficam onde estão**: a regra de colocação de FR-043a vale para teste de componente, que é o que esta feature entrega. Mover `posts.test.ts`, `posts-validation.test.ts`, `search-index.test.ts` e `filtering.test.ts` para junto de `src/lib` esbarraria no congelamento de `src/lib/**` (SC-011), então a migração deles não pertence a esta feature — fica registrada como pendência para quando `src/lib/**` abrir.
- **DisqusComments**: existe em `src/components/` e não foi citado em nenhuma das duas listas. Confirmado pelo autor — permanece intocado nesta feature, com a barra de reações entrando como `LikeCommentBar` separado, sem absorver o embed de terceiros.
- **Modo escuro**: decisão do autor — não existe modo escuro. O alternador de tema aparece nos artboards, mas MUST NOT ser portado: fica fora do inventário desta feature, sem token escuro, sem seletor de tema e sem persistência. Se o tema escuro voltar, volta como feature própria.
- **Motion adiado, não descartado**: decisão do autor diante da avaliação — `motion.dev` foi considerada e fica fora desta feature. Os fatos que sustentam o adiamento: a biblioteca não está instalada e seria a segunda dependência de runtime nova; ela exige `"use client"`, e usá-la fora dos 6 componentes que já são Client Component transformaria Server Component em Client Component contra o Princípio III; ela cobre movimento reduzido só no que ela mesma anima, então não substitui a regra global de FR-042a; e os artboards são HTML estático, não especificam movimento algum. O ganho da biblioteca — sequência, layout e gesto — não está desenhado nem pedido. Se o movimento orquestrado for desejado, volta como feature própria, sobre a mesma regra de FR-042a.
- **Tempo de leitura e contagem de palavras**: exibidos como dado recebido por propriedade, sem cálculo próprio nesta feature.

## Dependencies

- Artifact de redesign `1wTbkt7LJrH6yjQqc13VQH` (versão `1790377732-ae4b` — a mesma do cabeçalho desta spec e de `tasks.md`) como fonte da verdade visual, já lido e registrado nesta spec.
- `lucide-react` como fonte dos ícones do sistema (FR-036a); dependência nova, a ser adicionada pela primeira tarefa do plano.
- Constituição do projeto **v2.0.0** §Quality Gates, que define os oito portões referenciados por FR-046, e `GATES.md` na raiz, que registra comando, escopo, linha de base e ruído tolerado.
- As três famílias tipográficas precisam estar disponíveis pelo provedor de fontes já usado no projeto.
- `storybook-addon-pseudo-states` como forma de forçar o pseudo-estado exigido pela entrada de hover de FR-018a; dependência de desenvolvimento nova. A versão publicada (`10.6.0`) exige `storybook ^10.6.0`, e o projeto tem **10.5.10** instalado: adotá-la implica subir o Storybook e todos os pacotes `@storybook/*` para 10.6.0 em conjunto — movimento que cabe nos intervalos `^10.5.10` já declarados, mas que é tarefa própria e MUST anteceder a primeira entrada de hover.
