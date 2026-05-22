// How it works + features grid
export function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2 className="h2">No scraping. No cloud.<br/>Just hooks.</h2>
          <p className="lead">
            aipager is a small Python daemon on your machine. It hooks into Claude Code&apos;s native event API, runs your sessions under dtach for persistence, and pushes events to a Telegram bot you own.
          </p>
        </div>

        <div className="how-grid">
          <div className="how-step">
            <span className="num">01 — INTERCEPT</span>
            <h3>Native Claude Code hooks</h3>
            <p>
              When Claude reads a file, edits, runs a tool, or asks permission, Claude Code fires a hook. aipager listens. Nothing is scraped from your terminal.
            </p>
            <div className="how-diagram">
              <div className="pair"><span className="k">PreToolUse</span> <span className="v">→ relay</span></div>
              <div className="pair"><span className="k">PostToolUse</span> <span className="v">→ status</span></div>
              <div className="pair"><span className="k">Notification</span> <span className="v">→ permission</span></div>
              <div className="pair"><span className="k">Stop</span> <span className="v">→ idle</span></div>
            </div>
          </div>
          <div className="how-step">
            <span className="num">02 — PERSIST</span>
            <h3>Sessions survive your laptop closing</h3>
            <p>
              Every session runs inside dtach — a tiny terminal multiplexer. SSH drops, lid closes, network blinks: the session keeps running. You re-attach instantly.
            </p>
            <div className="how-diagram">
              <div className="pair"><span className="k">runtime</span> <span className="v">dtach socket</span></div>
              <div className="pair"><span className="k">recover</span> <span className="v">aipager attach</span></div>
              <div className="pair"><span className="k">model</span> <span className="v">sonnet · opus · haiku</span></div>
            </div>
          </div>
          <div className="how-step">
            <span className="num">03 — RELAY</span>
            <h3>Your bot. Your chat. Your tokens.</h3>
            <p>
              You create the bot with @BotFather, paste the token, pick a chat ID. aipager talks to Telegram from your machine. Code, prompts, and outputs never touch a third party.
            </p>
            <div className="how-diagram">
              <div className="pair"><span className="k">transport</span> <span className="v">Telegram Bot API</span></div>
              <div className="pair"><span className="k">auth</span> <span className="v">your bot token</span></div>
              <div className="pair"><span className="k">observers</span> <span className="v">read-only mirrors</span></div>
            </div>
          </div>
        </div>

        <div className="cards" style={{ marginTop: 40 }}>
          <div className="card">
            <div className="icon-box">↻</div>
            <h3>Reply-to-inject</h3>
            <p>Reply to any bot message and your text becomes the next prompt. Steer the session without opening your laptop.</p>
          </div>
          <div className="card">
            <div className="icon-box">⌘</div>
            <h3>Inline permission keyboard</h3>
            <p>Dangerous commands surface as Allow / Deny buttons. Decide once, the session resumes.</p>
          </div>
          <div className="card">
            <div className="icon-box">≡</div>
            <h3>Persistent reply keyboard</h3>
            <p>Three tiers — sessions, commands, models — always one tap away at the bottom of the chat.</p>
          </div>
          <div className="card">
            <div className="icon-box">⚠</div>
            <h3>Smart notifications</h3>
            <p>Context warnings, stall alerts, completion pings — only what matters, throttled to not spam.</p>
          </div>
          <div className="card">
            <div className="icon-box">⊕</div>
            <h3>Templates</h3>
            <p>Save prompts you reuse — code reviews, commit messages, test diffs — and fire them with a tap.</p>
          </div>
          <div className="card">
            <div className="icon-box">◎</div>
            <h3>Observer bots</h3>
            <p>Add a second read-only bot to a team chat or log channel. Same events, separate audience.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
