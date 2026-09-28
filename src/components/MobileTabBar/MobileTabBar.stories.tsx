import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import MobileTabBar from "./MobileTabBar";

const meta: Meta<typeof MobileTabBar> = {
  title: "Components/MobileTabBar",
  component: MobileTabBar,
};

export default meta;
type Story = StoryObj<typeof MobileTabBar>;

// Os dois estados que FR-033/FR-034 exigem: com um destino ativo e sem nenhum.
export const WithActive: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { activeHref: "/" },
};

export const WithActiveMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { activeHref: "/" },
};

export const NoneActive: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {},
};

export const NoneActiveMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: {},
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { activeHref: "/" },
};
