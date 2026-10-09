import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Mermaid } from "./mermaid";

// The plain text of a heading's children (code spans and emphasis included).
function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (typeof node === "object" && "props" in node) {
    return textOf((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

// GitHub's heading anchors, so a link written for the docs on GitHub
// (commands.md#update) lands on the same heading here: lower case, every
// character that is not a letter, digit, space, hyphen or underscore
// dropped, spaces to hyphens, and -1, -2 ... for a repeated heading.
function makeSlugger() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}\p{Pc}\- ]/gu, "")
      .replace(/ /g, "-");
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
}

export function DocsContent({ source }: { source: string }) {
  const slug = makeSlugger();
  const heading = (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") =>
    function Heading({ node: _n, children, ...rest }: { node?: unknown; children?: ReactNode }) {
      return <Tag id={slug(textOf(children))} {...rest}>{children}</Tag>;
    };
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-pre:bg-[var(--terminal-bg)] prose-pre:text-[var(--terminal-fg)] prose-pre:border prose-pre:border-border prose-headings:scroll-mt-20 prose-a:text-accent hover:prose-a:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: heading("h1"),
          h2: heading("h2"),
          h3: heading("h3"),
          h4: heading("h4"),
          h5: heading("h5"),
          h6: heading("h6"),
          // react-markdown passes a `node` prop (the rehype AST node) to
          // every component — destructure it out so it doesn't leak as a
          // DOM attribute. Intercept mermaid code blocks here too.
          // Reference tables (hook payloads, command lists) are wider than a
          // phone. Give each its own scroll container so the page itself
          // never scrolls sideways.
          table({ node: _n, children, ...rest }) {
            return (
              <div className="overflow-x-auto">
                <table {...rest}>{children}</table>
              </div>
            );
          },
          code({ node: _n, className, children, ...rest }) {
            const match = /language-(\w+)/.exec(className || "");
            if (match && match[1] === "mermaid") {
              return <Mermaid source={String(children).trimEnd()} />;
            }
            return (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
