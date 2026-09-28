import type { MDXComponents } from "mdx/types";
import type { ReactElement, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { slugifyHeading } from "./toc";
import CodeBlock from "@/components/CodeBlock/CodeBlock";

function headingId(children: ReactNode): string | undefined {
  return typeof children === "string" ? slugifyHeading(children) : undefined;
}

function extractCodeProps(children: ReactNode): { code: string; language: string } {
  const codeElement = children as ReactElement<{ className?: string; children?: string }>;
  const className = codeElement?.props?.className ?? "";
  const language = className.match(/language-(\S+)/)?.[1] ?? "";
  const code = String(codeElement?.props?.children ?? "").replace(/\n$/, "");
  return { code, language };
}

/**
 * Shared component mapping applied when rendering compiled MDX post bodies:
 * headings, code blocks, images, and links per FR-003.
 */
export const mdxComponents: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 id={headingId(children)} className="text-heading-lg font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      id={headingId(children)}
      className="text-heading-md font-semibold mt-10"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      id={headingId(children)}
      className="text-heading-sm font-semibold mt-8"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      id={headingId(children)}
      className="text-body-strong font-semibold mt-6"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5
      id={headingId(children)}
      className="text-body-md font-semibold mt-6"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6
      id={headingId(children)}
      className="text-body-md font-semibold uppercase mt-6"
      {...props}
    >
      {children}
    </h6>
  ),
  p: (props) => <p className="text-body-md mt-4" {...props} />,
  ul: (props) => <ul className="list-disc pl-6 mt-4 space-y-2" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 mt-4 space-y-2" {...props} />,
  li: (props) => <li className="text-body-md" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="border-l-4 border-primary bg-canvas-cream/50 pl-4 py-2 mt-4 italic text-ink-mute"
      {...props}
    />
  ),
  code: (props) => (
    <code className="rounded-sm bg-canvas-cream px-1 py-0.5" {...props} />
  ),
  pre: ({ children }) => {
    const { code, language } = extractCodeProps(children);
    return (
      <div className="mt-4">
        <CodeBlock code={code} language={language} />
      </div>
    );
  },
  img: (props) => (
    // eslint-disable-next-line jsx-a11y/alt-text -- alt comes through from MDX source
    <Image
      src={props.src ?? ""}
      alt={props.alt ?? ""}
      width={800}
      height={450}
      className="rounded-lg mt-4"
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
    />
  ),
  a: ({ href, ...props }) => (
    <Link
      href={href ?? "#"}
      className="text-link-blue hover:text-link-hover"
      {...props}
    />
  ),
};
