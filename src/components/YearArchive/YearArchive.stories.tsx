import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import YearArchive from "./YearArchive";

const meta: Meta<typeof YearArchive> = {
  title: "Components/YearArchive",
  component: YearArchive,
};

export default meta;
type Story = StoryObj<typeof YearArchive>;

// US5/AS-4: o ano SEM post continua visível como hiato. 2023 está aqui de propósito.
const withGap = [
  { year: 2024, count: 3 },
  { year: 2023, count: 0 },
  { year: 2022, count: 7 },
  { year: 2018, count: 2 },
];

export const WithGap: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { years: withGap },
};

export const WithGapMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { years: withGap },
};

export const NoGaps: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { years: withGap.filter((entry) => entry.count > 0) },
};

export const NoGapsMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { years: withGap.filter((entry) => entry.count > 0) },
};

// EC-06: um único ano preenchido — aparece, não quebra, e NENHUM hiato é inventado.
export const SingleYear: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { years: [{ year: 2024, count: 3 }] },
};

export const SingleYearMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { years: [{ year: 2024, count: 3 }] },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { years: withGap },
};
