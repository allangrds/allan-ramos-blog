import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Post } from "@/lib/types";
import FeaturedPostCard, { type FeaturedAccent } from "./FeaturedPostCard";

const base: Post = {
  title: "React será compilado",
  date: "2024-02-22",
  slug: "react-compilado",
  summary: "Você pode esquecer a memoização.",
  tags: ["react"],
  category: "Front-end",
  body: "",
};

describe("FeaturedPostCard", () => {
  // O ponto de maior risco de contraste da feature. Título branco sobre `sun` dá 1,59:1 e sobre
  // `mint` 2,34:1 — reprovam ATÉ o limite relaxado de 3:1. Este teste existe para que tornar o
  // título branco REPROVE, em qualquer das três cores de acento.
  it.each(["sun", "flame", "mint"] as FeaturedAccent[])(
    "o título é ink sobre o acento %s, nunca branco",
    (accent) => {
      render(<FeaturedPostCard post={base} accent={accent} />);

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveClass("text-ink");
      expect(heading).not.toHaveClass("text-white");
    },
  );

  it.each([
    ["sun", "bg-sun"],
    ["flame", "bg-flame"],
    ["mint", "bg-mint"],
  ] as [FeaturedAccent, string][])("o acento %s pinta a superfície com %s", (accent, expected) => {
    const { container } = render(<FeaturedPostCard post={base} accent={accent} />);

    expect(container.firstElementChild).toHaveClass(expected);
  });

  // Nenhuma superfície do destaque é escura, então branco nunca é permitido em nenhum texto dele.
  it.each(["sun", "flame", "mint"] as FeaturedAccent[])(
    "nenhum texto é branco no acento %s",
    (accent) => {
      const { container } = render(<FeaturedPostCard post={base} accent={accent} />);

      expect(container.querySelector(".text-white")).toBeNull();
    },
  );

  it("o acento padrão é sun", () => {
    const { container } = render(<FeaturedPostCard post={base} />);

    expect(container.firstElementChild).toHaveClass("bg-sun");
  });

  it("o título é link para o post", () => {
    render(<FeaturedPostCard post={base} />);

    expect(screen.getByRole("link", { name: base.title })).toHaveAttribute(
      "href",
      "/posts/react-compilado",
    );
  });

  it("o título usa a escala de display (FR-025)", () => {
    render(<FeaturedPostCard post={base} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("text-display-md");
  });

  // EC-03
  it("resumo ausente sai do DOM", () => {
    render(<FeaturedPostCard post={{ ...base, summary: "" }} />);

    expect(screen.queryByText(base.summary)).toBeNull();
  });
});
