/**
 * The colour of the page at every hour. The whole site follows one virtual
 * clock: the day section sweeps it from 07:30 to midnight, the receipt sits
 * in the night, and the install section is the next morning.
 */

type RGB = [number, number, number];

interface SkyKey {
  h: number;
  top: string;
  bottom: string;
  /** light text from here on */
  night: boolean;
}

const KEYS: SkyKey[] = [
  { h: 0, top: "#060912", bottom: "#0c1121", night: true },
  { h: 4.8, top: "#0d1430", bottom: "#1d2447", night: true },
  { h: 6.2, top: "#6d6c9e", bottom: "#e7a992", night: true },
  { h: 7.2, top: "#f0d3bc", bottom: "#fbeee2", night: false },
  { h: 9.5, top: "#e3ecf6", bottom: "#fafbfc", night: false },
  { h: 13, top: "#d9e7f6", bottom: "#f6f9fd", night: false },
  { h: 16.3, top: "#f1d9ba", bottom: "#fbf0e3", night: false },
  { h: 18.4, top: "#ec9f71", bottom: "#f7cfa2", night: false },
  { h: 19.6, top: "#4d3f7e", bottom: "#d27d6d", night: true },
  { h: 21, top: "#18203f", bottom: "#33295a", night: true },
  { h: 23, top: "#0a0f1f", bottom: "#141a33", night: true },
  { h: 24, top: "#060912", bottom: "#0c1121", night: true },
];

const hex = (s: string): RGB => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): string => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(" ")})`;

export interface Sky {
  top: string;
  bottom: string;
  /** 0 = day text, 1 = night text */
  nightness: number;
}

export function skyAt(hour: number): Sky {
  const h = ((hour % 24) + 24) % 24;
  let i = 0;
  while (i < KEYS.length - 2 && KEYS[i + 1].h <= h) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = b.h > a.h ? (h - a.h) / (b.h - a.h) : 0;
  const nightA = a.night ? 1 : 0;
  const nightB = b.night ? 1 : 0;
  // Text flips late in the step, so it never sits mid-grey on a mid sky for long.
  const flip = Math.min(1, Math.max(0, (t - 0.35) / 0.3));
  return {
    top: mix(hex(a.top), hex(b.top), t),
    bottom: mix(hex(a.bottom), hex(b.bottom), t),
    nightness: nightA + (nightB - nightA) * flip,
  };
}

/** CSS variables for a sky: the ground, the ink and the glass of the cards. */
export function skyVars(s: Sky): Record<string, string> {
  const n = s.nightness;
  const ink = mix([28, 24, 22], [236, 238, 246], n);
  const muted = mix([108, 96, 88], [150, 156, 184], n);
  return {
    "--sky-top": s.top,
    "--sky-bottom": s.bottom,
    "--ink": ink,
    "--muted": muted,
    "--line": n > 0.5 ? "rgb(255 255 255 / 0.12)" : "rgb(30 24 20 / 0.12)",
    "--glass": n > 0.5 ? "rgb(22 26 44 / 0.72)" : "rgb(255 255 255 / 0.66)",
    "--glass-ink": n > 0.5 ? "#eef0f8" : "#1d1a18",
    "--glass-muted": n > 0.5 ? "#9aa0bc" : "#6f655d",
    "--glass-line": n > 0.5 ? "rgb(255 255 255 / 0.1)" : "rgb(40 30 20 / 0.08)",
    "--nightness": String(n),
  };
}
