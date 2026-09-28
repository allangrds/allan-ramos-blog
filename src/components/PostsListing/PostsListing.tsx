import { getPaginatedPosts } from "@/lib/posts";
import Container from "@/components/Container/Container";
import PostCard from "@/components/PostCard/PostCard";
import FeaturedPostCard from "@/components/FeaturedPostCard/FeaturedPostCard";
import Pagination from "@/components/Pagination/Pagination";

export type PostsListingProps = {
  page: number;
};

export default function PostsListing({ page }: PostsListingProps) {
  const { posts, totalPages } = getPaginatedPosts(page);
  const isFirstPage = page === 1;
  const featuredPost = isFirstPage ? posts[0] : undefined;
  const remainingPosts = isFirstPage ? posts.slice(1) : posts;

  return (
    <Container className="py-12">
      {posts.length === 0 ? (
        <p className="text-body-md text-ink-mute">Nenhum post encontrado.</p>
      ) : (
        <>
          {featuredPost && <FeaturedPostCard post={featuredPost} />}
          {remainingPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </>
      )}
      <Pagination currentPage={page} totalPages={totalPages} />
    </Container>
  );
}
