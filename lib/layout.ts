/**
 * Which version of the page this screen gets, the way aly3n.dev decides it:
 * from the screen's width, once, and again only when a resize really moves
 * it into another band (a tablet turned round, a window dragged wider).
 *
 *   phone    under 600     the demo is a phone, with its terminal below it
 *   tablet   600 to 1023   the same phone and terminal, with room around them
 *   laptop   1024 to 1439  the desk: terminal and Telegram side by side
 *   desktop  1440 and up   the desk, at full size
 *
 * The same rule runs as an inline script in <head> before the first paint
 * (LAYOUT_SCRIPT), so CSS can hide the version this screen does not get
 * before anyone sees it, and React mounts only the one it does.
 *
 * This file is plain so the server can import the script; the hook that
 * follows the layout in the browser is in use-layout.ts.
 */

export type Layout = "phone" | "tablet" | "laptop" | "desktop";

export function decideLayout(width: number): Layout {
  if (width < 600) return "phone";
  if (width < 1024) return "tablet";
  if (width < 1440) return "laptop";
  return "desktop";
}

/** The phone-shaped demo, as opposed to the desk. */
export function isHandheld(layout: Layout | null): boolean {
  return layout === "phone" || layout === "tablet";
}

/** Sets data-layout on <html> before the first paint. Keep in step with decideLayout. */
export const LAYOUT_SCRIPT =
  "(function(){var w=innerWidth;document.documentElement.dataset.layout=w<600?'phone':w<1024?'tablet':w<1440?'laptop':'desktop'})()";
