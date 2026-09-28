import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import PostContentView from "./PostContentView";

/**
 * A story renderiza `PostContentView`, não `PostContent`: a casca é Server Component `async`
 * (compila o MDX com `evaluate()`) e o React recusa componente async no cliente, onde a story
 * roda. O conteúdo abaixo é JSX que reproduz a forma do MDX já compilado.
 */
const meta: Meta<typeof PostContentView> = {
  title: "Components/PostContent",
  component: PostContentView,
};

export default meta;
type Story = StoryObj<typeof PostContentView>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h1>Heading</h1>
        <p>
          A paragraph with a <a href="https://example.com">link</a> and some{" "}
          <code>inline code</code>.
        </p>
      </>
    ),
  },
};
