import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import EmptyState from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Components/EmptyState",
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

// Os dois estados da tarefa: com e sem dica. O texto vem do contexto de `MobileSerie.dc.html`,
// seção `PRÓXIMA SÉRIE` — "o card vazio é um convite".
// Sem elemento interativo, logo sem entrada de hover (FR-018a).

export const WithHint: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {
    title: "Espaço pra próxima série",
    hint: "o card vazio é um convite, não um bug",
  },
};

export const WithHintMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: WithHint.args,
};

export const WithoutHint: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { title: "Espaço pra próxima série" },
};

export const WithoutHintMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { title: "Espaço pra próxima série" },
};
