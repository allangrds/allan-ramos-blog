import { Plus } from "lucide-react";

export type EmptyStateProps = {
  title: string;
  hint?: string;
};

/**
 * Server Component: render puro do convite.
 *
 * **Contorno tracejado, nunca contagem** (FR-032, US7/AS-3). O vazio aqui é um espaço reservado
 * para o que ainda vem — série futura, tag sem post, busca sem resultado —, e dizer "0 resultados"
 * o transformaria em relatório de falha. O tracejado é o que diz "isto é um convite, não um bug",
 * e é por isso que ele é a única borda do sistema que não é sólida.
 */
export default function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-md border-2 border-dashed border-ink p-6 text-center">
      <Plus size={26} aria-hidden="true" className="text-ink-soft" />
      <p className="text-body-lg font-bold text-ink-soft">{title}</p>
      {hint && <p className="font-mono text-micro-cap text-ink-soft">{hint}</p>}
    </div>
  );
}
