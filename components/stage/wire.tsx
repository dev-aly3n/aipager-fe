import type { Packet, Tone } from "./script";

const COLOR: Record<Tone, string> = {
  fg: "text-[#e8ebee]",
  dim: "text-[#7f8791]",
  accent: "text-accent",
  live: "text-live",
  amber: "text-amber",
  deny: "text-danger",
  claude: "text-[#d97757]",
};

/**
 * The link between the desk and the pocket: hook events leave the terminal
 * for the daemon's socket and go on to Telegram; taps come back as
 * keystrokes typed into the session's terminal.
 */
export function Wire({ packets, busy }: { packets: Packet[]; busy: boolean }) {
  return (
    <div className="relative h-full w-full">
      <div className="wire-line absolute inset-x-0 top-1/2 h-px -translate-y-1/2" />
      {/* the daemon */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
        <div
          className={`mx-auto grid h-11 w-11 place-items-center rounded-full border bg-[#0d1014] transition-colors duration-300 ${
            busy ? "border-accent/60 shadow-[0_0_30px_-4px_rgb(63_169_245/0.55)]" : "border-white/15"
          }`}
        >
          <span className={`h-2.5 w-2.5 rounded-full bg-accent ${busy ? "dot-pulse" : "opacity-60"}`} />
        </div>
        <div className="mt-2 whitespace-nowrap font-mono text-[10px] leading-tight text-fg-3">
          aipager
          <br />
          daemon
        </div>
      </div>
      {packets.map((p) => (
        <span key={p.id} className={`packet z-20 ${p.dir} ${COLOR[p.tone]}`}>
          {p.dir === "left" ? "← " : ""}
          {p.label}
          {p.dir === "right" ? " →" : ""}
        </span>
      ))}
    </div>
  );
}
