import { getAllCategories } from "@/lib/posts";
import Container from "@/components/Container/Container";
import TagPill from "@/components/TagPill/TagPill";

export default function CategoriasPage() {
  const categories = getAllCategories();

  return (
    <Container className="py-12">
      <h1 className="text-heading-lg font-bold text-ink mb-6">Categorias</h1>
      {categories.length === 0 ? (
        <p className="text-body-md text-ink-mute">Nenhuma categoria encontrada.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <TagPill key={category} tag={category} href={`/categories/${category}`} />
          ))}
        </div>
      )}
    </Container>
  );
}
