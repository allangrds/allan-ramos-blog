import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import AuthorCard from "./AuthorCard";

const meta: Meta<typeof AuthorCard> = {
  title: "Components/AuthorCard",
  component: AuthorCard,
};

export default meta;
type Story = StoryObj<typeof AuthorCard>;

// Os dois estados da tarefa: com e sem contagem de palavras. Sem card no `ComponentesMobile`,
// a apresentação de 390px sai de `MobilePost.dc.html`.
const base = {
  name: "Allan Ramos",
  date: "22 fev 2024",
  readingTime: "9 min",
};

export const WithWordCount: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { ...base, wordCount: "1.740 palavras" },
};

export const WithWordCountMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { ...base, wordCount: "1.740 palavras" },
};

export const WithoutWordCount: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: base,
};

export const WithoutWordCountMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: base,
};

// Sem elemento interativo, logo sem entrada de hover (FR-018a).
