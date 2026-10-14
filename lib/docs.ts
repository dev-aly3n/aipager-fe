import fs from "node:fs";
import path from "node:path";
import { GROUPS, type DocSummary, type Head } from "./docs-nav";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export type { DocSummary, Head } from "./docs-nav";
export { SHORT_TITLES } from "./docs-nav";
export { GROUPS };

export type Doc = DocSummary & {
  source: string;        // the markdown body, with cross-links rewritten for the web
  headings: Head[];      // the h2/h3 of the body, for "on this page"
};

/** The page before and after this one, in sidebar order. */
export function neighbours(slug: string): { prev: DocSummary | null; next: DocSummary | null } {
  const all = listDocs();
  const i = all.findIndex((d) => d.slug === slug);
  return { prev: i > 0 ? all[i - 1] : null, next: i >= 0 && i < all.length - 1 ? all[i + 1] : null };
}

// One order for everything: the sidebar's groups, read top to bottom. The
// index, the static params and prev/next all follow it.
const SIDEBAR_ORDER: readonly string[] = GROUPS.flatMap((g) => g.slugs);

export function listDocs(): DocSummary[] {
  return SIDEBAR_ORDER.map(slug => readDoc(slug)).map(({ source: _s, ...rest }) => rest);
}

export function getDoc(slug: string): Doc {
  return readDoc(slug);
}

export function listSlugs(): string[] {
  // Exclude the empty-slug (index) entry — the dynamic [slug] route
  // doesn't render it; app/docs/page.tsx does.
  return SIDEBAR_ORDER.filter(s => s !== "");
}

function readDoc(slug: string): Doc {
  const filename = slug === "" ? "README.md" : `${slug}.md`;
  const raw = fs.readFileSync(path.join(DOCS_DIR, filename), "utf-8");
  const { title, description } = extractTitleAndDescription(raw);
  // The page draws the title and the lede itself, so the body starts after
  // them: the H1, and the paragraph the lede was taken from.
  const body = rewriteCrossLinks(dropLede(raw.replace(/^#[^\n]*\n+/, ""), description));
  return { slug, title, description, source: body, headings: headingsOf(body) };
}

/** Drop the opening paragraph when the page header is already showing it. */
function dropLede(md: string, lede: string): string {
  if (!lede) return md;
  const end = md.indexOf("\n\n");
  const first = (end === -1 ? md : md.slice(0, end)).replace(/\s+/g, " ").trim();
  return first === lede ? md.slice(end === -1 ? md.length : end + 2) : md;
}

/**
 * GitHub's heading anchors, the same ones the rendered headings get, so the
 * contents list and the page agree. Fed every heading in order, since the
 * numbering of a repeated heading depends on the ones before it.
 */
function makeSlugger() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}\p{Pc}\- ]/gu, "")
      .replace(/ /g, "-");
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n}`;
  };
}

/** The h2 and h3 of a body, in order, skipping anything inside a code fence. */
function headingsOf(md: string): Head[] {
  const slug = makeSlugger();
  const out: Head[] = [];
  let fenced = false;
  for (const line of md.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const text = m[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[`*]/g, "")
      .trim();
    const id = slug(text);
    const level = m[1].length;
    if (level === 2 || level === 3) out.push({ level: level as 2 | 3, text, id });
  }
  return out;
}

// Pull the first `# H1` and the first paragraph after it.
function extractTitleAndDescription(md: string): { title: string; description: string } {
  const lines = md.split("\n");
  let title = "";
  let i = 0;
  for (; i < lines.length; i++) {
    const m = /^# (.+)$/.exec(lines[i]);
    if (m) {
      title = m[1].trim();
      i++;
      break;
    }
  }
  // First non-blank, non-heading paragraph
  const para: string[] = [];
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") {
      if (para.length) break;
      continue;
    }
    if (line.startsWith("#") || line.startsWith("```") || line.startsWith("|")) break;
    para.push(line);
  }
  // The lede is drawn as plain text, so markdown in it would read as markup.
  const description = para
    .join(" ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return { title, description };
}

// Rewrite [text](X.md) and [text](X.md#anchor) → [text](/docs/X) or /docs/X#anchor.
// [text](README.md) → [text](/docs). A file outside docs/ ([text](../README.md),
// ../CHANGELOG.md) is not on this site: link it on GitHub instead.
const REPO_BLOB = "https://github.com/dev-aly3n/aipager/blob/main";

function rewriteCrossLinks(md: string): string {
  return md.replace(/\]\(([^)]+)\.md(#[^)]+)?\)/g, (_, name: string, anchor: string | undefined) => {
    const cleaned = name.replace(/^\.\//, "");
    if (cleaned.startsWith("../")) return `](${REPO_BLOB}/${cleaned.slice(3)}.md${anchor ?? ""})`;
    if (cleaned === "README") return `](/docs${anchor ?? ""})`;
    return `](/docs/${cleaned}${anchor ?? ""})`;
  });
}
