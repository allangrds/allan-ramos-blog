import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import TagPill from "./TagPill";

const meta: Meta<typeof TagPill> = {
  title: "Components/TagPill",
  component: TagPill,
};

export default meta;
type Story = StoryObj<typeof TagPill>;

// Os três estados juntos, como o grupo `PADRÃO · ATIVA · DESTAQUE` do card os apresenta.
const StateRow = () => (
  <div className="flex flex-wrap items-center gap-2">
    <TagPill tag="react" href="/tags/react" />
    <TagPill tag="node" href="/tags/node" active />
    <TagPill tag="typescript" href="/tags/typescript" count={12} />
  </div>
);

export const States: Story = {
  globals: DESKTOP,
  play: atDesktop,
  render: () => <StateRow />,
};

export const StatesMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  render: () => <StateRow />,
};

export const Default: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { tag: "react", href: "/tags/react" },
};

export const DefaultMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { tag: "react", href: "/tags/react" },
};

export const Active: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { tag: "react", href: "/tags/react", active: true },
};

export const ActiveMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { tag: "react", href: "/tags/react", active: true },
};

export const WithCount: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { tag: "react", href: "/tags/react", count: 12 },
};

export const WithCountMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { tag: "react", href: "/tags/react", count: 12 },
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  render: () => <StateRow />,
};
