import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Hero from "./Hero";

describe("Hero", () => {
  // A tarefa é RE-ESTILIZAÇÃO: o conteúdo não muda.
  it("mantém o título e a frase de apresentação", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Allan Ramos");
    expect(screen.getByText("Aprendendo e compartilhando tecnologia")).toBeInTheDocument();
  });

  it("mantém a chamada para /sobre", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: "Sobre mim" })).toHaveAttribute("href", "/sobre");
  });

  it("o título usa a maior escala de display", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("text-display-xxl");
  });

  // Sai o degradê da paleta anterior: a identidade nova não tem degradê, e `canvas-lavender` não
  // existe mais como token.
  it("não usa degradê nem token da paleta anterior", () => {
    const { container } = render(<Hero />);
    const section = container.firstElementChild;

    expect(section?.className).not.toMatch(/bg-linear|gradient|lavender/);
    expect(section).toHaveClass("bg-canvas");
  });
});
