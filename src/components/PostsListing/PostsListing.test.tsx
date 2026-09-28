import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Post } from "@/lib/types";
import PostsListingView from "./PostsListingView";

const makePost = (index: number): Post => ({
  title: `Post ${index}`,
  date: "2024-01-10",
  slug: `post-${index}`,
  summary: "Resumo.",
  tags: [],
  category: "Front-end",
  body: "",
});

const posts = [1, 2, 3].map(makePost);

describe("PostsListingView", () => {
  // Compõe PostCard, FeaturedPostCard e Pagination sem redesenhar nenhum dos três.
  it("na primeira página o primeiro post vira destaque e os demais viram cards", () => {
    render(<PostsListingView posts={posts} page={1} totalPages={3} />);

    expect(screen.getByText("Último post")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Post 1" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("a partir da segunda página não há destaque", () => {
    render(<PostsListingView posts={posts} page={2} totalPages={3} />);

    expect(screen.queryByText("Último post")).toBeNull();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("compõe a paginação com a página e o total recebidos", () => {
    render(<PostsListingView posts={posts} page={2} totalPages={3} />);

    expect(screen.getByRole("navigation", { name: "Paginação" })).toBeInTheDocument();
    expect(screen.getByText("2 de 3")).toBeInTheDocument();
  });

  // Lista vazia NÃO renderiza paginação órfã. Isto é diferente de EC-05, onde HÁ posts numa única
  // página e a paginação aparece desabilitada de propósito.
  it("lista vazia não renderiza paginação órfã", () => {
    render(<PostsListingView posts={[]} page={1} totalPages={1} />);

    expect(screen.queryByRole("navigation", { name: "Paginação" })).toBeNull();
    expect(screen.getByText("Nenhum post encontrado.")).toBeInTheDocument();
  });

  it("com posts numa única página a paginação aparece, desabilitada (EC-05)", () => {
    render(<PostsListingView posts={posts} page={1} totalPages={1} />);

    expect(screen.getByRole("navigation", { name: "Paginação" })).toBeInTheDocument();
    expect(screen.getByText("1 de 1")).toBeInTheDocument();
  });

  it("página fora da faixa não quebra a renderização", () => {
    render(<PostsListingView posts={posts} page={99} totalPages={3} />);

    expect(screen.getAllByRole("article")).toHaveLength(3);
    expect(screen.getByText("99 de 3")).toBeInTheDocument();
  });

  it("não usa token da paleta anterior na mensagem de lista vazia", () => {
    render(<PostsListingView posts={[]} page={1} totalPages={1} />);

    const message = screen.getByText("Nenhum post encontrado.");
    expect(message).toHaveClass("text-ink-soft");
    expect(message).not.toHaveClass("text-ink-mute");
  });
});
