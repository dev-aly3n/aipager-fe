#!/usr/bin/env python3
"""
One emoji set on every screen.

Usage: uvx --from "fonttools[woff]" python scripts/emoji-font.py path/to/Twemoji.Mozilla.ttf

A phone draws emoji from its own set, so the same 💬 looks one way on an
iPhone, another on Android and another on Windows, and a symbol written
without the emoji selector (⏹, ⏸) is a coloured picture on one and a plain
glyph on the next. The site ships its own instead: Twemoji, in the COLR
format every current browser draws in colour, cut down to the characters
the site actually shows, so a page fetches a few kilobytes rather than the
whole set.

It reads every place text comes from (the dictionaries, the product's
catalog strings, the components and the docs), keeps each character that
is an emoji there, writes public/fonts/emoji.woff2, and writes the
unicode-range into app/globals.css between the emoji:start and emoji:end
markers, so the browser only reaches for the font where it has a glyph.

A few characters with an emoji form are meant as text on this site (the
arrow after an outside link); TEXT keeps them out, so they stay in the
page's own font. Run it again after a docs sync brings new emoji.

Twemoji's artwork is Twitter's, under CC-BY 4.0; public/fonts/emoji-LICENSE.txt
carries the notice.
"""

from __future__ import annotations

import pathlib
import re
import sys
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "fonts" / "emoji.woff2"
CSS = ROOT / "app" / "globals.css"
DATA = "https://www.unicode.org/Public/15.1.0/ucd/emoji/emoji-data.txt"

SOURCES = (
    "lib/**/*.ts",
    "lib/bot-strings.json",
    "components/**/*.tsx",
    "components/**/*.ts",
    "app/**/*.tsx",
    "content/docs/**/*.md",
)

# Characters that have an emoji form but are text here.
TEXT = {
    0x2197,  # ↗ after a link that leaves the site
    0x2196,  # ↖ the same, right to left
    0x2194,  # ↔
    0x2195,  # ↕
    0x23FA,  # ⏺ Claude Code's bullet, drawn as ● in the terminal
}

VS16 = 0xFE0F
ZWJ = 0x200D
KEYCAP = 0x20E3


def emoji_props() -> tuple[set[int], set[int]]:
    """Code points with the Emoji property, and those drawn as emoji by default."""
    emoji: set[int] = set()
    pres: set[int] = set()
    text = urllib.request.urlopen(DATA, timeout=30).read().decode()
    for line in text.splitlines():
        line = line.split("#")[0].strip()
        if not line:
            continue
        cps, prop = (x.strip() for x in line.split(";"))
        a, _, b = cps.partition("..")
        run = range(int(a, 16), int(b or a, 16) + 1)
        if prop == "Emoji":
            emoji.update(run)
        elif prop == "Emoji_Presentation":
            pres.update(run)
    return emoji, pres


def wanted(emoji: set[int]) -> set[int]:
    keep: set[int] = set()
    for pattern in SOURCES:
        for path in ROOT.glob(pattern):
            for ch in path.read_text(encoding="utf-8"):
                cp = ord(ch)
                # ASCII digits, # and * have keycap forms; they are text here
                if cp < 0x80 or cp in TEXT or cp not in emoji:
                    continue
                keep.add(cp)
    return keep


def ranges(cps: list[int]) -> str:
    """unicode-range syntax, runs collapsed."""
    out: list[str] = []
    start = prev = cps[0]
    for cp in cps[1:] + [-1]:
        if cp == prev + 1:
            prev = cp
            continue
        out.append(f"U+{start:X}" if start == prev else f"U+{start:X}-{prev:X}")
        start = prev = cp
    return ", ".join(out)


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    src = pathlib.Path(sys.argv[1])
    emoji, _ = emoji_props()
    keep = wanted(emoji)
    have = set(TTFont(src).getBestCmap())
    missing = sorted(cp for cp in keep if cp not in have)
    keep = sorted(cp for cp in keep if cp in have)
    # the selector and the joiner ride along, so a sequence still shapes
    glyphs = keep + [cp for cp in (VS16, ZWJ, KEYCAP) if cp in have]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    opts = subset.Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]
    opts.name_IDs = ["*"]
    opts.notdef_outline = False
    font = TTFont(src)
    sub = subset.Subsetter(options=opts)
    sub.populate(unicodes=glyphs)
    sub.subset(font)
    font.flavor = "woff2"
    font.save(OUT)

    css = CSS.read_text(encoding="utf-8")
    block = (
        "/* emoji:start (written by scripts/emoji-font.py) */\n"
        "@font-face {\n"
        '  font-family: "aipager emoji";\n'
        '  src: url("/fonts/emoji.woff2") format("woff2");\n'
        "  font-display: swap;\n"
        f"  unicode-range: {ranges(sorted(glyphs))};\n"
        "}\n"
        "/* emoji:end */"
    )
    css, n = re.subn(r"/\* emoji:start.*?/\* emoji:end \*/", block, css, flags=re.S)
    if not n:
        sys.exit("app/globals.css has no emoji:start / emoji:end markers")
    CSS.write_text(css, encoding="utf-8")

    print(f"✓ {len(keep)} emoji, {OUT.stat().st_size / 1024:.1f} KB → {OUT.relative_to(ROOT)}")
    if missing:
        print("  not in the font, left to the device:", " ".join(chr(cp) for cp in missing))


if __name__ == "__main__":
    main()
