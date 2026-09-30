import { MOMENTS, SESSIONS } from "@/components/day/timeline";

const FROM = 7;
const TO = 24;
const x = (h: number): string => `${((Math.min(TO, Math.max(FROM, h)) - FROM) / (TO - FROM)) * 100}%`;

/** The day as a strip: each session's hours fill in as the clock passes them. */
export function DayStrip({ hour, active, onPick }: { hour: number; active: number; onPick: (k: number) => void }) {
  const night = hour >= 19.4;
  return (
    <div className="relative select-none">
      {/* hours */}
      <div className="relative h-4 font-mono text-[10px] text-[var(--muted)]">
        {[8, 10, 12, 14, 16, 18, 20, 22, 24].map((h) => (
          <span key={h} className="absolute -translate-x-1/2" style={{ left: x(h) }}>
            {String(h % 24).padStart(2, "0")}
          </span>
        ))}
      </div>
      {/* sessions */}
      <div className="relative mt-1.5 space-y-[5px] rounded-xl border border-[var(--line)] bg-[var(--glass)] px-0 py-2 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-y-0 rounded-r-xl bg-[var(--ink)] opacity-[0.05]" style={{ left: x(19.5), right: 0 }} />
        {SESSIONS.map((s) => (
          <div key={s.name} className="relative h-[7px]">
            <span className="absolute -left-12 top-1/2 w-10 -translate-y-1/2 text-right font-mono text-[10px]" style={{ color: s.color }}>
              {s.name}
            </span>
            <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[var(--line)]" />
            {s.spans
              .filter((sp) => sp.from < hour)
              .map((sp, i) => (
                <span
                  key={i}
                  className="absolute top-0 h-full rounded-full"
                  style={{ left: x(sp.from), width: `calc(${x(Math.min(sp.to, hour))} - ${x(sp.from)})`, background: sp.waiting ? "#f2b84b" : s.color }}
                />
              ))}
          </div>
        ))}
        {/* now */}
        <div className="pointer-events-none absolute -top-1 bottom-[-4px] w-px bg-[var(--ink)] opacity-50" style={{ left: x(hour) }} />
        <div className="pointer-events-none absolute -top-[26px] -translate-x-1/2" style={{ left: x(hour) }}>
          {night ? (
            <span className="block h-4 w-4 rounded-full bg-[#e9ecf7] shadow-[inset_-4px_-2px_0_0_var(--sky-top)]" />
          ) : (
            <span className="block h-4 w-4 rounded-full bg-[#ffb347] shadow-[0_0_14px_4px_rgb(255_180_80/0.55)]" />
          )}
        </div>
      </div>
      {/* the moments: a dot each, the one being told labelled */}
      <div className="relative mt-2 h-7">
        {MOMENTS.slice(1).map((m, i) => {
          const on = i + 1 === active;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onPick(i + 1)}
              title={`${m.time} · ${m.place}`}
              className={`group absolute top-0 flex -translate-x-1/2 flex-col items-center ${on ? "z-10" : ""}`}
              style={{ left: x(m.h) }}
            >
              <span className={`block rounded-full transition-all ${on ? "h-2.5 w-2.5 bg-[var(--ink)]" : m.h <= hour ? "h-2 w-2 bg-[var(--ink)] opacity-60 group-hover:opacity-100" : "h-2 w-2 border border-[var(--muted)] group-hover:bg-[var(--muted)]"}`} />
              <span className={`mt-1 whitespace-nowrap rounded-full px-1.5 font-mono text-[10.5px] ${on ? "bg-[var(--ink)] text-[var(--sky-bottom)]" : "hidden text-[var(--muted)] group-hover:block"}`}>
                {m.time}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
