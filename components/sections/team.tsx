type Cell = boolean | string;

const ROLES: { id: string; tone: string; note: string }[] = [
  { id: "owner", tone: "text-live border-live/40 bg-live/10", note: "the person who runs the machine" },
  { id: "admin", tone: "text-accent border-accent/40 bg-accent/10", note: "someone you would give a shell" },
  { id: "user", tone: "text-fg-2 border-white/20 bg-white/[0.05]", note: "prompts and approves, inside the project" },
  { id: "read_only", tone: "text-fg-3 border-white/12 bg-transparent", note: "sees everything, drives nothing" },
];

// From docs/groups.md → Roles.
const ROWS: { what: string; cells: Cell[] }[] = [
  { what: "Send prompts", cells: [true, true, true, false] },
  { what: "Approve tool calls", cells: [true, true, true, false] },
  { what: "Bypass deny rules", cells: [true, true, false, false] },
  { what: "Bypass the safety floor", cells: [true, false, false, false] },
  { what: "Bash", cells: [true, "best-effort rules", false, false] },
  { what: "Writes", cells: ["anywhere", "where the floor allows", "project + scratchpad", "project + scratchpad"] },
];

function Mark({ c }: { c: Cell }) {
  if (typeof c === "string") return <span className="text-[12.5px] text-fg-2">{c}</span>;
  return c ? (
    <span className="mx-auto block h-2.5 w-2.5 rounded-full bg-live shadow-[0_0_12px_rgb(79_214_147/0.6)]" aria-label="yes" />
  ) : (
    <span className="mx-auto block h-2.5 w-2.5 rounded-full border border-white/20" aria-label="no" />
  );
}

export function Team() {
  return (
    <section id="team" className="border-t border-white/[0.06] py-32">
      <div className="wrap">
        <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-end gap-16">
          <div>
            <div className="eyebrow">Team mode</div>
            <h2 className="mt-4 text-[clamp(34px,3.6vw,52px)] font-semibold leading-[1.04] tracking-[-0.04em]">Bring the team. Keep the keys.</h2>
          </div>
          <div className="text-[16.5px] leading-relaxed text-fg-2">
            Put the bot in a group and anyone on the allow-list can mention it:{" "}
            <code className="whitespace-nowrap rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[0.86em] text-foreground">
              @aipagerbot /api run the tests
            </code>
            . Every message runs with its sender&apos;s role, a tool the role may not use is refused before it runs, and the audit log records who
            decided what.
          </div>
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="w-[26%] px-7 py-5 font-mono text-[11.5px] font-normal uppercase tracking-[0.14em] text-fg-4">Role</th>
                {ROLES.map((r) => (
                  <th key={r.id} className="px-4 py-5 text-center font-normal">
                    <span className={`inline-block rounded-full border px-3 py-1 font-mono text-[12.5px] ${r.tone}`}>{r.id}</span>
                    <div className="mt-2 text-[12px] text-fg-3">{r.note}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.what} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.015]">
                  <td className="px-7 py-4 text-[14.5px] text-fg-2">{row.what}</td>
                  {row.cells.map((c, i) => (
                    <td key={i} className="px-4 py-4 text-center">
                      <Mark c={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 flex items-start gap-2.5 text-[13.5px] text-fg-3">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
          Adding someone gives them code execution on the machine that runs the daemon. Treat the list like SSH access.{" "}
          <a href="/docs/groups" className="whitespace-nowrap text-accent hover:underline">
            How team mode works →
          </a>
        </p>
      </div>
    </section>
  );
}
