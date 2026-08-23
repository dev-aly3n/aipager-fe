// AskUserQuestion inside a real phone: Claude asks, the inline keyboard gets
// a tap, work continues. The whole loop is CSS (percent-staged keyframes over
// one 10s cycle), so there is no JS to break. The option list and the
// answered state are overlaid in one grid cell, so the swap never shifts
// layout.

import { PhoneShell, TgReplyBar } from "./phone";

export function Answer() {
  return (
    <section id="features" className="overflow-hidden py-16 lg:py-24">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2">
        <div className="v-cycle relative order-2 mx-auto lg:order-1" aria-hidden>
          <div
            className="pointer-events-none absolute -inset-10 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(closest-side, var(--accent), transparent)" }}
          />
          <div className="relative">
            <PhoneShell width={240} label="Telegram showing a Claude question with tappable options">
              <div className="flex min-h-0 flex-1 flex-col justify-end gap-1.5 overflow-hidden px-2.5 pb-2 pt-1 text-[12px]">
                {/* Claude's question */}
                <div className="v-early max-w-[92%] self-start rounded-2xl rounded-bl-md bg-[var(--tg-in)] px-3 py-2">
                  <div className="font-semibold text-[var(--tg-fg)]">❓ api — Claude asks</div>
                  <div className="mt-0.5 text-[11.5px] text-[var(--tg-dim)]">
                    Which database should the new service use?
                  </div>
                </div>

                {/* inline keyboard ⇄ answered — overlaid, no layout shift */}
                <div className="grid">
                  <div className="v-out col-start-1 row-start-1 grid gap-[3px]">
                    <div className="tg-btn relative">
                      Postgres
                      <span className="v-ring absolute inset-0 rounded-[7px] border-2 border-[var(--tg-accent)]" />
                    </div>
                    <div className="tg-btn">SQLite</div>
                    <div className="tg-btn">Redis</div>
                  </div>
                  <div className="v-late col-start-1 row-start-1 flex flex-col gap-1.5 self-start">
                    <div className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-[var(--tg-out)] px-2.5 py-1.5 text-[var(--tg-fg)]">
                      ✅ Postgres
                    </div>
                    <div className="max-w-[92%] self-start rounded-2xl rounded-bl-md bg-[var(--tg-in)] px-3 py-2">
                      <span className="text-[var(--tg-ok)]">● </span>
                      <span className="text-[var(--tg-dim)]">
                        Scaffolding the Postgres schema…
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <TgReplyBar />
            </PhoneShell>
          </div>
        </div>

        <div className="order-1 max-w-lg lg:order-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Questions
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            When Claude asks, you tap.
          </h2>
          <p className="mt-4 leading-relaxed text-dim">
            Claude Code&apos;s multiple-choice questions land in Telegram as
            real buttons — one per option, checkboxes where the question
            allows several. Decisions stop waiting for you to get back to the
            desk.
          </p>
        </div>
      </div>
    </section>
  );
}
