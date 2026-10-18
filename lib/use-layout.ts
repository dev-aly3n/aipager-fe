"use client";

import { useSyncExternalStore } from "react";
import { decideLayout, type Layout } from "./layout";

let current: Layout | null = null;
const listeners = new Set<() => void>();

function read(): Layout {
  return decideLayout(window.innerWidth);
}

function onResize(): void {
  const next = read();
  if (next === current) return;
  current = next;
  document.documentElement.dataset.layout = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  if (listeners.size === 0) window.addEventListener("resize", onResize);
  listeners.add(l);
  return () => {
    listeners.delete(l);
    if (listeners.size === 0) window.removeEventListener("resize", onResize);
  };
}

function snapshot(): Layout {
  if (current === null) current = read();
  return current;
}

/**
 * The layout, for React. The server cannot see the screen, so it (and the
 * first render in the browser, which has to match it) gets null; the real
 * value follows a moment later.
 */
export function useLayout(): Layout | null {
  return useSyncExternalStore(subscribe, snapshot, () => null);
}
