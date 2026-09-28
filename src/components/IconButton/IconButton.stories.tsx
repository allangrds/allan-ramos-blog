import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Link2, Search, Sun } from "lucide-react";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import IconButton from "./IconButton";

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// As três variantes juntas, como o grupo `NEUTRO · ACENTO · MARCA` do card as apresenta.
const VariantRow = () => (
  <div className="flex items-center gap-2">
    <IconButton variant="neutral" label="Buscar" icon={<Search size={20} />} onClick={() => {}} />
    <IconButton variant="accent" label="Tema claro" icon={<Sun size={20} />} onClick={() => {}} />
    <IconButton variant="brand" label="Copiar link" icon={<Link2 size={20} />} onClick={() => {}} />
  </div>
);

export const Variants: Story = {
  globals: DESKTOP,
  play: atDesktop,
  render: () => <VariantRow />,
};

export const VariantsMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  render: () => <VariantRow />,
};

export const AsLink: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {
    variant: "neutral",
    label: "Ir para a busca",
    icon: <Search size={20} />,
    href: "/search",
  },
};

export const AsLinkMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: {
    variant: "neutral",
    label: "Ir para a busca",
    icon: <Search size={20} />,
    href: "/search",
  },
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  render: () => <VariantRow />,
};
