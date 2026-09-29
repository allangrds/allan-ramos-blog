import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Toc from "./Toc";

const meta: Meta<typeof Toc> = {
  title: "Components/Toc",
  component: Toc,
};

export default meta;
type Story = StoryObj<typeof Toc>;

const items = [
  { id: "o-que-significa-compilado", text: 'O que significa "compilado"', level: 1 },
  { id: "adeus-memoizacao-manual", text: "Adeus, memoização manual", level: 2 },
  { id: "o-que-muda-no-seu-codigo", text: "O que muda no seu código", level: 1 },
];

// As duas apresentações de FR-027 dividem o mesmo componente e trocam no corte de 1024px: em
// 1280px o que se vê é o painel fixo, em 390px a barra recolhível. Por isso a entrada de desktop
// de cada par mostra o painel, e a de celular mostra a barra — é a MESMA story em duas larguras,
// que é exatamente o que FR-038b pede.

/** Estado de repouso: painel fixo em 1280px. */
export const Collapsed: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { items },
};

/** Estado de repouso em 390px: a barra recolhida, anunciando o título ativo. */
export const CollapsedMobile: Story = {
  globals: MOBILE,
  args: { items },
  play: async ({ canvasElement }) => {
    await atMobile();

    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.getByText(/Sumário · 01 de 03/)).toBeVisible();
  },
};

/** Lista aberta em 1280px: no desktop o painel já nasce aberto, porque é fixo. */
export const Open: Story = {
  globals: DESKTOP,
  args: { items },
  play: async ({ canvasElement }) => {
    await atDesktop();

    await expect(within(canvasElement).getByRole("list")).toBeVisible();
  },
};

/** Lista aberta em 390px: o gatilho leva a barra de recolhida a aberta (US6/AS-4). */
export const OpenMobile: Story = {
  globals: MOBILE,
  args: { items },
  play: async ({ canvasElement }) => {
    await atMobile();

    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");

    await expect(canvas.getByRole("list", { hidden: true })).not.toBeVisible();

    await userEvent.click(trigger);

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("list")).toBeVisible();
  },
};

// EC-09, primeira metade: um único título renderiza normalmente. A segunda metade — sem nenhum
// título nada é renderizado — não tem entrada no catálogo porque não há o que apresentar; é o
// teste de comportamento que a prova.
export const SingleHeading: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { items: [items[0]] },
};

export const SingleHeadingMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { items: [items[0]] },
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { items },
};
