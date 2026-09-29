import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import type { SearchIndexEntry } from "@/lib/types";
import CommandPalette from "./CommandPalette";

const meta: Meta<typeof CommandPalette> = {
  title: "Components/CommandPalette",
  component: CommandPalette,
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

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

// `open` controlado por propriedade é o que torna os três estados de FR-031 apresentáveis: com
// estado interno, "com resultado" e "vazia" dependeriam de digitar dentro da apresentação.
// A folha é `fixed inset-0`, então ela cobre o canvas da story — é assim que ela aparece de
// verdade, e apresentá-la encaixada num retângulo seria apresentar outra coisa.

const search = (term: string) => async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  // A folha é `fixed`, fora do `canvasElement`; a consulta sai do documento inteiro.
  const screen = within(canvasElement.ownerDocument.body);
  await userEvent.type(screen.getByRole("searchbox"), term);
  return screen;
};

export const Closed: Story = {
  globals: DESKTOP,
  args: { open: false, onOpenChange: () => {}, index },
  play: async ({ canvasElement }) => {
    await atDesktop();

    // Estado FECHADA: nada no documento, nem escondido por CSS.
    await expect(
      within(canvasElement.ownerDocument.body).queryByRole("dialog"),
    ).not.toBeInTheDocument();
  },
};

export const ClosedMobile: Story = {
  globals: MOBILE,
  args: { open: false, onOpenChange: () => {}, index },
  play: async ({ canvasElement }) => {
    await atMobile();

    await expect(
      within(canvasElement.ownerDocument.body).queryByRole("dialog"),
    ).not.toBeInTheDocument();
  },
};

export const WithResults: Story = {
  globals: DESKTOP,
  args: { open: true, onOpenChange: () => {}, index },
  play: async (context) => {
    await atDesktop();
    const screen = await search("memo")(context);

    await expect(screen.getAllByRole("link")).toHaveLength(2);
  },
};

export const WithResultsMobile: Story = {
  globals: MOBILE,
  args: { open: true, onOpenChange: () => {}, index },
  play: async (context) => {
    await atMobile();
    const screen = await search("memo")(context);

    await expect(screen.getAllByRole("link")).toHaveLength(2);
  },
};

export const NoMatch: Story = {
  globals: DESKTOP,
  args: { open: true, onOpenChange: () => {}, index },
  play: async (context) => {
    await atDesktop();
    const screen = await search("zzzzz")(context);

    await expect(screen.getByText("Nada com essa palavra, ainda")).toBeVisible();
  },
};

export const NoMatchMobile: Story = {
  globals: MOBILE,
  args: { open: true, onOpenChange: () => {}, index },
  play: async (context) => {
    await atMobile();
    const screen = await search("zzzzz")(context);

    await expect(screen.getByText("Nada com essa palavra, ainda")).toBeVisible();
  },
};

// EC-11: índice ausente cai no mesmo convite que a busca sem correspondência.
export const EmptyIndex: Story = {
  globals: DESKTOP,
  args: { open: true, onOpenChange: () => {}, index: [] },
  play: async (context) => {
    await atDesktop();
    const screen = await search("memo")(context);

    await expect(screen.getByText("Nada com essa palavra, ainda")).toBeVisible();
  },
};

export const EmptyIndexMobile: Story = {
  globals: MOBILE,
  args: { open: true, onOpenChange: () => {}, index: [] },
  play: async (context) => {
    await atMobile();
    const screen = await search("memo")(context);

    await expect(screen.getByText("Nada com essa palavra, ainda")).toBeVisible();
  },
};

// Uma entrada de hover, só em 1280px (FR-018a).
export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  args: { open: true, onOpenChange: () => {}, index },
};
