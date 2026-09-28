import { transformerNotationHighlight } from "@shikijs/transformers";
import { codeToHtml } from "shiki";

import CodeBlockView from "./CodeBlockView";

export type CodeBlockProps = {
  code: string;
  language: string;
  filename?: string;
};

/**
 * Casca `async`: só destaca e delega. Server Component.
 *
 * A assinatura `{ code, language }` é preservada porque `src/lib/mdx.tsx` a consome e está
 * congelado por SC-011. `filename` entra opcional.
 */
export default async function CodeBlock({
  code,
  language,
  filename,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language || "text",
    theme: "dracula",
    transformers: [transformerNotationHighlight()],
  });

  return (
    <CodeBlockView
      html={html}
      code={code}
      language={language}
      filename={filename}
    />
  );
}
