import { Check } from "lucide-react";
import Link from "next/link";

export type SeriesItem = {
  title: string;
  href: string;
  /** Já lido. Distinguível dos demais no DOM, não só por cor (US5/AS-5). */
  read?: boolean;
};

export type SeriesShelfProps = {
  series: string;
  items: SeriesItem[];
};

/**
 * A trilha de uma série, em ordem CRESCENTE e não por data: série tem começo, e ler o segundo
 * antes do primeiro é o erro que a ordenação por data produz. A ordem é a do array recebido — o
 * componente não reordena, porque quem conhece a ordem de leitura é a origem do dado.
 *
 * EC-10: com um ÚNICO item a trilha aparece e não quebra — não existe "trilha mínima de dois".
 */
export default function SeriesShelf({ series, items }: SeriesShelfProps) {
  return (
    <section className="rounded-lg border-2 border-ink bg-paper p-4 shadow-hard">
      <h2 className="font-display text-micro-cap uppercase text-ink">Série · {series}</h2>

      <ol className="mt-3 flex flex-col gap-2">
        {items.map((item, position) => (
          <li key={item.href} className="flex items-center gap-2">
            {/* A posição é o que dá a ordem de leitura, e ela vem do índice, não de `order`:
                um campo de ordem que discordasse do array daria duas verdades. */}
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-sand font-mono text-micro-cap text-ink">
              {position + 1}
            </span>

            <Link
              href={item.href}
              className={`inline-flex min-h-11 items-center gap-2 text-body-lg ${
                item.read === true ? "text-ink-soft line-through" : "text-ink"
              }`}
            >
              {item.title}
              {/* O item lido é marcado por ÍCONE e por risco, além da cor: cor sozinha seria o
                  único portador da informação. O ícone tem rótulo de texto para leitor de tela. */}
              {item.read === true && (
                <>
                  <Check size={16} aria-hidden="true" />
                  <span className="sr-only">(já lido)</span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
