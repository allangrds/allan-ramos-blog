import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AuthorCard from "./AuthorCard";

const base = {
  name: "Allan Ramos",
  date: "22 fev 2024",
  readingTime: "9 min",
};

describe("AuthorCard", () => {
  it("exibe o nome de quem assina", () => {
    render(<AuthorCard {...base} wordCount="1.740 palavras" />);

    expect(screen.getByText("Allan Ramos")).toBeInTheDocument();
  });

  // SC-015: os dois são EXIBIDOS COMO RECEBIDOS, nunca calculados aqui.
  it("exibe tempo e contagem exatamente como recebidos", () => {
    render(<AuthorCard {...base} wordCount="1.740 palavras" />);

    expect(screen.getByText("22 fev 2024 · 9 min · 1.740 palavras")).toBeInTheDocument();
  });

  it("valores arbitrários passam intactos, provando que nada é recalculado", () => {
    render(<AuthorCard {...base} readingTime="99 min" wordCount="7 palavras" />);

    expect(screen.getByText("22 fev 2024 · 99 min · 7 palavras")).toBeInTheDocument();
  });

  // Sem `wordCount` o bloco some INTEIRO — valor e separador —, sem deixar lacuna.
  it("sem contagem de palavras a linha termina no tempo de leitura", () => {
    render(<AuthorCard {...base} />);

    expect(screen.getByText("22 fev 2024 · 9 min")).toBeInTheDocument();
    expect(screen.queryByText(/palavras/)).not.toBeInTheDocument();
    expect(screen.queryByText(/·\s*$/)).not.toBeInTheDocument();
  });

  // Composição explícita: o círculo é o `Avatar` da T007, não um redesenhado aqui.
  it("compõe o Avatar do sistema", () => {
    const { container } = render(<AuthorCard {...base} />);

    const avatar = container.querySelector(".rounded-full");
    expect(avatar).not.toBeNull();
    expect(avatar).toHaveClass("size-11", "border-2", "border-ink", "bg-mint");
    expect(avatar).toHaveTextContent("AR");
  });

  // Assinatura é conteúdo, não controle: nenhum elemento interativo entra aqui.
  it("não introduz elemento interativo", () => {
    render(<AuthorCard {...base} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("não usa token da paleta anterior", () => {
    const { container } = render(<AuthorCard {...base} />);

    expect(container.innerHTML).not.toMatch(/ink-mute|link-blue|text-caption|body-md/);
  });
});
