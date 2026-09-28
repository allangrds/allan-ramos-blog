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
 * A medida de leitura sai do TOKEN `--measure-prose` (FR-012), que está em `ch` — e a unidade
 * importa: `ch` acompanha o tamanho da fonte, então ampliar o texto a 200% aumenta a caixa junto
 * em vez de manter uma largura fixa em px que cortaria o texto (EC-13). A largura efetiva continua
 * limitada pelo pai, então ampliar não cria rolagem horizontal.
 *
 * Os estilos de prosa são aplicados por seletor de descendente porque o conteúdo vem do MDX: os
 * elementos são gerados, não escritos aqui, e não há onde pendurar classe neles.
 */
export default function PostContentView({ children }: PostContentViewProps) {
  return (
    <div
      className={[
        "max-w-(--measure-prose) text-body-lg text-ink",
        "[&_h2]:mt-10 [&_h2]:text-display-md",
        "[&_h3]:mt-8 [&_h3]:text-heading-md",
        "[&_p]:mt-4",
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mt-1",
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-2 [&_blockquote]:border-ink [&_blockquote]:pl-4 [&_blockquote]:text-ink-soft",
        "[&_a]:underline",
        "[&_img]:mt-6 [&_img]:rounded-md [&_img]:border-2 [&_img]:border-ink",
        "[&_hr]:mt-8 [&_hr]:border-t-2 [&_hr]:border-dotted [&_hr]:border-hairline",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
