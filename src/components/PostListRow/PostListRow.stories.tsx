import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import type { Post } from "@/lib/types";
import PostListRow from "./PostListRow";

const meta: Meta<typeof PostListRow> = {
  title: "Components/PostListRow",
  component: PostListRow,
};

export default meta;
type Story = StoryObj<typeof PostListRow>;

const base: Post = {
  title: "Diário Fullstack 3",
  date: "2022-09-06",
  slug: "diario-full-stack-3",
  summary: "Iniciando meus estudos em banco de dados e entendendo ACID.",
  tags: ["banco-de-dados"],
  category: "Back-end",
  series: "Virando fullstack",
  seriesOrder: 3,
  body: "",
};

// FR-024/US5/AS-1: com e sem numeração de série.
export const WithSeries: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: base },
};

export const WithSeriesMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: base },
};

export const WithoutSeries: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: { ...base, series: undefined, seriesOrder: undefined } },
};

export const WithoutSeriesMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: { ...base, series: undefined, seriesOrder: undefined } },
};

// EC-02: título longo em três linhas.
const longTitle: Post = {
  ...base,
  title:
    "Um título deliberadamente longo para provar que a linha da home corta em três linhas em vez de empurrar o layout e criar rolagem horizontal em 390px",
};

export const LongTitle: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: longTitle },
};

export const LongTitleMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: longTitle },
};

// EC-03: resumo ausente.
export const WithoutSummary: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: { ...base, summary: "" } },
};

export const WithoutSummaryMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: { ...base, summary: "" } },
};

// EC-04: sem categoria, a faixa cai para hairline.
export const WithoutCategory: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: { ...base, category: undefined } },
};

export const WithoutCategoryMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: { ...base, category: undefined } },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { post: base },
};
