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
