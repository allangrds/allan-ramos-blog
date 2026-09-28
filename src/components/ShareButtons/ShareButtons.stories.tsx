import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ShareButtons from "./ShareButtons";

const meta: Meta<typeof ShareButtons> = {
  title: "Components/ShareButtons",
  component: ShareButtons,
};

export default meta;
type Story = StoryObj<typeof ShareButtons>;

export const Default: Story = {
  args: {
    url: "https://allanramos.dev/posts/example",
    title: "Example post",
  },
};
