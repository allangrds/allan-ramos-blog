import Avatar from "@/components/Avatar/Avatar";

export type AuthorCardProps = {
  name: string;
  /** Data já formatada para leitura. Formatar aqui duplicaria a decisão que a rota já tomou. */
  date: string;
  /** Tempo de leitura já pronto, ex.: "9 min". */
  readingTime: string;
  /** Contagem de palavras já pronta, ex.: "1.740 palavras". Ausente, o bloco é omitido. */
  wordCount?: string;
};

/**
 * Server Component: render puro da assinatura do post.
 *
 * **Tempo de leitura e contagem de palavras são RECEBIDOS, nunca calculados aqui** (SC-015).
 * Calcular exigiria o corpo do post, que este componente não tem e não deve ter: ele assina, não
 * analisa. Os dois chegam prontos de quem leu o post.
 */
export default function AuthorCard({ name, date, readingTime, wordCount }: AuthorCardProps) {
  // EC: sem contagem de palavras o separador some junto com o valor — omitir o bloco sem
  // remover o `·` deixaria uma lacuna visível no fim da linha.
  const meta = [date, readingTime, wordCount].filter(Boolean).join(" · ");

  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} size="md" />
      <span className="flex min-w-0 flex-col">
        <span className="text-body-lg font-bold text-ink">{name}</span>
        <span className="font-mono text-micro-cap text-ink-soft">{meta}</span>
      </span>
    </div>
  );
}
