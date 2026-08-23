// Sessions + the Mini App: one wide panel, two ways in. The dashboard mock
// mirrors what `/app` actually serves (session list, per-session actions,
// diff viewer, settings) and the chat column mirrors the `/new` wizard.

function ChatWay() {
  return (
    <div className="flex flex-col gap-2 text-[13px]">
      <div className="self-end rounded-2xl rounded-br-md bg-accent/20 px-3.5 py-2">
        /new api
      </div>
      <div className="max-w-[90%] self-start rounded-2xl rounded-bl-md border border-border bg-surface px-3.5 py-2.5">
        <div className="font-semibold">New session — pick a mode:</div>
        <div className="mt-2 grid grid-cols-2 gap-1 text-center text-xs">
          <span className="rounded-md bg-background px-2 py-1.5 ring-1 ring-accent/60">🔐 Ask</span>
          <span className="rounded-md bg-background px-2 py-1.5">⚡ Auto</span>
        </div>
        <div className="mt-1 text-[11px] text-dim">then model → folder, two taps more</div>
      </div>
      <div className="max-w-[90%] self-start rounded-2xl rounded-bl-md border border-border bg-surface px-3.5 py-2">
        ✅ <span className="font-semibold">api</span> created ·{" "}
        <span className="text-dim">sonnet · ~/work/api</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {["/status", "/resume", "/rename", "/diff", "/kill"].map((c) => (
          <code key={c} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-dim">
            {c}
          </code>
        ))}
      </div>
    </div>
  );
}

const SESSIONS: {
  name: string;
  dot: string;
  state: string;
  detail: string;
  meta: string;
  action: string;
}[] = [
  {
    name: "jim",
    dot: "bg-warning",
    state: "busy",
    detail: "Editing src/server/handlers.ts",
    meta: "ctx 42% · $0.31",
    action: "⏹",
  },
  {
    name: "api",
    dot: "bg-success",
    state: "idle",
    detail: "42/42 tests green",
    meta: "ctx 22% · sonnet",
    action: "🔄",
  },
  {
    name: "docs",
    dot: "bg-accent",
    state: "waiting",
    detail: "❓ Which database should…",
    meta: "needs an answer",
    action: "💬",
  },
];

function MiniAppWay() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/70 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-sm font-semibold">Sessions</span>
        <span className="rounded-md bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
          + New
        </span>
      </div>
      <div className="divide-y divide-border/70">
        {SESSIONS.map((s) => (
          <div key={s.name} className="flex items-center gap-3 px-4 py-3">
            <span className={`size-2 shrink-0 rounded-full ${s.dot}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm font-semibold">{s.name}</span>
                <span className="text-[11px] text-dim">{s.state}</span>
              </div>
              <div className="truncate text-xs text-dim">{s.detail}</div>
            </div>
            <span className="hidden text-[11px] text-dim sm:block">{s.meta}</span>
            <span className="rounded-md border border-border px-2 py-1 text-xs">{s.action}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-5 border-t border-border px-4 py-2 text-xs text-dim">
        <span className="font-medium text-foreground">Sessions</span>
        <span>Diff</span>
        <span>Settings</span>
      </div>
    </div>
  );
}

export function Fleet() {
  return (
    <section className="py-16 lg:py-24">
      <div className="wrap">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Sessions & the Mini App
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Run a fleet, not a window.
          </h2>
          <p className="mt-4 leading-relaxed text-dim">
            Sessions are first-class: each has its own status, model, working
            directory and cost. Start one in chat with{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm">/new</code>,
            or from the Mini App dashboard the daemon serves right inside
            Telegram — same actions in both.
          </p>
        </div>

        <div className="mt-10 grid gap-6 rounded-2xl border border-border bg-surface/40 p-6 sm:p-8 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
          <div className="min-w-0">
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-dim">
              In the chat
            </div>
            <ChatWay />
          </div>
          <div className="min-w-0">
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-dim">
              In the Mini App
            </div>
            <MiniAppWay />
            <p className="mt-3 text-xs text-dim">
              On by default (<code className="font-mono">aipager miniapp status</code>) —
              every request verified against Telegram&apos;s initData signature.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
