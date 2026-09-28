import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import Pagination from "./Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Components/Pagination",
  component: Pagination,
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const FirstPage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { currentPage: 1, totalPages: 5 },
};

export const FirstPageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { currentPage: 1, totalPages: 5 },
};

export const MiddlePage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { currentPage: 3, totalPages: 5 },
};

export const MiddlePageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { currentPage: 3, totalPages: 5 },
};

export const LastPage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { currentPage: 5, totalPages: 5 },
};

export const LastPageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { currentPage: 5, totalPages: 5 },
};

// EC-05: página única, com os DOIS extremos desabilitados ao mesmo tempo — e presentes. O reflexo
// é esconder; esconder muda o layout debaixo do leitor.
export const SinglePage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { currentPage: 1, totalPages: 1 },
};

export const SinglePageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { currentPage: 1, totalPages: 1 },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { currentPage: 3, totalPages: 5 },
};
