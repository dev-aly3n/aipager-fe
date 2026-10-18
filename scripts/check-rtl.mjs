#!/usr/bin/env node
/**
 * The direction rules, checked in the source.
 *
 * Usage: node scripts/check-rtl.mjs
 *
 * Arabic and Persian read the other way, so a page written with "left" and
 * "right" breaks in them while looking perfect in English. These are the
 * rules from the project's translation guide (§1.6) that can be checked
 * without a browser; scripts/check-locales.mjs checks the rendered page.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

/** Where a physical side is the right answer, and why. */
const ALLOWED = new Map([
  // The desk is one drawn scene: the cable's curve is plotted against these
  // exact coordinates, so mirroring the windows would unplug it.
  ["components/tg/desktop.tsx", "the desk scene is drawn to fixed coordinates"],
  // A terminal is an English program's window; it is left to right inside
  // every language, and carries dir="ltr" to say so.
  ["components/tg/terminal.tsx", "the terminal is an ltr island"],
]);

/** Classes that pick a side instead of a start and an end. */
const PHYSICAL =
  /(?<![\w-])(?:-)?(?:ml|mr|pl|pr|left|right|rounded-[tb]?[lr]|border-[lr])-(?:\[[^\]]+\]|[\w./]+)/g;
/** float-right, text-left and the like, which the pattern above's boundary skips */
const SIDED = /(?<![\w-])(?:float|text|clear)-(?:left|right)(?![\w-])/g;
/** Ones that mean "both sides" or "centred", which are the same either way. */
const SYMMETRIC = /^(?:-)?(?:left|right)-(?:1\/2|\[?-?50%\]?)$/;

/** Direction controls: never in text a person can copy. */
const CONTROLS = /[‎‏؜‪-‮⁦-⁩]/;

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(e.name)) files.push(p);
  }
})(path.join(ROOT, "components"));
files.push(...fs.readdirSync(path.join(ROOT, "app"), { recursive: true })
  .filter((f) => typeof f === "string" && /\.tsx$/.test(f))
  .map((f) => path.join(ROOT, "app", f)));

let bad = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file);
  if (ALLOWED.has(rel)) continue;
  const src = fs.readFileSync(file, "utf-8");
  src.split("\n").forEach((line, i) => {
    // only class strings, and not a comment about direction
    if (/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line)) return;
    for (const m of line.matchAll(SIDED)) {
      bad += 1;
      console.log(`✗ ${rel}:${i + 1}  ${m[0]}  (use float-start/end, text-start/end)`);
    }
    for (const m of line.matchAll(PHYSICAL)) {
      const cls = m[0];
      if (SYMMETRIC.test(cls)) continue;
      // inset-x-… and the like name both sides at once
      if (/^-?(?:left|right)-/.test(cls) && /\binset-/.test(line)) continue;
      bad += 1;
      console.log(`✗ ${rel}:${i + 1}  ${cls}  (use the logical side: ms/me, ps/pe, start/end, border-s/e, rounded-s/e)`);
    }
  });
}

// A direction control pasted into a terminal breaks the command, and the
// dictionaries are where one would slip in.
for (const f of fs.readdirSync(path.join(ROOT, "lib", "i18n", "dict"))) {
  if (!f.endsWith(".ts")) continue;
  const src = fs.readFileSync(path.join(ROOT, "lib", "i18n", "dict", f), "utf-8");
  if (CONTROLS.test(src)) {
    bad += 1;
    console.log(`✗ lib/i18n/dict/${f}  holds a direction control character`);
  }
}

// Code blocks are copied, so they may not hold one either.
const docs = path.join(ROOT, "content", "docs");
for (const loc of fs.readdirSync(docs)) {
  const dir = path.join(docs, loc);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir)) {
    const src = fs.readFileSync(path.join(dir, f), "utf-8");
    for (const m of src.matchAll(/```[^\n]*\n(.*?)```/gs)) {
      if (CONTROLS.test(m[1])) {
        bad += 1;
        console.log(`✗ content/docs/${loc}/${f}  a code block holds a direction control character`);
        break;
      }
    }
  }
}

console.log(bad ? `\n${bad} place(s) to fix` : "✓ directions are logical, and no control characters where text is copied");
process.exit(bad ? 1 : 0);
