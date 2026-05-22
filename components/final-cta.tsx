"use client";

import { Icon, CopyButton } from "@/components/landing/ui";

export function FinalCta() {
  return (
    <section className="cta">
      <div className="wrap" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <span className="eyebrow" style={{ position: "relative" }}>Get started</span>
        <h2 className="h2" style={{ maxWidth: 720, textAlign: "center" }}>Your terminal, in your pocket. In under a minute.</h2>
        <div className="hero-install cta-install" style={{ margin: "8px 0 0" }}>
          <span className="dollar">$</span>
          <span className="cmd">curl -fsSL aipager.run/install | sh</span>
          <CopyButton text="curl -fsSL aipager.run/install | sh" className="copy" />
        </div>
        <div className="hero-actions" style={{ position: "relative" }}>
          <a href="https://github.com/dev-aly3n/aipager" className="btn btn-primary">
            <Icon name="github" size={14} />
            Star on GitHub
          </a>
          <a href="https://aipager.run/docs" className="btn btn-ghost">
            Read the docs
            <span className="btn-arrow"><Icon name="arrow" size={14} /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
