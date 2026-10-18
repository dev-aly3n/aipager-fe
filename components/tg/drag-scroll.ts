"use client";

import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

/**
 * Scrolling by dragging, the way a phone scrolls. Used by the conversation
 * and by the terminal, neither of which takes the wheel: a reader scrolling
 * the page past them is never caught by one.
 *
 * Throw it and it keeps going: the speed of the last moments before you let
 * go, bleeding away until it is slower than half a pixel a frame or it
 * reaches an end.
 */

/** The fastest a flick can leave, in pixels per millisecond. */
const MAX_V = 4;
/** What is left of that speed after one millisecond. */
const DECAY = 0.9955;
/** Below this it has stopped, in pixels per millisecond. */
const REST = 0.03;
/** Movement older than this says nothing about how fast you let go. */
const RECENT_MS = 90;

interface Grab {
  y: number;
  top: number;
  moved: boolean;
  marks: { t: number; y: number }[];
}

/**
 * What a box being dragged needs to wear.
 *
 * `touch-pan-y` hands a finger's vertical swipe back to the browser, which
 * pans the page (and cancels our pointer stream, so the two never fight);
 * on those devices the box scrolls natively instead, which also gives it
 * the system's own momentum. A mouse is unaffected: no wheel, drag only.
 */
export const DRAG_CLASS = "cursor-grab select-none touch-pan-y overflow-hidden active:cursor-grabbing [@media(pointer:coarse)]:overflow-y-auto";

export interface DragScroll {
  /** goes on the scrolling box */
  ref: RefObject<HTMLDivElement | null>;
  /** and so do these */
  bind: {
    onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
  };
  /** a drag, or the throw after it, is in charge of the scroll right now */
  busy: () => boolean;
  /** whatever is still moving, stop it */
  stop: () => void;
}

export function useDragScroll(): DragScroll {
  const ref = useRef<HTMLDivElement>(null);
  const grab = useRef<Grab | null>(null);
  const spin = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (spin.current !== null) cancelAnimationFrame(spin.current);
    spin.current = null;
  }, []);

  const throwIt = useCallback((v0: number) => {
    const el = ref.current;
    if (!el) return;
    let v = Math.max(-MAX_V, Math.min(MAX_V, v0));
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(34, now - last);
      last = now;
      const max = el.scrollHeight - el.clientHeight;
      const next = el.scrollTop + v * dt;
      if (next <= 0 || next >= max) {
        el.scrollTop = next <= 0 ? 0 : max;
        spin.current = null;
        return;
      }
      el.scrollTop = next;
      v *= Math.pow(DECAY, dt);
      if (Math.abs(v) < REST) {
        spin.current = null;
        return;
      }
      spin.current = requestAnimationFrame(step);
    };
    spin.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => stop, [stop]);

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      stop();
      grab.current = { y: e.clientY, top: el.scrollTop, moved: false, marks: [{ t: performance.now(), y: e.clientY }] };
      // a drag must not paint a text selection behind it
      e.preventDefault();
    },
    [stop],
  );

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const g = grab.current;
    const el = ref.current;
    if (!g || !el) return;
    const dy = e.clientY - g.y;
    if (!g.moved && Math.abs(dy) < 4) return;
    if (!g.moved) {
      // Once it is a drag and not a tap, the pointer belongs to this box
      // until it is let go, even if it leaves the window. Not before: a
      // captured pointer hands the click to the box instead of the button
      // under the finger.
      g.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    el.scrollTop = g.top - dy;
    g.marks.push({ t: performance.now(), y: e.clientY });
    if (g.marks.length > 6) g.marks.shift();
  }, []);

  const onPointerUp = useCallback(() => {
    const g = grab.current;
    grab.current = null;
    if (!g?.moved) return;
    // How fast it was going as you let go, not over the whole drag: a long
    // slow pull that ends in a flick still throws it, and one that ends
    // held still does not.
    const now = performance.now();
    const from = g.marks.find((m) => now - m.t < RECENT_MS) ?? g.marks[g.marks.length - 2];
    const to = g.marks[g.marks.length - 1];
    if (!from || !to || to.t - from.t < 8 || now - to.t > RECENT_MS) return;
    throwIt(-(to.y - from.y) / (to.t - from.t));
  }, [throwIt]);

  const onPointerCancel = useCallback(() => {
    grab.current = null;
  }, []);

  const busy = useCallback(() => grab.current !== null || spin.current !== null, []);

  return { ref, bind: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel }, busy, stop };
}
