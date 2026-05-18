"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;

function isDark(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

export function Mermaid({ source }: { source: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark() ? "dark" : "default",
        securityLevel: "strict",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      });
      initialized = true;
    }

    const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`;
    mermaid
      .render(id, source)
      .then(({ svg }) => {
        setSvg(svg);
        setError(null);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "render failed");
      });
  }, [source]);

  if (error) {
    return (
      <pre className="text-xs text-danger whitespace-pre-wrap p-4 border border-danger/30 rounded">
        Mermaid render failed: {error}
        {"\n\n"}
        {source}
      </pre>
    );
  }

  if (svg === null) {
    return (
      <div
        ref={ref}
        className="mermaid-block text-xs text-dim italic py-8 text-center"
        aria-label="Loading diagram"
      >
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="mermaid-block my-6 flex justify-center overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
