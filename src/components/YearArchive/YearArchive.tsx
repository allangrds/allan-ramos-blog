import Link from "next/link";

export type YearEntry = {
  year: number;
  count: number;
};

export type YearArchiveProps = {
  years: YearEntry[];
};

/**
 * Arquivo por ano.
 *
 * **Ano sem post CONTINUA VISÍVEL como hiato** (US5/AS-4), nunca omitido: o hiato é informação —
 * mostra que houve um ano sem escrever — e omitir o ano faria a lista mentir por silêncio.
 *
 * **EC-06**: com um único ano preenchido, nenhum hiato é INVENTADO. O componente não preenche
 * lacunas entre o menor e o maior ano; ele renderiza exatamente os anos recebidos, porque quem
 * sabe quais anos existem é a origem do dado.
 */
export default function YearArchive({ years }: YearArchiveProps) {
  return (
    <section>
      <h2 className="font-display text-micro-cap uppercase text-ink">Arquivo por ano</h2>

      <ul className="mt-3 flex flex-col gap-1">
        {years.map(({ year, count }) => {
          const isGap = count === 0;

          return (
            <li key={year}>
              {isGap ? (
                // Hiato: presente, legível e NÃO clicável — não há para onde ir.
                <span
                  data-gap="true"
                  className="flex items-center justify-between rounded-sm border-2 border-dashed border-hairline px-3 py-2 font-mono text-micro-cap text-ink-soft"
                >
                  {year}
                  <span>sem posts</span>
                </span>
              ) : (
                <Link
                  href={`/page/1?ano=${year}`}
                  className="flex min-h-11 items-center justify-between rounded-sm border-2 border-ink bg-paper px-3 py-2 font-mono text-micro-cap text-ink"
                >
                  {year}
                  <span>{count}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
