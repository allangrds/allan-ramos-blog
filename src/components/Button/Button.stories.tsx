import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { expect } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Button from "./Button";

// Ícone do artboard: seta para a direita, traço em `currentColor`. Sem cor própria, então a
// régua 1 de SC-004 segue vazia.
const ArrowIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="4" y1="12" x2="19" y2="12" />
    <polyline points="13 6 19 12 13 18" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

// As variantes vêm agrupadas por tamanho porque é assim que o artboard as apresenta — os grupos
// `VARIANTES · LG` e `COM ÍCONE / MD / DESABILITADO` do card `Button`. A entrada mostra as três
// variantes juntas, então todos os estados continuam visíveis no catálogo.
const VariantRow = ({ size }: { size: "lg" | "md" }) => (
  <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center">
    <Button variant="primary" size={size}>
      primary
    </Button>
    <Button variant="secondary" size={size}>
      secondary
    </Button>
    <Button variant="accent" size={size}>
      accent
    </Button>
  </div>
);

export const VariantsLg: Story = {
  globals: DESKTOP,
  render: () => <VariantRow size="lg" />,
  // Guarda de FR-041a em navegador real. O anel de foco resolve a cor POR SUPERFÍCIE, e a regra
  // de `globals.css` precisa acertar o elemento que É a superfície, não só o que está dentro
  // dela. `color-contrast` do addon não avalia cor de contorno, então sem esta asserção o
  // Portão 4 fica verde com o anel em `ink-blue` sobre `ink` (2,86:1) e sobre `sun` (2,84:1).
  play: async (context) => {
    await atDesktop();

    const { canvasElement } = context;
    const [primary, secondary, accent] = Array.from(
      canvasElement.querySelectorAll("button"),
    );

    const outlineOf = (element: Element) => {
      (element as HTMLElement).focus();
      return getComputedStyle(element).outlineColor;
    };

    // Superfície escura → anel branco. Superfície clara → anel `ink-blue`. Superfície `sun` → ink.
    expect(outlineOf(primary)).toBe("rgb(255, 255, 255)");
    expect(outlineOf(secondary)).toBe("rgb(31, 79, 216)");
    expect(outlineOf(accent)).toBe("rgb(20, 18, 16)");
  },
};

export const VariantsLgMobile: Story = {
  globals: MOBILE,
  render: () => <VariantRow size="lg" />,
  play: atMobile,
};

export const VariantsMd: Story = {
  globals: DESKTOP,
  play: atDesktop,
  render: () => <VariantRow size="md" />,
};

export const VariantsMdMobile: Story = {
  globals: MOBILE,
  render: () => <VariantRow size="md" />,
  play: atMobile,
};

export const WithIcon: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {
    variant: "primary",
    size: "md",
    icon: <ArrowIcon />,
    children: "Ler agora",
  },
};

export const WithIconMobile: Story = {
  globals: MOBILE,
  args: {
    variant: "primary",
    size: "lg",
    icon: <ArrowIcon />,
    children: "Explorar o acervo",
  },
  play: atMobile,
};

export const Disabled: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { size: "md", disabled: true, children: "disabled" },
};

export const DisabledMobile: Story = {
  globals: MOBILE,
  args: { size: "md", disabled: true, children: "disabled" },
  play: atMobile,
};

// Par de ações irmãs: divide a linha em 390px em vez de empilhar (US3/AS-5, FR-039). O `flex-1`
// vem do pai pelo `className` — o Button não sabe se está sozinho.
const Pair = () => (
  <div className="flex gap-2">
    <Button variant="secondary" size="lg" className="flex-1">
      Anterior
    </Button>
    <Button variant="accent" size="lg" className="flex-1">
      Próximo
    </Button>
  </div>
);

export const PairOfActions: Story = {
  globals: DESKTOP,
  play: atDesktop,
  render: () => <Pair />,
};

export const PairOfActionsMobile: Story = {
  globals: MOBILE,
  render: () => <Pair />,
  play: atMobile,
};

// Hover tem UMA entrada, só em 1280px (FR-018a, regra global 7): 390px é contexto de toque,
// onde hover não ocorre. A cor sai da regra de sistema de `globals.css`, não do componente.
export const Hover: Story = {
  globals: DESKTOP,
  play: atDesktop,
  parameters: { pseudo: { hover: true } },
  render: () => <VariantRow size="lg" />,
};
