import Button from "@/components/Button/Button";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;
  const prevHref = currentPage - 1 <= 1 ? "/" : `/page/${currentPage - 1}`;
  const nextHref = `/page/${currentPage + 1}`;

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-between mt-10 pt-6 border-t border-hairline"
    >
      {!isFirst ? (
        <Button href={prevHref} variant="secondary">
          Anterior
        </Button>
      ) : (
        <span />
      )}
      <span className="text-caption text-ink-mute">
        {currentPage} de {totalPages}
      </span>
      {!isLast ? (
        <Button href={nextHref} variant="secondary">
          Próximo
        </Button>
      ) : (
        <span />
      )}
    </nav>
  );
}
