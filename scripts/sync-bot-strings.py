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
import aipager.miniapp as miniapp  # noqa: E402
from aipager.i18n import Msg, Plural, get  # noqa: E402
from aipager.i18n.locales import LOCALES  # noqa: E402

SESSION = "api"
TOOL = "Bash: pnpm test e2e/login"


@cache
def messages() -> dict:
    """Every Msg and Plural the product defines, by key.

    The Mini App is a second package with its own text, and the site mocks
    its screen, so its words have to be here too.
    """
    found: dict = {}
    mods = [(bot, "aipager.bot"), (miniapp, "aipager.miniapp")]
    for pkg, name in mods:
      for info in pkgutil.iter_modules(pkg.__path__):
        mod = importlib.import_module(f"{name}.{info.name}")
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
    n = tr.n
    mode = {k: t(m(f"mode.{k}")) for k in ("ask", "auto", "full")}
    spin = [t(m(f"card.verb.spin_{w}")) for w in ("thinking", "reasoning", "pondering", "considering", "analyzing", "processing", "evaluating", "calculating", "examining", "investigating", "formulating", "crafting")]
    working = t(m("pin.state"), state=t(m("pin.state.working")))
    # A template keeps its placeholders so the site can fill them in; the
    # words around them are the product's own, in this language.
    S, C, A, D = "{session}", "{clock}", "{agent}", "{detail}"
    return {
        "code": code,
        "name": loc.endonym,
        "english": loc.english_name,
        "rtl": loc.rtl,
        # the Fifteen languages section shows these as they come
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
        # and the demo fills these in as the evening goes
        "tpl": {
            "permHead": t(m("perm.separate"), session=S),
            "cardStatus": t(m("card.status"), mark="{mark}", session=S, verb="{verb}").replace("**", ""),
            "answerLine": t(m("ans.line_anon"), icon="{icon}", session=S, verb="{verb}", detail=D),
            "answered": t(m("ans.answered_anon"), session=S, question="{question}", option="{option}"),
            "agentLive": t(m("card.row.agent_live"), agent=A, activity="{activity}", clock=C),
            "shellLive": t(m("card.row.shell_live"), label="{label}", clock=C),
            "bgRowWorking": t(m("agents.row.working"), agent=A, activity="{activity}").replace("**", ""),
            "bgRowDone": t(m("agents.row.done"), agent=A, clock=C).replace("**", ""),
            "blocked": t(m("auth.blocked_for_role"), session=S, tool="{tool}", person="{person}", role="{role}"),
            "pinWaiting": t(m("pin.first.waiting"), session=S) + " " + t(m("pin.summary"), summary="{summary}"),
            "pinWorking": t(m("pin.first.single"), glyph="⚙️", session=S, state=working),
            "pinOneIdle": t(m("pin.first.single"), glyph="💤", session=S,
                            state=t(m("pin.state"), state=t(m("pin.state.idle")))),
            "pinIdle": t(m("pin.first.all_idle")),
            "pinCounts": t(m("pin.first.counts"), glyph="{glyph}", counts="{counts}"),
            "pinRunning": t(m("pin.paren"), running="{running}"),
            "pinTarget": t(m("pin.target"), session=S).replace("**", ""),
            "switched": t(m("modecard.switch_confirmed"), session=S, mode="{mode}"),
            "confirmFull": t(m("modecard.confirm_full"), session=S, mode="{mode}", flag="--dangerously-skip-permissions"),
            "ready": t(m("newflow.ready"), session=S),
            "readySettings": t(m("newflow.ready_settings"), mode="{mode}", model="{model}", folder="{folder}"),
            "peerFrom": t(m("card.peer.from"), session=S, who="{who}").replace("**", ""),
        },
        "btn": {
            "toFull": t(m("modecard.btn.to_full")),
            "cancel": t(m("newflow.btn.cancel")),
            "sendNow": t(m("sendnow.btn.send")),
        },
        "line": {
            "queued": t(m("sendnow.line")),
            "promise": t(m("agents.promise")),
            "verbDone": t(m("card.verb.done")),
            "verbAllow": t(m("ans.verb.allow")),
            # the card's verb slot only ever holds one of card.verb.*; the
            # site used to invent "Testing", which the bot never says
            "verbWorking": t(m("card.verb.working")),
        },
        # the counts the demo actually shows, with this language's plurals
        "count": {
            "working1": n(m("pin.count.working"), 1, kind="text"),
            "working2": n(m("pin.count.working"), 2, kind="text"),
            "idle1": n(m("pin.count.idle"), 1, kind="text"),
            "idle2": n(m("pin.count.idle"), 2, kind="text"),
            "agents2": n(m("pin.running_agents"), 2, kind="text"),
            "agents1": n(m("pin.running_agents"), 1, kind="text"),
            "fold3": n(m("card.fold"), 3, kind="text"),
            "fold4": n(m("card.fold"), 4, kind="text"),
            "fold6": n(m("card.fold"), 6, kind="text"),
            # how long ago a tile was last active: the Mini App writes the
            # whole phrase, unit and all, so the site must not spell "2s"
            "age2": t(m("ui.age.seconds"), n=2),
            "age14": t(m("ui.age.seconds"), n=14),
            # the folded list of ended sessions under the Mini App grid
            "finished12": n(m("ui.grid.finished_n"), 12, kind="text"),
            "agentsWorking1": n(m("agents.head.working"), 1, kind="text"),
            "agentsWorking2": n(m("agents.head.working"), 2, kind="text"),
            "agentsDone2": n(m("agents.head.done"), 2, kind="text", clock=C),
            "agentDone11": n(m("card.row.agent_done"), 11, kind="text", agent=A, clock=C),
            "agentDone7": n(m("card.row.agent_done"), 7, kind="text", agent=A, clock=C),
        },
    }


def main() -> None:
    codes = [c for c, loc in LOCALES.items() if loc.enabled]
    data = [render(c) for c in codes]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"✓ {len(data)} languages written to {OUT}")


if __name__ == "__main__":
    main()
