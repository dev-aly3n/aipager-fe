"use client";

import { useEffect, useRef, useState } from "react";
import type { Spark, World } from "./world";

/**
 * The cable between the terminal and Telegram.
 *
 * It is a real rope: a verlet chain of 40 links with gravity, the daemon
 * hanging on it as a weight, and your pointer able to shove it aside or
 * pick it up and drop it. Every hook event rides along it as a charge —
 * the light travels on the cable, the words stay in the socket at each
 * end, so you read what left and what arrived without chasing anything.
 */

export const STAGE = { w: 1200, h: 744 } as const;
/** where the cable plugs in: the bottom of each window's socket */
export const SOCKET = { top: 580, h: 52 };
const A = { x: 204, y: SOCKET.top + SOCKET.h };
const B = { x: 794, y: SOCKET.top + SOCKET.h };

const N = 40;
const SLACK = 1.028;
const GRAV = 1500;
const DAMP = 0.986;
const ITER = 14;
const GRAB_R = 40;
const PUSH_R = 96;
const SLOTS = 6;
const FLOOR = STAGE.h - 13;

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

function rope(): Node[] {
  const out: Node[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = A.x + (B.x - A.x) * t;
    const y = A.y + Math.sin(Math.PI * t) * 70;
    out.push({ x, y, px: x, py: y, w: i === 0 || i === N ? 0 : 1 });
  }
  // the daemon hangs off the middle link, and it has weight
  out[N / 2].w = 0.4;
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

export function Cable({ world, spark }: { world: World; spark: { id: number; s: Spark } | null }) {
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<SVGPathElement>(null);
  const hit = useRef<SVGPathElement>(null);
  const shade = useRef<SVGPathElement>(null);
  const sheen = useRef<SVGPathElement>(null);
  const daemon = useRef<SVGGElement>(null);
  const sparkA = useRef<SVGCircleElement>(null);
  const sparkB = useRef<SVGCircleElement>(null);
  const slots = useRef<(SVGGElement | null)[]>([]);
  const queue = useRef<Wire[]>([]);
  const [left, setLeft] = useState<Face>({ text: "waiting for a turn", hot: false });
  const [right, setRight] = useState<Face>({ text: "nothing new", hot: false });
  const [grabbing, setGrabbing] = useState(false);
  const [grabbed, setGrabbed] = useState(false);

  // ── the rope, the pointer and the charges, all driven by one loop ──
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ns = rope();
    const rest = (Math.hypot(B.x - A.x, B.y - A.y) * SLACK) / N;
    const live: Live[] = [];
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const m = { x: -1e4, y: -1e4, vx: 0, vy: 0, on: false, grab: -1 };

    const toStage = (e: PointerEvent): { x: number; y: number } | null => {
      const r = root.current?.getBoundingClientRect();
      if (!r || !r.width) return null;
      const k = r.width / STAGE.w;
      return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
    };
    const nearest = (x: number, y: number): { i: number; d: number } => {
      let i = -1;
      let d = 1e9;
      for (let k = 1; k < ns.length - 1; k++) {
        const q = Math.hypot(ns[k].x - x, ns[k].y - y);
        if (q < d) {
          d = q;
          i = k;
        }
      }
      return { i, d };
    };

    const move = (e: PointerEvent) => {
      // Touch belongs to the page: a finger scrolls past, it does not shove the rope.
      if (e.pointerType === "touch") return;
      const p = toStage(e);
      if (!p) return;
      m.vx = p.x - m.x;
      m.vy = p.y - m.y;
      m.x = p.x;
      m.y = p.y;
      m.on = true;
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const p = toStage(e);
      if (!p) return;
      const { i, d } = nearest(p.x, p.y);
      if (d > GRAB_R) return;
      e.preventDefault();
      m.grab = i;
      m.x = p.x;
      m.y = p.y;
      document.documentElement.style.userSelect = "none";
      setGrabbing(true);
      setGrabbed(true);
    };
    const up = () => {
      if (m.grab < 0) return;
      m.grab = -1;
      document.documentElement.style.userSelect = "";
      setGrabbing(false);
    };
    const out = () => {
      m.on = false;
      m.x = -1e4;
      m.y = -1e4;
    };
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
    const jolt = (el: Element | null | undefined) => {
      if (!el) return;
      el.classList.remove("jolt");
      // getBoundingClientRect flushes layout for SVG too, where offsetWidth is
      // undefined — without it the same class never restarts the animation.
      el.getBoundingClientRect();
      el.classList.add("jolt");
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

    const step = (dt: number) => {
      for (const n of ns) {
        if (!n.w) continue;
        const vx = (n.x - n.px) * DAMP;
        const vy = (n.y - n.py) * DAMP;
        n.px = n.x;
        n.py = n.y;
        n.x += vx;
        n.y += vy + GRAV * dt * dt;
      }
      // the pointer: a finger through the rope, or a hand holding it
      if (m.grab >= 0) {
        const n = ns[m.grab];
        n.x = m.x;
        n.y = m.y;
      } else if (m.on) {
        for (const n of ns) {
          if (!n.w) continue;
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d > PUSH_R || d < 0.001) continue;
          const f = 1 - d / PUSH_R;
          n.x += (dx / d) * f * f * 7 + m.vx * f * 0.42;
          n.y += (dy / d) * f * f * 7 + m.vy * f * 0.42;
        }
      }
      for (let k = 0; k < ITER; k++) {
        for (let i = 0; i < ns.length - 1; i++) {
          const a = ns[i];
          const b = ns[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.001;
          const diff = (d - rest) / d;
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
      }
      for (const n of ns) {
        if (!n.w) continue;
        if (n.y > FLOOR) {
          n.y = FLOOR;
          n.px += (n.x - n.px) * 0.35;
        }
        if (n.x < 10) n.x = 10;
        if (n.x > STAGE.w - 10) n.x = STAGE.w - 10;
      }
      m.vx *= 0.6;
      m.vy *= 0.6;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
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
      const ring = daemon.current?.firstElementChild as SVGCircleElement | undefined;
      if (ring) {
        ring.setAttribute("stroke", through ? TONE[through.tone].glow : "#2f3843");
        ring.setAttribute("stroke-width", through ? "2" : "1");
      }
      daemon.current?.setAttribute("transform", `translate(${mid.x.toFixed(2)} ${mid.y.toFixed(2)})`);

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
          n.y += 1.6;
        }
        if (p.s >= 1) {
          flash(p.dir === "out" ? "r" : "l", p.to);
          land(p.dir === "out" ? "r" : "l");
          kick(p.dir === "out" ? "b" : "a", 5);
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
      daemon.current?.setAttribute("transform", `translate(${ns[N / 2].x.toFixed(2)} ${ns[N / 2].y.toFixed(2)})`);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      cool.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("blur", out);
      document.documentElement.style.userSelect = "";
    };
  }, []);

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
      {!grabbed && (
        <div className="absolute font-mono text-[9.5px] uppercase tracking-[0.16em] text-fg-4" style={{ left: 26, top: STAGE.h - 34 }}>
          ✥ the cable is real — flick it
        </div>
      )}
      <Socket x={A.x} w={244} side="l" caption="claude-api · hooks" face={left} hot={left.hot} />
      <Socket x={B.x} w={330} side="r" caption="telegram · @aipagerbot" face={right} hot={right.hot} />
      <svg
        viewBox={`0 0 ${STAGE.w} ${STAGE.h}`}
        className="absolute inset-0 h-full w-full"
        style={{ cursor: grabbing ? "grabbing" : undefined }}
        aria-hidden
      >
        <defs>
          <linearGradient id="cable-skin" gradientUnits="userSpaceOnUse" x1={A.x} y1="0" x2={B.x} y2="0">
            <stop offset="0" stopColor="#8c5440" />
            <stop offset="0.18" stopColor="#4a4f57" />
            <stop offset="0.82" stopColor="#3e5468" />
            <stop offset="1" stopColor="#2b6f96" />
          </linearGradient>
          <filter id="cable-glow" x="-30%" y="-400%" width="160%" height="900%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* the plugs */}
        {[A, B].map((p, i) => (
          <g key={p.x} data-plug={i === 0 ? "l" : "r"} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={p.x - 11} y={p.y - 12} width="22" height="11" rx="2" fill="#2b323b" stroke="#454d58" strokeWidth="0.8" />
            <rect x={p.x - 11} y={p.y - 12} width="22" height="3.4" rx="1.6" fill="#596472" opacity="0.5" />
            <path d={`M${p.x - 7} ${p.y - 2}L${p.x + 7} ${p.y - 2}L${p.x + 5} ${p.y + 9}Q${p.x} ${p.y + 12} ${p.x - 5} ${p.y + 9}Z`} fill="#171c23" stroke="#353d47" strokeWidth="0.8" />
            <circle cx={p.x} cy={p.y + 7} r="2.4" fill="#05080c" />
          </g>
        ))}
        <circle ref={sparkA} cx={A.x} cy={A.y + 8} r="5" fill="none" stroke="#9ad8ff" strokeWidth="2" opacity="0" />
        <circle ref={sparkB} cx={B.x} cy={B.y + 8} r="5" fill="none" stroke="#a8f0c6" strokeWidth="2" opacity="0" />
        <path ref={shade} fill="none" stroke="#04070b" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
        <path ref={hit} fill="none" stroke="transparent" strokeWidth="30" strokeLinecap="round" style={{ pointerEvents: "stroke", cursor: grabbing ? "grabbing" : "grab" }} />
        <path ref={main} fill="none" stroke="url(#cable-skin)" strokeWidth="6.5" strokeLinecap="round" />
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
          <circle r="16" fill="#0b0f14" stroke="#2f3843" />
          <g transform="translate(-9 -9) scale(0.281)">
            <rect x="2" y="2" width="60" height="60" rx="14" fill="#181C20" stroke="#3a4048" />
            <path d="M16 24 L26 32 L16 40" stroke="#F6F7F8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="30" y="29" width="8" height="6" rx="1" fill="#F6F7F8" />
            <circle cx="48" cy="20" r="6" fill="#3FA9F5" fillOpacity="0.22" />
            <circle cx="48" cy="20" r="3" fill="#3FA9F5" />
          </g>
          <text y="30" textAnchor="middle" className="fill-[#6a7682] font-mono" fontSize="9">
            aipager daemon
          </text>
        </g>
      </svg>
    </div>
  );
}

function Socket({ x, w, side, caption, face, hot }: { x: number; w: number; side: "l" | "r"; caption: string; face: Face; hot: boolean }) {
  return (
    <div data-socket={side} className="absolute" style={{ left: x - w / 2, top: SOCKET.top, width: w, height: SOCKET.h }}>
      <div className={`h-full rounded-b-xl border border-t-0 px-3 pb-4 pt-1.5 transition-colors duration-200 ${hot ? "border-white/20 bg-[#121922]" : "border-white/10 bg-[#0c1117]"}`}>
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
              hot ? (side === "l" ? "bg-[#9ad8ff] shadow-[0_0_8px_2px_rgb(42_171_238/0.8)]" : "bg-[#a8f0c6] shadow-[0_0_8px_2px_rgb(79_214_147/0.7)]") : "bg-white/15"
            }`}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg-4">{caption}</span>
        </div>
        <div className={`truncate font-mono text-[12px] transition-colors duration-200 ${hot ? "text-white" : "text-fg-3"}`}>{face.text}</div>
      </div>
    </div>
  );
}
