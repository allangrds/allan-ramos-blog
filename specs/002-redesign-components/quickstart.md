# Quickstart — validação da feature

**Feature**: `002-redesign-components` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

Guia executável para provar que a feature funciona. Nenhum código de implementação aqui.

---

## 0. Pré-requisito único, uma vez por máquina

```bash
npx playwright install chromium
```

**Sem isso o Portão 4 não roda.** Ele não falha por teste vermelho — **não executa**:

```text
error during close Error: browserType.launch: Executable doesn't exist at
  .../ms-playwright/chromium_headless_shell-1234/chrome-headless-shell
```

**Não verifique isto listando a pasta de caches.** Medido em R13: a máquina pode **já ter** um
`chromium_headless_shell-<rev>` instalado e o portão continuar inexecutável, porque o Playwright
resolvido pelo projeto procura **outra revisão de build**. `ls ~/Library/Caches/ms-playwright/` dá
falso positivo. A única verificação válida é executar o portão:

```bash
npx vitest run --project storybook
```

Esperado: as stories existentes passam a ser **executadas** (hoje o projeto descobre 11 arquivos e
reporta `no tests`). Este é o **único** pré-requisito manual de máquina — o "checkout limpo" da
US2 é medido depois dele, não antes.

---

## 1. Os portões

Comando exato, escopo de cada comando, linha de base medida e ruído tolerado:
[`GATES.md`](../../GATES.md) §1 a §4. Este guia **não os copia** — cinco cópias do bloco de
portões já divergiram em seis pontos, e a correção foi reduzir tudo a um lugar.

Dois avisos de leitura, porque são a origem de erro mais comum:

- **Seis comandos, oito portões.** Os portões 7 (teste como entregável) e 8 (nada fecha vermelho)
  não têm comando **por natureza** — o que não os torna opcionais nem "não executáveis". SC-010
  define isso explicitamente.
- **"Aviso novo" é comparado por identidade**, nunca por contagem (`GATES.md` §3, FR-046a). O
  aviso de base é `src/lib/mdx.tsx:98:5 — Unused eslint-disable directive`, em arquivo congelado
  por SC-011, que esta feature **não pode** corrigir. Total "1 warning" com outro aviso no lugar
  é regressão, não base mantida.
- **Um aviso do `next build` pode ser da sua máquina, não do repositório** (R12). Se aparecer
  `Next.js ignored package-lock.json ... because it is outside the current Git repository`, a
  causa é um `package-lock.json` órfão no diretório **pai** do repositório. A base de código do
  Portão 5 é **zero aviso**; este é ruído de ambiente e a T001 registra o que decidiu fazer com
  ele (`GATES.md` §4, ou apagar o arquivo órfão — que está fora do repo e não fere SC-011).

---

## 2. Portão 6 — execução limpa, procedimento repetível

Roda **ao fim de cada camada** e uma vez ao fim da feature, não a cada tarefa. A cadência é
exceção **nomeada** na Constituição §Cadência; o motivo é o custo medido de onze rotas abertas
duas vezes com inspeção de console à mão.

**Procedimento, rotas, ambiente de inspeção e exigência de evidência**: [`GATES.md`](../../GATES.md) §6.

```bash
npm run dev                  # as onze rotas, na ordem de GATES.md §6
npm run build && npm start   # as mesmas onze — hydration mismatch só aparece aqui
```

### 2.3 O que conta como falha

A lista é **aberta** (Constituição §Os oito portões, Portão 6): **qualquer** erro e **qualquer**
aviso novo reprovam, no terminal e no console, mesmo que a página renderize. Os cinco casos de
maior risco que MUST ser procurados ativamente estão na constituição; a única tolerância é a lista
fechada de ruído de `GATES.md` §4.

### 2.4 Verificação específica desta feature

- **`/search` continua funcionando** com o `SearchBox` antigo e visual antigo. Isso é
  **esperado**, não defeito: `src/app/**` está fora de escopo (SC-013).
- **Zero `git diff` em `src/app/**` além de `globals.css` e `layout.tsx`**:

```bash
git diff --name-only -- src/app/ src/lib/ src/content/
# única saída aceitável: src/app/globals.css e src/app/layout.tsx
```

Qualquer outro arquivo nessa lista é violação de SC-011. E em `layout.tsx` o diff **MUST** ficar
restrito ao bloco de fontes e à `className` do `<html>`:

```bash
git diff -- src/app/layout.tsx
# nada de metadata, nada de Header/main/Footer, nada na estrutura do <body>
```

---

## 3. Catálogo — verificação visual por camada

```bash
npm run storybook
```

Ao fim de cada camada, percorrer no catálogo:

1. Todos os estados listados na **tarefa daquele componente** em `tasks.md` (FR-036, SC-003). A
   régua **não** é "os estados enumerados nos requisitos": 16 dos 36 componentes não enumeram
   nenhum, e sob aquela leitura passariam com zero estado.
2. **Cada componente em desktop e em 390px** (FR-038, SC-002).
3. Em 390px: coluna única, botão isolado em largura cheia, **zero rolagem horizontal** —
   asserido por `document.documentElement.scrollWidth <= 390` em cada entrada `Mobile`, não
   inspecionado (FR-039, SC-009).
4. A entrada de **hover** de cada elemento interativo, em 1280px (FR-018a), e o **foco visível**
   alcançável por teclado em todos eles (FR-018b).

---

## 4. Contraste — item de aceitação, não sugestão

Os valores já foram calculados (ver [research.md](./research.md) R3). A verificação por camada é
**binária**:

| Regra | Como verificar |
|---|---|
| Sobre `flame`, `sun`, `mint` o texto é **sempre `ink`** | `color-contrast` do `addon-a11y` com `test: "error"` |
| Branco só sobre `ink`, `ink-blue`, `code-bg`, `#0A66C2` | `color-contrast` do `addon-a11y`, mais a tabela de contraste de `DESIGN.md` para os pares que o addon não alcança |
| Nenhum texto abaixo de 4,5:1 (3:1 só acima de 24px) | `npx vitest run --project storybook` |

**Armadilhas medidas** — branco sobre `sun` dá **1.59:1** e sobre `mint` dá **2.34:1**. As duas
reprovam até o limite relaxado de 3:1. Onde isso morde: `FeaturedPostCard` ("título em display
sobre o acento") e `CategoryBadge`. Nos dois, o texto **tem de ser `ink`**.

FR-008 foi corrigida na spec durante o planejamento para exatamente esta régua — a redação
anterior permitia branco ≥24px em display sobre qualquer acento, o que a medição reprovou.

---

## 5. Critérios de pronto da feature

Portões 1 a 5 verdes (`GATES.md` §1) e `npm run test:all` verde, **mais os dezessete critérios de
sucesso**. A lista abaixo cobre **todos** os SC da spec — antes omitia oito deles, e critério de
pronto incompleto é critério que aprova o que não devia:

- [ ] **SC-001** — 36 componentes no catálogo, cada um com story, teste de story e
      `<Nome>.test.tsx` na própria pasta
- [ ] **SC-002** — cada estado em duas entradas, 1280px e 390px, as duas renderizadas no teste de
      story (exceto a entrada de hover, que só existe em 1280px)
- [ ] **SC-003** — todos os estados listados na tarefa de cada componente em `tasks.md` presentes
      no catálogo, **incluindo os dez
      casos de borda `E`**; os três casos `A` com teste de comportamento
- [ ] **SC-004** — `grep -rnE '#[0-9a-fA-F]{3,8}' src/components/` devolve **vazio**, sem exceção
- [ ] **SC-005** — zero token aubergine declarado ou consumido; nenhum renomeio disfarçado
- [ ] **SC-005a** — bloco `/* LEGADO */` vazio e removido; e a seção de valores provisórios de
      `DESIGN.md` (FR-046b), se foi usada, também vazia
- [ ] **SC-006** — a11y passa em 100% das stories, com `a11y.test` em `"error"`; nenhuma regra
      desativada sem registro em `DESIGN.md`
- [ ] **SC-007** — nenhum texto abaixo de 4,5:1 (3:1 só acima de 24px) em nenhuma superfície
- [ ] **SC-008** — nenhum alvo de toque abaixo de 44px na menor dimensão. **Régua**: a regra
      `target-size` do `addon-a11y` habilitada (não vem por padrão), mais a asserção da menor
      dimensão no teste de comportamento de cada componente interativo
- [ ] **SC-009** — zero rolagem horizontal em 390px em toda apresentação do catálogo. **Régua**:
      `document.documentElement.scrollWidth <= 390` asserido em cada entrada `Mobile`; inspeção
      visual não conta
- [ ] **SC-010** — portões 1 a 6 executáveis e verdes; 7 e 8 satisfeitos pelos critérios de
      natureza definidos no próprio SC-010
- [ ] **SC-011** — `git diff` de `src/app/**` limitado a `globals.css` + `layout.tsx`;
      `src/lib/**` e `src/content/**` intocados
- [ ] **SC-012** — zero erro e zero aviso novo, terminal e console, nas **onze** rotas, em `dev` e
      em produção, contra a base de `GATES.md` §3
- [ ] **SC-013** — `SearchBox` e `DisqusComments` com zero linha alterada
- [ ] **SC-014** — zero call site em `src/app/**` alterado
- [ ] **SC-015** — nenhum componente busca dado por conta própria
- [ ] **SC-016** — supressão de movimento com um único ponto de definição; zero dependência de
      animação no `package.json`
- [ ] **FR-011a** — `DESIGN.md` existe e cobre todos os tokens
- [ ] **R14** — nenhuma dependência de `package.json` declarada como `"latest"`; a base de
      `GATES.md` §3 foi registrada **depois** de as versões serem fixadas
