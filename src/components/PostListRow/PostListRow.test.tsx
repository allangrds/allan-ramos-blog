import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Post } from "@/lib/types";
import PostListRow from "./PostListRow";

const base: Post = {
  title: "Diário Fullstack 3",
  date: "2022-09-06",
  slug: "diario-full-stack-3",
  summary: "Banco de dados e ACID.",
  tags: ["banco-de-dados"],
  category: "Back-end",
  series: "Virando fullstack",
  seriesOrder: 3,
  body: "",
};

const stripeOf = (container: HTMLElement) => container.querySelector("article > div");

describe("PostListRow", () => {
  // FR-024/US5/AS-1: a numeração aparece SÓ quando a série é informada.
  it("mostra a numeração quando a série é informada", () => {
    render(<PostListRow post={base} />);

    expect(screen.getByText(/Série\s*3/)).toBeInTheDocument();
  });

  it("não mostra numeração quando não há série", () => {
    render(<PostListRow post={{ ...base, series: undefined }} />);

    expect(screen.queryByText(/Série/)).toBeNull();
  });

  // EC-04: a faixa resolve para a cor da categoria, e para `hairline` na ausência dela.
  it.each([
    ["Front-end", "bg-flame"],
    ["Back-end", "bg-mint"],
    ["Ferramentas", "bg-sun"],
    ["Design", "bg-ink-blue"],
    ["Programação", "bg-ink"],
  ])("categoria %s pinta a faixa com %s", (category, expected) => {
    const { container } = render(<PostListRow post={{ ...base, category }} />);

    expect(stripeOf(container)).toHaveClass(expected);
  });

  it("sem categoria a faixa fica hairline e continua presente", () => {
    const { container } = render(<PostListRow post={{ ...base, category: undefined }} />);
    const stripe = stripeOf(container);

    expect(stripe).not.toBeNull();
    expect(stripe).toHaveClass("bg-hairline");
  });

  // EC-03
  it("resumo ausente sai do DOM, sem texto de substituição", () => {
    render(<PostListRow post={{ ...base, summary: "" }} />);

    expect(screen.queryByText(base.summary)).toBeNull();
    expect(screen.queryByText(/sem resumo|indisponível/i)).toBeNull();
  });

  // EC-02
  it("título longo é truncado em três linhas, mantendo o texto no DOM", () => {
    const longTitle = "palavra ".repeat(60).trim();
    render(<PostListRow post={{ ...base, title: longTitle }} />);

    const link = screen.getByRole("link", { name: longTitle });
    expect(link).toHaveClass("line-clamp-3");
    expect(link.textContent).toBe(longTitle);
  });

  it("o título é link para o post", () => {
    render(<PostListRow post={base} />);

    expect(screen.getByRole("link", { name: base.title })).toHaveAttribute(
      "href",
      "/posts/diario-full-stack-3",
    );
  });

  it("não aninha links", () => {
    const { container } = render(<PostListRow post={base} />);

    container.querySelectorAll("a").forEach((anchor) => {
      expect(anchor.querySelector("a")).toBeNull();
    });
  });
});
