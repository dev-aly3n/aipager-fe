import fs from "node:fs";
import path from "node:path";
import { GROUPS, navTitle, type DocSummary, type Head } from "./docs-nav";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export type { DocSummary, Head } from "./docs-nav";
export { SHORT_TITLES, navTitle } from "./docs-nav";
export { GROUPS };

export type Doc = DocSummary & {
  source: string;        // the markdown body, with cross-links rewritten for the web
  headings: Head[];      // the h2/h3 of the body, for "on this page"
  /**
   * A translated heading keeps the English heading's anchor, so a link
   * written once (`commands.md#languages`) lands in every language. The
   * markdown carries it as `## <a id="languages"></a>…`; here it is a map
   * from the heading's own words to that id.
   */
  anchors: Record<string, string>;
};

/** The page before and after this one, in sidebar order. */
export function neighbours(slug: string, locale = "en"): { prev: DocSummary | null; next: DocSummary | null } {
  const all = listDocs(locale);
  const i = all.findIndex((d) => d.slug === slug);
  return { prev: i > 0 ? all[i - 1] : null, next: i >= 0 && i < all.length - 1 ? all[i + 1] : null };
}

// One order for everything: the sidebar's groups, read top to bottom. The
// index, the static params and prev/next all follow it.
const SIDEBAR_ORDER: readonly string[] = GROUPS.flatMap((g) => g.slugs);

export function listDocs(locale = "en"): DocSummary[] {
  return SIDEBAR_ORDER.map((slug) => readDoc(slug, locale)).map(({ source: _s, ...rest }) =>
    // a language's index is the one the site builds (getIndex), so the nav
    // names it in that language rather than by the English page underneath
    rest.slug === "" && locale !== "en" ? { ...rest, translated: true, built: true } : rest,
  );
}

/**
 * The index in another language. aipager's translations have no docs index
 * of their own (a language's README.md translates the project's README, a
 * different page), so the site builds one from what it has: the sidebar's
 * groups, and under each, its pages by their own names and opening lines.
 */
export function getIndex(locale: string, t: { title: string; description: string; groups: readonly string[] }): Doc {
  if (locale === "en") return readDoc("", "en");
  const pages = listDocs(locale);
  const md = GROUPS.map((g, i) => {
    const items = g.slugs.flatMap((slug) => pages.filter((p) => slug !== "" && p.slug === slug));
    return [`## ${t.groups[i]}`, ...items.map((p) => `### [${navTitle(p, t.title)}](${p.slug}.md)\n\n${p.description}`)].join("\n\n");
  }).join("\n\n");
  const source = rewriteCrossLinks(md, locale);
  return { slug: "", title: t.title, description: t.description, source, headings: headingsOf(source), translated: true, built: true, anchors: {} };
}

export function getDoc(slug: string, locale = "en"): Doc {
  return readDoc(slug, locale);
}

/**
 * Where a page lives in this language. aipager's own repo holds the
 * translations (docs/i18n/<code>/), mirrored here by scripts/sync-docs.sh;
 * anything a language has not got yet falls back to the English page, which
 * is the one the translations themselves defer to.
 */
function fileFor(slug: string, locale: string): { file: string; translated: boolean } {
  const name = slug === "" ? "README.md" : `${slug}.md`;
  // a language's README.md is the project's README, not this index (see getIndex)
  if (locale !== "en" && slug !== "") {
    const local = path.join(DOCS_DIR, locale, name);
    if (fs.existsSync(local)) return { file: local, translated: true };
  }
  return { file: path.join(DOCS_DIR, name), translated: false };
}

export function listSlugs(): string[] {
  // Exclude the empty-slug (index) entry, since the dynamic [slug] route
  // doesn't render it; app/docs/page.tsx does.
  return SIDEBAR_ORDER.filter(s => s !== "");
}

function readDoc(slug: string, locale = "en"): Doc {
  const { file, translated } = fileFor(slug, locale);
  const anchors: Record<string, string> = {};
  const raw = strip(fs.readFileSync(file, "utf-8"), anchors);
  const { title, description } = extractTitleAndDescription(raw);
  // The page draws the title and the lede itself, so the body starts after
  // them: the H1, and the paragraph the lede was taken from.
  const body = rewriteCrossLinks(dropLede(raw.replace(/^#[^\n]*\n+/, ""), description), locale);
  return { slug, title, description, source: body, headings: headingsOf(body, anchors), translated, anchors };
}

/**
 * A translated page is wrapped for GitHub: an i18n-source comment, the note
 * that the English page wins, and (right to left) a <div dir="rtl"> around
 * everything with each code block in its own <div dir="ltr">. The site says
 * all of that in its own chrome and sets the direction on the document, so
 * the wrappers come off here.
 */
function strip(md: string, anchors: Record<string, string> = {}): string {
  return md
    // the English anchor a translated heading carries becomes its id; a
    // right-to-left heading may open with a direction mark for GitHub, which
    // the page's own direction makes unneeded
    .replace(/^(#{1,6}\s*)(?:&rlm;|\u200f)?<a id="([^"]+)"><\/a>\s*(.+)$/gim, (_all, hashes: string, id: string, text: string) => {
      anchors[text.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[`*]/g, "").trim()] = id;
      return `${hashes}${text}`;
    })
    .replace(/^<div dir="rtl">\s*/i, "")
    .replace(/\s*<\/div>\s*$/i, "")
    .replace(/^[ \t]*(?:<div dir="(?:rtl|ltr)">|<\/div>)[ \t]*$/gim, "")
    .replace(/^<!--\s*i18n-source:[^>]*-->\s*$/gim, "")
    // the page's own "this is a translation" line: the site shows its own,
    // so drop the markdown's (Chinese wraps the link in full-width brackets)
    .replace(/^>\s*(?:‏)?[^\n]*[(（]\[English\]\([^)]*\)[)）][^\n]*$/gim, "");
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
function headingsOf(md: string, anchors: Record<string, string> = {}): Head[] {
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
    const id = anchors[text] ?? slug(text);
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

// Rewrite [text](X.md) and [text](X.md#anchor) → [text](/<locale>/docs/X) or
// /<locale>/docs/X#anchor, so a link keeps the reader in their language.
// [text](README.md) → [text](/<locale>/docs). A file outside docs/
// ([text](../README.md), ../CHANGELOG.md) is not on this site: link it on
// GitHub instead.
const REPO_BLOB = "https://github.com/dev-aly3n/aipager/blob/main";

function rewriteCrossLinks(md: string, locale: string): string {
  return md.replace(/\]\(([^)]+)\.md(#[^)]+)?\)/g, (_, name: string, anchor: string | undefined) => {
    const cleaned = name.replace(/^\.\//, "");
    if (cleaned.startsWith("../")) return `](${REPO_BLOB}/${cleaned.slice(3)}.md${anchor ?? ""})`;
    if (cleaned === "README") return `](/${locale}/docs${anchor ?? ""})`;
    return `](/${locale}/docs/${cleaned}${anchor ?? ""})`;
  });
}
