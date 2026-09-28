import { getPaginatedPosts } from "@/lib/posts";

import PostsListingView from "./PostsListingView";

export type PostsListingProps = {
  page: number;
};

/**
 * Casca de dado: só busca e delega. Server Component.
 *
 * Contrato congelado `{ page: number }` — consumido por `src/app/page.tsx` e
 * `src/app/page/[page]/page.tsx`. Todo o visual vive em `PostsListingView`, porque esta casca lê o
 * disco e não pode ser importada numa story.
 */
export default function PostsListing({ page }: PostsListingProps) {
  const { posts, totalPages } = getPaginatedPosts(page);

  return <PostsListingView posts={posts} page={page} totalPages={totalPages} />;
}
