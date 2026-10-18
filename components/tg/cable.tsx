"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Spark, World } from "./world";
import type { Dict } from "@/lib/i18n";

/**
 * The cable between the terminal and Telegram.
 *
 * It is a real rope: a verlet chain of 40 links with gravity, the daemon
 * hanging on it as a weight, and your pointer able to shove it aside or
 * pick it up and drop it. Every hook event rides along it as a charge:
 * the light travels on the cable, the words stay in the socket at each
 * end, so you read what left and what arrived without chasing anything.
 */

export const STAGE = { w: 1200, h: 744 } as const;

interface Point {
  x: number;
  y: number;
}

/**
 * A label plate at one end. "hang" sits under a window with the plug at its
 * foot; "stand" sits on top of one with the plug on its head.
 */
interface Plate {
  x: number;
  y: number;
  w: number;
  h: number;
  edge: "hang" | "stand";
}

/**
 * Where the cable runs. The rope, the charges and the daemon are the same
 * everywhere; only these numbers change between the desk, where it runs
 * sideways between two windows, and the phone, where it drops from the
 * phone's foot to the terminal's head.
 */
export interface CableGeo {
  stage: { w: number; h: number };
  /** the terminal's end */
  a: Point;
  /** Telegram's end */
  b: Point;
  slack: number;
  /** how far the rope bows before gravity takes it */
  bow: number;
  /** the lowest a link may hang */
  floor: number;
  plates: { l: Plate; r: Plate };
  /** where the "flick it" hint sits, or nowhere on a touch screen */
  flick: Point | null;
  /** the daemon's name: under it on the desk, beside it where the plates are close */
  tag: "below" | "side";
  /** what each plate is labelled */
  names: { l: string; r: string };
  /** how far the cable leaves each plug in the plug's own line before it hangs free */
  boot: number;
  /** the words in a plate the plug sits in, or on a tag beside a port the plug sits in */
  look: "plate" | "tag";
  feel: Feel;
}

/** How the cable behaves, as opposed to where it runs. */
interface Feel {
  /** how hard it resists folding at a link; 0 lets it kink anywhere */
  stiff: number;
  /** how much of a stretch each pass takes back; under 1 it gives, and springs */
  give: number;
  /** the daemon's inverse mass: smaller is heavier */
  daemon: number;
  /** the daemon's size */
  big: number;
  /** a finger may take hold of it, not only a mouse */
  touch: boolean;
  /** a breeze that keeps it alive when nothing else moves it, in px/s² */
  sway: number;
  /** how far a scroll of the page swings it */
  inertia: number;
  /** how much of its speed it keeps each step: lower settles sooner, higher swings longer */
  damp: number;
  /** how much of the way a held point goes toward the hand each step: 1 is in the hand */
  follow: number;
}

const SOCKET = { top: 580, h: 52 };

export const DESK: CableGeo = {
  stage: STAGE,
  a: { x: 204, y: SOCKET.top + SOCKET.h },
  b: { x: 794, y: SOCKET.top + SOCKET.h },
  slack: 1.028,
  bow: 70,
  floor: STAGE.h - 13,
  plates: {
    l: { x: 204 - 122, y: SOCKET.top, w: 244, h: SOCKET.h, edge: "hang" },
    r: { x: 794 - 165, y: SOCKET.top, w: 330, h: SOCKET.h, edge: "hang" },
  },
  flick: { x: 26, y: STAGE.h - 34 },
  tag: "below",
  names: { l: "claude-api · hooks", r: "telegram · @aipagerbot" },
  boot: 0,
  look: "plate",
  feel: { stiff: 0, give: 1, daemon: 0.4, big: 1, touch: false, sway: 0, inertia: 0, damp: 0.955, follow: 1 },
};

/** The phone's stage height, from the phone's foot to the terminal's head. */
export const PHONE_H = 230;

/**
 * The phone's, for a column w wide. The cable comes out of a port in the
 * phone's foot and goes into one in the terminal's head further along, so
 * it hangs in an S between them, and the words sit in the two corners the
 * rope leaves free. Drawn at the column's own width rather than scaled, so
 * the words keep their size on a small phone.
 *
 * It is also the one a finger plays with: it gives when pulled and springs
 * back, a breeze keeps it moving, a scroll swings it, a tap plucks it.
 */
export function phoneGeo(w: number): CableGeo {
  const plug = 21; // the port's housing, then the plug's shell under it
  const b = { x: Math.round(w * 0.4), y: plug };
  const a = { x: Math.round(w * 0.8), y: PHONE_H - plug };
  return {
    stage: { w, h: PHONE_H },
    a,
    b,
    slack: 1.1,
    bow: 0,
    floor: a.y - 2,
    plates: {
      // the terminal's words, low, on the side away from its port, clear of
      // the last of the rope as it comes round into the plug
      l: { x: 8, y: PHONE_H - 60, w: Math.max(a.x - 74, 170), h: 50, edge: "stand" },
      // Telegram's, high, past the phone's port
      r: { x: b.x + 28, y: 14, w: w - b.x - 36, h: 50, edge: "hang" },
    },
    // under Telegram's words, where the rope has already turned away
    flick: { x: b.x + 30, y: 74 },
    tag: "side",
    // the phone above it already says Telegram
    names: { l: "claude-api · hooks", r: "@aipagerbot" },
    boot: 14,
    look: "tag",
    // all but still: a breath of a breeze, nothing from the page scrolling,
    // a held point that lags well behind the finger
    feel: { stiff: 1, give: 1, daemon: 0.75, big: 1.3, touch: true, sway: 25, inertia: 0, damp: 0.95, follow: 0.15 },
  };
}

const N = 40;
const GRAV = 1500;
const ITER = 16;
const GRAB_R = 40;
const PUSH_R = 74;
const SLOTS = 6;

interface Node {
  x: number;
  y: number;
  px: number;
  py: number;
  /** inverse mass: 0 is pinned, small is heavy */
  w: number;
}

export type Dir = "out" | "back";

export interface Wire {
  id: number;
  dir: Dir;
  /** what the socket it left says */
  from: string;
  /** what the socket it lands in says */
  to: string;
  tone: "hook" | "perm" | "verdict" | "quiet";
  speed: number;
}

interface Live extends Wire {
  s: number;
  bumped: boolean;
}

const TONE: Record<Wire["tone"], { core: string; glow: string; seg: number }> = {
  hook: { core: "#9ad8ff", glow: "#2aabee", seg: 26 },
  perm: { core: "#ffd79a", glow: "#f2b84b", seg: 34 },
  verdict: { core: "#a8f0c6", glow: "#4fd693", seg: 30 },
  quiet: { core: "#c3ccd6", glow: "#7f8791", seg: 16 },
};

function rope(g: CableGeo): Node[] {
  const out: Node[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = g.a.x + (g.b.x - g.a.x) * t;
    const y = g.a.y + (g.b.y - g.a.y) * t + Math.sin(Math.PI * t) * g.bow;
    out.push({ x, y, px: x, py: y, w: i === 0 || i === N ? 0 : 1 });
  }
  // the daemon hangs off the middle link, and it has weight
  out[N / 2].w = g.feel.daemon;
  // the stiff boot behind each plug holds the first links on the plug's line
  if (g.boot) {
    for (const [end, step, p, plate] of [
      [0, 1, g.a, g.plates.l],
      [N, -1, g.b, g.plates.r],
    ] as const) {
      const away = plate.edge === "stand" ? -1 : 1;
      for (let k = 1; k <= 2; k++) {
        const n = out[end + step * k];
        n.x = n.px = p.x;
        n.y = n.py = p.y + (away * g.boot * k) / 2;
        n.w = 0;
      }
    }
  }
  return out;
}

function draw(ns: Node[]): string {
  let d = `M${ns[0].x.toFixed(2)} ${ns[0].y.toFixed(2)}`;
  for (let i = 1; i < ns.length - 1; i++) {
    const mx = (ns[i].x + ns[i + 1].x) / 2;
    const my = (ns[i].y + ns[i + 1].y) / 2;
    d += `Q${ns[i].x.toFixed(2)} ${ns[i].y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
  }
  const last = ns[ns.length - 1];
  return `${d}L${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
}

interface Face {
  text: string;
  hot: boolean;
}

/** One flight, and the speed that takes exactly that long. */
export const FLIGHT_MS = 780;
const SPEED = 1000 / FLIGHT_MS;

export function Cable({ world, spark, t, geo = DESK }: { world: World; spark: { id: number; s: Spark } | null; t: Dict; geo?: CableGeo }) {
  const g = geo;
  const { a: A, b: B, stage: ST } = g;
  // two cables never share a page, but ids in an SVG are global, so each owns its own
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<SVGPathElement>(null);
  const hit = useRef<SVGPathElement>(null);
  const shade = useRef<SVGPathElement>(null);
  const sheen = useRef<SVGPathElement>(null);
  const daemon = useRef<SVGGElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const body = useRef<SVGGElement>(null);
  const sparkA = useRef<SVGCircleElement>(null);
  const sparkB = useRef<SVGCircleElement>(null);
  const slots = useRef<(SVGGElement | null)[]>([]);
  const queue = useRef<Wire[]>([]);
  // what each socket says before the evening starts, in the reader's language
  const [left, setLeft] = useState<Face>({ text: t.demo.cable.idle, hot: false });
  const [right, setRight] = useState<Face>({ text: t.demo.cable.quiet, hot: false });
  const [grabbing, setGrabbing] = useState(false);
  const [grabbed, setGrabbed] = useState(false);

  // ── the rope, the pointer and the charges, all driven by one loop ──
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ns = rope(g);
    const rest = (Math.hypot(B.x - A.x, B.y - A.y) * g.slack) / N;
    const live: Live[] = [];
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const m = { x: -1e4, y: -1e4, vx: 0, vy: 0, on: false, grab: -1, at: 0, moved: 0, sx: 0, sy: 0 };
    // a touch only counts where the cable lets a finger hold it
    const fingerOk = (e: PointerEvent) => e.pointerType !== "touch" || g.feel.touch;

    const toStage = (e: PointerEvent): { x: number; y: number } | null => {
      const r = root.current?.getBoundingClientRect();
      if (!r || !r.width) return null;
      const k = r.width / ST.w;
      return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
    };
    const nearest = (x: number, y: number): { i: number; d: number } => {
      let i = -1;
      let d = 1e9;
      for (let k = 1; k < ns.length - 1; k++) {
        if (!ns[k].w) continue;
        const q = Math.hypot(ns[k].x - x, ns[k].y - y);
        if (q < d) {
          d = q;
          i = k;
        }
      }
      return { i, d };
    };

    const move = (e: PointerEvent) => {
      // Touch belongs to the page: a finger scrolls past, it does not shove
      // the rope, unless it took hold of a cable that lets it.
      if (e.pointerType === "touch" && !(g.feel.touch && m.grab >= 0)) return;
      const p = toStage(e);
      if (!p) return;
      if (m.grab >= 0) m.moved = Math.max(m.moved, Math.hypot(p.x - m.sx, p.y - m.sy));
      m.vx = p.x - m.x;
      m.vy = p.y - m.y;
      m.x = p.x;
      m.y = p.y;
      m.on = true;
    };
    const down = (e: PointerEvent) => {
      if (!fingerOk(e)) return;
      const p = toStage(e);
      if (!p) return;
      const { i, d } = nearest(p.x, p.y);
      if (d > GRAB_R) return;
      e.preventDefault();
      m.grab = i;
      m.x = p.x;
      m.y = p.y;
      m.sx = p.x;
      m.sy = p.y;
      m.at = performance.now();
      m.moved = 0;
      document.documentElement.style.userSelect = "none";
      setGrabbing(true);
      setGrabbed(true);
    };
    const up = () => {
      if (m.grab < 0) return;
      // On a phone a tap, not a pull: the daemon hops, anywhere else the cable twangs.
      if (g.feel.touch && performance.now() - m.at < 260 && m.moved < 8) {
        const n = ns[m.grab];
        if (Math.abs(m.grab - N / 2) <= 3) {
          // the middle of the cable leaps with it, thrown a little to one side
          const side = Math.random() < 0.5 ? -1 : 1;
          for (let k = -9; k <= 9; k++) {
            const q = ns[N / 2 + k];
            if (!q.w) continue;
            const f = Math.cos((Math.PI * k) / 20);
            q.py = q.y + 3.5 * f;
            q.px = q.x - side * 1.1 * f;
          }
          jolt(body.current, "boing");
        } else if (n.w) {
          n.px = n.x + (Math.random() < 0.5 ? -1.2 : 1.2);
          n.py = n.y + 0.8;
        }
      }
      m.grab = -1;
      document.documentElement.style.userSelect = "";
      setGrabbing(false);
    };
    const out = () => {
      m.on = false;
      m.x = -1e4;
      m.y = -1e4;
    };
    // Chrome reads touch-action from boxes, not from an SVG path, so a
    // finger that lands on the cable is kept from scrolling the page here.
    const hold = (e: TouchEvent) => {
      if (g.feel.touch) e.preventDefault();
    };
    const pin = (e: TouchEvent) => {
      if (m.grab >= 0) e.preventDefault();
    };
    const grip = hit.current;
    grip?.addEventListener("touchstart", hold, { passive: false });
    window.addEventListener("touchmove", pin, { passive: false });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });
    window.addEventListener("blur", out);

    const kick = (end: "a" | "b", force: number) => {
      const i0 = end === "a" ? 1 : ns.length - 2;
      const step = end === "a" ? 1 : -1;
      for (let k = 0; k < 8; k++) {
        const n = ns[i0 + step * k];
        if (!n || !n.w) continue;
        const f = (1 - k / 8) * force;
        n.y += f;
        n.x += step * f * 0.5;
      }
    };

    const cool: number[] = [];
    const lit = { a: -1e4, b: -1e4 };
    const jolt = (el: Element | null | undefined, cls = "jolt") => {
      if (!el) return;
      el.classList.remove(cls);
      // getBoundingClientRect flushes layout for SVG too, where offsetWidth is
      // undefined; without it the same class never restarts the animation.
      el.getBoundingClientRect();
      el.classList.add(cls);
    };
    // Only the socket takes the knock: the window above it is not what the
    // cable is plugged into.
    const land = (side: "l" | "r") => {
      jolt(root.current?.querySelector(`[data-socket="${side}"]`));
      jolt(root.current?.querySelector(`[data-plug="${side}"]`));
    };
    const flash = (side: "l" | "r", text: string) => {
      if (side === "l") lit.a = performance.now();
      else lit.b = performance.now();
      const set = side === "l" ? setLeft : setRight;
      set({ text, hot: true });
      cool.push(window.setTimeout(() => set((f) => (f.text === text ? { text, hot: false } : f)), 950));
    };

    let clock = 0;
    const step = (dt: number) => {
      clock += dt;
      ns.forEach((n, i) => {
        if (!n.w) return;
        const vx = (n.x - n.px) * g.feel.damp;
        const vy = (n.y - n.py) * g.feel.damp;
        n.px = n.x;
        n.py = n.y;
        // a breeze that never quite settles: the whole cable leans with it,
        // the middle most, and a slower gust under it keeps it from looking
        // like a metronome
        const gust = Math.sin(clock * 1.3 + i * 0.05) + 0.6 * Math.sin(clock * 0.47 + 1.7);
        const air = g.feel.sway ? g.feel.sway * gust * Math.sin((Math.PI * i) / N) : 0;
        n.x += vx + air * dt * dt;
        n.y += vy + GRAV * dt * dt;
      });
      // the pointer: a finger through the rope, or a hand holding it
      if (m.grab >= 0) {
        const n = ns[m.grab];
        n.x += (m.x - n.x) * g.feel.follow;
        n.y += (m.y - n.y) * g.feel.follow;
      } else if (m.on) {
        for (const n of ns) {
          if (!n.w) continue;
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d > PUSH_R || d < 0.001) continue;
          const f = 1 - d / PUSH_R;
          n.x += (dx / d) * f * f * 3 + m.vx * f * 0.16;
          n.y += (dy / d) * f * f * 3 + m.vy * f * 0.16;
        }
      }
      // It may give a little while it is held, and is firm again once let
      // go, so it never sags under itself. A held cable gets more passes,
      // so a finger cannot pull it longer than it is.
      const give = m.grab >= 0 ? g.feel.give : Math.max(g.feel.give, 0.9);
      const passes = m.grab >= 0 && g.feel.touch ? ITER * 2 : ITER;
      for (let k = 0; k < passes; k++) {
        for (let i = 0; i < ns.length - 1; i++) {
          const a = ns[i];
          const b = ns[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.001;
          // under 1, each pass takes back only part of a stretch: the cable gives
          const diff = ((d - rest) / d) * give;
          const tot = a.w + b.w;
          if (!tot) continue;
          const ax = dx * diff * (a.w / tot);
          const ay = dy * diff * (a.w / tot);
          const bx = dx * diff * (b.w / tot);
          const by = dy * diff * (b.w / tot);
          a.x += ax;
          a.y += ay;
          b.x -= bx;
          b.y -= by;
        }
        // A cable bends, it does not fold: two links apart may not come
        // closer than a gentle bend allows.
        if (g.feel.stiff) {
          const reach = rest * 2 * 0.98;
          for (let i = 0; i < ns.length - 2; i++) {
            const a = ns[i];
            const c = ns[i + 2];
            const tot = a.w + c.w;
            if (!tot) continue;
            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const d = Math.hypot(dx, dy) || 0.001;
            if (d >= reach) continue;
            const push = ((d - reach) / d) * g.feel.stiff * 0.5;
            a.x += dx * push * (a.w / tot);
            a.y += dy * push * (a.w / tot);
            c.x -= dx * push * (c.w / tot);
            c.y -= dy * push * (c.w / tot);
          }
        }
      }
      for (const n of ns) {
        if (!n.w) continue;
        if (n.y > g.floor) {
          n.y = g.floor;
          n.px += (n.x - n.px) * 0.35;
        }
        if (n.x < 10) n.x = 10;
        if (n.x > ST.w - 10) n.x = ST.w - 10;
      }
      m.vx *= 0.6;
      m.vy *= 0.6;
    };

    // A phone's cable is already hanging at rest when it first comes into
    // view, rather than falling into shape in front of the reader who
    // scrolled down to it.
    if (g.feel.touch) for (let i = 0; i < 900; i++) step(1 / 120);

    // Nothing to draw while the cable is off the screen.
    let seen = true;
    const io = new IntersectionObserver(([e]) => (seen = e.isIntersecting), { rootMargin: "160px" });
    if (root.current) io.observe(root.current);
    let scrolled = window.scrollY;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!seen) {
        last = now;
        scrolled = window.scrollY;
        return;
      }
      // The page moving under it swings it, the way a cable hanging off a
      // phone swings when you move the phone.
      if (g.feel.inertia) {
        const dy = Math.max(-14, Math.min(14, window.scrollY - scrolled));
        scrolled = window.scrollY;
        if (dy) ns.forEach((n, i) => n.w && (n.y += dy * g.feel.inertia * Math.sin((Math.PI * i) / N)));
      }
      if (still) {
        // The cable hangs where it is; only the sockets keep speaking.
        queue.current.splice(0).forEach((w) => {
          flash(w.dir === "out" ? "l" : "r", w.from);
          flash(w.dir === "out" ? "r" : "l", w.to);
        });
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      acc += dt;
      let guard = 0;
      while (acc >= 1 / 120 && guard++ < 8) {
        step(1 / 120);
        acc -= 1 / 120;
      }

      const path = main.current;
      if (!path) return;
      if (sheen.current) {
        const near = m.on ? nearest(m.x, m.y).d : 1e9;
        sheen.current.setAttribute("stroke-opacity", m.grab >= 0 ? "0.5" : near < PUSH_R ? "0.34" : "0.18");
      }
      const d = draw(ns);
      path.setAttribute("d", d);
      shade.current?.setAttribute("d", d);
      hit.current?.setAttribute("d", d);
      sheen.current?.setAttribute("d", d);
      const mid = ns[N / 2];
      const through = live.find((q) => Math.abs(q.s - 0.5) < 0.07);
      ring.current?.setAttribute("stroke", through ? TONE[through.tone].glow : "#2f3843");
      ring.current?.setAttribute("stroke-width", through ? "2" : "1");
      daemon.current?.setAttribute("transform", `translate(${mid.x.toFixed(2)} ${mid.y.toFixed(2)}) scale(${g.feel.big})`);

      // charges take the cable as it is this frame
      while (queue.current.length && live.length < SLOTS) {
        const w = queue.current.shift();
        if (!w) break;
        live.push({ ...w, s: 0, bumped: false });
        flash(w.dir === "out" ? "l" : "r", w.from);
      }
      for (const [el, when] of [
        [sparkA.current, lit.a],
        [sparkB.current, lit.b],
      ] as [SVGCircleElement | null, number][]) {
        if (!el) continue;
        const age = (now - when) / 520;
        if (age < 0 || age > 1) {
          el.setAttribute("opacity", "0");
          continue;
        }
        el.setAttribute("r", (5 + age * 20).toFixed(1));
        el.setAttribute("opacity", (0.5 * (1 - age) ** 1.5).toFixed(3));
      }

      const len = path.getTotalLength();
      for (let i = live.length - 1; i >= 0; i--) {
        const p = live[i];
        p.s += p.speed * dt;
        if (!p.bumped && p.s >= 0.5) {
          p.bumped = true;
          const n = ns[N / 2];
          n.y += 0.7;
        }
        if (p.s >= 1) {
          flash(p.dir === "out" ? "r" : "l", p.to);
          land(p.dir === "out" ? "r" : "l");
          kick(p.dir === "out" ? "b" : "a", 2.4 * g.feel.big);
          live.splice(i, 1);
        }
      }
      for (let i = 0; i < SLOTS; i++) {
        const g = slots.current[i];
        if (!g) continue;
        const p = live[i];
        if (!p) {
          g.style.display = "none";
          continue;
        }
        g.style.display = "";
        const t = p.dir === "out" ? p.s : 1 - p.s;
        const at = t * len;
        const tone = TONE[p.tone];
        const tail = g.children[0] as SVGPathElement;
        const halo = g.children[1] as SVGPathElement;
        const core = g.children[2] as SVGPathElement;
        const back = p.dir === "out" ? 1 : -1;
        const gap = len + 60;
        for (const [el, seg, lead] of [
          [tail, tone.seg * 4.6, tone.seg * 2.6],
          [halo, tone.seg * 1.2, 0],
          [core, tone.seg * 0.55, 0],
        ] as [SVGPathElement, number, number][]) {
          el.setAttribute("d", d);
          el.setAttribute("stroke-dasharray", `${seg} ${gap}`);
          el.setAttribute("stroke-dashoffset", `${-(at - seg / 2 - back * lead)}`);
          el.setAttribute("stroke", el === core ? tone.core : tone.glow);
        }
        const pt = path.getPointAtLength(Math.max(0, Math.min(len, at)));
        for (let k = 3; k < 6; k++) {
          const c = g.children[k] as SVGCircleElement;
          c.setAttribute("cx", pt.x.toFixed(2));
          c.setAttribute("cy", pt.y.toFixed(2));
          if (k < 5) c.setAttribute("fill", tone.glow);
        }
      }
    };
    if (still) {
      for (let i = 0; i < 400; i++) step(1 / 120);
      const d0 = draw(ns);
      for (const el of [main.current, shade.current, sheen.current, hit.current]) el?.setAttribute("d", d0);
      daemon.current?.setAttribute("transform", `translate(${ns[N / 2].x.toFixed(2)} ${ns[N / 2].y.toFixed(2)}) scale(${g.feel.big})`);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      cool.forEach((t) => window.clearTimeout(t));
      grip?.removeEventListener("touchstart", hold);
      window.removeEventListener("touchmove", pin);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", out);
      document.documentElement.style.userSelect = "";
    };
  }, [g, A, B, ST]);

  // ── what the evening sends down it ──
  useEffect(() => {
    if (!spark) return;
    queue.current.push({ ...spark.s, id: spark.id, speed: SPEED });
  }, [spark]);

  // the status line keeps the bar alive while Claude works
  const busy = world.panes.some((p) => p.spinner !== null);
  useEffect(() => {
    if (!busy) return;
    const id = window.setInterval(
      () => queue.current.push({ id: Date.now(), dir: "out", from: "statusline", to: "⚙️ api · ctx 12% · $0.14", tone: "quiet", speed: 1.7 }),
      4200,
    );
    return () => window.clearInterval(id);
  }, [busy]);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-20">
      {!grabbed && g.flick && (
        <div
          className={`absolute font-mono text-fg-4 ${g.look === "tag" ? "text-balance text-[10.5px] leading-snug" : "text-[9.5px] uppercase tracking-[0.16em]"}`}
          // on the phone it has what is left of the row, and wraps inside it
          style={{ left: g.flick.x, top: g.flick.y, maxWidth: g.look === "tag" ? ST.w - g.flick.x - 8 : undefined }}
        >
          ✥ {t.demo.cable.flick}
        </div>
      )}
      <Socket plate={g.plates.l} side="l" caption={g.names.l} face={left} hot={left.hot} look={g.look} />
      <Socket plate={g.plates.r} side="r" caption={g.names.r} face={right} hot={right.hot} look={g.look} />
      <svg
        viewBox={`0 0 ${ST.w} ${ST.h}`}
        className="absolute inset-0 h-full w-full"
        // the scene is drawn to coordinates, so an anchor's "end" is always its right
        style={{ cursor: grabbing ? "grabbing" : undefined, direction: "ltr", WebkitTouchCallout: "none", userSelect: "none" }}
        aria-hidden
      >
        <defs>
          {/* orange at the terminal, blue at Telegram, whichever way the cable runs */}
          <linearGradient id={`${uid}-skin`} gradientUnits="userSpaceOnUse" x1={A.x} y1={A.y} x2={B.x} y2={B.y}>
            <stop offset="0" stopColor="#8c5440" />
            <stop offset="0.18" stopColor="#4a4f57" />
            <stop offset="0.82" stopColor="#3e5468" />
            <stop offset="1" stopColor="#2b6f96" />
          </linearGradient>
          <filter id={`${uid}-glow`} x="-30%" y="-400%" width="160%" height="900%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* the ports, where the plugs go into the phone and the terminal rather than into a plate */}
        {g.look === "tag" && (
          <>
            <rect x={B.x - 19} y={-5} width="38" height="13" rx="4" fill="#2a313b" stroke="#3d4652" strokeWidth="0.8" />
            <rect x={A.x - 19} y={ST.h - 8} width="38" height="13" rx="4" fill="#2a313b" stroke="#3d4652" strokeWidth="0.8" />
          </>
        )}
        {/* the plugs */}
        {([
          [A, g.plates.l, "l"],
          [B, g.plates.r, "r"],
        ] as const).map(([p, plate, side]) => (
          <g key={side} data-plug={side} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {/* drawn hanging down; a plug standing on a window is the same plug turned over */}
            <g transform={plate.edge === "stand" ? `translate(0 ${2 * p.y}) scale(1 -1)` : undefined}>
              <rect x={p.x - 11} y={p.y - 12} width="22" height="11" rx="2" fill="#2b323b" stroke="#454d58" strokeWidth="0.8" />
              <rect x={p.x - 11} y={p.y - 12} width="22" height="3.4" rx="1.6" fill="#596472" opacity="0.5" />
              <path d={`M${p.x - 7} ${p.y - 2}L${p.x + 7} ${p.y - 2}L${p.x + 5} ${p.y + 9}Q${p.x} ${p.y + 12} ${p.x - 5} ${p.y + 9}Z`} fill="#171c23" stroke="#353d47" strokeWidth="0.8" />
              <circle cx={p.x} cy={p.y + 7} r="2.4" fill="#05080c" />
            </g>
          </g>
        ))}
        <circle ref={sparkA} cx={A.x} cy={g.plates.l.edge === "stand" ? A.y - 8 : A.y + 8} r="5" fill="none" stroke="#9ad8ff" strokeWidth="2" opacity="0" />
        <circle ref={sparkB} cx={B.x} cy={g.plates.r.edge === "stand" ? B.y - 8 : B.y + 8} r="5" fill="none" stroke="#a8f0c6" strokeWidth="2" opacity="0" />
        <path ref={shade} fill="none" stroke="#04070b" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
        {/* where a finger may take hold of it, the page does not scroll */}
        <path
          ref={hit}
          fill="none"
          stroke="transparent"
          strokeWidth={g.feel.touch ? 40 : 30}
          strokeLinecap="round"
          style={{ pointerEvents: "stroke", cursor: grabbing ? "grabbing" : "grab", touchAction: g.feel.touch ? "none" : undefined }}
        />
        <path ref={main} fill="none" stroke={`url(#${uid}-skin)`} strokeWidth="6.5" strokeLinecap="round" />
        <path ref={sheen} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.5" strokeLinecap="round" transform="translate(0 -1.6)" />
        {Array.from({ length: SLOTS }, (_, i) => (
          <g
            key={i}
            className="charge"
            ref={(el) => {
              slots.current[i] = el;
            }}
            style={{ display: "none" }}
          >
            <path fill="none" strokeWidth="9" strokeLinecap="round" opacity="0.34" />
            <path fill="none" strokeWidth="19" strokeLinecap="round" opacity="0.2" />
            <path fill="none" strokeWidth="5" strokeLinecap="round" />
            <circle r="17" opacity="0.16" />
            <circle r="8" opacity="0.45" />
            <circle r="3.4" fill="#ffffff" />
          </g>
        ))}
        <g ref={daemon}>
          {/* tap it and it hops, squashing as it goes */}
          <g ref={body} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle ref={ring} r="16" fill="#0b0f14" stroke="#2f3843" />
            <g transform="translate(-9 -9) scale(0.281)">
              <rect x="2" y="2" width="60" height="60" rx="14" fill="#181C20" stroke="#3a4048" />
              <path d="M16 24 L26 32 L16 40" stroke="#F6F7F8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* on the phone its cursor waits, the way a shell's does */}
              <rect x="30" y="29" width="8" height="6" rx="1" fill="#F6F7F8" className={g.look === "tag" ? "caret-blink" : undefined} />
              <circle cx="48" cy="20" r="6" fill="#3FA9F5" fillOpacity="0.22" />
              <circle cx="48" cy="20" r="3" fill="#3FA9F5" />
            </g>
          </g>
          <text
            x={g.tag === "side" ? -23 : 0}
            y={g.tag === "side" ? 3 : 30}
            textAnchor={g.tag === "side" ? "end" : "middle"}
            className="fill-[#6a7682] font-mono"
            fontSize="9"
          >
            {t.demo.cable.daemon}
          </text>
        </g>
      </svg>
    </div>
  );
}

function Socket({ plate, side, caption, face, hot, look }: { plate: Plate; side: "l" | "r"; caption: string; face: Face; hot: boolean; look: CableGeo["look"] }) {
  // a plate under a window opens upward into it, with the plug at its foot;
  // one standing on a window opens downward, with the plug on its head; a
  // tag beside a port is a card of its own
  const shape =
    look === "tag" ? "rounded-xl py-2" : plate.edge === "hang" ? "rounded-b-xl border-t-0 pb-4 pt-1.5" : "rounded-t-xl border-b-0 pb-1.5 pt-4";
  return (
    <div data-socket={side} className="absolute" style={{ left: plate.x, top: plate.y, width: plate.w, height: plate.h }}>
      <div className={`h-full border transition-colors duration-200 ${look === "tag" ? "px-2.5" : "px-3"} ${shape} ${hot ? "border-white/20 bg-[#121922]" : look === "tag" ? "border-white/[0.08] bg-[#0c1117]/85" : "border-white/10 bg-[#0c1117]"}`}>
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
              hot ? (side === "l" ? "bg-[#9ad8ff] shadow-[0_0_8px_2px_rgb(42_171_238/0.8)]" : "bg-[#a8f0c6] shadow-[0_0_8px_2px_rgb(79_214_147/0.7)]") : "bg-white/15"
            }`}
          />
          {/* a session name and a @username: English, and cased as English */}
          <span lang="en" dir="ltr" className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-fg-4">
            {caption}
          </span>
        </div>
        <div className={`truncate font-mono text-[12px] transition-colors duration-200 ${hot ? "text-white" : "text-fg-3"}`}>{face.text}</div>
      </div>
    </div>
  );
}
