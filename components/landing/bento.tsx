// The rest of the toolbox as a bento grid — every cell gets its own little
// visual instead of another row of identical feature cards.

function Cell({
  title,
  span,
  children,
}: {
  title: string;
  span?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`min-w-0 rounded-xl border border-border bg-surface p-5 ${span ?? ""}`}>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function Bento() {
  return (
    <section className="py-16 lg:py-24">
      <div className="wrap">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">
            Everything else
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Small daemon, deep toolbox.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Cell title="Keep talking — it queues" span="lg:col-span-2">
            <p className="text-sm text-dim">
              Messages reach Claude immediately, mid-turn included — exactly
              like typing into the terminal. Send five; each gets picked up at
              a natural boundary.
            </p>
            <div className="mt-3 flex flex-col gap-1.5 text-[13px]">
              <div className="self-end rounded-2xl rounded-br-md bg-accent/20 px-3 py-1.5">
                also bump the deps <span className="ml-1 text-xs">👍</span>
              </div>
              <div className="self-end rounded-2xl rounded-br-md bg-accent/20 px-3 py-1.5">
                and write a changelog entry <span className="ml-1 text-xs">👀</span>
              </div>
              <div className="text-xs text-dim">
                👀 sent to the session · 👍 Claude picked it up
              </div>
            </div>
          </Cell>

          <Cell title="Voice notes work">
            <div className="flex items-end gap-[3px]" aria-hidden>
              {[5, 9, 14, 8, 16, 11, 6, 13, 9, 5, 12, 7].map((h, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-accent/70"
                  style={{ height: h }}
                />
              ))}
            </div>
            <p className="mt-3 text-sm text-dim">
              Transcribed locally with Whisper and injected as your next
              prompt. Audio never leaves the machine.
            </p>
          </Cell>

          <Cell title="Review the diff">
            <div className="rounded-md bg-terminal-bg p-3 font-mono text-[11px] leading-relaxed">
              <div className="text-dim">src/auth/session.ts</div>
              <div className="text-danger">- if (exp &lt; now())</div>
              <div className="text-success">+ if (exp &lt; now_ms())</div>
            </div>
            <p className="mt-3 text-sm text-dim">
              <code className="font-mono">/diff</code> in chat, or the Mini
              App&apos;s viewer for every Write and Edit.
            </p>
          </Cell>

          <Cell title="Drop files in">
            <p className="text-sm text-dim">
              Send a file to the chat — it lands in the session&apos;s
              workspace and Claude gets the path. Screenshots, logs, CSVs.
            </p>
          </Cell>

          <Cell title="Make the keyboard yours">
            <div className="space-y-1.5">
              {[
                ["Deploy staging", "Write tests", "Explain plan"],
                ["/compact", "/clear", "/model opus"],
              ].map((row, i) => (
                <div key={i} className="flex gap-1.5">
                  {row.map((k) => (
                    <span
                      key={k}
                      className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-dim"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-dim">
              Templates, commands and model switches — override any of it with
              <code className="ml-1 font-mono">keyboard.json</code>.
            </p>
          </Cell>

          <Cell title="Bring the team" span="lg:col-span-2">
            <div className="flex flex-wrap gap-1.5">
              {[
                ["owner", "text-accent border-accent/50"],
                ["admin", "text-success border-success/40"],
                ["user", "text-foreground border-border"],
                ["read_only", "text-dim border-border"],
              ].map(([role, cls]) => (
                <span key={role} className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${cls}`}>
                  {role}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-dim">
              Group mode with per-user roles: every message runs with its
              sender&apos;s permissions, never whoever drove last. Denied
              tools are auto-rejected, and every decision is audited:
            </p>
            <div className="mt-2 rounded-md bg-terminal-bg px-3 py-2 font-mono text-[11px] text-terminal-fg">
              ✅ [jim] · Allowed by @alice · Bash: ls -la /tmp
            </div>
          </Cell>

          <Cell title="Tune the feed">
            <p className="text-sm text-dim">
              <code className="font-mono">/settings</code> — message layout,
              formatting and language. Stall warnings and context alerts nudge
              you before a session needs rescuing.
            </p>
          </Cell>
        </div>
      </div>
    </section>
  );
}
