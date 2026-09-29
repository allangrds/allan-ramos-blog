import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LikeCommentBar from "./LikeCommentBar";

describe("LikeCommentBar", () => {
  it("exibe exatamente as contagens recebidas", () => {
    render(<LikeCommentBar likes={142} comments={12} />);

    expect(screen.getByText("142 curtidas")).toBeInTheDocument();
    expect(screen.getByText("12 comentários")).toBeInTheDocument();
  });

  it("contagens zeradas são exibidas como zero, não omitidas", () => {
    render(<LikeCommentBar likes={0} comments={0} />);

    expect(screen.getByText("0 curtidas")).toBeInTheDocument();
    expect(screen.getByText("0 comentários")).toBeInTheDocument();
  });

  it("o singular concorda com a contagem", () => {
    render(<LikeCommentBar likes={1} comments={1} />);

    expect(screen.getByText("1 curtida")).toBeInTheDocument();
    expect(screen.getByText("1 comentário")).toBeInTheDocument();
  });

  // FR-031b: só leitura. Nenhum controle, porque não há ação por trás de nenhum deles.
  it("não oferece controle nenhum", () => {
    render(<LikeCommentBar likes={142} comments={12} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  // FR-031b: nenhuma escrita, nenhuma rede — nem na montagem.
  it("não faz requisição de rede ao renderizar", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    render(<LikeCommentBar likes={142} comments={12} />);

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("os ícones são escondidos de tecnologia assistiva", () => {
    const { container } = render(<LikeCommentBar likes={1} comments={1} />);

    const icons = container.querySelectorAll("svg");
    expect(icons).toHaveLength(2);
    icons.forEach((icon) => expect(icon).toHaveAttribute("aria-hidden", "true"));
  });

  it("não usa token da paleta anterior", () => {
    const { container } = render(<LikeCommentBar likes={1} comments={1} />);

    expect(container.innerHTML).not.toMatch(/ink-mute|link-blue|body-md|text-caption|primary/);
  });
});
