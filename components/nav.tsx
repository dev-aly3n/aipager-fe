"use client";

import { useEffect, useState } from "react";
import { Logo, Icon } from "@/components/landing/ui";

const LINKS: { href: string; label: string }[] = [
  { href: "/#demo", label: "Demo" },
  { href: "/#sessions", label: "Sessions" },
  { href: "/#how", label: "How it works" },
  { href: "/#install", label: "Install" },
  { href: "/#faq", label: "FAQ" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  // Below 900px the links live in a dropdown behind the hamburger.
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reopening at desktop width would leave `.open` set on a menu that's no
  // longer a dropdown; close it as soon as the breakpoint is crossed.
  useEffect(() => {
    if (!menuOpen) return;
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = () => { if (mq.matches) setMenuOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [menuOpen]);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a href="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <Logo size={22} />
          <span>aipager</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-4)", marginLeft: 4 }}>v0.4.4</span>
        </a>
        {/* Tapping any entry closes the panel — the anchors are same-page, so
            without this the menu would stay open over the target section. */}
        <div
          className={`nav-links ${menuOpen ? "open" : ""}`}
          id="nav-links"
          onClick={() => setMenuOpen(false)}
        >
          {LINKS.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <a href="https://github.com/dev-aly3n/aipager" className="nav-gh nav-cta" aria-label="github">
            <Icon name="github" size={14} />
            <span>GitHub</span>
            <span className="badge">★</span>
          </a>
        </div>
        <button
          type="button"
          className="nav-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name="menu" size={18} />
        </button>
      </div>
    </nav>
  );
}
