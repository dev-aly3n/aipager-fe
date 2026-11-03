#!/usr/bin/env bash
# Copy the reference docs and the version of an aipager release into the site.
# Usage: ./scripts/sync-docs.sh [path-to-aipager-repo] [tag]
#
# The repo defaults to ../aipager (the sibling of this site's checkout), and a
# relative path is read from wherever you run the script. The tag is vX.Y.Z or
# X.Y.Z and defaults to the newest vX.Y.Z tag in that repo. Only a release
# tag is accepted: a branch or a commit would publish docs that never shipped.
#
# Everything is read out of the tag itself (docs/ and pyproject.toml), never
# out of the repo's files on disk, so the branch it has checked out does not
# matter and the repo is left exactly as it was.
#
# It refuses, changing nothing, when the path is not a git repo, the tag is
# missing or not a release, the tag's pyproject.toml names another version,
# the tag has no docs/ or holds anything but plain files there (a symlink
# would copy a file from this machine into the site), or the release is older
# than the one the site shows.
#
# content/docs becomes an exact copy of the release, so a page that was
# dropped upstream is dropped here too. Run after every aipager release, then
# commit and push to deploy. CI does this on its own: see
# .github/workflows/sync-aipager.yml.

set -euo pipefail

# The site is the checkout this script lives in, found through any symlink
# to the script, with CDPATH unset so cd prints nothing into the result.
SELF="${BASH_SOURCE[0]}"
while [[ -L "$SELF" ]]; do
  LINK=$(readlink -- "$SELF")
  [[ "$LINK" == /* ]] || LINK="$(dirname -- "$SELF")/$LINK"
  SELF="$LINK"
done
SITE=$(CDPATH='' cd -- "$(dirname -- "$SELF")/.." && pwd -P)
RELEASE='^v[0-9]+\.[0-9]+\.[0-9]+$'

fail() {
  for line in "$@"; do echo "$line" >&2; done
  exit 1
}

# The repo path is relative to the caller, so resolve it before moving to the
# site's root, where every path below is relative.
ARG="${1:-$SITE/../aipager}"
[[ -d "$ARG" ]] || fail "✗ no directory at $ARG" \
  "  pass the path to your aipager clone: ./scripts/sync-docs.sh ~/code/aipager"
REPO=$(CDPATH='' cd -- "$ARG" && pwd -P)
cd -- "$SITE"
# content/docs is deleted below, so be sure this really is the site.
[[ -f lib/docs-nav.ts && -f app/_og/card.tsx ]] || fail "✗ $SITE is not the aipager.run site"

# A plain folder of docs cannot say which release it came from.
TOP=$(git -C "$REPO" rev-parse --show-toplevel 2>/dev/null || true)
[[ -n "$TOP" && "$(CDPATH='' cd -- "$TOP" && pwd -P)" == "$REPO" ]] || fail "✗ $REPO is not a git repository" \
  "  the docs are read from a release tag, so pass the root of an aipager git clone"

if [[ -n "${2:-}" ]]; then
  TAG="v${2#v}"
  [[ "$TAG" =~ $RELEASE ]] || fail "✗ $2 is not a release tag" \
    "  pass a tag of the form v1.4.0 (or 1.4.0); branches, commits and pre-releases are refused"
else
  # The whole list is captured first: piping git into head could kill git
  # with SIGPIPE, which pipefail would turn into a failed run.
  TAGS=$(git -C "$REPO" tag --list 'v[0-9]*' --sort=-v:refname)
  TAG=""
  while IFS= read -r t; do
    if [[ "$t" =~ $RELEASE ]]; then TAG="$t"; break; fi
  done <<< "$TAGS"
  [[ -n "$TAG" ]] || fail "✗ no release tag (vX.Y.Z) in $REPO" \
    "  fetch them first: git -C $REPO fetch --tags"
fi

# Always the fully spelled ref, so a branch that happens to share the tag's
# name can never be picked instead.
REF="refs/tags/$TAG"
git -C "$REPO" rev-parse -q --verify "$REF^{commit}" > /dev/null || fail "✗ no tag $TAG in $REPO" \
  "  fetch it first: git -C $REPO fetch --tags"
[[ "$(git -C "$REPO" cat-file -t "$REF:docs" 2>/dev/null || true)" == "tree" ]] || fail "✗ $TAG has no docs/ directory"
git -C "$REPO" cat-file -e "$REF:pyproject.toml" 2>/dev/null || fail "✗ $TAG has no pyproject.toml"
# Only plain files are copied. A symlink would be followed by cp and copy
# whatever it points at on this machine into the site (and from CI, onto the
# public repo); a submodule would be dropped without a word.
BAD=$(git -C "$REPO" ls-tree -r "$REF" -- docs | awk '$1 != "100644" && $1 != "100755"')
[[ -z "$BAD" ]] || fail "✗ $TAG's docs/ holds something other than plain files" "$BAD"

# git archive reads the tag's tree straight from the object store: no
# checkout, no worktree, nothing written inside the aipager repo.
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
git -C "$REPO" archive --format=tar "$REF" docs pyproject.toml | tar -x -C "$TMP"

SRC="$TMP/docs"
DEST="content/docs"

VER=$(grep -m1 '^version' "$TMP/pyproject.toml" | sed 's/.*"\(.*\)".*/\1/') || VER=""
[[ "$VER" == "${TAG#v}" ]] || fail "✗ $TAG's pyproject.toml says version ${VER:-(none)}, not ${TAG#v}"

HAVE=""
if [[ -f lib/aipager-version.json ]]; then
  HAVE=$(sed 's/[^0-9.]//g' lib/aipager-version.json)
fi
# The site never goes back to an older release than the one it shows.
if [[ -n "$HAVE" && "$VER" != "$HAVE" ]]; then
  NEWEST=$(printf '%s\n%s\n' "$VER" "$HAVE" | sort -V | tail -1)
  [[ "$NEWEST" != "$HAVE" ]] || fail "✗ $TAG is older than the site's $HAVE" \
    "  your clone may be behind: git -C $REPO fetch --tags"
fi

# The copy below must not fail halfway, after content/docs is gone, so the
# shape it relies on is checked first.
[[ -f "$SRC/install-with-an-agent.md" ]] || fail "✗ $TAG has no docs/install-with-an-agent.md"
for dir in "$SRC"/i18n/*/; do
  [[ -d "$dir" ]] || continue
  compgen -G "$dir*.md" > /dev/null || fail "✗ $TAG has no pages in docs/i18n/$(basename "$dir")"
done

# Every check has passed: from here on the site's files are written.

pages() {
  [[ -d "$1" ]] || return 0
  for f in "$1"/*.md; do
    [[ -e "$f" ]] && basename "$f"
  done
  return 0
}

BEFORE=$(pages "$DEST")
rm -rf "$DEST"

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

# The site's pages are listed by hand in GROUPS (lib/docs-nav.ts), so a page
# that came or went upstream needs a person to look at that list.
AFTER=$(pages "$DEST")
if [[ -n "$BEFORE" ]]; then
  while IFS= read -r f; do
    [[ -n "$f" ]] || continue
    grep -qxF -- "$f" <<< "$BEFORE" \
      || echo "! new upstream: $DEST/$f is copied but not published until its slug is added to GROUPS in lib/docs-nav.ts"
  done <<< "$AFTER"
  while IFS= read -r f; do
    [[ -n "$f" ]] || continue
    grep -qxF -- "$f" <<< "$AFTER" \
      || echo "! gone upstream: $DEST/$f was removed, and the build fails while GROUPS in lib/docs-nav.ts still lists it"
  done <<< "$BEFORE"
fi

# The agent install guide is also served raw at aipager.run/agent.md (the
# README tells people to point their coding agent there). An agent reads
# it outside the docs site, so its links to other docs become absolute.
mkdir -p public
sed -E 's#\]\(([A-Za-z0-9_-]+)\.md(\#[^)]*)?\)#](https://aipager.run/docs/\1\2)#g' \
  "$SRC/install-with-an-agent.md" > public/agent.md
echo "✓ public/agent.md written from install-with-an-agent.md"

# The version every page shows is this file, read when the site is built, so
# it moves together with the docs it describes.
printf '{ "version": "%s" }\n' "$VER" > lib/aipager-version.json
echo "✓ version: $VER (from $TAG, had ${HAVE:-none})"

echo
echo "✓ docs synced from $REPO at $TAG"
echo "  commit + push to deploy."
