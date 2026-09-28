import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Breadcrumb from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const TWO = [{ label: "Início", href: "/" }, { label: "Tags" }];
const THREE = [
  { label: "Início", href: "/" },
  { label: "Tags", href: "/tags" },
  { label: "react" },
];
const FOUR = [
  { label: "Início", href: "/" },
  { label: "Categorias", href: "/categorias" },
  { label: "Front-end", href: "/categories/Front-end" },
  { label: "React compilado" },
];

export const TwoLevels: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { items: TWO },
};

export const TwoLevelsMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { items: TWO },
};

export const ThreeLevels: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { items: THREE },
};

export const ThreeLevelsMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { items: THREE },
};

export const FourLevels: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { items: FOUR },
};

export const FourLevelsMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { items: FOUR },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { items: THREE },
};
