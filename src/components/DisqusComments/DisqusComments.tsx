"use client";

import { useEffect, useRef } from "react";

export type DisqusCommentsProps = {
  shortname: string;
  slug: string;
  title: string;
};

declare global {
  interface Window {
    disqus_config?: () => void;
    DISQUS?: { reset: (options: unknown) => void };
  }
}

export default function DisqusComments({
  shortname,
  slug,
  title,
}: DisqusCommentsProps) {
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = `${window.location.origin}/posts/${slug}`;

    window.disqus_config = function (this: {
      page: { url: string; identifier: string; title: string };
    }) {
      this.page.url = url;
      this.page.identifier = slug;
      this.page.title = title;
    };

    const script = document.createElement("script");
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", String(Date.now()));
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [shortname, slug, title]);

  return <div id="disqus_thread" ref={threadRef} />;
}
