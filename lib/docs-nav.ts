/**
 * The parts of the docs index a browser may hold: the pages' names, how the
 * sidebar groups them, and the shape of a heading. No filesystem here, so a
 * client component can import it (lib/docs.ts reads the markdown and cannot).
 */

export type DocSummary = {
  slug: string; // "" for the index (README.md), else e.g. "architecture"
  title: string;
  description: string;
  /** read in this language, or falling back to the English page */
  translated?: boolean;
  /** put together by the site rather than read from one markdown file */
  built?: boolean;
};

/** One entry in a page's table of contents. */
export type Head = { level: 2 | 3; text: string; id: string };

/** How the sidebar groups the pages. */
export const GROUPS: { label: string; slugs: string[] }[] = [
  { label: "Start here", slugs: ["", "install-with-an-agent"] },
  { label: "Reference", slugs: ["architecture", "hooks", "commands", "groups"] },
  { label: "Running it", slugs: ["security", "troubleshooting", "problem-reports"] },
];

/**
 * What a page is called in the nav.
 *
 * A translated page is named by its own heading, which aipager's translators
 * wrote, minus any tail after a colon: "Problem reports: what a report
 * contains" is a title, not a nav entry. The index's heading is only the
 * product's name, so it goes by the word the language uses for the docs.
 * An English page, or one a language has not got yet, uses the short names
 * below, which read better than the headings they shorten.
 */
export function navTitle(doc: DocSummary, docsTitle: string): string {
  if (!doc.translated) return SHORT_TITLES[doc.slug] ?? doc.title;
  if (doc.slug === "") return docsTitle;
  return doc.title.split(/\s*[:：]\s*/)[0];
}

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
