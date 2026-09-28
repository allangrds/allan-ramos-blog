import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import TagPill from "./TagPill";

const meta: Meta<typeof TagPill> = {
  title: "Components/TagPill",
  component: TagPill,
};

export default meta;
type Story = StoryObj<typeof TagPill>;

export const Default: Story = {
  args: {
    tag: "react",
    href: "/tags/react",
  },
};
