import fs from "node:fs";
import path from "node:path";

const DOCS_DIR = path.join(process.cwd(), "content", "docs");

export type DocSummary = {
  slug: string;          // "" for the index (README.md), else e.g. "architecture"
  title: string;
  description: string;
};

export type Doc = DocSummary & {
  source: string;        // the markdown body, with cross-links rewritten for the web
};

// Order shown in the sidebar — explicit beats alphabetical for reference docs.
const SIDEBAR_ORDER = [
  "",                    // README — index
  "architecture",
  "hooks",
  "commands",
  "groups",
  "observers",
  "troubleshooting",
  "security",
] as const;

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
  return {
    slug,
    title,
    description,
    source: rewriteCrossLinks(raw),
  };
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
  return { title, description: para.join(" ").replace(/\s+/g, " ").trim() };
}

// Rewrite [text](X.md) and [text](X.md#anchor) → [text](/docs/X) or /docs/X#anchor.
// [text](README.md) → [text](/docs).
function rewriteCrossLinks(md: string): string {
  return md.replace(/\]\(([^)]+)\.md(#[^)]+)?\)/g, (_, name: string, anchor: string | undefined) => {
    const cleaned = name.replace(/^\.\//, "");
    if (cleaned === "README") return `](/docs${anchor ?? ""})`;
    return `](/docs/${cleaned}${anchor ?? ""})`;
  });
}
