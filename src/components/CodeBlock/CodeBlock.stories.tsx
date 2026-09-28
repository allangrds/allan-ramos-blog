import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import CodeBlockView from "./CodeBlockView";

/**
 * A story renderiza `CodeBlockView`, não `CodeBlock`: a casca é Server Component `async` (destaca
 * com `shiki`) e o React recusa componente async no cliente, onde a story roda. O `html` abaixo é
 * um exemplo já destacado, recebido como dado.
 */
const meta: Meta<typeof CodeBlockView> = {
  title: "Components/CodeBlock",
  component: CodeBlockView,
};

export default meta;
type Story = StoryObj<typeof CodeBlockView>;

const code = 'const greeting = "olá";\nconsole.log(greeting);';
const html = `<pre class="shiki"><code><span class="line"><span>const greeting = "olá";</span></span>
<span class="line"><span>console.log(greeting);</span></span></code></pre>`;

// Linha longa de propósito: é o que exercita a rolagem do CORPO sem rolagem da PÁGINA em 390px.
const longLine =
  "const umaLinhaBemLongaParaForcarRolagemHorizontalDentroDoBlocoDeCodigo = { chave: 'valor', outra: 'coisa', terceira: 'mais' };";
const longHtml = `<pre class="shiki"><code><span class="line"><span>${longLine}</span></span></code></pre>`;

export const WithFilenameAndLanguage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { html, code, language: "ts", filename: "exemplo.ts" },
};

export const WithFilenameAndLanguageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { html, code, language: "ts", filename: "exemplo.ts" },
};

// EC-07: sem nome de arquivo, o cabeçalho omite o campo e MANTÉM a ação de copiar.
export const WithoutFilename: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { html, code, language: "ts" },
};

export const WithoutFilenameMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { html, code, language: "ts" },
};

// EC-07: sem linguagem também. O campo sai; nenhum rótulo de substituição é inventado.
export const WithoutLanguage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { html, code, filename: "exemplo.txt" },
};

export const WithoutLanguageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { html, code, filename: "exemplo.txt" },
};

// EC-07 no extremo: sem nome E sem linguagem. Só a ação de copiar sobrevive no cabeçalho.
export const WithoutHeaderText: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { html, code },
};

export const WithoutHeaderTextMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { html, code },
};

// US6/AS-3 e SC-009: a linha longa rola dentro do bloco, e a entrada Mobile assere que a PÁGINA
// não passa de 390px.
export const LongLine: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { html: longHtml, code: longLine, language: "ts", filename: "longa.ts" },
};

export const LongLineMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { html: longHtml, code: longLine, language: "ts", filename: "longa.ts" },
};
