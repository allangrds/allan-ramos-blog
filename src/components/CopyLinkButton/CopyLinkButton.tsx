"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

export type CopyLinkButtonProps = {
  url: string;
};

export default function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    // EC-08: cópia negada pelo navegador não entra em "copiado" e não lança erro ao leitor.
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill border-2 border-ink bg-paper px-4 font-mono text-micro-cap text-ink"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
      {copied ? "Copiado!" : "Compartilhar o link"}
    </button>
  );
}
