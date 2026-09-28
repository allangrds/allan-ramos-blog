import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import CopyLinkButton from "./CopyLinkButton";

const url = "https://allanramos.dev/posts/react-compilado";

const stubClipboard = (writeText: () => Promise<void>) => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CopyLinkButton", () => {
  it("em repouso oferece a ação", () => {
    stubClipboard(() => Promise.resolve());
    render(<CopyLinkButton url={url} />);

    expect(screen.getByRole("button")).toHaveTextContent("Compartilhar o link");
  });

  it("clique copia a url recebida e entra em copiado", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    render(<CopyLinkButton url={url} />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Copiado!");
    });
    expect(writeText).toHaveBeenCalledWith(url);
  });

  // EC-08
  it("cópia negada não entra em copiado e não lança erro", async () => {
    stubClipboard(() => Promise.reject(new Error("NotAllowedError")));
    render(<CopyLinkButton url={url} />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Compartilhar o link");
    });
  });

  it("tem alvo de toque de 44px", () => {
    stubClipboard(() => Promise.resolve());
    render(<CopyLinkButton url={url} />);

    expect(screen.getByRole("button")).toHaveClass("min-h-11");
  });

  it("não usa token da paleta anterior", () => {
    stubClipboard(() => Promise.resolve());
    render(<CopyLinkButton url={url} />);

    const classes = screen.getByRole("button").className;
    expect(classes).not.toMatch(/ink-mute|primary/);
  });
});
