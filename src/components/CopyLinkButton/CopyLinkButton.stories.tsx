import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import CopyLinkButton from "./CopyLinkButton";

const meta: Meta<typeof CopyLinkButton> = {
  title: "Components/CopyLinkButton",
  component: CopyLinkButton,
};


// O Chromium do Portão 4 roda sem permissão de área de transferência, então a escrita é NEGADA —
// e o componente, corretamente, se recusa a dizer "Copiado!" sem ter copiado. Esse caminho (EC-08)
// é coberto pelo teste de comportamento; o que estas entradas precisam APRESENTAR é o estado de
// sucesso, e para isso a escrita é substituída por um dublê que resolve.
const withWritableClipboard = async (run: () => Promise<void>) => {
  const original = navigator.clipboard;
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: () => Promise.resolve() },
    configurable: true,
  });

  try {
    await run();
  } finally {
    Object.defineProperty(navigator, "clipboard", {
      value: original,
      configurable: true,
    });
  }
};

export default meta;
type Story = StoryObj<typeof CopyLinkButton>;

const url = "https://allanramos.dev/posts/react-compilado";

export const Resting: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { url },
};

export const RestingMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { url },
};

export const Copied: Story = {
  globals: DESKTOP,
  args: { url },
  play: async ({ canvasElement }) => {
    await atDesktop();

    const button = within(canvasElement).getByRole("button");

    await withWritableClipboard(async () => {
      await userEvent.click(button);
      await expect(button).toHaveTextContent("Copiado!");
    });
  },
};

export const CopiedMobile: Story = {
  globals: MOBILE,
  args: { url },
  play: async ({ canvasElement }) => {
    await atMobile();

    const button = within(canvasElement).getByRole("button");

    await withWritableClipboard(async () => {
      await userEvent.click(button);
      await expect(button).toHaveTextContent("Copiado!");
    });
  },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { url },
};
