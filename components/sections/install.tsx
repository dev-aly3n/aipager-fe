"use client";

import { useState } from "react";
import { CopyButton } from "@/components/brand";

const WAYS: { id: string; label: string; cmd: string; note: string }[] = [
  { id: "sh", label: "install.sh", cmd: "curl -fsSL aipager.run/install | sh", note: "Uses uv, pipx or Homebrew, whichever you already have, and bootstraps uv if you have none." },
  { id: "uv", label: "uv", cmd: "uv tool install aipager", note: "uv brings its own Python, so this works whatever your system Python is doing. The smooth path on macOS." },
  { id: "pipx", label: "pipx", cmd: "pipx install aipager", note: "An isolated venv on your PATH." },
  { id: "brew", label: "Homebrew", cmd: "brew install dev-aly3n/tap/aipager", note: "macOS and Linuxbrew. Pulls dtach from Homebrew's own formula." },
  { id: "docker", label: "Docker", cmd: "docker pull ghcr.io/dev-aly3n/aipager:latest", note: "Python, Node, claude and dtach baked in, amd64 and arm64. Run the wizard once, then the daemon: the README has both lines." },
  { id: "nix", label: "Nix", cmd: "nix profile install github:dev-aly3n/aipager", note: "Built from source against pinned nixpkgs. Install claude separately." },
  { id: "aur", label: "AUR", cmd: "yay -S aipager", note: "Or paru, or any AUR helper. dtach and python-telegram-bot come from pacman." },
  { id: "snap", label: "Snap", cmd: "snap install aipager", note: "Strict confinement with everything bundled; workspaces live under ~/." },
];

const STEPS: { cmd: string; title: string; note: string }[] = [
  { cmd: "curl -fsSL aipager.run/install | sh", title: "Install", note: "Linux or macOS, any architecture. dtach comes with it." },
  { cmd: "aipager config", title: "Configure", note: "A wizard takes your bot token from @BotFather and your chat, checks both, and wires Claude Code's hooks. No file to edit by hand." },
  { cmd: "aipager start", title: "Run", note: "The daemon. aipager service install keeps it up after you log out, with systemd or launchd." },
  { cmd: "aipager session api", title: "Walk away", note: "Claude Code in a dtach session. Detach with Ctrl-\\ and Telegram takes over." },
];

export function Install() {
  const [way, setWay] = useState(WAYS[0]);
  return (
    <section id="install" className="relative overflow-hidden border-t border-white/[0.06] py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_at_50%_0%,rgb(63_169_245/0.10),transparent_65%)]" />
      <div className="wrap relative">
        <div className="text-center">
          <div className="eyebrow">Install</div>
          <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(36px,4.2vw,60px)] font-semibold leading-[1.02] tracking-[-0.04em]">
            One line to install. <span className="text-fg-3">Four to walk away.</span>
          </h2>
        </div>

        {/* the ways to install */}
        <div className="mt-14 flex flex-wrap justify-center gap-1.5">
          {WAYS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWay(w)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[12.5px] transition-colors ${
                w.id === way.id ? "bg-foreground text-[#0a0c0f]" : "text-fg-3 hover:bg-white/[0.06] hover:text-foreground"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-6 max-w-4xl">
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0d1014] py-5 pl-7 pr-4 shadow-[0_30px_80px_-40px_rgb(63_169_245/0.45)]">
            <span className="font-mono text-[clamp(18px,2vw,28px)] text-accent">$</span>
            <span key={way.id} className="min-w-0 flex-1 truncate font-mono text-[clamp(16px,2vw,28px)] tracking-[-0.01em] text-foreground">
              {way.cmd}
            </span>
            <CopyButton
              text={way.cmd}
              className="shrink-0 rounded-xl border border-white/12 px-4 py-2 text-[13px] text-fg-2 transition-colors hover:border-accent hover:text-foreground"
            />
          </div>
          <p className="mt-4 text-center text-[14px] text-fg-3">{way.note}</p>
        </div>

        {/* the four steps, on one line */}
        <div className="relative mt-24">
          <div className="absolute left-[12.5%] right-[12.5%] top-[7px] h-px bg-gradient-to-r from-accent/60 via-white/15 to-live/60" />
          <ol className="relative grid grid-cols-4 gap-8">
            {STEPS.map((s, i) => (
              <li key={s.cmd} className="text-center">
                <span className={`mx-auto block h-[15px] w-[15px] rounded-full border-2 bg-[#0a0c0f] ${i === 3 ? "border-live" : "border-accent"}`} />
                <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-fg-4">0{i + 1}</div>
                <div className="mt-1 text-[18px] font-semibold tracking-[-0.02em]">{s.title}</div>
                <code className="mt-3 inline-block rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[12px] text-fg-2">{s.cmd}</code>
                <p className="mx-auto mt-3 max-w-[16rem] text-[13.5px] leading-relaxed text-fg-3">{s.note}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
