import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Callout from "./Callout";

describe("Callout", () => {
  // FR-029 / US6/AS-6: os três tipos existem e são DISTINTOS na marcação, não só na cor.
  it("a citação sai em <blockquote>", () => {
    const { container } = render(<Callout kind="quote">A melhor API é a que deixou de existir.</Callout>);

    const quote = container.querySelector("blockquote");
    expect(quote).not.toBeNull();
    expect(quote).toHaveTextContent("A melhor API é a que deixou de existir.");
  });

  it("a nota sai em <aside>", () => {
    const { container } = render(<Callout kind="note">O compilador chega na versão seguinte.</Callout>);

    expect(container.querySelector("aside")).not.toBeNull();
    expect(container.querySelector("blockquote")).toBeNull();
  });

  it("o item de checklist sai em parágrafo, com a marca de conferido", () => {
    const { container } = render(<Callout kind="checklist">Componentes puros durante o render.</Callout>);

    expect(container.querySelector("p")).not.toBeNull();
    expect(container.querySelector("aside")).toBeNull();
    expect(container.querySelector("blockquote")).toBeNull();
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("os três tipos produzem elementos diferentes entre si", () => {
    const tag = (kind: "note" | "quote" | "checklist") =>
      render(<Callout kind={kind}>texto</Callout>).container.firstElementChild?.tagName;

    expect(new Set([tag("note"), tag("quote"), tag("checklist")]).size).toBe(3);
  });

  it("o título é exibido quando recebido e omitido quando não", () => {
    const { rerender } = render(
      <Callout kind="note" title="Nota do tradutor">
        corpo
      </Callout>,
    );
    expect(screen.getByText("Nota do tradutor")).toBeInTheDocument();

    rerender(<Callout kind="note">corpo</Callout>);
    expect(screen.queryByText("Nota do tradutor")).not.toBeInTheDocument();
  });

  // Cada tipo tem superfície própria, e o texto sobre acento é SEMPRE `ink` (§3 de DESIGN.md).
  it.each([
    ["note", "bg-sun"],
    ["quote", "bg-blush"],
  ] as const)("o tipo %s pousa sobre %s com texto ink", (kind, surface) => {
    const { container } = render(<Callout kind={kind}>corpo</Callout>);

    expect(container.firstElementChild).toHaveClass(surface, "text-ink");
  });

  // Sem elemento interativo: o Callout é conteúdo, não controle. Nenhum botão, nenhum link.
  it("não introduz elemento interativo", () => {
    render(
      <Callout kind="note" title="Nota">
        corpo
      </Callout>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("não usa token da paleta anterior", () => {
    const { container } = render(<Callout kind="note">corpo</Callout>);

    expect(container.innerHTML).not.toMatch(/ink-mute|link-blue|body-md|text-caption|primary/);
  });
});
