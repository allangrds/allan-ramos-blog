import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Breadcrumb from "./Breadcrumb";

const THREE = [
  { label: "Início", href: "/" },
  { label: "Tags", href: "/tags" },
  { label: "react" },
];

describe("Breadcrumb", () => {
  // O último item é a página atual: link para onde já se está é uma parada de tabulação que não
  // leva a nada.
  it("o último item NÃO é link", () => {
    render(<Breadcrumb items={THREE} />);

    expect(screen.queryByRole("link", { name: "react" })).toBeNull();
    expect(screen.getByText("react")).toBeInTheDocument();
  });

  it("os demais itens são links reais", () => {
    render(<Breadcrumb items={THREE} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    links.forEach((link) => expect(link).toHaveAttribute("href"));
  });

  it("o último item se anuncia como página atual", () => {
    render(<Breadcrumb items={THREE} />);

    expect(screen.getByText("react")).toHaveAttribute("aria-current", "page");
  });

  // Mesmo que o último item venha COM href, ele não vira link: a posição manda.
  it("o último item com href continua não sendo link", () => {
    render(
      <Breadcrumb
        items={[{ label: "Início", href: "/" }, { label: "Tags", href: "/tags" }]}
      />,
    );

    expect(screen.queryByRole("link", { name: "Tags" })).toBeNull();
  });

  it.each([2, 3, 4])("funciona com trilha de %i níveis", (levels) => {
    const items = Array.from({ length: levels }, (_, position) => ({
      label: `nível ${position + 1}`,
      href: position === levels - 1 ? undefined : `/n${position}`,
    }));
    render(<Breadcrumb items={items} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(levels);
    expect(screen.getAllByRole("link")).toHaveLength(levels - 1);
  });

  it("todo link tem alvo de toque de 44px", () => {
    render(<Breadcrumb items={THREE} />);

    screen.getAllByRole("link").forEach((link) => expect(link).toHaveClass("min-h-11"));
  });

  it("a região tem nome próprio", () => {
    render(<Breadcrumb items={THREE} />);

    expect(screen.getByRole("navigation")).toHaveAccessibleName("Trilha de navegação");
  });
});
