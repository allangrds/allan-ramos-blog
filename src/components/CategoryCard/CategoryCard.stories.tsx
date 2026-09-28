import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DESKTOP, MOBILE, atDesktop, atMobile } from "@/story-viewport";
import CategoryCard from "./CategoryCard";
import type { CategoryName } from "@/components/CategoryBadge/CategoryBadge";

const meta: Meta<typeof CategoryCard> = {
  title: "Components/CategoryCard",
  component: CategoryCard,
};

export default meta;
type Story = StoryObj<typeof CategoryCard>;

const ALL: CategoryName[] = [
  "Front-end",
  "Back-end",
  "Ferramentas",
  "Design",
  "Programação",
];

const titles = ["React será compilado", "Axios ou fetch()", "useEffect vs useLayoutEffect"];

// As cinco juntas: cada uma é uma superfície entregue, e a contagem em display fica sobre ela.
const AllFive = () => (
  <div className="flex flex-wrap gap-3">
    {ALL.map((category, position) => (
      <CategoryCard
        key={category}
        category={category}
        count={position + 1}
        titles={titles}
      />
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
  args: { category: "Front-end", count: 3, titles },
};

export const SingleMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { category: "Front-end", count: 3, titles },
};

// Sem títulos: o bloco sai do DOM em vez de deixar lacuna.
export const WithoutTitles: Story = {
  globals: DESKTOP,
  play: atDesktop,
  args: { category: "Design", count: 0 },
};

export const WithoutTitlesMobile: Story = {
  globals: MOBILE,
  play: atMobile,
  args: { category: "Design", count: 0 },
};

export const Hover: Story = {
  globals: DESKTOP,
  parameters: { pseudo: { hover: true } },
  render: () => <AllFive />,
};
