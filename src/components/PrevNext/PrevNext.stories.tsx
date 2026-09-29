import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import PrevNext from "./PrevNext";

const meta: Meta<typeof PrevNext> = {
  title: "Components/PrevNext",
  component: PrevNext,
};

export default meta;
type Story = StoryObj<typeof PrevNext>;

// Os três estados da tarefa: os dois vizinhos, só anterior (último post da lista) e só próximo
// (primeiro). Sem card no `ComponentesMobile`; a apresentação de 390px sai de `MobilePost`.
const prev = {
  href: "/posts/diario-full-stack-2",
  title: "Diário Fullstack 2: modelando o schema",
  meta: "Back-end · 22 ago 2022",
};

const next = {
  href: "/posts/diario-full-stack-3",
  title: "Diário Fullstack 3: ACID na prática",
  meta: "Back-end · 06 set 2022",
};

export const BothNeighbours: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { prev, next },
};

export const BothNeighboursMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { prev, next },
};

export const OnlyPrev: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { prev },
};

export const OnlyPrevMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { prev },
};

export const OnlyNext: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { next },
};

export const OnlyNextMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { next },
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { prev, next },
};
