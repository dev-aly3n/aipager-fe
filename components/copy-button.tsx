"use client";

import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`inline-flex items-center gap-1.5 transition-colors duration-200 ${className}`}
    >
      {copied ? (
        <>
          <Check size={14} className="text-success" />
          <span className="text-xs text-success font-medium">Copied!</span>
        </>
      ) : (
        <Copy size={14} className="text-dim hover:text-foreground" />
      )}
    </button>
  );
}
