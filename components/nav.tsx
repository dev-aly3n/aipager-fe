"use client";

import { motion } from "framer-motion";

const LINKS = [
  { label: "Demo", href: "#demo" },
  { label: "Features", href: "#features" },
  { label: "Install", href: "#install" },
  { label: "Keyboard", href: "#keyboard" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-40 backdrop-blur-sm border-b border-border/50 bg-background/80"
    >
      <div className="mx-auto max-w-4xl flex items-center justify-between px-4 py-3">
        <a href="#" className="font-bold text-sm tracking-tight">
          aipager
        </a>
        <div className="hidden sm:flex items-center gap-5">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs text-dim hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href="https://github.com/dev-aly3n/aipager"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-dim hover:text-foreground transition-colors duration-200"
        >
          GitHub
        </a>
      </div>
    </motion.nav>
  );
}
