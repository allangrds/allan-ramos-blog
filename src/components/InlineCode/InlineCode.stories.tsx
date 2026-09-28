import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import InlineCode from "./InlineCode";

const meta: Meta<typeof InlineCode> = {
  title: "Components/InlineCode",
  component: InlineCode,
};

export default meta;
type Story = StoryObj<typeof InlineCode>;

// O card é `InlineCode / link` e mostra o código DENTRO de uma frase — é assim que ele precisa
// ser lido, porque o tamanho do texto é herdado do parágrafo em volta.
const InSentence = () => (
  <p className="text-body-lg text-ink">
    use <InlineCode>satisfies</InlineCode> e veja o post original
  </p>
);

export const InProse: Story = {
  globals: DESKTOP,
  play: atDesktop,
  render: () => <InSentence />,
};

export const InProseMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  render: () => <InSentence />,
};

export const Standalone: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { children: "satisfies" },
};

export const StandaloneMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { children: "satisfies" },
};
