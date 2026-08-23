// The hero mirror's one scenario, as data. The player derives the complete
// visual state for any point in (virtual) time by folding these steps, so
// there are no timers to leak and no cleanup to get wrong: pause, loop and
// the permission hold all fall out of how time is computed, not managed.

// ---------- terminal ----------

export type TermLine =
  | { id: string; kind: "banner" }
  | { id: string; kind: "prompt"; text: string }
  | { id: string; kind: "text"; text: string }
  | { id: string; kind: "tool"; name: string; arg: string; result?: string }
  | { id: string; kind: "spinner"; verb: string; sinceMs: number }
  | {
      id: string;
      kind: "perm";
      tool: string;
      cmd: string;
      desc: string;
      resolved?: boolean;
    };

// ---------- phone ----------

export type PhoneTool = { icon: "done" | "run"; label: string };

export type PhoneStatus = {
  kind: "working" | "perm";
  verb: string;
  sinceMs: number;
  tools: PhoneTool[];
  permCmd?: string;
  permDesc?: string;
  resolved?: "allow";
};

export type PhoneState = {
  typed: string;
  user?: { text: string; reaction?: "sent" | "picked" };
  status?: PhoneStatus;
  audit?: string;
  result?: { headline: string; text: string };
};

export type MirrorState = {
  term: TermLine[];
  phone: PhoneState;
  fading: boolean;
};

// ---------- steps ----------

export type Step = { at: number } & (
  | { do: "type"; text: string; ms: number }
  | { do: "send" }
  | { do: "picked"; verb: string; termVerb: string }
  | { do: "term"; line: TermLine }
  | { do: "term-result"; id: string; result: string }
  | { do: "term-rm"; id: string }
  | { do: "verb"; verb: string }
  | { do: "tool"; icon: "done" | "run"; label: string }
  | { do: "perm"; tool: string; cmd: string; desc: string; hold: number }
  | { do: "resolved" }
  | { do: "audit"; text: string }
  | { do: "finish"; headline: string; text: string }
  | { do: "fade" }
);

export const SESSION = "api";
export const PROMPT = "fix the failing auth test";
const TEST_CMD = "pnpm test --filter auth";

// Virtual-time timeline. Steps after the `perm` step only ever run once the
// permission is resolved (tap or auto), because virtual time holds there.
export const SCENARIO: Step[] = [
  { at: 0, do: "term", line: { id: "banner", kind: "banner" } },
  { at: 700, do: "type", text: PROMPT, ms: 1500 },
  { at: 2450, do: "send" },
  { at: 2650, do: "term", line: { id: "p1", kind: "prompt", text: PROMPT } },
  { at: 3150, do: "picked", verb: "Cogitating", termVerb: "Pondering" },
  {
    at: 3950,
    do: "term",
    line: {
      id: "t1",
      kind: "text",
      text: "The token-expiry test is failing — reading it first.",
    },
  },
  {
    at: 4500,
    do: "term",
    line: { id: "read1", kind: "tool", name: "Read", arg: "src/auth/auth.test.ts" },
  },
  { at: 4500, do: "tool", icon: "done", label: "Read auth.test.ts" },
  { at: 5000, do: "term-result", id: "read1", result: "Read 88 lines" },
  { at: 5450, do: "verb", verb: "Investigating" },
  {
    at: 5750,
    do: "term",
    line: { id: "read2", kind: "tool", name: "Read", arg: "src/auth/session.ts" },
  },
  { at: 5750, do: "tool", icon: "done", label: "Read session.ts" },
  { at: 6250, do: "term-result", id: "read2", result: "Read 142 lines" },
  {
    at: 7050,
    do: "term",
    line: {
      id: "t2",
      kind: "text",
      text: "Found it — the expiry check compares seconds against a millisecond timestamp.",
    },
  },
  { at: 7600, do: "verb", verb: "Fixing" },
  {
    at: 7800,
    do: "term",
    line: { id: "edit1", kind: "tool", name: "Update", arg: "src/auth/session.ts" },
  },
  { at: 7800, do: "tool", icon: "run", label: "Edit session.ts" },
  {
    at: 8400,
    do: "term-result",
    id: "edit1",
    result: "Updated with 4 additions and 1 removal",
  },
  // --- the product moment: approval travels through your phone -------------
  {
    at: 9300,
    do: "perm",
    tool: "Bash command",
    cmd: TEST_CMD,
    desc: "Re-run the auth test suite",
    hold: 3500,
  },
  { at: 9360, do: "resolved" },
  { at: 9700, do: "audit", text: `Allowed · Bash: ${TEST_CMD}` },
  { at: 9900, do: "term-rm", id: "perm" },
  {
    at: 9900,
    do: "term",
    line: { id: "bash1", kind: "tool", name: "Bash", arg: TEST_CMD },
  },
  {
    at: 9900,
    do: "term",
    line: { id: "spin2", kind: "spinner", verb: "Testing", sinceMs: 9900 },
  },
  { at: 9960, do: "verb", verb: "Running tests" },
  { at: 11900, do: "term-result", id: "bash1", result: "42 passed · 0 failed (6.8s)" },
  { at: 12600, do: "term-rm", id: "spin2" },
  {
    at: 12600,
    do: "term",
    line: {
      id: "t3",
      kind: "text",
      text: "All green — the expiry check now compares milliseconds.",
    },
  },
  {
    at: 13100,
    do: "finish",
    headline: "Finished · 42/42 green",
    text: "Fixed the expiry check in session.ts — all auth tests pass.",
  },
  { at: 17200, do: "fade" },
];

export const SCENARIO_END = 17800;

const permStep = SCENARIO.find((s) => s.do === "perm");
if (!permStep) throw new Error("scenario must contain a perm step");
export const PERM_AT = permStep.at;
export const PERM_HOLD = (permStep as Extract<Step, { do: "perm" }>).hold;

// ---------- the fold ----------

export function stateAt(v: number): MirrorState {
  let term: TermLine[] = [];
  let phone: PhoneState = { typed: "" };
  let fading = false;

  const replaceLine = (id: string, patch: Partial<TermLine>) => {
    term = term.map((l) => (l.id === id ? ({ ...l, ...patch } as TermLine) : l));
  };

  for (const step of SCENARIO) {
    if (step.at > v) break;
    switch (step.do) {
      case "type": {
        const done = Math.min(1, (v - step.at) / step.ms);
        phone = { ...phone, typed: step.text.slice(0, Math.round(step.text.length * done)) };
        break;
      }
      case "send":
        phone = { ...phone, typed: "", user: { text: PROMPT, reaction: "sent" } };
        break;
      case "picked":
        phone = {
          ...phone,
          user: phone.user && { ...phone.user, reaction: "picked" },
          status: { kind: "working", verb: step.verb, sinceMs: step.at, tools: [] },
        };
        term = [
          ...term,
          { id: "spin", kind: "spinner", verb: step.termVerb, sinceMs: step.at },
        ];
        break;
      case "term":
        term = [...term, step.line];
        break;
      case "term-result":
        replaceLine(step.id, { result: step.result });
        break;
      case "term-rm":
        term = term.filter((l) => l.id !== step.id);
        break;
      case "verb":
        if (phone.status) {
          phone = {
            ...phone,
            status: {
              ...phone.status,
              kind: "working",
              verb: step.verb,
              permCmd: undefined,
              permDesc: undefined,
              resolved: undefined,
            },
          };
        }
        break;
      case "tool":
        if (phone.status) {
          phone = {
            ...phone,
            status: {
              ...phone.status,
              tools: [...phone.status.tools, { icon: step.icon, label: step.label }],
            },
          };
        }
        break;
      case "perm":
        term = term.filter((l) => l.id !== "spin");
        term = [
          ...term,
          { id: "perm", kind: "perm", tool: step.tool, cmd: step.cmd, desc: step.desc },
        ];
        if (phone.status) {
          phone = {
            ...phone,
            status: {
              ...phone.status,
              kind: "perm",
              verb: "Permission needed",
              permCmd: step.cmd,
              permDesc: step.desc,
            },
          };
        }
        break;
      case "resolved":
        replaceLine("perm", { resolved: true });
        if (phone.status) {
          phone = { ...phone, status: { ...phone.status, resolved: "allow" } };
        }
        break;
      case "audit":
        phone = { ...phone, audit: step.text };
        break;
      case "finish":
        phone = {
          ...phone,
          status: undefined,
          result: { headline: step.headline, text: step.text },
        };
        break;
      case "fade":
        fading = true;
        break;
    }
  }

  return { term, phone, fading };
}
