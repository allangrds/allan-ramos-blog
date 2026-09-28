import { notFound } from "next/navigation";

import { getPaginatedPosts } from "@/lib/posts";
import PostsListing from "@/components/PostsListing/PostsListing";

type PagePageProps = {
  params: Promise<{ page: string }>;
};

export function generateStaticParams() {
  const { totalPages } = getPaginatedPosts(1);
  return Array.from({ length: totalPages - 1 }, (_, index) => ({
    page: String(index + 2),
  }));
}

export default async function PagePage({ params }: PagePageProps) {
  const { page: pageParam } = await params;
  const page = Number(pageParam);

  if (!Number.isInteger(page) || page < 2) notFound();

  const { totalPages } = getPaginatedPosts(page);
  if (page > totalPages) notFound();

  return <PostsListing page={page} />;
}
