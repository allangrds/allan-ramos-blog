import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Container from "./Container";

const meta: Meta<typeof Container> = {
  title: "Components/Container",
  component: Container,
};

export default meta;
type Story = StoryObj<typeof Container>;

// Primitivo de layout não tem card no artboard, mas TEM story: o Princípio II não abre exceção
// por tipo de componente. A story mostra o container com conteúdo de exemplo nas duas larguras.
const sample = (
  <p className="text-body-lg text-ink">
    A medida de leitura existe para que a linha não passe de 65 a 72 caracteres. Este parágrafo
    está aqui para que a largura da coluna seja visível, e não afirmada. Quando ele quebra no
    lugar certo, a medida está certa.
  </p>
);

export const DefaultWidth: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { children: sample },
};

export const DefaultWidthMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { children: sample },
};

export const ProseWidth: Story = {
  globals: DESKTOP,
  args: { prose: true, children: sample },
  // A largura de leitura sai do token `--measure-prose`. Medir aqui prova que o token CHEGA ao
  // componente: um `max-w-(--measure-prose)` com token inexistente não limitaria nada, e a
  // coluna encheria os 1280px sem que classe nenhuma faltasse no HTML.
  play: async ({ canvasElement }) => {
    await atDesktop();

    const container = canvasElement.querySelector("div");
    const width = container?.getBoundingClientRect().width ?? 0;

    expect(width).toBeGreaterThan(0);
    expect(width).toBeLessThan(1280);
  },
};

export const ProseWidthMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { prose: true, children: sample },
};
