#!/usr/bin/env python3
"""Render the bot texts the site shows, in every language aipager speaks.

Usage: python3 scripts/sync-bot-strings.py [path-to-aipager-repo]

Defaults to ../aipager (sibling checkout). Every string comes from aipager's
own catalogs, rendered by its own ``Tr`` (digits, plurals and direction
included), so the site never shows a translation of its own. Run it after
every aipager release, next to ./scripts/sync-docs.sh.
"""

from __future__ import annotations

import importlib
import json
import pkgutil
import sys
from functools import cache
from pathlib import Path

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "../aipager").resolve()
OUT = Path(__file__).resolve().parent.parent / "lib" / "bot-strings.json"
sys.path.insert(0, str(ROOT))

import aipager.bot as bot  # noqa: E402
from aipager.i18n import Msg, Plural, get  # noqa: E402
from aipager.i18n.locales import LOCALES  # noqa: E402

SESSION = "api"
TOOL = "Bash: pnpm test e2e/login"


@cache
def messages() -> dict:
    """Every Msg and Plural the bot package defines, by key."""
    found: dict = {}
    for info in pkgutil.iter_modules(bot.__path__):
        mod = importlib.import_module(f"aipager.bot.{info.name}")
        for value in vars(mod).values():
            items = value.values() if isinstance(value, dict) else value if isinstance(value, tuple) else [value]
            for v in items:
                if isinstance(v, (Msg, Plural)):
                    found.setdefault(v.key, v)
    return found


def m(key: str):
    return messages()[key]


def render(code: str) -> dict:
    tr = get(code)
    loc = LOCALES[code]
    t = tr.text
    mode = {k: t(m(f"mode.{k}")) for k in ("ask", "auto", "full")}
    spin = [t(m(f"card.verb.spin_{w}")) for w in ("thinking", "reasoning", "pondering", "considering", "analyzing", "processing", "evaluating", "calculating", "examining", "investigating", "formulating", "crafting")]
    working = t(m("pin.state"), state=t(m("pin.state.working")))
    return {
        "code": code,
        "name": loc.endonym,
        "english": loc.english_name,
        "rtl": loc.rtl,
        "permHead": t(m("perm.separate"), session=SESSION),
        "allow": t(m("perm.btn.allow")),
        "deny": t(m("perm.btn.deny")),
        "always": t(m("perm.btn.allow_always")),
        "stop": t(m("perm.btn.stop")),
        "pinWaiting": t(m("pin.first.waiting"), session=SESSION) + " " + t(m("pin.summary"), summary=TOOL),
        "pinWorking": t(m("pin.first.single"), glyph="⚙️", session=SESSION, state=working),
        "pinIdle": t(m("pin.first.all_idle")),
        "answerLine": t(m("ans.line_anon"), icon="✅", session=SESSION, verb=t(m("ans.verb.allow")), detail=TOOL),
        "cardStatus": t(m("card.status"), mark="⏳", session=SESSION, verb=spin[2]).replace("**", ""),
        "clock": tr.clock(194),
        "spin": spin,
        "modes": mode,
        "switched": t(m("modecard.switch_confirmed"), session=SESSION, mode=mode["auto"]),
        "agentsDone": tr.n(m("agents.head.done"), 2, kind="text", clock=tr.clock(372)),
        "language": t(m("lang.row"), language=loc.endonym),
    }


def main() -> None:
    codes = [c for c, loc in LOCALES.items() if loc.enabled]
    data = [render(c) for c in codes]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"✓ {len(data)} languages written to {OUT}")


if __name__ == "__main__":
    main()
