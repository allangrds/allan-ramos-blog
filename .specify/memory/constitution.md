<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0
Bump rationale: MAJOR — redefinição incompatível de regra de governança. O texto de 1.0.0
dizia que os portões valem "para toda tarefa, sem exceção"; 2.0.0 nomeia uma exceção de
cadência para o Portão 6. Além disso o Portão 3 muda de exigência (passa a obrigar cobertura
do teste de componente) e a seção deixa de transcrever comandos, que migram para GATES.md.

Origem: auditoria de qualidade de requisitos em
specs/002-redesign-components/checklists/quality-gates.md (60 itens), que mediu seis
divergências entre as cinco cópias do bloco de portões.

Principles: nenhum alterado. I a V seguem idênticos, inclusive numeração e redação.

Sections modified:
  - Quality Gates — reescrita. Deixa de ser transcrição literal de um bloco de comandos e
    passa a ser regra. Mudanças materiais:
      * Portão 3 passa a exigir que o comando cubra o teste de componente (antes dizia
        "projeto unit verde", o que deixava o teste de componente fora do portão).
      * Portão 4 ganha a proibição explícita de ser absorvido pelo comando do Portão 3.
      * Portão 6 passa a ter lista ABERTA de falhas: qualquer erro e qualquer aviso novo
        reprovam; os cinco tipos antes enumerados passam a ser os casos de maior risco.
      * Cadência ganha seção própria: 1–5 por tarefa, 6 por camada e ao fim da feature.
        Esta é a única exceção, e é nomeada.
      * Nova subseção "Falha de portão": corrigir adiante × reverter, precedência do escopo
        declarado, portão instável, falha por causa externa, falha retardada, e a11y que
        falha por motivo legítimo. Nenhuma delas tinha tratamento em 1.0.0.
      * Comando exato, escopo de comando, linha de base medida, ruído tolerado e rotas do
        Portão 6 saem daqui e passam a viver em GATES.md, na raiz.
      * O aviso "dois dos portões ainda NÃO existem como script" sai: era descrição de estado,
        não regra, e ficaria falso assim que os scripts fossem criados.
  - Governance — GATES.md entra na lista de documentos subordinados.

Sections added: nenhuma seção de topo nova.
Sections removed: o bloco ```text GATES (...)``` transcrito literalmente.

Follow-up TODOs:
  - GATES.md §3 tem duas bases ainda não medidas (avisos do build e do console), marcadas ⚠
    e atribuídas à primeira tarefa de infraestrutura da feature em curso.
-->

# Allan Ramos Blog Constitution

## Core Principles

### I. Design System como Fonte Única

Todo valor visual — cor, tipografia, espaçamento, raio de borda e sombra — MUST viver
como token em `src/app/globals.css`, declarado em `:root` e exposto via `@theme inline`.

- Componente MUST NOT hardcodar valor visual. Nenhum hex, nenhum `px` avulso, nenhuma
  escala tipográfica inline que não venha de um token.
- Se um componente precisa de um valor que ainda não existe, o token MUST ser criado
  primeiro; só então o componente o consome.
- `DESIGN.md` MUST ser atualizado no mesmo commit em que o token é criado, alterado ou
  removido. Token sem entrada em `DESIGN.md` é violação; entrada em `DESIGN.md` sem token
  correspondente também é.

**Racional:** um blog pessoal muda de visual aos poucos e por impulso. Centralizar os
valores em tokens é o que permite mudar a identidade em um lugar só, e manter `DESIGN.md`
no mesmo commit é o que impede a documentação de virar ficção.

### II. Componente com Story e Teste (NÃO NEGOCIÁVEL)

Nenhum componente entra em `src/components/` sem, na mesma entrega:

- `<Nome>.stories.tsx` cobrindo TODOS os estados e variantes do componente — não apenas o
  caso feliz; e
- teste automatizado do comportamento do componente.

Story sem teste é violação. Teste sem story é violação. As duas condições são conjuntas,
não alternativas. Alterar um componente existente MUST atualizar story e teste junto.

**Racional:** a story é a documentação viva e o alvo das checagens de a11y (Princípio IV);
o teste é o que trava a regressão. Entregar um sem o outro deixa metade da rede de proteção
no chão e transfere a dívida para o próximo commit, que nunca chega.

### III. Server Component por Padrão

Todo componente MUST ser Server Component por padrão. `"use client"` é permitido SOMENTE
quando há pelo menos um destes: estado, efeito, handler de evento ou API de browser.

- A diretiva MUST ficar no menor componente possível que realmente precisa dela.
- Subir `"use client"` para o componente pai por conveniência é violação, mesmo que
  funcione.
- Componente marcado `"use client"` MUST NOT ser `async` e MUST NOT importar módulo
  `server-only`.

**Racional:** cada `"use client"` arrasta a subárvore inteira para o bundle do cliente.
Num blog, cujo conteúdo é majoritariamente estático, a fronteira mal colocada custa
JavaScript que o leitor baixa sem receber nada em troca.

### IV. Acessibilidade Verificada, Não Prometida

- Elemento interativo MUST ser `<button>`, `<a href>` ou `<input>` com `<label>` de
  verdade. `div`/`span` com `onClick` é proibido, sem exceção.
- Alvo de toque MUST ter no mínimo 44px na menor dimensão.
- Texto MUST passar contraste 4.5:1; 3:1 é aceito apenas acima de 24px.
- As checagens do `@storybook/addon-a11y` MUST rodar como teste e MUST passar. Acessibilidade
  afirmada em review sem checagem verde não conta como verificada.

**Racional:** "verificada, não prometida" é o ponto inteiro do princípio. Semântica HTML
correta entrega teclado, leitor de tela e foco de graça; recriá-los à mão em cima de uma
`div` sempre sai pior. O addon-a11y como teste é o que transforma a intenção em portão.

### V. Simplicidade

Mínimo de código que resolve o problema. Nada especulativo.

- MUST NOT criar abstração para uso único.
- MUST NOT adicionar configurabilidade que não foi pedida.
- MUST NOT escrever tratamento de erro para cenário impossível.
- Nenhuma funcionalidade além da que foi pedida.

Teste prático: se um engenheiro sênior olharia e diria "isto está complicado demais",
está. Reescreva menor.

**Racional:** este é um blog pessoal mantido por uma pessoa nas horas vagas. Toda
abstração criada "para depois" é custo de manutenção cobrado hoje contra um benefício que
provavelmente nunca chega.

## Quality Gates

Oito portões valem para toda tarefa. O que cada portão **exige** está nesta seção e é alterável
só por emenda. O **comando exato**, o **escopo de cada comando**, a **linha de base medida**, o
**ruído tolerado** e a **lista de rotas do Portão 6** vivem em [`GATES.md`](../../GATES.md), na
raiz, e são atualizáveis em commit comum: medição não é governança, e exigir emenda para
registrar um número medido deixaria este documento refém de cada atualização de dependência.

### Os oito portões

1. **Lint** — zero erro e zero aviso **novo** em relação à base registrada em `GATES.md`.
2. **Tipos** — zero erro.
3. **Teste de comportamento** — verde. O comando deste portão MUST cobrir o teste de
   **componente**, não apenas o de lógica. Portão de teste que não executa o teste que o
   Princípio II torna obrigatório não verifica nada.
4. **Teste de story** — verde, incluindo as checagens do `@storybook/addon-a11y` configuradas
   para **reprovar**, não para reportar. Este portão tem comando **próprio**: o comando do Portão
   3 MUST NOT passar a cobri-lo.
5. **Build** — sem erro e sem aviso **novo** em relação à base registrada em `GATES.md`.
6. **Execução limpa no Next.js** — em desenvolvimento **e** em produção, sobre a lista de rotas
   de `GATES.md`: **qualquer** erro e **qualquer** aviso novo reprovam, no terminal e no console
   do navegador, mesmo que a página renderize. Os casos de maior risco, que MUST ser procurados
   ativamente, são hydration mismatch, `"use client"` faltando em componente com hook ou
   manipulador, import de módulo `server-only` dentro de Client Component, Client Component
   `async`, e uso de API de browser durante render no servidor — a lista é de **exemplos**, não
   é o limite do que reprova. O que **não** reprova é apenas a lista fechada de ruído tolerado de
   `GATES.md`.
7. **Teste é entregável, não opcional** — toda tarefa que cria ou altera um componente entrega,
   na mesma tarefa: (a) o componente, (b) a story com todos os estados, (c) o teste. Tarefa sem
   teste está incompleta.
8. **Nenhuma tarefa é fechada com portão vermelho** — a correção acontece na tarefa em que o
   portão ficou vermelho. Dívida não é adiada para o fim da feature.

### Cadência

Os portões 1 a 5 rodam **a cada tarefa**. O Portão 6 roda **ao fim de cada camada de
implementação, em tarefa própria, e uma vez mais ao fim da feature**. Esta é a **única exceção de
cadência**, e ela é nomeada aqui em vez de ser praticada em silêncio por um documento
subordinado. O motivo é medido: o Portão 6 exige abrir onze rotas duas vezes e inspecionar
console à mão, o que a cada tarefa daria quase uma centena de execuções manuais — e o custo não
compra detecção, porque os defeitos que ele encontra nascem da composição, que só existe com a
camada fechada. Os portões 7 e 8 não têm cadência: valem no instante em que a tarefa é fechada.

### Falha de portão

- **Corrigir adiante, não reverter.** A correção acontece na própria tarefa. Reverter é recurso
  de quem implementa, nunca forma de fechar a tarefa com o portão ainda vermelho.
- **O escopo declarado prevalece.** Quando corrigir um portão vermelho exigiria tocar arquivo que
  a feature declarou fora de escopo, a correção MUST caber nos arquivos permitidos. Valor
  provisório é aceitável se, e só se, (a) registrado em seção própria e visível de `DESIGN.md` e
  (b) coberto por tarefa nomeada que exige aquela seção **vazia** antes do fim da feature.
  Ampliar o escopo declarado para fechar um portão exige emenda ao escopo, por escrito, **antes**
  da correção — nunca depois dela.
- **Portão instável** — resultado intermitente NÃO conta como verde. Reexecutar é permitido para
  diagnosticar; o portão é verde só quando o verde se repete. Instabilidade observada MUST ser
  registrada em `GATES.md` — como ruído tolerado, com motivo, ou tratada como falha.
- **Falha por causa externa** — rede indisponível, provedor de fontes fora, binário de navegador
  ausente. A tarefa fica **bloqueada**, não concluída: para efeito do Portão 8, portão que não
  pôde ser executado equivale a portão vermelho.
- **Falha retardada** — portão que fica vermelho por efeito de tarefa anterior já fechada
  bloqueia a **tarefa em curso**, e a correção pertence a ela. "Estava verde quando eu fechei"
  não transfere a dívida para frente.
- **Checagem de acessibilidade que falha por motivo legítimo** — a regra MUST NOT ser desativada
  em silêncio. Desativar exige registro em `DESIGN.md` com o motivo, o alcance exato e a
  demonstração de que não há alternativa acessível. Sem registro, a falha é falha.

### Regras de aplicação

- Os portões são verificados por **execução real** — não por inspeção visual do código nem por
  afirmação de quem implementou. O Portão 6 é o único manual, e por isso exige registro de
  evidência no corpo do commit (`GATES.md` §6).
- Portão cujo comando ainda não existe MUST ser executado pelo comando subjacente equivalente, e
  a tarefa que **cria** o script MUST anteceder qualquer tarefa que dependa daquele portão.
  Criado o script, o comando subjacente **deixa de ser aceito** como forma de fechar tarefa.
- Nenhum documento subordinado — spec, plano, lista de tarefas, guia de validação — pode
  redefinir o que um portão exige. Divergência entre um deles e esta seção é defeito do documento
  subordinado, e "a intenção é o que vale" não autoriza reinterpretar. O caminho para mudar um
  portão é a emenda.

## Development Workflow

Toda feature MUST passar pelo fluxo completo, nesta ordem:

```text
specify → clarify → plan → tasks → checklist → analyze → implement
```

- `clarify`, `checklist` e `analyze` são OBRIGATÓRIOS, não opcionais. Pular qualquer um
  deles é violação desta constituição, mesmo em features pequenas.
- `clarify` roda antes de `plan`: planejar sobre spec ambígua produz plano que precisa ser
  refeito.
- `checklist` e `analyze` rodam depois de `tasks` e antes de `implement`: os dois validam
  os artefatos contra esta constituição, e é esta constituição que lhes dá o que validar.
- `implement` MUST respeitar os Quality Gates tarefa a tarefa (Portão 8).

## Governance

- Esta constituição PREVALECE sobre preferência pessoal, hábito, pressa e sobre o que
  "sempre foi feito assim" neste repositório. Quando uma preferência conflita com um
  princípio aqui, o princípio vence.
- Complexidade MUST ser justificada POR ESCRITO em `plan.md`, na seção de justificativa de
  complexidade, com (a) o que a torna necessária e (b) qual alternativa mais simples foi
  descartada e por quê. Complexidade sem justificativa escrita é rejeitada em `analyze`.
- Emendas a esta constituição MUST ser feitas em commit próprio, que altera este arquivo,
  registra o Sync Impact Report no topo e incrementa a versão.
- Versionamento semântico deste documento:
  - **MAJOR** — remoção ou redefinição incompatível de princípio ou regra de governança.
  - **MINOR** — novo princípio ou seção, ou expansão material de orientação existente.
  - **PATCH** — esclarecimento, correção de texto, refinamento sem mudança semântica.
- Conformidade é verificada em `analyze` e no review de cada mudança. Violação encontrada
  MUST ser corrigida antes do merge, ou a constituição MUST ser emendada explicitamente
  para permitir o caso — nunca ignorada em silêncio.
- Orientação de desenvolvimento em tempo de execução vive em `.claude/CLAUDE.md`; decisões
  visuais em `DESIGN.md`; comando, escopo, linha de base e ruído tolerado dos portões em
  `GATES.md`. Os três são subordinados a esta constituição.

**Version**: 2.0.0 | **Ratified**: 2026-09-25 | **Last Amended**: 2026-09-26
