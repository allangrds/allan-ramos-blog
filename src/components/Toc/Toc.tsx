"use client";

import { useEffect, useState } from "react";

export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export type TocProps = {
  items: TocItem[];
};

function useActiveHeadingId(ids: string[]): string | undefined {
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const headingElements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const visibleIds = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIds.add(entry.target.id);
          } else {
            visibleIds.delete(entry.target.id);
          }
        });

        const firstVisibleId = ids.find((id) => visibleIds.has(id));
        if (firstVisibleId) setActiveId(firstVisibleId);
      },
      { rootMargin: "0px 0px -70% 0px" },
    );

    headingElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}

export default function Toc({ items }: TocProps) {
  const activeId = useActiveHeadingId(items.map((item) => item.id));

  if (items.length === 0) return null;

  return (
    <nav aria-label="Sumário" className="text-body-md">
      <p className="text-micro-cap uppercase text-ink-mute mb-2">Sumário</p>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            style={{ marginLeft: (item.level - 1) * 12 }}
            className="py-1"
          >
            <a
              href={`#${item.id}`}
              className={
                item.id === activeId
                  ? "text-primary font-bold"
                  : "text-link-blue hover:text-link-hover"
              }
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
