"use client";

// Install section with method tabs
import { useState } from "react";
import { CopyButton } from "@/components/landing/ui";

type InstallMethod = {
  id: string;
  label: string;
  lines: { p: string; c: string }[];
  note: string;
  badge?: string;
};

const INSTALL_METHODS: InstallMethod[] = [
  {
    id: "curl",
    label: "curl",
    lines: [{ p: "$", c: "curl -fsSL aipager.run/install | sh" }],
    note: "One-shot installer. Detects your platform and uses the best available method (uv → pipx → brew). Pulls dtach if missing.",
    badge: "recommended",
  },
  {
    id: "uv",
    label: "uv",
    lines: [{ p: "$", c: "uv tool install aipager" }],
    note: "Fastest install if you already have uv. Isolated venv, no global Python pollution.",
  },
  {
    id: "pipx",
    label: "pipx",
    lines: [{ p: "$", c: "pipx install aipager" }],
    note: "Classic isolated-venv install. Works anywhere Python ≥ 3.10 runs.",
  },
  {
    id: "brew",
    label: "brew",
    lines: [
      { p: "$", c: "brew tap dev-aly3n/aipager" },
      { p: "$", c: "brew install aipager" },
    ],
    note: "macOS-friendly. Installs dtach automatically as a dependency.",
  },
  {
    id: "docker",
    label: "docker",
    lines: [
      { p: "$", c: "docker run -it --rm \\" },
      { p: " ", c: "  -v $HOME/.claude:/root/.claude \\" },
      { p: " ", c: "  -v $HOME/.aipager:/root/.aipager \\" },
      { p: " ", c: "  ghcr.io/dev-aly3n/aipager" },
    ],
    note: "Run it in a container. Mount your Claude config and aipager state for persistence.",
  },
  {
    id: "from-source",
    label: "from source",
    lines: [
      { p: "$", c: "git clone https://github.com/dev-aly3n/aipager" },
      { p: "$", c: "cd aipager && uv sync && uv run aipager" },
    ],
    note: "For hacking on aipager itself. Requires uv.",
  },
];

export function Install() {
  const [active, setActive] = useState("curl");
  const m = INSTALL_METHODS.find((x) => x.id === active) || INSTALL_METHODS[0];
  const cmdText = m.lines.map((l) => l.c).join("\n");

  return (
    <section className="section" id="install">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Install</span>
          <h2 className="h2">From zero to your pocket<br/>in three commands.</h2>
          <p className="lead">
            Python ≥ 3.10. macOS, Linux, WSL. The installer fetches dtach for you if it isn&apos;t present.
          </p>
        </div>

        <div className="install-card">
          <div className="install-tabs" role="tablist">
            {INSTALL_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                role="tab"
                aria-selected={active === method.id}
                className={`install-tab ${active === method.id ? "active" : ""}`}
                onClick={() => setActive(method.id)}
              >
                {method.label}
                {method.badge && (
                  <span style={{ marginLeft: 8, fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    · {method.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="install-body">
            <div className="install-cmd-block">
              <CopyButton text={cmdText} className="copy" />
              {m.lines.map((line, i) => (
                <div className="line" key={i}>
                  <span className="p">{line.p}</span>
                  <span className="c">{line.c}</span>
                </div>
              ))}
            </div>
            <div className="install-notes">
              <p className="note">{m.note}</p>
              <p className="note">
                Need a different shell? <strong>fish</strong> and <strong>zsh</strong> users can <code>aipager completion install</code> after the first run.
              </p>
              <p className="note">
                Already running? <code>aipager update</code> picks up the latest release without touching your config.
              </p>
            </div>
          </div>
        </div>

        <div className="install-next">
          <div className="step">
            <span className="num">01 — CONFIGURE</span>
            <span className="cmd">aipager config</span>
            <p>Interactive wizard. Paste your bot token, pick a chat, aipager patches <code style={{ fontFamily: "var(--font-mono)" }}>~/.claude/settings.json</code> for you.</p>
          </div>
          <div className="step">
            <span className="num">02 — START</span>
            <span className="cmd">aipager start</span>
            <p>Daemon launches. Telegram says hello. Open Claude Code and run normally — every event mirrors.</p>
          </div>
          <div className="step">
            <span className="num">03 — RUN AS A SERVICE</span>
            <span className="cmd">aipager service install</span>
            <p>Optional. Adds a launchd / systemd unit so the daemon comes back after a reboot.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
