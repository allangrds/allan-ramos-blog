import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "md",
    href: "/sobre",
    children: "Sobre mim",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    size: "md",
    href: "/sobre",
    children: "Anterior",
  },
};

export const LargePrimary: Story = {
  args: {
    variant: "primary",
    size: "lg",
    href: "/sobre",
    children: "Sobre mim",
  },
};
