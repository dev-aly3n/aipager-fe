"use client";

import { useEffect, useRef, useState } from "react";
import {
  PERM_AT,
  PERM_HOLD,
  SCENARIO_END,
  stateAt,
  type MirrorState,
} from "./scenario";

const TICK_MS = 120;

export type Mirror = {
  state: MirrorState;
  // Virtual scenario time — sub-second animations (spinner glyphs, caret)
  // are CSS; anything stateful derives from this.
  v: number;
  // True while the scenario is paused on the permission prompt waiting for a
  // tap (it self-resolves after PERM_HOLD if the visitor doesn't).
  holding: boolean;
  allow: () => void;
};

// All timing state lives in two refs: when the loop started (real time) and
// when the permission was resolved (real time, null while unresolved).
// Virtual time is a pure function of those, so switching tabs, replays and
// the tap/auto race can't corrupt anything — there is nothing to corrupt.
export function useMirror(): Mirror {
  const [clock, setClock] = useState(0);
  const startRef = useRef<number | null>(null);
  const resolvedRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = performance.now();
    const iv = setInterval(() => setClock((c) => c + 1), TICK_MS);
    return () => clearInterval(iv);
  }, []);

  void clock; // re-render trigger; the render below re-reads the real clock

  const now = performance.now();
  const start = startRef.current ?? now;
  const r = now - start;

  let v: number;
  let holding = false;
  if (r < PERM_AT) {
    v = r;
  } else if (resolvedRef.current == null) {
    if (r - PERM_AT >= PERM_HOLD) {
      resolvedRef.current = r;
      v = PERM_AT;
    } else {
      v = PERM_AT;
      holding = true;
    }
  } else {
    v = PERM_AT + (r - resolvedRef.current);
  }

  if (v >= SCENARIO_END) {
    startRef.current = now;
    resolvedRef.current = null;
    v = 0;
    holding = false;
  }

  const allow = () => {
    if (resolvedRef.current == null && startRef.current != null) {
      const rr = performance.now() - startRef.current;
      if (rr >= PERM_AT) resolvedRef.current = rr;
    }
  };

  return { state: stateAt(v), v, holding, allow };
}
