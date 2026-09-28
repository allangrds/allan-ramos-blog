"use client";

import { useState } from "react";

export type CopyButtonProps = {
  code: string;
};

export default function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-3 right-3 rounded-sm bg-on-primary/10 px-2 py-1 text-caption text-on-primary hover:bg-on-primary/20"
    >
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}
