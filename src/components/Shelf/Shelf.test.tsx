import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Shelf from "./Shelf";

const full = [
  { title: "Refactoring", author: "Fowler" },
  { title: "Domain-Driven Design", author: "Evans" },
];

describe("Shelf", () => {
  it("renderiza os livros recebidos", () => {
    render(<Shelf books={full} />);

    expect(screen.getByText("Refactoring")).toBeInTheDocument();
    expect(screen.getByText("Fowler")).toBeInTheDocument();
  });

  // FR-035/US5/AS-3: a tentação é preencher o buraco com um título plausível. Um título inventado
  // é dado falso na tela do leitor; o buraco é a informação correta.
  it("title null produz marcador de vazio", () => {
    const { container } = render(<Shelf books={[...full, { title: null }]} />);

    expect(container.querySelector("[data-empty='true']")).not.toBeNull();
    expect(screen.getByText("Slot vazio")).toBeInTheDocument();
  });

  it("nenhum título inventado aparece no DOM no slot vazio", () => {
    const { container } = render(<Shelf books={[{ title: null }]} />);
    const slot = container.querySelector("[data-empty='true']");

    // O único texto do slot é o rótulo para leitor de tela.
    expect(slot?.textContent).toBe("Slot vazio");
  });

  it("o slot vazio não é confundido com um livro sem autor", () => {
    const { container } = render(
      <Shelf books={[{ title: "Sem autor" }, { title: null }]} />,
    );

    expect(container.querySelectorAll("[data-empty='true']")).toHaveLength(1);
    expect(screen.getByText("Sem autor")).toBeInTheDocument();
  });

  it("livro sem autor não renderiza linha de autor vazia", () => {
    const { container } = render(<Shelf books={[{ title: "Sem autor" }]} />);
    const book = container.querySelector("li > span");

    expect(book?.textContent).toBe("Sem autor");
  });

  it("vários slots vazios geram vários marcadores", () => {
    const { container } = render(<Shelf books={[{ title: null }, { title: null }]} />);

    expect(container.querySelectorAll("[data-empty='true']")).toHaveLength(2);
  });
});
