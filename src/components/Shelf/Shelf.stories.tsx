import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Shelf from "./Shelf";

const meta: Meta<typeof Shelf> = {
  title: "Components/Shelf",
  component: Shelf,
};

export default meta;
type Story = StoryObj<typeof Shelf>;

const full = [
  { title: "Refactoring", author: "Fowler" },
  { title: "Domain-Driven Design", author: "Evans" },
  { title: "A Philosophy of Software Design", author: "Ousterhout" },
];

// FR-035/US5/AS-3: slot sem livro recebe MARCADOR DE VAZIO, nunca um livro inventado.
const withEmptySlot = [...full.slice(0, 2), { title: null }];

export const Full: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { books: full },
};

export const FullMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { books: full },
};

export const WithEmptySlot: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { books: withEmptySlot },
};

export const WithEmptySlotMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { books: withEmptySlot },
};
