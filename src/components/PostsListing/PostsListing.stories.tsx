import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import type { Post } from "@/lib/types";
import PostsListingView from "./PostsListingView";

/**
 * A story renderiza `PostsListingView`, não `PostsListing`: a casca lê o disco
 * (`getPaginatedPosts` → `fs`), e `fs` não existe no navegador onde o Portão 4 roda.
 */
const meta: Meta<typeof PostsListingView> = {
  title: "Components/PostsListing",
  component: PostsListingView,
};

export default meta;
type Story = StoryObj<typeof PostsListingView>;

const makePost = (index: number): Post => ({
  title: `Post de exemplo ${index}`,
  date: `2024-0${index}-10`,
  slug: `post-${index}`,
  summary: "Um resumo curto para dar corpo ao card na listagem.",
  tags: ["react"],
  category: index % 2 === 0 ? "Front-end" : "Back-end",
  body: "",
});

const posts = [1, 2, 3].map(makePost);

export const FirstPage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { posts, page: 1, totalPages: 3 },
};

export const FirstPageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { posts, page: 1, totalPages: 3 },
};

// A partir da segunda página não há destaque: o destaque é "o último post".
export const MiddlePage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { posts, page: 2, totalPages: 3 },
};

export const MiddlePageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { posts, page: 2, totalPages: 3 },
};

export const LastPage: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { posts, page: 3, totalPages: 3 },
};

export const LastPageMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { posts, page: 3, totalPages: 3 },
};

// Lista vazia: sem paginação órfã sobre o nada.
export const EmptyList: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { posts: [], page: 1, totalPages: 1 },
};

export const EmptyListMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { posts: [], page: 1, totalPages: 1 },
};
