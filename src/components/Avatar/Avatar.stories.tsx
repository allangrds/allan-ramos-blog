import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Avatar from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "Components/Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Os três tamanhos juntos, como o grupo `LG 108 · MD 44 · SM 32` do card os apresenta. Em 390px
// o `lg` mede 78px pelo MESMO componente — a troca é a classe responsiva, não outra prop.
const SizeRow = () => (
  <div className="flex items-center gap-2">
    <Avatar name="Allan Ramos" size="lg" />
    <Avatar name="Allan Ramos" size="md" />
    <Avatar name="Allan Ramos" size="sm" />
  </div>
);

// As duas entradas medem a dimensão RENDERIZADA, não a classe: `size-19.5` e `size-27` só valem
// se o Tailwind de fato as gerar a partir de `--spacing`. Utilitário inexistente seria silencioso
// — a classe estaria no HTML e o círculo sairia do tamanho do conteúdo.
const measureLarge = (canvasElement: HTMLElement) =>
  Math.round(canvasElement.querySelectorAll("span")[0].getBoundingClientRect().width);

export const Sizes: Story = {
  globals: DESKTOP,
  render: () => <SizeRow />,
  play: async ({ canvasElement }) => {
    await atDesktop();
    expect(measureLarge(canvasElement)).toBe(108);
  },
};

export const SizesMobile: Story = {
  globals: MOBILE,
  render: () => <SizeRow />,
  play: async ({ canvasElement }) => {
    await atMobile();
    expect(measureLarge(canvasElement)).toBe(78);
  },
};

export const WithInitials: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { name: "Allan Ramos", size: "md" },
};

export const WithInitialsMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { name: "Allan Ramos", size: "md" },
};

// EC-01 entra no catálogo, não só no teste: sem foto e sem nome aproveitável o círculo mostra um
// MARCADOR NEUTRO — nunca um círculo vazio nem string vazia dentro dele.
export const NeutralMarker: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { size: "md" },
};

export const NeutralMarkerMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { size: "md" },
};
