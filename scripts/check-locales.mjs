#!/usr/bin/env node
/**
 * Every language, as a reader meets it.
 *
 * Usage: node scripts/check-locales.mjs [base-url] [code ...]
 *   defaults to http://localhost:3212 and every language.
 *
 * For each one it loads the home page and a docs page, at desktop width and
 * at phone width, and checks: the document says which language it is and
 * which way it reads, nothing overflows sideways, the console is quiet, no
 * long dash slipped in, no bot markup is showing as text, and no English
 * sentence from en.ts is still on the page.
 */

import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire("/Users/aly3n/webProjects/github-profile/aly3n.dev/package.json");
const puppeteer = require("puppeteer-core");

const BASE = process.argv[2]?.startsWith("http") ? process.argv[2] : "http://localhost:3212";
const ASKED = process.argv.slice(process.argv[2]?.startsWith("http") ? 3 : 2);
const LOCALES = ["en", "es", "ru", "pt-BR", "zh-Hans", "fr", "de", "ko", "ar", "id", "uk", "it", "tr", "fa", "vi"];
const RTL = new Set(["ar", "fa"]);
const codes = ASKED.length ? ASKED : LOCALES;

/** Sentences the English page says, long enough to be unmistakable. */
const EN = (() => {
  const src = fs.readFileSync(path.join(process.cwd(), "lib", "i18n", "dict", "en.ts"), "utf-8");
  return [...src.matchAll(/"((?:[^"\\]|\\.){40,})"/g)]
    .map((m) => m[1].replace(/\\"/g, '"'))
    .filter((s) => !s.includes("{") && !s.startsWith("http"))
    .slice(0, 400);
})();

const b = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "shell",
  args: ["--no-sandbox"],
});

let bad = 0;
// the browser is closed whatever happens, so a crash never leaves a
// headless Chrome behind to starve the next run
try {
for (const code of codes) {
  const problems = [];
  for (const [what, url, width] of [
    ["home", `${BASE}/${code}`, 1440],
    ["home@390", `${BASE}/${code}`, 390],
    ["docs", `${BASE}/${code}/docs/commands`, 1440],
    ["docs@390", `${BASE}/${code}/docs/commands`, 390],
  ]) {
    const p = await b.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    p.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text().slice(0, 90));
    });
    await p.setViewport({ width, height: 950 });
    // "load", not networkidle: the demo keeps a frame loop running, and a
    // built page has no idle moment to wait for. A dev server shared with
    // other work can miss the first try, so give it three.
    let res = null;
    for (let tries = 3; tries > 0; tries -= 1) {
      try {
        res = await p.goto(url, { waitUntil: "load", timeout: 90000 });
        break;
      } catch (e) {
        if (tries === 1) throw e;
        await new Promise((r) => setTimeout(r, 2500));
      }
    }
    await new Promise((r) => setTimeout(r, what.startsWith("home") ? 2600 : 900));
    const seen = await p.evaluate(() => ({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      text: document.body.innerText,
    }));
    // 304 is the second visit to the same page, at the other width
    if (res.status() !== 200 && res.status() !== 304) problems.push(`${what}: HTTP ${res.status()}`);
    if (seen.lang !== code) problems.push(`${what}: lang is "${seen.lang}"`);
    if (seen.dir !== (RTL.has(code) ? "rtl" : "ltr")) problems.push(`${what}: dir is "${seen.dir}"`);
    if (seen.hscroll) problems.push(`${what}: scrolls sideways`);
    if (seen.text.includes("—")) problems.push(`${what}: long dash on the page`);
    // aipager writes its messages in Telegram's HTML; the demo must render
    // that markup, never show it
    const tag = seen.text.match(/<\/?(?:b|i|code)>/);
    if (tag) problems.push(`${what}: bot markup showing as text (${tag[0]})`);
    if (errors.length) problems.push(`${what}: ${errors.length} console error(s): ${errors[0]}`);
    if (what === "home" && code !== "en") {
      const left = EN.filter((s) => seen.text.includes(s));
      if (left.length) problems.push(`home: ${left.length} English line(s) left, e.g. "${left[0].slice(0, 54)}…"`);
    }
    await p.close();
  }
  if (problems.length) {
    bad += 1;
    console.log(`✗ ${code}`);
    for (const x of problems) console.log(`    ${x}`);
  } else {
    console.log(`✓ ${code}`);
  }
}
} finally {
  await b.close();
}
process.exit(bad ? 1 : 0);
