import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Kbd from "./Kbd";

const meta: Meta<typeof Kbd> = {
  title: "Components/Kbd",
  component: Kbd,
};

export default meta;
type Story = StoryObj<typeof Kbd>;

// As três teclas que o sistema usa, medidas nos cards `TopBar` e `CommandPalette`.
const KeyRow = () => (
  <div className="flex items-center gap-2">
    <Kbd>⌘K</Kbd>
    <Kbd>esc</Kbd>
    <Kbd>↵</Kbd>
  </div>
);

export const Keys: Story = {
  globals: DESKTOP,
  play: atDesktop,
  render: () => <KeyRow />,
};

// Sem card de celular: vale o ponto de corte único de 1024px, e a entrada existe mesmo sem
// mudança visual porque FR-038b exige as duas.
export const KeysMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  render: () => <KeyRow />,
};

export const Single: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { children: "⌘K" },
};

export const SingleMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { children: "⌘K" },
};
