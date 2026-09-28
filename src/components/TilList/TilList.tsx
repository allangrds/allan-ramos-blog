import InlineCode from "@/components/InlineCode/InlineCode";

export type TilItem = {
  /** Linguagem ou tecnologia da anotação. */
  lang: string;
  /** O termo aprendido. */
  term: string;
  note: string;
};

export type TilListProps = {
  items: TilItem[];
};

/**
 * Anotações curtas.
 *
 * Dado **por propriedade, sem origem real** (FR-031b): o componente não busca nada e não tem
 * acesso a rede nem a arquivo (SC-015). A ligação com a fonte real é trabalho da feature das rotas.
 */
export default function TilList({ items }: TilListProps) {
  return (
    <section>
      <h2 className="font-display text-micro-cap uppercase text-ink">Anotações curtas</h2>

      {/* Lista vazia: nenhum item, e nenhum texto inventado no lugar. Quem decide o que dizer numa
          lista vazia é o `EmptyState`, que é outro componente. */}
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item) => (
          <li key={`${item.lang}-${item.term}`} className="flex flex-col gap-1">
            <span className="flex items-center gap-2">
              <span className="font-mono text-micro-cap text-ink-soft">{item.lang}</span>
              <InlineCode>{item.term}</InlineCode>
            </span>
            <span className="text-body-lg text-ink">{item.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
