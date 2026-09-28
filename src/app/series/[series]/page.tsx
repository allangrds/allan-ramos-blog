import { getAllSeries, getPostsBySeries } from "@/lib/posts";
import PostCard from "@/components/PostCard/PostCard";
import Container from "@/components/Container/Container";

type SeriesPageProps = {
  params: Promise<{ series: string }>;
};

export function generateStaticParams() {
  return getAllSeries().map((series) => ({ series }));
}

export default async function SeriesPage({ params }: SeriesPageProps) {
  const { series } = await params;
  const posts = getPostsBySeries(series);

  return (
    <Container className="py-12">
      <h1 className="text-heading-lg font-bold text-ink mb-6">
        Série &ldquo;{series}&rdquo;
      </h1>
      {posts.length === 0 ? (
        <p className="text-body-md text-ink-mute">
          Nenhum post encontrado nesta série.
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.slug} post={post} />)
      )}
    </Container>
  );
}
