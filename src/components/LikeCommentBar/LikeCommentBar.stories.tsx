import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import LikeCommentBar from "./LikeCommentBar";

const meta: Meta<typeof LikeCommentBar> = {
  title: "Components/LikeCommentBar",
  component: LikeCommentBar,
};

export default meta;
type Story = StoryObj<typeof LikeCommentBar>;

// Os dois estados da tarefa: contagens com valor e contagens zeradas. Sem card no
// `ComponentesMobile`; a apresentação de 390px sai de `MobilePost.dc.html`.
// Sem elemento interativo (FR-031b), logo sem entrada de hover.

export const WithCounts: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { likes: 142, comments: 12 },
};

export const WithCountsMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { likes: 142, comments: 12 },
};

export const Empty: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { likes: 0, comments: 0 },
};

export const EmptyMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { likes: 0, comments: 0 },
};
