import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Toc, { type TocItem } from "./Toc";

const items: TocItem[] = [
  { id: "introducao", text: "Introdução", level: 1 },
  { id: "detalhes", text: "Detalhes", level: 2 },
  { id: "conclusao", text: "Conclusão", level: 1 },
];

// `IntersectionObserver` não existe em jsdom. O dublê guarda a chamada de retorno para que o
// teste possa DIRIGIR a rolagem — sem ele, "o item ativo muda com a rolagem" só seria
// verificável a olho, e o Princípio IV não aceita inspeção no lugar de asserção.
let notifyIntersection: ((entries: IntersectionObserverEntry[]) => void) | undefined;

const scrollTo = (id: string) => {
  act(() => {
    notifyIntersection?.([
      { isIntersecting: true, target: { id } } as unknown as IntersectionObserverEntry,
    ]);
  });
};

beforeEach(() => {
  notifyIntersection = undefined;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        notifyIntersection = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const trigger = () => screen.getByRole("button", { name: /sumário/i });

describe("Toc", () => {
  it("lista um link real por título", () => {
    render(<Toc items={items} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    links.forEach((link) => {
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href");
    });
  });

  // CHK031: nome de região próprio, senão `landmark-unique` reprova ao lado das outras navegações.
  it("a região tem nome acessível próprio", () => {
    render(<Toc items={items} />);

    expect(screen.getByRole("navigation")).toHaveAccessibleName("Sumário");
  });

  // EC-09, primeira metade.
  it("com um único título renderiza normalmente", () => {
    render(<Toc items={[items[0]]} />);

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  // EC-09, segunda metade: nunca uma casca vazia.
  it("sem nenhum título o componente não é renderizado", () => {
    const { container } = render(<Toc items={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  describe("barra recolhível do celular (FR-027)", () => {
    it("começa recolhida e o gatilho anuncia isso", () => {
      render(<Toc items={items} />);

      expect(trigger()).toHaveAttribute("aria-expanded", "false");
    });

    it("clique no gatilho abre a lista", () => {
      render(<Toc items={items} />);

      fireEvent.click(trigger());

      expect(trigger()).toHaveAttribute("aria-expanded", "true");
      expect(trigger()).toHaveAccessibleName("Recolher o sumário");
    });

    it("clique de volta recolhe", () => {
      render(<Toc items={items} />);

      fireEvent.click(trigger());
      fireEvent.click(trigger());

      expect(trigger()).toHaveAttribute("aria-expanded", "false");
      expect(trigger()).toHaveAccessibleName("Abrir o sumário");
    });

    // Em jsdom não há CSS, então o que se assere é o MECANISMO da troca — a classe que esconde a
    // lista. Que ela some de fato da tela é provado em navegador real, no Portão 4.
    it("a lista fica escondida enquanto recolhida e aparece ao abrir", () => {
      render(<Toc items={items} />);

      const list = screen.getByRole("list");
      expect(list).toHaveClass("hidden");

      fireEvent.click(trigger());

      expect(list).not.toHaveClass("hidden");
    });

    it("a barra anuncia a posição e o título ativos", () => {
      render(<Toc items={items} />);

      expect(screen.getByText("Sumário · 01 de 03")).toBeInTheDocument();
    });
  });

  describe("item ativo", () => {
    it("sem rolagem o primeiro título é o ativo", () => {
      render(<Toc items={items} />);

      const current = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "location");

      expect(current).toHaveLength(1);
      expect(current[0]).toHaveTextContent("Introdução");
    });

    it("o item ativo muda com a rolagem", () => {
      render(<Toc items={items} />);

      scrollTo("conclusao");

      const current = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "location");

      expect(current).toHaveLength(1);
      expect(current[0]).toHaveTextContent("Conclusão");
      expect(screen.getByText("Sumário · 03 de 03")).toBeInTheDocument();
    });

    // O ativo não pode ser distinguido SÓ por cor: ganha superfície própria e peso 700.
    it("o ativo se distingue por mais do que cor", () => {
      render(<Toc items={items} />);

      const active = screen.getByRole("link", { name: /Introdução/ });
      expect(active).toHaveClass("bg-blush", "font-bold");

      const idle = screen.getByRole("link", { name: /Detalhes/ });
      expect(idle).not.toHaveClass("bg-blush");
    });
  });

  describe("regras transversais de elemento interativo", () => {
    it("o gatilho é um <button> real, não elemento genérico com clique", () => {
      render(<Toc items={items} />);

      expect(trigger().tagName).toBe("BUTTON");
      expect(trigger()).toHaveAttribute("type", "button");
    });

    it("o gatilho é alcançável por teclado", () => {
      render(<Toc items={items} />);

      trigger().focus();
      expect(trigger()).toHaveFocus();
    });

    it("gatilho e links têm alvo de toque de 44px", () => {
      render(<Toc items={items} />);

      expect(trigger()).toHaveClass("size-11");
      screen.getAllByRole("link").forEach((link) => expect(link).toHaveClass("min-h-11"));
    });

    // Composição explícita: o gatilho é o `IconButton` da T006, não um botão redesenhado aqui.
    it("o gatilho é o IconButton do sistema", () => {
      render(<Toc items={items} />);

      expect(trigger()).toHaveClass("size-11", "rounded-full", "border-2", "border-ink");
    });
  });

  it("não usa token da paleta anterior", () => {
    render(<Toc items={items} />);

    const markup = screen.getByRole("navigation").outerHTML;
    expect(markup).not.toMatch(/ink-mute|link-blue|link-hover|text-primary|body-md/);
  });
});
