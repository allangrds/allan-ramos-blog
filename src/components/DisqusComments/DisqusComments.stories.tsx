import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DisqusComments from "./DisqusComments";

const meta: Meta<typeof DisqusComments> = {
  title: "Components/DisqusComments",
  component: DisqusComments,
};

export default meta;
type Story = StoryObj<typeof DisqusComments>;

export const Default: Story = {
  args: {
    shortname: "allan-ramos-blog",
    slug: "example-post",
    title: "Example post",
  },
};
