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

echo
echo "✓ docs synced from $SRC"
echo "  commit + push to deploy."

# Also mirror the current aipager version so the site's fallback badge can
# never go stale (the live badge comes from PyPI at request time).
PYPROJECT="${1:-../aipager}/pyproject.toml"
if [[ -f "$PYPROJECT" ]]; then
  VER=$(grep -m1 '^version' "$PYPROJECT" | sed 's/.*"\(.*\)".*/\1/')
  printf '{ "version": "%s" }\n' "$VER" > lib/version-fallback.json
  echo "✓ version fallback set to $VER"
fi
