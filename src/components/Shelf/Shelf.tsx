import { BookOpen } from "lucide-react";

export type ShelfBook = {
  /** `null` marca um slot VAZIO. Ver a nota de FR-035 abaixo. */
  title: string | null;
  author?: string;
};

export type ShelfProps = {
  books: ShelfBook[];
};

/**
 * A estante.
 *
 * **FR-035/US5/AS-3**: slot sem livro recebe um MARCADOR DE VAZIO, nunca um livro inventado. É a
 * tentação mais direta deste componente — preencher a estante com um título plausível para o
 * desenho não ficar com um buraco. Um título inventado é dado falso na tela do leitor, e o buraco
 * é a informação correta: ainda não há livro ali.
 */
export default function Shelf({ books }: ShelfProps) {
  return (
    <section>
      <h2 className="font-display text-micro-cap uppercase text-ink">Na estante</h2>

      <ul className="mt-3 flex flex-wrap gap-3">
        {books.map((book, position) => {
          const isEmpty = book.title === null;

          return (
            <li key={isEmpty ? `vazio-${position}` : book.title}>
              {isEmpty ? (
                <span
                  data-empty="true"
                  className="flex h-24 w-16 flex-col items-center justify-center rounded-sm border-2 border-dashed border-hairline text-ink-soft"
                >
                  <BookOpen size={20} aria-hidden="true" />
                  <span className="sr-only">Slot vazio</span>
                </span>
              ) : (
                <span className="flex h-24 w-16 flex-col justify-between rounded-sm border-2 border-ink bg-sand p-2">
                  <span className="line-clamp-3 text-micro-cap text-ink">{book.title}</span>
                  {book.author !== undefined && (
                    <span className="line-clamp-1 font-mono text-micro-cap-sm text-ink-soft">
                      {book.author}
                    </span>
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
