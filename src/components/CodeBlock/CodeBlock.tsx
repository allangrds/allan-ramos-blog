import { codeToHtml } from "shiki";
import { transformerNotationHighlight } from "@shikijs/transformers";

import CopyButton from "./CopyButton";

export type CodeBlockProps = {
  code: string;
  language: string;
};

export default async function CodeBlock({ code, language }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language || "text",
    theme: "dracula",
    transformers: [transformerNotationHighlight()],
  });

  return (
    <div className="relative">
      <CopyButton code={code} />
      <div
        className="overflow-x-auto rounded-md shadow-md [&_pre]:p-4 [&_pre]:bg-ink!"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
