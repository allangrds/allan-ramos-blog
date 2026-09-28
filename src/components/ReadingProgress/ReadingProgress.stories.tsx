import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import ReadingProgress from "./ReadingProgress";

const meta: Meta<typeof ReadingProgress> = {
  title: "Components/ReadingProgress",
  component: ReadingProgress,
};

export default meta;
type Story = StoryObj<typeof ReadingProgress>;

// `value` existe para isto: sem ele os três estados de US4/AS-5 não seriam demonstráveis no
// catálogo, porque a fração dependeria de rolar a página da story.
const assertFraction = (expected: number) => async ({
  canvasElement,
}: {
  canvasElement: HTMLElement;
}) => {
  const bar = within(canvasElement).getByRole("progressbar");
  expect(bar).toHaveAttribute("aria-valuenow", String(expected));
};

export const Empty: Story = {
  globals: DESKTOP,
  args: { value: 0 },
  play: async (context) => {
    await atDesktop();
    await assertFraction(0)(context);
  },
};

export const EmptyMobile: Story = {
  globals: MOBILE,
  args: { value: 0 },
  play: async (context) => {
    await atMobile();
    await assertFraction(0)(context);
  },
};

export const Partial: Story = {
  globals: DESKTOP,
  args: { value: 42 },
  play: async (context) => {
    await atDesktop();
    await assertFraction(42)(context);
  },
};

export const PartialMobile: Story = {
  globals: MOBILE,
  args: { value: 42 },
  play: async (context) => {
    await atMobile();
    await assertFraction(42)(context);
  },
};

export const Complete: Story = {
  globals: DESKTOP,
  args: { value: 100 },
  play: async (context) => {
    await atDesktop();
    await assertFraction(100)(context);
  },
};

export const CompleteMobile: Story = {
  globals: MOBILE,
  args: { value: 100 },
  play: async (context) => {
    await atMobile();
    await assertFraction(100)(context);
  },
};
