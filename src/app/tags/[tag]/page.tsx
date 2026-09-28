import { getAllTags, getPostsByTag } from "@/lib/posts";
import PostCard from "@/components/PostCard/PostCard";
import Container from "@/components/Container/Container";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  return (
    <Container className="py-12">
      <h1 className="text-heading-lg font-bold text-ink mb-6">
        Posts com a tag &ldquo;{tag}&rdquo;
      </h1>
      {posts.length === 0 ? (
        <p className="text-body-md text-ink-mute">
          Nenhum post encontrado com esta tag.
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.slug} post={post} />)
      )}
    </Container>
  );
}
