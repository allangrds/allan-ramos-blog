import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Callout from "./Callout";

const meta: Meta<typeof Callout> = {
  title: "Components/Callout",
  component: Callout,
};

export default meta;
type Story = StoryObj<typeof Callout>;

// Os três tipos de FR-029, cada um nas duas larguras. O `Callout` não tem card no
// `ComponentesMobile`: a apresentação de 390px sai de `MobilePost.dc.html`, onde ele é um bloco
// de largura cheia dentro da coluna de texto — que é o que estas entradas mostram.

export const Note: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {
    kind: "note",
    title: "Nota do tradutor",
    children: "O compilador chega na versão seguinte à 19.",
  },
};

export const NoteMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: Note.args,
};

export const Quote: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {
    kind: "quote",
    children: "“A melhor API é a que deixou de existir.”",
  },
};

export const QuoteMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: Quote.args,
};

export const Checklist: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {
    kind: "checklist",
    children: "Componentes puros durante o render.",
  },
};

export const ChecklistMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: Checklist.args,
};

// O `Callout` não tem elemento interativo, então não há entrada de hover (FR-018a só a exige de
// quem tem): nada aqui muda de estado sob o cursor.
