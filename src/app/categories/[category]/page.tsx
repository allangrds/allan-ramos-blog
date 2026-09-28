import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard/PostCard";
import Container from "@/components/Container/Container";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ category }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts = getPostsByCategory(category);

  return (
    <Container className="py-12">
      <h1 className="text-heading-lg font-bold text-ink mb-6">
        Posts na categoria &ldquo;{category}&rdquo;
      </h1>
      {posts.length === 0 ? (
        <p className="text-body-md text-ink-mute">
          Nenhum post encontrado nesta categoria.
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.slug} post={post} />)
      )}
    </Container>
  );
}
