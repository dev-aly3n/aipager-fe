#!/usr/bin/env node
/**
 * Every prerendered page is plain static, read from the last build.
 *
 * Usage: node scripts/check-static.mjs   (after npm run build)
 *
 * The site's pages are built once and served as they are, so one deploy
 * changes all of them together. A request-time fetch or a `revalidate`
 * export would quietly turn a page back into one that is rebuilt on its own
 * schedule, and visitors would see old and new pages side by side. Next
 * records that choice per route in .next/prerender-manifest.json, so this
 * reads it there rather than guessing from the source. The number of routes
 * is not fixed here: a new doc page is one more static route, not a failure.
 */

import fs from "node:fs";
import path from "node:path";

const MANIFEST = path.join(process.cwd(), ".next", "prerender-manifest.json");

if (!fs.existsSync(MANIFEST)) {
  console.log(`✗ no ${path.relative(process.cwd(), MANIFEST)}, run npm run build first`);
  process.exit(1);
}

/** @type {{ routes?: Record<string, { initialRevalidateSeconds?: number | false }> }} */
const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
const routes = Object.entries(manifest.routes ?? {});

let bad = 0;
for (const [route, entry] of routes) {
  const every = entry.initialRevalidateSeconds;
  if (every !== false) {
    bad += 1;
    console.log(`✗ ${route} revalidates every ${every}s`);
  }
}

if (routes.length === 0) {
  console.log("✗ the build manifest lists no prerendered routes");
  process.exit(1);
}

console.log(bad ? `\n${bad} route(s) still revalidate` : `✓ ${routes.length} prerendered routes, none revalidating`);
process.exit(bad ? 1 : 0);
