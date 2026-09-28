import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import PostCard from "./PostCard";

const meta: Meta<typeof PostCard> = {
  title: "Components/PostCard",
  component: PostCard,
};

export default meta;
type Story = StoryObj<typeof PostCard>;

export const Default: Story = {
  args: {
    post: {
      title: "Expondo seu webserver local com Ngrok",
      date: "2018-05-06",
      slug: "expondo-web-server-com-ngrok",
      summary:
        "Como usar o Ngrok para expor um servidor local para a internet e facilitar testes e validações com clientes.",
      tags: [],
      body: "",
    },
  },
};
