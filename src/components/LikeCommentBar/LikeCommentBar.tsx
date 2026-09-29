import { Heart, MessageCircle } from "lucide-react";

export type LikeCommentBarProps = {
  likes: number;
  comments: number;
};

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

// `sun` carrega a curtida e `paper` o comentário, como o artboard. O texto é `ink` nos dois:
// 11.74 sobre `sun` e 18.24 sobre `paper` (§3 de DESIGN.md).
const PILL =
  "inline-flex items-center gap-2 rounded-pill border-2 border-ink px-4 py-2 text-body-lg font-bold text-ink shadow-hard";

/**
 * Server Component — recusa deliberada da diretiva. As contagens são **dado de leitura**, não
 * controle: FR-031b proíbe persistir, escrever em serviço e absorver o embed do Disqus. Sem
 * handler criado localmente não há gatilho para `"use client"`.
 *
 * **O artboard desenha as duas contagens como `<button>`, e aqui elas não são.** Um botão sem
 * ação é um controle que mente para tecnologia assistiva: seria anunciado como acionável e não
 * faria nada. Enquanto FR-031b proibir a escrita, a marcação honesta é a de texto — e por não
 * haver controle, não há alvo de toque nem entrada de hover a cumprir.
 *
 * `DisqusComments` permanece intocado (SC-013): esta barra é componente separado e **não**
 * absorve o embed de terceiros.
 */
export default function LikeCommentBar({ likes, comments }: LikeCommentBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className={`${PILL} bg-sun`}>
        <Heart size={17} aria-hidden="true" />
        {plural(likes, "curtida", "curtidas")}
      </span>
      <span className={`${PILL} bg-paper`}>
        <MessageCircle size={17} aria-hidden="true" />
        {plural(comments, "comentário", "comentários")}
      </span>
    </div>
  );
}
