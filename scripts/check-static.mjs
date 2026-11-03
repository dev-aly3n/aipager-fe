#!/usr/bin/env node
/**
 * Every page and image is plain static, read from the last build.
 *
 * Usage: node scripts/check-static.mjs   (after npm run build)
 *
 * The site's pages are built once and served as they are, so one deploy
 * changes all of them together. A request-time fetch or a `revalidate`
 * export would quietly turn a page back into one that is rebuilt on its own
 * schedule, or rendered afresh for every visitor, and visitors would see old
 * and new pages side by side. Next records that choice per route, so this
 * reads it from the build rather than guessing from the source.
 *
 * Two things are checked. Every prerendered route must never revalidate
 * (.next/prerender-manifest.json). And every route the app defines
 * (.next/app-path-routes-manifest.json) must have been prerendered at all,
 * because a route that is rendered on every request is simply missing from
 * the first list. The number of routes is not fixed here: a new doc page is
 * one more static route, not a failure.
 */

import fs from "node:fs";
import path from "node:path";

const NEXT = path.join(process.cwd(), ".next");
const PRERENDER = path.join(NEXT, "prerender-manifest.json");
const APP_ROUTES = path.join(NEXT, "app-path-routes-manifest.json");

for (const file of [PRERENDER, APP_ROUTES]) {
  if (!fs.existsSync(file)) {
    console.log(`✗ no ${path.relative(process.cwd(), file)}, run npm run build first`);
    process.exit(1);
  }
}

/** @type {{ routes?: Record<string, { initialRevalidateSeconds?: number | false, srcRoute?: string | null }> }} */
const manifest = JSON.parse(fs.readFileSync(PRERENDER, "utf-8"));
const routes = Object.entries(manifest.routes ?? {});

/** @type {Record<string, string>} app/ file path -> the route it serves */
const appRoutes = JSON.parse(fs.readFileSync(APP_ROUTES, "utf-8"));

if (routes.length === 0) {
  console.log("✗ the build manifest lists no prerendered routes");
  process.exit(1);
}

let bad = 0;
for (const [route, entry] of routes) {
  const every = entry.initialRevalidateSeconds;
  if (every !== false) {
    bad += 1;
    console.log(`✗ ${route} revalidates every ${every}s`);
  }
}

// A route with [params] is prerendered once per value, and each of those
// pages names it as its srcRoute; a plain route is prerendered under its own
// path. A route with neither is rendered on request.
const prerendered = new Set();
for (const [route, entry] of routes) {
  prerendered.add(route);
  if (entry.srcRoute) prerendered.add(entry.srcRoute);
}
for (const route of new Set(Object.values(appRoutes))) {
  if (!prerendered.has(route)) {
    bad += 1;
    console.log(`✗ ${route} is rendered on every request, not built once`);
  }
}

console.log(
  bad
    ? `\n${bad} route(s) are not plain static`
    : `✓ ${routes.length} prerendered routes, none revalidating`,
);
process.exit(bad ? 1 : 0);
