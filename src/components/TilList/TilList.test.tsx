import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TilList from "./TilList";

const items = [
  { lang: "TypeScript", term: "satisfies", note: "Valida sem alargar o tipo inferido." },
  { lang: "CSS", term: "color-mix()", note: "Mistura duas cores." },
];

describe("TilList", () => {
  it("renderiza exatamente os itens recebidos", () => {
    render(<TilList items={items} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it.each(items)("mostra lang, term e note de %o", ({ lang, term, note }) => {
    render(<TilList items={items} />);

    expect(screen.getByText(lang)).toBeInTheDocument();
    expect(screen.getByText(term)).toBeInTheDocument();
    expect(screen.getByText(note)).toBeInTheDocument();
  });

  it("o termo usa o elemento semântico <code>", () => {
    const { container } = render(<TilList items={items} />);

    expect(container.querySelector("code")?.textContent).toBe("satisfies");
  });

  // Lista vazia: nada renderizado no lugar dos itens, e nenhum texto inventado.
  it("lista vazia não inventa texto de substituição", () => {
    render(<TilList items={[]} />);

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.queryByText(/nenhuma|vazio|sem anota/i)).toBeNull();
  });

  it("com um único item não quebra", () => {
    render(<TilList items={[items[0]]} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });
});
