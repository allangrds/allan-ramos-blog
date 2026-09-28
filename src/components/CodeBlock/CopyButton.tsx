"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export type CopyButtonProps = {
  code: string;
};

export default function CopyButton({ code }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    // EC-08: a cópia pode ser NEGADA pelo navegador — permissão, contexto não seguro, ou ausência
    // da API. Nesse caso o componente MUST NOT entrar em "copiado" e MUST NOT lançar erro ao
    // leitor: dizer "Copiado!" sem ter copiado é pior que não copiar, e uma rejeição não tratada
    // aparece no console, que é canal do Portão 6.
    try {
      await navigator.clipboard.writeText(code);
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
      className="inline-flex min-h-11 items-center gap-2 rounded-pill border-2 border-ink bg-paper px-3 font-mono text-micro-cap text-ink"
    >
      {/* O retorno é por ÍCONE e por texto, não só por cor (FR-026, US6/AS-2). */}
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {copied ? "Copiado!" : "Copiar"}
    </button>
  );
}
