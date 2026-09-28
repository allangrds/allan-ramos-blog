import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SearchBox from "./SearchBox";

const meta: Meta<typeof SearchBox> = {
  title: "Components/SearchBox",
  component: SearchBox,
};

export default meta;
type Story = StoryObj<typeof SearchBox>;

export const Default: Story = {
  args: {
    index: [
      {
        slug: "expondo-web-server-com-ngrok",
        title: "Expondo seu webserver local com Ngrok",
        summary: "Como usar o Ngrok para expor um servidor local.",
        tags: [],
        bodyText: "ngrok expõe servidores locais",
      },
    ],
  },
};
