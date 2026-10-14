/**
 * The parts of the docs index a browser may hold: the pages' names, how the
 * sidebar groups them, and the shape of a heading. No filesystem here, so a
 * client component can import it (lib/docs.ts reads the markdown and cannot).
 */

export type DocSummary = {
  slug: string; // "" for the index (README.md), else e.g. "architecture"
  title: string;
  description: string;
};

/** One entry in a page's table of contents. */
export type Head = { level: 2 | 3; text: string; id: string };

/** How the sidebar groups the pages. */
export const GROUPS: { label: string; slugs: string[] }[] = [
  { label: "Start here", slugs: ["", "install-with-an-agent"] },
  { label: "Reference", slugs: ["architecture", "hooks", "commands", "groups"] },
  { label: "Running it", slugs: ["security", "troubleshooting", "problem-reports"] },
];

/** The short name a page goes by in the nav, where its own H1 is too long. */
export const SHORT_TITLES: Record<string, string> = {
  "": "Overview",
  "install-with-an-agent": "Install with an agent",
  architecture: "Architecture",
  hooks: "Hook events",
  commands: "Bot commands",
  groups: "Team mode",
  security: "Security model",
  troubleshooting: "Troubleshooting",
  "problem-reports": "Problem reports",
};
