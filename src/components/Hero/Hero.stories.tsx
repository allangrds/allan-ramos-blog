import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Hero from "./Hero";

const meta: Meta<typeof Hero> = {
  title: "Components/Hero",
  component: Hero,
};

export default meta;
type Story = StoryObj<typeof Hero>;

// Sem card no artboard: a apresentação vem do topo de `Main.dc.html` (desktop) e `Mobile.dc.html`
// (390px), e a re-estilização deriva dos tokens.
export const Default: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {},
};

export const DefaultMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: {},
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: {},
};
