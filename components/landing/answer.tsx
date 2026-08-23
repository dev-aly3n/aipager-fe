// AskUserQuestion, as a floating chat fragment — no phone frame, just the
// moment: Claude asks, you tap, work continues. The whole loop is CSS
// (percent-staged keyframes over one 10s cycle), so there is no JS to break.

export function Answer() {
  return (
    <section id="features" className="overflow-hidden py-16 lg:py-24">
      <div className="wrap grid items-center gap-10 lg:grid-cols-2">
        <div className="max-w-lg">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Questions
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            When Claude asks, you tap.
          </h2>
          <p className="mt-4 leading-relaxed text-dim">
            Claude Code&apos;s multiple-choice questions land in Telegram as
            real buttons — one per option, checkboxes where the question
            allows several. Decisions stop waiting for you to get back to
            the desk.
          </p>
        </div>

        <div className="v-cycle relative mx-auto w-full max-w-sm" aria-hidden>
          <div
            className="pointer-events-none absolute -inset-8 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
          />
          <div className="relative space-y-2 text-[13px]">
            {/* Claude's question */}
            <div className="v-early rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3 shadow-xl">
              <div className="font-semibold">❓ api — Claude asks</div>
              <div className="mt-1 text-dim">
                Which database should the new service use?
              </div>
            </div>

            {/* options ⇄ answered — overlaid in one grid cell so the swap
                doesn't shift layout */}
            <div className="grid">
              <div className="v-out col-start-1 row-start-1 space-y-[3px]">
                <div className="v-tapbtn relative rounded-lg border border-border bg-surface px-3 py-2 text-center shadow-lg">
                  Postgres
                  <span className="v-ring absolute inset-0 rounded-lg border-2 border-accent" />
                </div>
                <div className="rounded-lg border border-border bg-surface px-3 py-2 text-center shadow-lg">
                  SQLite
                </div>
                <div className="rounded-lg border border-border bg-surface px-3 py-2 text-center shadow-lg">
                  Redis
                </div>
              </div>
              <div className="v-late col-start-1 row-start-1 self-start">
                <div className="rounded-2xl rounded-br-md bg-accent/20 px-4 py-2 text-right font-medium text-foreground shadow-lg">
                  ✅ Postgres
                </div>
              </div>
            </div>

            {/* Claude continues */}
            <div className="v-later rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3 shadow-xl">
              <div className="flex gap-2 text-dim">
                <span className="text-success">●</span>
                Scaffolding the Postgres schema…
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
