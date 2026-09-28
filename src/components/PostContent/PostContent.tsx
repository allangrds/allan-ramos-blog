import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "@/lib/mdx";

export type PostContentProps = {
  body: string;
};

export default async function PostContent({ body }: PostContentProps) {
  const { default: MDXContent } = await evaluate(body, runtime);

  return (
    <div>
      <MDXContent components={mdxComponents} />
    </div>
  );
}
