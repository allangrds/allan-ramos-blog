import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EmptyState from "./EmptyState";

describe("EmptyState", () => {
  it("exibe o texto de convite recebido", () => {
    render(<EmptyState title="Espaço pra próxima série" />);

    expect(screen.getByText("Espaço pra próxima série")).toBeInTheDocument();
  });

  it("a dica é exibida quando recebida e omitida quando não", () => {
    const { rerender } = render(
      <EmptyState title="Espaço pra próxima série" hint="o card vazio é um convite, não um bug" />,
    );
    expect(screen.getByText("o card vazio é um convite, não um bug")).toBeInTheDocument();

    rerender(<EmptyState title="Espaço pra próxima série" />);
    expect(screen.queryByText("o card vazio é um convite, não um bug")).not.toBeInTheDocument();
  });

  // FR-032 / US7/AS-3: o DOM não contém contagem de resultados, em estado nenhum.
  it.each([
    ["com dica", { title: "Nada por aqui ainda", hint: "tente outra palavra" }],
    ["sem dica", { title: "Nada por aqui ainda" }],
  ])("%s, o DOM não exibe contagem de resultados", (_label, props) => {
    const { container } = render(<EmptyState {...props} />);

    expect(container.textContent).not.toMatch(/\d+\s*resultado/i);
    expect(container.textContent).not.toMatch(/nenhum resultado|sem resultados|0 itens/i);
  });

  // O tracejado é o que distingue convite de erro, e é a única borda não sólida do sistema.
  it("o contorno é tracejado", () => {
    const { container } = render(<EmptyState title="Nada por aqui ainda" />);

    expect(container.firstElementChild).toHaveClass("border-dashed", "border-2", "border-ink");
  });

  it("o ícone é escondido de tecnologia assistiva", () => {
    const { container } = render(<EmptyState title="Nada por aqui ainda" />);

    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("não introduz elemento interativo", () => {
    render(<EmptyState title="Nada por aqui ainda" hint="dica" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("não usa token da paleta anterior", () => {
    const { container } = render(<EmptyState title="Nada por aqui ainda" />);

    expect(container.innerHTML).not.toMatch(/ink-mute|link-blue|body-md|text-caption|primary/);
  });
});
