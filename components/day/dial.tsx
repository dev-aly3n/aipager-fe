import { MOMENTS, SESSIONS } from "./timeline";

/** Noon at the top, midnight at the bottom; 6 on the left, 18 on the right. */
const angle = (h: number): number => ((h / 24) * 360 + 180) * (Math.PI / 180);
// Rounded, so the server and the browser draw exactly the same numbers.
const round = (v: number): number => Math.round(v * 100) / 100;
const pt = (h: number, r: number): [number, number] => [round(r * Math.sin(angle(h))), round(-r * Math.cos(angle(h)))];

function arc(from: number, to: number, r: number): string {
  const [x1, y1] = pt(from, r);
  const [x2, y2] = pt(to, r);
  const large = ((to - from) / 24) * 360 > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

/** A ring segment between two radii, clockwise from `from` to `to`. */
function sector(from: number, to: number, outer: number, inner: number): string {
  const [ox1, oy1] = pt(from, outer);
  const [ox2, oy2] = pt(to, outer);
  const [ix2, iy2] = pt(to, inner);
  const [ix1, iy1] = pt(from, inner);
  const large = ((to - from) / 24) * 360 > 180 ? 1 : 0;
  return `M ${ox1} ${oy1} A ${outer} ${outer} 0 ${large} 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${large} 0 ${ix1} ${iy1} Z`;
}

const RING = [236, 214, 192];

export function Dial({ hour, active }: { hour: number; active: number }) {
  const [hx, hy] = pt(hour, 262);
  const night = hour >= 19.4 || hour < 6.3;
  return (
    <svg viewBox="-310 -310 620 620" className="h-full w-full overflow-visible" aria-hidden>
      {/* night sector: 19:30 to 06:00, under the horizon */}
      <path d={sector(19.5, 30, 286, 150)} fill="var(--ink)" opacity="0.04" />
      <circle r="286" fill="none" stroke="var(--line)" />
      <circle r="250" fill="none" stroke="var(--line)" strokeDasharray="1 5" />
      {/* hour ticks */}
      {Array.from({ length: 96 }, (_, i) => {
        const h = i / 4;
        const major = i % 12 === 0;
        const hourTick = i % 4 === 0;
        const [x1, y1] = pt(h, 286);
        const [x2, y2] = pt(h, major ? 272 : hourTick ? 278 : 282);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeOpacity={major ? 0.55 : hourTick ? 0.3 : 0.14} strokeWidth={major ? 1.6 : 1} />;
      })}
      {[0, 3, 6, 9, 12, 15, 18, 21].map((h) => {
        const [x, y] = pt(h, 300);
        return (
          <text key={h} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill="var(--muted)" fontSize="11" fontFamily="var(--font-geist-mono)">
            {String(h).padStart(2, "0")}
          </text>
        );
      })}
      {/* each session's day, drawn up to now */}
      {SESSIONS.map((s, k) => (
        <g key={s.name}>
          <circle r={RING[k]} fill="none" stroke={s.color} strokeOpacity="0.1" strokeWidth="9" />
          {s.spans
            .filter((sp) => sp.from < hour)
            .map((sp, i) => (
              <path
                key={i}
                d={arc(sp.from, Math.min(sp.to, hour), RING[k])}
                fill="none"
                stroke={sp.waiting ? "#f2b84b" : s.color}
                strokeWidth="9"
                strokeLinecap={sp.waiting ? "butt" : "round"}
              />
            ))}
        </g>
      ))}
      {/* the moments it paged you */}
      {MOMENTS.slice(1).map((m, i) => {
        const [x, y] = pt(m.h, 262);
        const past = m.h <= hour + 0.01;
        const on = i + 1 === active;
        return (
          <g key={m.id}>
            {on && <circle cx={x} cy={y} r="11" fill="none" stroke="var(--ink)" strokeOpacity="0.35" className="pin-ring" />}
            <circle cx={x} cy={y} r={on ? 5.5 : 4} fill={past ? "var(--ink)" : "var(--sky-bottom)"} stroke="var(--ink)" strokeOpacity="0.5" />
          </g>
        );
      })}
      {/* the hand, with the sun or the moon */}
      <line x1="0" y1="0" x2={hx} y2={hy} stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="1" />
      <g transform={`translate(${hx} ${hy})`}>
        {night ? (
          <g>
            <circle r="13" fill="#e9ecf7" />
            <circle r="11" cx="6" cy="-4" fill="var(--sky-top)" />
          </g>
        ) : (
          <g>
            <circle r="20" fill="#ffc46b" opacity="0.25" />
            <circle r="12" fill="#ffb347" />
          </g>
        )}
      </g>
    </svg>
  );
}
