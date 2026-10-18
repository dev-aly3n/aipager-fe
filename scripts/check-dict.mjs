#!/usr/bin/env node
/**
 * What a translated dictionary must hold true, beyond typechecking.
 *
 * Usage: node scripts/check-dict.mjs [code ...]   (all of them with no args)
 *
 * It compares each language's file with the English one as text, so it needs
 * no build step: same keys in the same order, nothing left in English that
 * should have moved, no long dash, the arrows the language reads with, and
 * every product name still spelled the way the product spells it.
 */

import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "lib", "i18n", "dict");
const LOCALES = ["es", "ru", "pt-BR", "zh-Hans", "fr", "de", "ko", "ar", "id", "uk", "it", "tr", "fa", "vi"];
const RTL = new Set(["ar", "fa"]);

/** Keys in order, and the string on each, from a dictionary file. */
function read(code) {
  const file = path.join(DIR, `${code}.ts`);
  if (!fs.existsSync(file)) return null;
  const src = fs.readFileSync(file, "utf-8");
  const keys = [...src.matchAll(/^\s*([A-Za-z_][\w]*):/gm)].map((m) => m[1]);
  const strings = [...src.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]).filter((s) => s.length > 1);
  return { src, keys, strings };
}

const en = read("en");
const codes = process.argv.slice(2).length ? process.argv.slice(2) : LOCALES;
let bad = 0;

/** Names and commands that must survive translation untouched. */
const KEEP = ["aipager", "Claude Code", "Claude", "Anthropic", "Telegram", "GitHub", "PyPI", "BotFather", "dtach", "Bash", "WebFetch", "/mode", "/status", "/new", "/app", "read_only"];

for (const code of codes) {
  const it = read(code);
  if (!it) {
    console.log(`· ${code}: not written yet`);
    continue;
  }
  const problems = [];

  // 1. the same keys, in the same order
  if (it.keys.join(",") !== en.keys.join(",")) {
    const missing = en.keys.filter((k) => !it.keys.includes(k));
    const extra = it.keys.filter((k) => !en.keys.includes(k));
    if (missing.length) problems.push(`missing keys: ${[...new Set(missing)].slice(0, 8).join(", ")}`);
    if (extra.length) problems.push(`unknown keys: ${[...new Set(extra)].slice(0, 8).join(", ")}`);
    if (!missing.length && !extra.length) problems.push("keys are in a different order from en.ts");
  }

  // 2. the rules the product's own checker enforces
  if (it.src.includes("—")) problems.push("long dash (U+2014)");
  const wrongArrow = RTL.has(code) ? "→" : "←";
  if (it.strings.some((s) => s.includes(wrongArrow))) problems.push(`arrow ${wrongArrow} points the wrong way for ${code}`);

  // 3. nothing left untranslated: a line that is still exactly the English one
  const same = it.strings.filter((s, i) => en.strings[i] === s && /\s/.test(s) && s.length > 24 && !KEEP.some((k) => s.startsWith(k)));
  if (same.length > 6) problems.push(`${same.length} lines are still the English text, e.g. "${same[0].slice(0, 48)}…"`);

  // 4. what aipager itself types into Claude, which it types in English
  //    whatever the language (aipager/bot/handlers.py:_file_prompt)
  if (!it.src.includes("check this:")) problems.push('"check this:" was translated: aipager sends that prompt in English');

  // 5. the product's own names, spelled its way
  for (const name of ["aipager", "Claude Code", "Telegram"]) {
    const enCount = en.src.split(name).length - 1;
    const got = it.src.split(name).length - 1;
    if (got < enCount * 0.5) problems.push(`"${name}" appears ${got} times, ${enCount} in English: a name may have been translated`);
  }

  if (problems.length) {
    bad += 1;
    console.log(`✗ ${code}`);
    for (const p of problems) console.log(`    ${p}`);
  } else {
    console.log(`✓ ${code}`);
  }
}

process.exit(bad ? 1 : 0);
