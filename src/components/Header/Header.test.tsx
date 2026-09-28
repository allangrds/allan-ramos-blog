import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Header from "./Header";

describe("Header", () => {
  // FR-016a, contrato congelado: `Header()` MUST ser chamável sem argumento, porque é assim que
  // `src/app/layout.tsx` o consome. Este teste chama a função direto, não via JSX, porque o JSX
  // sempre passa um objeto e esconderia a quebra.
  it("é chamável sem argumento", () => {
    expect(() => Header()).not.toThrow();
  });

  it("index ausente vira lista vazia, sem quebrar a renderização", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("aceita o índice recebido e o repassa para a ilha cliente", () => {
    render(
      <Header
        index={[
          { slug: "a", title: "A", summary: "", tags: [], bodyText: "" },
        ]}
      />,
    );

    // A ilha é o único caminho legal do índice até a CommandPalette (SC-015): o que se prova aqui
    // é que ela está montada dentro do Header, não que já consome o índice — isso é da T044.
    expect(screen.getByRole("button", { name: "Buscar" })).toBeInTheDocument();
  });

  // FR-013a: os cinco destinos continuam alcançáveis, e SEM JavaScript. Renderizar duas
  // apresentações significa dez links no DOM — cinco por ponto de corte.
  it.each(["Posts", "Categorias", "Tags", "Buscar", "Sobre"])(
    "o destino %s está no HTML servido, nas duas apresentações",
    (label) => {
      render(<Header />);

      expect(screen.getAllByRole("link", { name: label })).toHaveLength(2);
    },
  );

  it("não depende de estado para mostrar os destinos em telas pequenas", () => {
    const { container } = render(<Header />);

    // O menu antigo era um `useState` com botão "Abrir menu"; ele não existe mais.
    expect(screen.queryByRole("button", { name: /menu/i })).toBeNull();
    expect(container.querySelectorAll("nav")).toHaveLength(2);
  });

  // CHK031: duas landmarks `nav` no mesmo documento precisam de nome DISTINTO, senão reprovam a
  // regra `landmark-unique` do axe, que roda no Portão 4.
  it("as duas landmarks de navegação têm nomes distintos", () => {
    render(<Header />);

    const names = screen
      .getAllByRole("navigation")
      .map((nav) => nav.getAttribute("aria-label"));

    expect(new Set(names).size).toBe(names.length);
  });

  it("activeHref marca exatamente um destino como página atual", () => {
    render(<Header activeHref="/tags" />);

    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");

    // Um por apresentação, e nenhum outro destino marcado.
    expect(current).toHaveLength(2);
    current.forEach((link) => expect(link).toHaveTextContent("Tags"));
  });

  it("sem activeHref nenhum destino se declara página atual", () => {
    render(<Header />);

    const current = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("aria-current") === "page");

    expect(current).toHaveLength(0);
  });

  it("todo destino tem alvo de toque de 44px", () => {
    render(<Header />);

    screen
      .getAllByRole("link")
      .forEach((link) => expect(link).toHaveClass("min-h-11"));
  });
});
