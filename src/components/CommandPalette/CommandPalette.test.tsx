import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { SearchIndexEntry } from "@/lib/types";
import CommandPalette from "./CommandPalette";

const index: SearchIndexEntry[] = [
  {
    slug: "react-compilado",
    title: "React será compilado",
    summary: "O compilador e o fim da anotação manual.",
    tags: ["react"],
    bodyText: "memo memo memo deixa de ser necessário",
  },
  {
    slug: "use-effect",
    title: "useEffect vs useLayoutEffect",
    summary: "Quando cada um roda.",
    tags: ["react"],
    bodyText: "memo de leitura",
  },
];

const type = (value: string) =>
  fireEvent.change(screen.getByRole("searchbox"), { target: { value } });

describe("CommandPalette", () => {
  // FR-031, estado FECHADA: nada no documento.
  it("fechada não renderiza nada", () => {
    const { container } = render(
      <CommandPalette open={false} onOpenChange={() => {}} index={index} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("aberta é um diálogo modal nomeado", () => {
    render(<CommandPalette open onOpenChange={() => {}} index={index} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Buscar");
  });

  it("o campo de busca tem rótulo real", () => {
    render(<CommandPalette open onOpenChange={() => {}} index={index} />);

    expect(screen.getByRole("searchbox")).toHaveAccessibleName("Buscar");
  });

  describe("teclado", () => {
    it("⌘K abre quando está fechada", () => {
      const onOpenChange = vi.fn();
      render(<CommandPalette open={false} onOpenChange={onOpenChange} index={index} />);

      fireEvent.keyDown(document, { key: "k", metaKey: true });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("ctrl+K também abre, para quem não está no mac", () => {
      const onOpenChange = vi.fn();
      render(<CommandPalette open={false} onOpenChange={onOpenChange} index={index} />);

      fireEvent.keyDown(document, { key: "K", ctrlKey: true });

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it("esc fecha quando está aberta", () => {
      const onOpenChange = vi.fn();
      render(<CommandPalette open onOpenChange={onOpenChange} index={index} />);

      fireEvent.keyDown(document, { key: "Escape" });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("esc não faz nada quando já está fechada", () => {
      const onOpenChange = vi.fn();
      render(<CommandPalette open={false} onOpenChange={onOpenChange} index={index} />);

      fireEvent.keyDown(document, { key: "Escape" });

      expect(onOpenChange).not.toHaveBeenCalled();
    });
  });

  // US7/AS-2: em 390px quem fecha é o ×, em lugar da tecla de escape.
  it("o × fecha a folha", () => {
    const onOpenChange = vi.fn();
    render(<CommandPalette open onOpenChange={onOpenChange} index={index} />);

    fireEvent.click(screen.getByRole("button", { name: "Fechar a busca" }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  describe("estados de resultado (FR-031)", () => {
    it("com resultado lista os posts que casam", () => {
      render(<CommandPalette open onOpenChange={() => {}} index={index} />);

      type("compilado");

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute("href", "/posts/react-compilado");
    });

    it("a contagem de trechos conta as ocorrências de verdade", () => {
      render(<CommandPalette open onOpenChange={() => {}} index={index} />);

      type("memo");

      expect(screen.getByText("3 trechos")).toBeInTheDocument();
      expect(screen.getByText("1 trecho")).toBeInTheDocument();
    });

    it("vazia: busca sem correspondência cai no convite", () => {
      render(<CommandPalette open onOpenChange={() => {}} index={index} />);

      type("zzzzz");

      expect(screen.queryAllByRole("link")).toHaveLength(0);
      expect(screen.getByText("Nada com essa palavra, ainda")).toBeInTheDocument();
    });

    // EC-11: índice vazio ou ausente cai no mesmo convite.
    it.each([
      ["vazio", [] as SearchIndexEntry[]],
      ["ausente", undefined],
    ])("EC-11: índice %s cai no convite", (_label, value) => {
      render(<CommandPalette open onOpenChange={() => {}} index={value} />);

      type("memo");

      expect(screen.queryAllByRole("link")).toHaveLength(0);
      expect(screen.getByText("Nada com essa palavra, ainda")).toBeInTheDocument();
    });

    // FR-032: em NENHUM estado aparece contagem de resultados.
    it.each(["", "zzzzz", "memo"])(
      "com a busca %o o DOM não exibe contagem de resultados",
      (value) => {
        const { container } = render(
          <CommandPalette open onOpenChange={() => {}} index={index} />,
        );

        if (value) type(value);

        expect(container.textContent).not.toMatch(/\d+\s*resultado/i);
        expect(container.textContent).not.toMatch(/nenhum resultado|sem resultados/i);
      },
    );
  });

  it("clicar num resultado fecha a folha", () => {
    const onOpenChange = vi.fn();
    render(<CommandPalette open onOpenChange={onOpenChange} index={index} />);

    type("compilado");
    fireEvent.click(screen.getByRole("link"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("o × e o campo têm alvo de toque de 44px", () => {
    render(<CommandPalette open onOpenChange={() => {}} index={index} />);

    expect(screen.getByRole("button", { name: "Fechar a busca" })).toHaveClass("size-11");
    expect(screen.getByRole("searchbox")).toHaveClass("min-h-11");
  });

  it("não usa token da paleta anterior", () => {
    const { container } = render(
      <CommandPalette open onOpenChange={() => {}} index={index} />,
    );

    expect(container.innerHTML).not.toMatch(/ink-mute|link-blue|body-md|text-caption|primary/);
  });
});
