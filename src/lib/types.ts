export type Post = {
  title: string;
  date: string;
  slug: string;
  summary: string;
  tags: string[];
  category?: string;
  series?: string;
  seriesOrder?: number;
  coverImage?: string;
  body: string;
};

export type Tag = {
  name: string;
  posts: Post[];
};

export type Category = {
  name: string;
  posts: Post[];
};

export type Series = {
  name: string;
  posts: Post[];
};

export type SearchIndexEntry = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  bodyText: string;
};
