import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PrevNext from "./PrevNext";

const prev = {
  href: "/posts/diario-full-stack-2",
  title: "Diário Fullstack 2: modelando o schema",
  meta: "Back-end · 22 ago 2022",
};

const next = {
  href: "/posts/diario-full-stack-3",
  title: "Diário Fullstack 3: ACID na prática",
  meta: "Back-end · 06 set 2022",
};

describe("PrevNext", () => {
  it("com os dois vizinhos exibe dois links reais", () => {
    render(<PrevNext prev={prev} next={next} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href");
    });
  });

  it("cada link leva ao vizinho recebido", () => {
    render(<PrevNext prev={prev} next={next} />);

    expect(screen.getByRole("link", { name: /modelando o schema/ })).toHaveAttribute(
      "href",
      prev.href,
    );
    expect(screen.getByRole("link", { name: /ACID na prática/ })).toHaveAttribute(
      "href",
      next.href,
    );
  });

  // Ausência de vizinho omite o lado INTEIRO — nada de espaço reservado para o que não existe.
  it("só anterior: o lado do próximo não é renderizado", () => {
    render(<PrevNext prev={prev} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByText("← Anterior")).toBeInTheDocument();
    expect(screen.queryByText("Próximo →")).not.toBeInTheDocument();
  });

  it("só próximo: o lado do anterior não é renderizado", () => {
    render(<PrevNext next={next} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByText("Próximo →")).toBeInTheDocument();
    expect(screen.queryByText("← Anterior")).not.toBeInTheDocument();
  });

  it("sem vizinho nenhum nada é renderizado", () => {
    const { container } = render(<PrevNext />);

    expect(container).toBeEmptyDOMElement();
  });

  it("a linha de contexto é omitida quando não vem", () => {
    render(<PrevNext next={{ href: next.href, title: next.title }} />);

    expect(screen.queryByText(/Back-end/)).not.toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveTextContent(next.title);
  });

  // O "próximo" é o card escuro do artboard; o texto sobre `ink` é branco (18.69).
  it("o próximo usa fundo ink com texto branco", () => {
    render(<PrevNext next={next} />);

    expect(screen.getByRole("link")).toHaveClass("bg-ink", "text-white");
  });

  it("a região tem nome acessível próprio", () => {
    render(<PrevNext prev={prev} next={next} />);

    expect(screen.getByRole("navigation")).toHaveAccessibleName("Posts vizinhos");
  });

  it("não usa token da paleta anterior", () => {
    const { container } = render(<PrevNext prev={prev} next={next} />);

    expect(container.innerHTML).not.toMatch(/ink-mute|link-blue|link-hover|body-md|text-caption/);
  });
});
