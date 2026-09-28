import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Post } from "@/lib/types";
import PostCard from "./PostCard";

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

describe("PostCard", () => {
  // Contrato congelado `{ post }`: `surface` é opcional com padrão.
  it("renderiza com apenas o post, sem surface", () => {
    render(<PostCard post={base} />);

    expect(screen.getByRole("link", { name: base.title })).toBeInTheDocument();
  });

  it("o título é link para o post", () => {
    render(<PostCard post={base} />);

    expect(screen.getByRole("link", { name: base.title })).toHaveAttribute(
      "href",
      "/posts/diario-full-stack-3",
    );
  });

  // O card compõe TagPill, que é link por contrato congelado. Se o card inteiro fosse `<a>`,
  // haveria `<a>` dentro de `<a>` — HTML inválido que o axe reprova.
  it("não aninha links: o card não é um link inteiro", () => {
    const { container } = render(<PostCard post={base} />);

    expect(container.firstElementChild?.tagName).toBe("ARTICLE");
    container.querySelectorAll("a").forEach((anchor) => {
      expect(anchor.querySelector("a")).toBeNull();
    });
  });

  // EC-03: o bloco de resumo NÃO está no DOM, e não sobra lacuna nem texto de substituição.
  it("resumo ausente sai do DOM, sem texto de substituição", () => {
    const { container } = render(<PostCard post={{ ...base, summary: "" }} />);

    expect(container.querySelectorAll("p")).toHaveLength(1); // só o rodapé com a data
    expect(container.textContent).not.toMatch(/sem resumo|indisponível|—\s*$/i);
  });

  it("com resumo o bloco existe", () => {
    const { container } = render(<PostCard post={base} />);

    expect(screen.getByText(base.summary)).toBeInTheDocument();
    expect(container.querySelectorAll("p")).toHaveLength(2);
  });

  // EC-04: a faixa cai para `hairline`, ela NÃO desaparece.
  it("sem categoria a faixa fica hairline e continua presente", () => {
    const { container } = render(
      <PostCard post={{ ...base, category: undefined }} />,
    );
    const stripe = stripeOf(container);

    expect(stripe).not.toBeNull();
    expect(stripe).toHaveClass("bg-hairline");
  });

  it.each([
    ["Front-end", "bg-flame"],
    ["Back-end", "bg-mint"],
    ["Ferramentas", "bg-sun"],
    ["Design", "bg-ink-blue"],
    ["Programação", "bg-ink"],
  ])("categoria %s pinta a faixa com %s", (category, expected) => {
    const { container } = render(<PostCard post={{ ...base, category }} />);

    expect(stripeOf(container)).toHaveClass(expected);
  });

  it("categoria fora das cinco cai para hairline em vez de quebrar", () => {
    const { container } = render(
      <PostCard post={{ ...base, category: "Inexistente" }} />,
    );

    expect(stripeOf(container)).toHaveClass("bg-hairline");
  });

  // EC-02: o título é truncado por limite de linhas, não por corte de string — cortar a string
  // mudaria o dado; `line-clamp` mantém o texto completo no DOM para leitor de tela.
  it("título longo é truncado por limite de linhas, mantendo o texto no DOM", () => {
    const longTitle = "palavra ".repeat(60).trim();
    render(<PostCard post={{ ...base, title: longTitle }} />);

    const link = screen.getByRole("link", { name: longTitle });
    expect(link).toHaveClass("line-clamp-3");
    expect(link.textContent).toBe(longTitle);
  });

  it("sem série a pílula de série não aparece", () => {
    render(<PostCard post={{ ...base, series: undefined }} />);

    expect(screen.queryByText(/Série/)).toBeNull();
  });

  it("sem tags nenhuma pílula de tag aparece", () => {
    render(<PostCard post={{ ...base, tags: [] }} />);

    expect(screen.queryByRole("link", { name: /^#/ })).toBeNull();
  });

  // FR-041 exige contraste verificado em TODA variante de superfície entregue. Na escura o texto
  // principal é branco (permitido sobre `ink`) e o secundário é `sand` — `ink-soft` sobre `ink`
  // seria texto escuro sobre fundo escuro.
  it.each([
    ["light", "bg-paper", "text-ink"],
    ["dark", "bg-ink", "text-white"],
  ] as const)("a superfície %s usa %s com %s", (surface, background, text) => {
    const { container } = render(<PostCard post={base} surface={surface} />);
    const card = container.firstElementChild;

    expect(card).toHaveClass(background);
    expect(card).toHaveClass(text);
  });

  it("a superfície escura nunca usa ink-soft no texto secundário", () => {
    const { container } = render(<PostCard post={base} surface="dark" />);

    expect(container.querySelector(".text-ink-soft")).toBeNull();
  });
});
