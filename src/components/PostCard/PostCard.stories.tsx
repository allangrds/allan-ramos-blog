import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import type { Post } from "@/lib/types";
import PostCard from "./PostCard";

const meta: Meta<typeof PostCard> = {
  title: "Components/PostCard",
  component: PostCard,
};

export default meta;
type Story = StoryObj<typeof PostCard>;

// Dado de exemplo vive NA STORY: nenhum componente desta camada busca dado (SC-015).
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

export const Light: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: base, surface: "light" },
};

export const LightMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: base, surface: "light" },
};

// Variante de DESENHO, não tema (FR-023): as duas coexistem na mesma página.
export const Dark: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: { ...base, series: undefined, tags: [] }, surface: "dark" },
};

export const DarkMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: { ...base, series: undefined, tags: [] }, surface: "dark" },
};

// EC-02: título longo é truncado no limite de linhas, sem empurrar o layout nem criar rolagem
// horizontal — a entrada Mobile assere `scrollWidth <= 390`.
const longTitle: Post = {
  ...base,
  title:
    "Um título deliberadamente longo para provar que o limite de linhas corta o texto em vez de empurrar o card e criar rolagem horizontal em 390px",
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

// EC-03: resumo ausente — o bloco sai do DOM e o espaço colapsa, sem texto de substituição.
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

// EC-04: sem categoria, série nem tag — a faixa cai para `hairline` em vez de desaparecer.
export const WithoutTaxonomy: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {
    post: { ...base, category: undefined, series: undefined, seriesOrder: undefined, tags: [] },
  },
};

export const WithoutTaxonomyMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: {
    post: { ...base, category: undefined, series: undefined, seriesOrder: undefined, tags: [] },
  },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { post: base },
};
