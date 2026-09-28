import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Header from "./Header";

const meta: Meta<typeof Header> = {
  title: "Components/Header",
  component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

// A altura da faixa é o estado responsivo do componente: 68px a partir de 1024px e 64px abaixo
// dele. Medida RENDERIZADA, porque `h-16`/`lg:h-17` com escala errada não falharia em lugar nenhum.
// `header > div` é o `Container`, que também embrulha a segunda linha de destinos; a FAIXA é o
// filho dele. Medir o Container daria 168px em 390px — a faixa mais a linha de navegação.
const measureBand = (canvasElement: HTMLElement) =>
  Math.round(
    (canvasElement.querySelector("header > div > div") as HTMLElement).getBoundingClientRect()
      .height,
  );

export const Default: Story = {
  globals: DESKTOP,
  args: {},
  play: async ({ canvasElement }) => {
    await atDesktop();
    expect(measureBand(canvasElement)).toBe(68);
  },
};

export const DefaultMobile: Story = {
  globals: MOBILE,
  args: {},
  play: async ({ canvasElement }) => {
    await atMobile();
    expect(measureBand(canvasElement)).toBe(64);
  },
};

export const ActiveDestination: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { activeHref: "/tags" },
};

export const ActiveDestinationMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { activeHref: "/tags" },
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: {},
};
