import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import type { Post } from "@/lib/types";
import FeaturedPostCard from "./FeaturedPostCard";

const meta: Meta<typeof FeaturedPostCard> = {
  title: "Components/FeaturedPostCard",
  component: FeaturedPostCard,
};

export default meta;
type Story = StoryObj<typeof FeaturedPostCard>;

const base: Post = {
  title: "React será compilado",
  date: "2024-02-22",
  slug: "react-compilado",
  summary: "Você pode esquecer a memoização.",
  tags: ["react"],
  category: "Front-end",
  body: "",
};

// As TRÊS cores de acento entram no catálogo porque cada uma é uma superfície entregue, e FR-041
// exige contraste verificado em toda superfície entregue. A regra `color-contrast` do addon roda
// com `test: "error"` em cada uma destas entradas — é aqui que o ponto de maior risco de contraste
// da feature é efetivamente medido.
export const OnSun: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: base, accent: "sun" },
};

export const OnSunMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: base, accent: "sun" },
};

export const OnFlame: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: base, accent: "flame" },
};

export const OnFlameMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: base, accent: "flame" },
};

export const OnMint: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { post: base, accent: "mint" },
};

export const OnMintMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { post: base, accent: "mint" },
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

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { post: base },
};
