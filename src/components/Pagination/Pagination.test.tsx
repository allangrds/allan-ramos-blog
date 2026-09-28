import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Pagination from "./Pagination";

describe("Pagination", () => {
  // EC-05, o ponto que mais convida ao erro: com uma única página os DOIS extremos ficam
  // desabilitados E PRESENTES NO DOM. A versão anterior devolvia `null` e a navegação desaparecia.
  it("com uma única página os dois extremos ficam desabilitados e presentes", () => {
    render(<Pagination currentPage={1} totalPages={1} />);

    expect(screen.queryAllByRole("link")).toHaveLength(0);

    const previous = screen.getByText("Anterior");
    const next = screen.getByText("Próximo");
    expect(previous).toBeInTheDocument();
    expect(next).toBeInTheDocument();
    expect(previous.closest("[aria-disabled='true']")).not.toBeNull();
    expect(next.closest("[aria-disabled='true']")).not.toBeNull();
  });

  it("o extremo desabilitado nunca desaparece — vira tracejado", () => {
    render(<Pagination currentPage={1} totalPages={1} />);

    screen.getAllByText(/Anterior|Próximo/).forEach((extreme) => {
      expect(extreme.className).toContain("border-dashed");
    });
  });

  it("na primeira página só o anterior está desabilitado", () => {
    render(<Pagination currentPage={1} totalPages={5} />);

    expect(screen.getByText("Anterior").closest("[aria-disabled='true']")).not.toBeNull();
    expect(screen.getByRole("link", { name: /Próximo/ })).toBeInTheDocument();
  });

  it("na última página só o próximo está desabilitado", () => {
    render(<Pagination currentPage={5} totalPages={5} />);

    expect(screen.getByText("Próximo").closest("[aria-disabled='true']")).not.toBeNull();
    expect(screen.getByRole("link", { name: /Anterior/ })).toBeInTheDocument();
  });

  it("na página do meio os dois extremos são links reais", () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("a segunda página aponta o anterior para a raiz, não para /page/1", () => {
    render(<Pagination currentPage={2} totalPages={5} />);

    expect(screen.getByRole("link", { name: /Anterior/ })).toHaveAttribute("href", "/");
  });

  it("informa a posição atual", () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(screen.getByText("3 de 5")).toBeInTheDocument();
  });

  it("todo extremo tem alvo de toque de 44px", () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    screen.getAllByRole("link").forEach((link) => expect(link).toHaveClass("min-h-11"));
  });

  it("a região tem nome próprio", () => {
    render(<Pagination currentPage={3} totalPages={5} />);

    expect(screen.getByRole("navigation")).toHaveAccessibleName("Paginação");
  });
});
