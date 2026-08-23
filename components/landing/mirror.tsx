"use client";

import { useMirror } from "./player";
import { Terminal } from "./terminal";
import { Phone } from "./phone";

// The one animated thing on the page: a Claude Code terminal and the
// Telegram phone that mirrors it, playing a single ~20s story on a loop.
// The only interactive moment is the permission prompt — tap Allow on the
// phone (or it allows itself after a beat).
export function Mirror() {
  const { state, v, holding, allow } = useMirror();

  return (
    <div
      className={`flex items-stretch justify-center gap-5 transition-opacity duration-500 ${
        state.fading ? "opacity-0" : "opacity-100"
      }`}
      // Pinned to the phone's natural height (256px wide at the S25's 9:19.5
      // ratio). Without this, items-stretch lets the terminal's CONTENT set
      // the row height, so both panels ballooned whenever the story grew
      // (permission box in) and shrank back after — visible layout shift.
      style={{ height: "calc(256px * 19.5 / 9)" }}
    >
      <div className="hidden max-w-[520px] flex-1 md:flex">
        <Terminal lines={state.term} v={v} />
      </div>
      <Phone phone={state.phone} v={v} holding={holding} onAllow={allow} />
    </div>
  );
}
