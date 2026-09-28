import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SeriesShelf from "./SeriesShelf";

const items = [
  { title: "Diário Fullstack 1", href: "/posts/diario-full-stack-1", read: true },
  { title: "Diário Fullstack 2", href: "/posts/diario-full-stack-2" },
  { title: "Diário Fullstack 3", href: "/posts/diario-full-stack-3" },
];

describe("SeriesShelf", () => {
  it("renderiza links reais para cada item", () => {
    render(<SeriesShelf series="Virando fullstack" items={items} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    links.forEach((link) => expect(link).toHaveAttribute("href"));
  });

  // US5/AS-5: o item já lido é distinguível no DOM, e não só por cor.
  it("o item lido é distinguível por texto acessível, não só por cor", () => {
    render(<SeriesShelf series="Virando fullstack" items={items} />);

    const read = screen.getByRole("link", { name: /Diário Fullstack 1/ });
    expect(read.textContent).toContain("(já lido)");

    const unread = screen.getByRole("link", { name: /Diário Fullstack 2/ });
    expect(unread.textContent).not.toContain("(já lido)");
  });

  it("o item lido também é marcado visualmente", () => {
    render(<SeriesShelf series="Virando fullstack" items={items} />);

    expect(screen.getByRole("link", { name: /Diário Fullstack 1/ })).toHaveClass("line-through");
    expect(screen.getByRole("link", { name: /Diário Fullstack 2/ })).not.toHaveClass(
      "line-through",
    );
  });

  // A ordem é CRESCENTE e vem do array: série tem começo, e ordenar por data faria o leitor
  // começar pelo fim.
  it("numera na ordem recebida, começando em 1", () => {
    render(<SeriesShelf series="Virando fullstack" items={items} />);

    const positions = screen.getAllByRole("listitem").map((item) =>
      item.querySelector("span")?.textContent,
    );
    expect(positions).toEqual(["1", "2", "3"]);
  });

  it("não reordena o array recebido", () => {
    const reversed = [...items].reverse();
    render(<SeriesShelf series="Virando fullstack" items={reversed} />);

    const titles = screen.getAllByRole("link").map((link) => link.textContent);
    expect(titles[0]).toContain("Diário Fullstack 3");
  });

  // EC-10
  it("com um único item a trilha aparece e não quebra", () => {
    render(<SeriesShelf series="Virando fullstack" items={[items[0]]} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("mostra o nome da série", () => {
    render(<SeriesShelf series="Virando fullstack" items={items} />);

    expect(screen.getByRole("heading")).toHaveTextContent("Virando fullstack");
  });

  it("todo item tem alvo de toque de 44px", () => {
    render(<SeriesShelf series="Virando fullstack" items={items} />);

    screen.getAllByRole("link").forEach((link) => expect(link).toHaveClass("min-h-11"));
  });
});
