import { getSearchIndex } from "@/lib/search-index";
import SearchBox from "@/components/SearchBox/SearchBox";
import Container from "@/components/Container/Container";

export default function SearchPage() {
  const index = getSearchIndex();

  return (
    <Container className="py-12">
      <h1 className="text-heading-lg font-bold text-ink mb-6">Buscar</h1>
      <SearchBox index={index} />
    </Container>
  );
}
