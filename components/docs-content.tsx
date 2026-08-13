import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Mermaid } from "./mermaid";

export function DocsContent({ source }: { source: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none prose-pre:bg-[var(--terminal-bg)] prose-pre:text-[var(--terminal-fg)] prose-pre:border prose-pre:border-border prose-headings:scroll-mt-20 prose-a:text-accent hover:prose-a:underline">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
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
