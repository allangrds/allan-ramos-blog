import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import TilList from "./TilList";

const meta: Meta<typeof TilList> = {
  title: "Components/TilList",
  component: TilList,
};

export default meta;
type Story = StoryObj<typeof TilList>;

// Dado por propriedade, sem origem real (FR-031b): o exemplo vive na story.
const items = [
  { lang: "TypeScript", term: "satisfies", note: "Valida sem alargar o tipo inferido." },
  { lang: "CSS", term: "color-mix()", note: "Mistura duas cores em espaço declarado." },
  { lang: "Git", term: "git restore", note: "Desfaz no diretório sem mexer no histórico." },
];

export const Several: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { items },
};

export const SeveralMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { items },
};

export const SingleItem: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { items: [items[0]] },
};

export const SingleItemMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { items: [items[0]] },
};

// Lista vazia: nenhum item e nenhum texto inventado no lugar. Quem decide o que dizer numa lista
// vazia é o `EmptyState`, que é outro componente.
export const Empty: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { items: [] },
};

export const EmptyMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { items: [] },
};
