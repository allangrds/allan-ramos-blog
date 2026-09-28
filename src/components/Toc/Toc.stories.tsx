import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Toc from "./Toc";

const meta: Meta<typeof Toc> = {
  title: "Components/Toc",
  component: Toc,
};

export default meta;
type Story = StoryObj<typeof Toc>;

export const Default: Story = {
  args: {
    items: [
      { id: "introducao", text: "Introdução", level: 1 },
      { id: "detalhes", text: "Detalhes", level: 2 },
      { id: "conclusao", text: "Conclusão", level: 1 },
    ],
  },
};
