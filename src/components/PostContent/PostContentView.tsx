import type { ReactNode } from "react";

export type PostContentViewProps = {
  children: ReactNode;
};

/**
 * Apresentação do corpo do post — sincrona de propósito.
 *
 * `PostContent` é Server Component `async` porque compila o MDX com `evaluate()`, e o React
 * recusa componente async no cliente: uma story, que roda em navegador real, não consegue
 * renderizá-lo. Toda decisão visual do corpo do post vive aqui, na unidade que a story
 * **consegue** renderizar, e a casca async fica sendo só o `await`. Mesmo padrão de
 * `CodeBlock` → `CopyButton` e `Header` → `SearchTrigger`.
 *
 * A T030 é a dona do visual: é ela que traz a medida de leitura `--measure-prose` (FR-012) e os
 * estilos de prosa. Aqui o envelope está como estava no `PostContent`, sem mudança de saída.
 */
export default function PostContentView({ children }: PostContentViewProps) {
  return <div>{children}</div>;
}
