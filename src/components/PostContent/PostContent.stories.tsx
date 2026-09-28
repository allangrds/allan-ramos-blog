import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostContent from "./PostContent";

const meta: Meta<typeof PostContent> = {
  title: "Components/PostContent",
  component: PostContent,
};

export default meta;
type Story = StoryObj<typeof PostContent>;

const sampleBody = `# Heading

A paragraph with a [link](/) and some \`inline code\`.

\`\`\`js
console.log("code block");
\`\`\`
`;

export const Default: Story = {
  args: {
    body: sampleBody,
  },
};
