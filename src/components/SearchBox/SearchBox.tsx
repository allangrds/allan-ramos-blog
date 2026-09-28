"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { SearchIndexEntry } from "@/lib/types";
import { searchIndex } from "@/lib/search";

export type SearchBoxProps = {
  index: SearchIndexEntry[];
};

export default function SearchBox({ index }: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchIndex(index, query), [index, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar posts..."
        className="w-full rounded-pill border border-hairline px-4 py-2 text-body-md text-ink focus:outline-none focus:border-primary"
      />
      <ul className="mt-6">
        {query.trim() === "" ? null : results.length === 0 ? (
          <li className="text-body-md text-ink-mute">
            Nenhum post encontrado.
          </li>
        ) : (
          results.map((entry) => (
            <li key={entry.slug} className="border-b border-hairline py-4">
              <Link
                href={`/posts/${entry.slug}`}
                className="text-heading-sm font-semibold text-ink hover:text-primary"
              >
                {entry.title}
              </Link>
              <p className="text-body-md text-ink-mute mt-1">
                {entry.summary}
              </p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
