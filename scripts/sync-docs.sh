#!/usr/bin/env bash
# Copy reference docs from a local aipager checkout into content/docs.
# Usage: ./scripts/sync-docs.sh [path-to-aipager-repo]
#
# Defaults to ../aipager (sibling checkout). The aipager repo is the
# canonical source for these markdown files; this script just mirrors
# them. Run after every aipager docs/ change.

set -euo pipefail

SRC="${1:-../aipager}/docs"
DEST="content/docs"

if [[ ! -d "$SRC" ]]; then
  echo "✗ no docs directory at $SRC" >&2
  echo "  pass the path to your aipager checkout: ./scripts/sync-docs.sh ~/code/aipager" >&2
  exit 1
fi

mkdir -p "$DEST"
cp -v "$SRC"/*.md "$DEST/"

# Every language aipager's docs are translated into, each in its own folder
# with the same file names. The site falls back to English for anything a
# language is missing.
for dir in "$SRC"/i18n/*/; do
  [[ -d "$dir" ]] || continue
  code=$(basename "$dir")
  mkdir -p "$DEST/$code"
  cp "$dir"/*.md "$DEST/$code/"
  echo "✓ $code: $(ls "$dir"/*.md | wc -l | tr -d ' ') pages"
done

# The agent install guide is also served raw at aipager.run/agent.md (the
# README tells people to point their coding agent there). An agent reads
# it outside the docs site, so its links to other docs become absolute.
mkdir -p public
sed -E 's#\]\(([A-Za-z0-9_-]+)\.md(\#[^)]*)?\)#](https://aipager.run/docs/\1\2)#g' \
  "$SRC/install-with-an-agent.md" > public/agent.md
echo "✓ public/agent.md written from install-with-an-agent.md"

echo
echo "✓ docs synced from $SRC"
echo "  commit + push to deploy."

# Also mirror the current aipager version so the site's fallback badge can
# never go stale (the live badge comes from PyPI at request time).
PYPROJECT="${1:-../aipager}/pyproject.toml"
if [[ -f "$PYPROJECT" ]]; then
  VER=$(grep -m1 '^version' "$PYPROJECT" | sed 's/.*"\(.*\)".*/\1/')
  HAVE=$(sed 's/[^0-9.]//g' lib/version-fallback.json)
  # a checkout can be behind the release the site already shows
  NEWEST=$(printf '%s\n%s\n' "$VER" "$HAVE" | sort -V | tail -1)
  printf '{ "version": "%s" }\n' "$NEWEST" > lib/version-fallback.json
  echo "✓ version fallback: $NEWEST (checkout $VER, had $HAVE)"
fi
