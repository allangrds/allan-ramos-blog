import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import ShareButtons from "./ShareButtons";

const url = "https://allanramos.dev/posts/react-compilado";
const title = "React compilado";

// `CopyLinkButton` é a ilha cliente que este componente compõe, e ela lê `navigator.clipboard`,
// que não existe em jsdom. O dublê não é o objeto deste teste — EC-08 é coberto na T035.
beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: () => Promise.resolve() },
    configurable: true,
  });
});

describe("ShareButtons", () => {
  // FR-028 / US6/AS-5.
  it("oferece as três ações", () => {
    render(<ShareButtons url={url} title={title} />);

    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Compartilhar o link" })).toBeInTheDocument();
  });

  // O nome da rede é ESCRITO, não só o ícone — é o que AS-5 cobra.
  it.each(["GitHub", "LinkedIn"])("a ação %s traz o nome da rede em texto", (network) => {
    render(<ShareButtons url={url} title={title} />);

    expect(screen.getByRole("link", { name: network })).toHaveTextContent(network);
  });

  it("as duas primeiras ações são links reais", () => {
    render(<ShareButtons url={url} title={title} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  it("o ícone de cada marca é escondido de tecnologia assistiva", () => {
    render(<ShareButtons url={url} title={title} />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });
  });

  // O grupo é o consumidor de `title`: é o post que está sendo compartilhado.
  it("o grupo é nomeado pelo título recebido", () => {
    render(<ShareButtons url={url} title={title} />);

    expect(screen.getByRole("group")).toHaveAccessibleName(`Compartilhar “${title}”`);
  });

  it("a terceira ação recebe a url recebida", () => {
    render(<ShareButtons url={url} title={title} />);

    // O `CopyLinkButton` não expõe a url na marcação: o que se assere é que ele foi composto,
    // e o clique que copia `url` é provado no teste da T035.
    expect(screen.getByRole("button", { name: "Compartilhar o link" }).tagName).toBe("BUTTON");
  });

  it("toda ação tem alvo de toque de 44px", () => {
    render(<ShareButtons url={url} title={title} />);

    [...screen.getAllByRole("link"), screen.getByRole("button")].forEach((action) =>
      expect(action).toHaveClass("min-h-11"),
    );
  });

  // SC-004 régua 1: a cor das marcas vem da superfície, nunca de hex dentro do componente.
  it("os SVG de marca não carregam cor própria", () => {
    render(<ShareButtons url={url} title={title} />);

    screen.getAllByRole("link").forEach((link) => {
      expect(link.querySelector("svg")).toHaveAttribute("fill", "currentColor");
      expect(link.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    });
  });

  it("não usa token da paleta anterior", () => {
    render(<ShareButtons url={url} title={title} />);

    expect(screen.getByRole("group").outerHTML).not.toMatch(
      /link-blue|link-hover|text-caption|ink-mute/,
    );
  });
});
