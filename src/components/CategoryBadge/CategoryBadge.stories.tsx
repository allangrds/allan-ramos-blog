import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import CategoryBadge, { type CategoryName } from "./CategoryBadge";

const meta: Meta<typeof CategoryBadge> = {
  title: "Components/CategoryBadge",
  component: CategoryBadge,
};

export default meta;
type Story = StoryObj<typeof CategoryBadge>;

const ALL: CategoryName[] = [
  "Front-end",
  "Back-end",
  "Ferramentas",
  "Design",
  "Programação",
];

// As cinco juntas, como o grupo `AS CINCO` do card as apresenta. Em 390px o rótulo cai para 9px.
const AllFive = () => (
  <div className="flex flex-wrap items-center gap-2">
    {ALL.map((category) => (
      <CategoryBadge key={category} category={category} />
    ))}
  </div>
);

export const AsCinco: Story = {
  globals: DESKTOP,
  play: atDesktop,
  render: () => <AllFive />,
};

export const AsCincoMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  render: () => <AllFive />,
};

export const Single: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { category: "Front-end" },
};

export const SingleMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { category: "Front-end" },
};
