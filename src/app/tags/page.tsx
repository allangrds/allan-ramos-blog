import { getAllTags } from "@/lib/posts";
import Container from "@/components/Container/Container";
import TagPill from "@/components/TagPill/TagPill";

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <Container className="py-12">
      <h1 className="text-heading-lg font-bold text-ink mb-6">Tags</h1>
      {tags.length === 0 ? (
        <p className="text-body-md text-ink-mute">Nenhuma tag encontrada.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagPill key={tag} tag={tag} href={`/tags/${tag}`} />
          ))}
        </div>
      )}
    </Container>
  );
}
