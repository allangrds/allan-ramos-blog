import type { ReactNode } from "react";

export type ContainerProps = {
  children: ReactNode;
  className?: string;
  /**
   * Largura de LEITURA em vez da largura padrão: limita a linha à medida de `--measure-prose`
   * (FR-012), que é o token de 65 a 72 caracteres. Opcional com padrão `false`, para não
   * quebrar o contrato congelado de `{ className }` consumido por `src/app/**`.
   */
  prose?: boolean;
};

// A largura de leitura sai do TOKEN, não de um valor avulso: `--measure-prose` é insumo da
// justificativa do ponto de corte de 1024px, então ele não pode viver solto num componente.
const WIDTH_CLASSES = {
  default: "max-w-3xl",
  prose: "max-w-(--measure-prose)",
} as const;

export default function Container({
  children,
  className = "",
  prose = false,
}: ContainerProps) {
  const width = prose ? WIDTH_CLASSES.prose : WIDTH_CLASSES.default;

  return (
    <div className={`mx-auto px-6 ${width} ${className}`.trim()}>{children}</div>
  );
}
