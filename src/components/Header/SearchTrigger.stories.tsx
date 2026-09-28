import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import SearchTrigger from "./SearchTrigger";

const meta: Meta<typeof SearchTrigger> = {
  title: "Components/Header/SearchTrigger",
  component: SearchTrigger,
};

export default meta;
type Story = StoryObj<typeof SearchTrigger>;

export const Resting: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: {},
};

export const RestingMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: {},
};

// O estado `open` é o que justifica a ilha existir, então ele tem entrada própria.
export const Open: Story = {
  globals: DESKTOP,
  args: {},
  play: async ({ canvasElement }) => {
    await atDesktop();

    const button = within(canvasElement).getByRole("button", { name: "Buscar" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  },
};

export const OpenMobile: Story = {
  globals: MOBILE,
  args: {},
  play: async ({ canvasElement }) => {
    await atMobile();

    const button = within(canvasElement).getByRole("button", { name: "Buscar" });
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: {},
};
