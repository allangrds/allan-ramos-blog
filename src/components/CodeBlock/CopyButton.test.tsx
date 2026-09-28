import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import CopyButton from "./CopyButton";

// `navigator.clipboard` NÃO existe em jsdom por padrão, então o dublê não é conveniência: é o que
// torna EC-08 testável. Caso de borda declarado da spec, não cenário impossível.
const stubClipboard = (writeText: () => Promise<void>) => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CopyButton", () => {
  it("em repouso oferece a ação de copiar", () => {
    stubClipboard(() => Promise.resolve());
    render(<CopyButton code="const x = 1;" />);

    expect(screen.getByRole("button", { name: /Copiar/ })).toHaveTextContent("Copiar");
  });

  // FR-026/US6/AS-2: retorno VISÍVEL do estado "copiado".
  it("clique entra em copiado com retorno visível", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    render(<CopyButton code="const x = 1;" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Copiado!");
    });
    expect(writeText).toHaveBeenCalledWith("const x = 1;");
  });

  // EC-08: cópia NEGADA pelo navegador. O componente não entra em "copiado" e não lança erro ao
  // leitor — dizer "Copiado!" sem ter copiado é pior que não copiar.
  it("cópia negada não entra em copiado e não lança erro", async () => {
    stubClipboard(() => Promise.reject(new Error("NotAllowedError")));
    render(<CopyButton code="const x = 1;" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Copiar");
    });
    expect(screen.getByRole("button")).not.toHaveTextContent("Copiado!");
  });

  it("API de área de transferência ausente também não quebra", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: undefined,
      configurable: true,
    });
    render(<CopyButton code="const x = 1;" />);

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByRole("button")).toHaveTextContent("Copiar");
    });
  });

  it("tem alvo de toque de 44px", () => {
    stubClipboard(() => Promise.resolve());
    render(<CopyButton code="x" />);

    expect(screen.getByRole("button")).toHaveClass("min-h-11");
  });
});
