"use client";

import { useEffect, useState } from "react";
import { Logo, Icon } from "@/components/landing/ui";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a href="/" className="nav-brand">
          <Logo size={22} />
          <span>aipager</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-4)", marginLeft: 4 }}>v0.4.4</span>
        </a>
        <div className="nav-links">
          <a href="/#demo">Demo</a>
          <a href="/#sessions">Sessions</a>
          <a href="/#how">How it works</a>
          <a href="/#install">Install</a>
          <a href="/#faq">FAQ</a>
          <a href="/docs">Docs</a>
          <a href="https://github.com/dev-aly3n/aipager" className="nav-gh nav-cta" aria-label="github">
            <Icon name="github" size={14} />
            <span>GitHub</span>
            <span className="badge">★</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
