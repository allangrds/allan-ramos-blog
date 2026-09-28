import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";

import InlineCode from "@/components/InlineCode/InlineCode";
import { DESKTOP, MOBILE, MOBILE_WIDTH, atDesktop, atMobile } from "@/story-viewport";
import PostContentView from "./PostContentView";

/**
 * A story renderiza `PostContentView`, não `PostContent`: a casca é Server Component `async`
 * (compila o MDX com `evaluate()`) e o React recusa componente async no cliente, onde a story
 * roda. O conteúdo abaixo é JSX que reproduz a forma do MDX já compilado.
 */
const meta: Meta<typeof PostContentView> = {
  title: "Components/PostContent",
  component: PostContentView,
};

export default meta;
type Story = StoryObj<typeof PostContentView>;

const shortBody = (
  <>
    <p>
      Um corpo curto, com um termo em <InlineCode>satisfies</InlineCode> no meio da frase.
    </p>
  </>
);

// Corpo longo com todos os blocos do pipeline MDX, que é o que prova a medida de leitura: a linha
// precisa quebrar entre 65 e 72 caracteres em texto de verdade, não em uma frase curta.
const longBody = (
  <>
    <h2>Um título de segundo nível</h2>
    <p>
      A medida de leitura existe para que a linha não passe de 65 a 72 caracteres. Este parágrafo é
      longo de propósito, porque uma frase curta não revela onde a linha quebra e portanto não prova
      nada sobre a medida. Quando ele quebra no lugar certo, a medida está certa.
    </p>
    <h3>Um título de terceiro nível</h3>
    <ul>
      <li>Primeiro item da lista</li>
      <li>Segundo item, com <InlineCode>color-mix()</InlineCode> no meio</li>
    </ul>
    <ol>
      <li>Item numerado</li>
      <li>Outro item numerado</li>
    </ol>
    <blockquote>
      Uma citação, que recebe barra à esquerda e cor secundária em vez de itálico.
    </blockquote>
    <hr />
    <p>
      Um parágrafo final, depois da régua, com um <a href="/sobre">link inline</a>.
    </p>
  </>
);

export const ShortBody: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { children: shortBody },
};

export const ShortBodyMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { children: shortBody },
};

export const LongBody: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { children: longBody },
};

export const LongBodyMobile: Story = {
  globals: MOBILE,
  args: { children: longBody },
  // EC-13 é condição de AMBIENTE, então não ganha entrada própria no catálogo (FR-036b): a
  // verificação acontece aqui dentro, sobre uma entrada que já existe. O texto é ampliado a 200%,
  // a rolagem horizontal é medida, e o tamanho é devolvido — a entrada segue apresentando o estado
  // normal. `--measure-prose` está em `ch`, então a caixa cresce com a fonte em vez de cortar.
  play: async (context) => {
    await atMobile();

    const root = document.documentElement;
    const original = root.style.fontSize;
    root.style.fontSize = "200%";

    try {
      await waitFor(() => {
        expect(root.scrollWidth).toBeLessThanOrEqual(MOBILE_WIDTH);
      });
    } finally {
      root.style.fontSize = original;
    }

    await context.step?.("texto devolvido a 100%", async () => {
      await waitFor(() => {
        expect(root.scrollWidth).toBeLessThanOrEqual(MOBILE_WIDTH);
      });
    });
  },
};
