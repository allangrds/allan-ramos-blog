import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import SeriesShelf from "./SeriesShelf";

const meta: Meta<typeof SeriesShelf> = {
  title: "Components/SeriesShelf",
  component: SeriesShelf,
};

export default meta;
type Story = StoryObj<typeof SeriesShelf>;

const items = [
  { title: "Diário Fullstack 1", href: "/posts/diario-full-stack-1", read: true },
  { title: "Diário Fullstack 2", href: "/posts/diario-full-stack-2", read: true },
  { title: "Diário Fullstack 3", href: "/posts/diario-full-stack-3" },
];

export const WithReadItems: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { series: "Virando fullstack", items },
};

export const WithReadItemsMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { series: "Virando fullstack", items },
};

export const NoneRead: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { series: "Virando fullstack", items: items.map(({ title, href }) => ({ title, href })) },
};

export const NoneReadMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { series: "Virando fullstack", items: items.map(({ title, href }) => ({ title, href })) },
};

// EC-10: trilha com um ÚNICO item aparece e não quebra — não existe "trilha mínima de dois".
export const SingleItem: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { series: "Virando fullstack", items: [items[0]] },
};

export const SingleItemMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { series: "Virando fullstack", items: [items[0]] },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { series: "Virando fullstack", items },
};
