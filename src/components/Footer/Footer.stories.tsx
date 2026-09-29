import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Footer from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
};

export default meta;
type Story = StoryObj<typeof Footer>;

// Contrato congelado: `Footer()` sem props, então o único eixo de estado é a largura — três
// colunas no desktop, coluna única em 390px.

export const ThreeColumns: Story = {
  globals: DESKTOP,
  play: async ({ canvasElement }) => {
    await atDesktop();

    await expect(within(canvasElement).getByRole("link", { name: "Design system" })).toBeVisible();
  },
};

export const SingleColumnMobile: Story = {
  globals: MOBILE,
  play: async ({ canvasElement }) => {
    await atMobile();

    await expect(within(canvasElement).getByRole("link", { name: "Design system" })).toBeVisible();
  },
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
};
