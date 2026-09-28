import CopyButton from "./CopyButton";

export type CodeBlockViewProps = {
  /** HTML já destacado. Vem da casca `CodeBlock`, que é quem chama o `shiki`. */
  html: string;
  /** Texto cru, para a ação de copiar. */
  code: string;
  language?: string;
  filename?: string;
};

/**
 * Apresentação do bloco de código — sincrona de propósito.
 *
 * `CodeBlock` é Server Component `async` porque destaca com `shiki`, e o React recusa componente
 * async no cliente: a story, que roda em navegador real, não consegue renderizá-lo. Todo o visual
 * vive aqui, e a casca async fica sendo só o `await codeToHtml()`.
 *
 * A fronteira interna JÁ ESTAVA CORRETA e foi preservada: o único cliente é o `CopyButton`. É o
 * precedente que `Header`/`SearchTrigger` repete.
 *
 * **EC-07**: sem nome de arquivo ou sem linguagem, o cabeçalho OMITE o campo ausente e mantém a
 * ação de copiar. Nenhum rótulo de substituição é inventado — "sem nome" no lugar do nome seria
 * informação falsa sobre o arquivo.
 */
export default function CodeBlockView({
  html,
  code,
  language,
  filename,
}: CodeBlockViewProps) {
  const hasHeaderText = filename !== undefined || (language !== undefined && language !== "");

  return (
    <figure className="overflow-hidden rounded-md border-2 border-ink shadow-hard">
      <div className="flex items-center gap-2 border-b-2 border-ink bg-sand px-3 py-2">
        {hasHeaderText && (
          <span className="flex min-w-0 items-center gap-2 font-mono text-micro-cap text-ink">
            {filename !== undefined && <span className="truncate">{filename}</span>}
            {language !== undefined && language !== "" && (
              <span className="shrink-0 rounded-pill border-2 border-ink px-2">{language}</span>
            )}
          </span>
        )}

        {/* A ação de copiar fica no cabeçalho sempre, inclusive quando não há nome nem linguagem:
            é ela que EC-07 manda manter. `ml-auto` a empurra para a direita mesmo sem irmãos. */}
        <div className="ml-auto">
          <CopyButton code={code} />
        </div>
      </div>

      {/* O CORPO rola na horizontal; a página, não (US6/AS-3, SC-009). `overflow-x-auto` prende a
          rolagem aqui dentro, e é isso que impede a linha longa de empurrar o documento. */}
      {/* `text-sand` é COR DE RESERVA, não decoração. O `shiki` pinta cada token com `style`
          inline, que vence a classe — então na prática ela nunca aparece em código destacado. Ela
          existe para o caso em que o HTML chega SEM cor: aí o texto herdaria `ink` sobre
          `code-bg`, que dá **1,04:1** e é praticamente invisível. Medido no Portão 4, que reprovou
          exatamente isso antes desta linha existir. */}
      {/* `tabIndex` e `role="region"` NÃO são enfeite: uma área que rola na horizontal precisa ser
          alcançável por teclado, senão quem não usa mouse não consegue ler o fim da linha. O Portão
          4 reprovou com `scrollable-region-focusable` antes destes atributos — o defeito nasceu
          junto com a rolagem que US6/AS-3 pede. O anel de foco vem da regra de sistema, que já
          cobre `[tabindex]`. */}
      <div
        tabIndex={0}
        role="region"
        aria-label={
          filename !== undefined ? `Código: ${filename}` : "Bloco de código"
        }
        className="overflow-x-auto bg-code-bg text-sand [&_pre]:bg-code-bg! [&_pre]:p-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Dica de rolagem, só abaixo do ponto de corte. Ela é estática de propósito: detectar
          transbordo exigiria medir largura no cliente, e isso transformaria este componente
          sincrono em mais uma ilha — por um aviso que em 390px vale para quase todo bloco. */}
      <figcaption className="border-t-2 border-ink bg-sand px-3 py-1 font-mono text-micro-cap-sm text-ink-soft lg:hidden">
        role o código para o lado
      </figcaption>
    </figure>
  );
}
