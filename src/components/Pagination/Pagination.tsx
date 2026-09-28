import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

// O extremo desabilitado vira TRACEJADO e PERMANECE VISÍVEL — nunca some (FR-030, US4/AS-3). É o
// ponto que mais convida ao erro: o reflexo é esconder, e esconder muda o layout debaixo do
// leitor quando ele chega na última página.
const EXTREME_BASE =
  "inline-flex min-h-11 items-center gap-1 rounded-pill border-2 px-4 text-body-lg font-bold";
const EXTREME_ENABLED = "border-ink bg-paper text-ink shadow-hard";
const EXTREME_DISABLED = "border-dashed border-hairline bg-transparent text-ink-soft";

/**
 * Server Component: os extremos são links reais quando habilitados.
 *
 * API livre — FR-016 não lista `Pagination` e nenhuma rota o chama direto, só `PostsListing`.
 *
 * **EC-05**: com uma ÚNICA página os dois extremos ficam desabilitados ao mesmo tempo, e o
 * componente continua renderizando. A versão anterior devolvia `null` nesse caso, o que fazia a
 * navegação desaparecer em vez de se apresentar inerte.
 */
export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;
  const previousHref = currentPage - 1 <= 1 ? "/" : `/page/${currentPage - 1}`;
  const nextHref = `/page/${currentPage + 1}`;

  return (
    <nav
      aria-label="Paginação"
      className="mt-10 flex items-center justify-between gap-2 border-t-2 border-ink pt-6"
    >
      {isFirst ? (
        <span aria-disabled="true" className={`${EXTREME_BASE} ${EXTREME_DISABLED}`}>
          <ChevronLeft size={18} aria-hidden="true" />
          Anterior
        </span>
      ) : (
        <Link href={previousHref} className={`${EXTREME_BASE} ${EXTREME_ENABLED}`}>
          <ChevronLeft size={18} aria-hidden="true" />
          Anterior
        </Link>
      )}

      <span className="font-mono text-micro-cap text-ink-soft">
        {currentPage} de {totalPages}
      </span>

      {isLast ? (
        <span aria-disabled="true" className={`${EXTREME_BASE} ${EXTREME_DISABLED}`}>
          Próximo
          <ChevronRight size={18} aria-hidden="true" />
        </span>
      ) : (
        <Link href={nextHref} className={`${EXTREME_BASE} ${EXTREME_ENABLED}`}>
          Próximo
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      )}
    </nav>
  );
}
