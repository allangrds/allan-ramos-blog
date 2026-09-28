import type { ReactNode } from "react";

export type InlineCodeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Código dentro de uma frase, no elemento semântico `<code>`.
 *
 * NÃO declara tamanho de texto de propósito: herda o do parágrafo em volta. O artboard desenha
 * 14,5px, que não é escala declarada, e fixar uma das cinco quebraria o ritmo da linha — um
 * `text-body-lg` dentro de um parágrafo `body-lg` seria redundante, e qualquer outra escala daria
 * um salto visível no meio da frase. Herdar é a escolha tokenizada: o tamanho continua vindo de
 * um token, o do contexto.
 *
 * O raio é `rounded-sm`, mesma decisão do `Kbd`: 12px é o menor raio do sistema.
 */
export default function InlineCode({ children, className = "" }: InlineCodeProps) {
  const classes = `rounded-sm bg-sand px-1.5 py-0.5 font-mono text-ink ${className}`.trim();

  return <code className={classes}>{children}</code>;
}
