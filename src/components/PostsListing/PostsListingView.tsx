import Container from "@/components/Container/Container";
import FeaturedPostCard from "@/components/FeaturedPostCard/FeaturedPostCard";
import Pagination from "@/components/Pagination/Pagination";
import PostCard from "@/components/PostCard/PostCard";
import type { Post } from "@/lib/types";

export type PostsListingViewProps = {
  posts: Post[];
  page: number;
  totalPages: number;
};

/**
 * Apresentação da listagem — pura e sincrona de propósito.
 *
 * A casca `PostsListing` lê o disco (`getPaginatedPosts` → `fs`), e `fs` não existe no navegador:
 * importar a casca numa story quebraria o empacotamento do Portão 4. Todo o visual desce para cá,
 * que é a unidade que a story **consegue** renderizar, e a casca fica sendo só a busca do dado.
 * Mesmo padrão de `PostContent` → `PostContentView` e `CodeBlock` → `CopyButton`.
 *
 * Compõe `FeaturedPostCard`, `PostCard` e `Pagination` sem redesenhar nenhum dos três.
 */
export default function PostsListingView({
  posts,
  page,
  totalPages,
}: PostsListingViewProps) {
  const isFirstPage = page === 1;
  const featuredPost = isFirstPage ? posts[0] : undefined;
  const remainingPosts = isFirstPage ? posts.slice(1) : posts;
  const isEmpty = posts.length === 0;

  return (
    <Container className="flex flex-col gap-6 py-12">
      {isEmpty ? (
        // O texto definitivo de lista vazia é do `EmptyState` (T042), que ainda não existe. Até lá
        // a mensagem fica aqui, já com token válido em vez do `text-ink-mute` da paleta anterior.
        <p className="text-body-lg text-ink-soft">Nenhum post encontrado.</p>
      ) : (
        <>
          {featuredPost !== undefined && <FeaturedPostCard post={featuredPost} />}
          {remainingPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </>
      )}

      {/* Lista vazia NÃO renderiza paginação órfã: não há o que paginar, e uma navegação inerte
          sobre o nada é ruído. Isto é diferente de EC-05, onde HÁ posts numa única página e a
          paginação aparece desabilitada de propósito. */}
      {!isEmpty && <Pagination currentPage={page} totalPages={totalPages} />}
    </Container>
  );
}
