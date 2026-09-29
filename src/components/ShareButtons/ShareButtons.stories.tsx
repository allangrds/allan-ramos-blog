import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import ShareButtons from "./ShareButtons";

const meta: Meta<typeof ShareButtons> = {
  title: "Components/ShareButtons",
  component: ShareButtons,
};

export default meta;
type Story = StoryObj<typeof ShareButtons>;

const args = {
  url: "https://allanramos.dev/posts/react-compilado",
  title: "React compilado: o que muda no seu código",
};

// O estado "copiado" da terceira ação NÃO ganha entrada aqui: ele é do `CopyLinkButton`, e é lá
// que está apresentado (T035). Repetir a apresentação faria o mesmo estado ter dois donos.
const assertThreeActions = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByRole("link", { name: "GitHub" })).toBeVisible();
  await expect(canvas.getByRole("link", { name: "LinkedIn" })).toBeVisible();
  await expect(canvas.getByRole("button", { name: "Compartilhar o link" })).toBeVisible();
};

export const ThreeActions: Story = {
  globals: DESKTOP,
  args,
  play: async (context) => {
    await atDesktop();
    await assertThreeActions(context);
  },
};

// Em 390px as três ações quebram em linhas; a asserção de `atMobile` é o que prova que nenhuma
// delas cria rolagem horizontal na página (SC-009).
export const ThreeActionsMobile: Story = {
  globals: MOBILE,
  args,
  play: async (context) => {
    await atMobile();
    await assertThreeActions(context);
  },
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args,
};
