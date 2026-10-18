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
import re
import sys
from functools import cache
from pathlib import Path

ROOT = Path(sys.argv[1] if len(sys.argv) > 1 else "../aipager").resolve()
OUT = Path(__file__).resolve().parent.parent / "lib" / "bot-strings.json"
sys.path.insert(0, str(ROOT))

import aipager  # noqa: E402
import aipager.bot as bot  # noqa: E402
import aipager.miniapp as miniapp  # noqa: E402
from aipager.bot.appearance import appearance_schema  # noqa: E402
from aipager.bot.settings_menu import settings_schema  # noqa: E402
from aipager.i18n import Msg, Plural, get  # noqa: E402
from aipager.i18n.locales import LOCALES  # noqa: E402

SESSION = "api"
TOOL = "Bash: pnpm test e2e/login"


@cache
def messages() -> dict:
    """Every Msg and Plural the product defines, by key.

    The Mini App is a second package with its own text, and the site mocks
    its screen, so its words have to be here too, and so do the few that
    live in aipager's own top-level modules (the session facts, the
    language picker).
    """
    found: dict = {}
    mods = [(bot, "aipager.bot"), (miniapp, "aipager.miniapp"), (aipager, "aipager")]
    for pkg, name in mods:
      for info in pkgutil.iter_modules(pkg.__path__):
        if info.ispkg and name == "aipager":
            continue
        mod = importlib.import_module(f"{name}.{info.name}")
        for value in vars(mod).values():
            items = value.values() if isinstance(value, dict) else value if isinstance(value, tuple) else [value]
            for v in items:
                if isinstance(v, (Msg, Plural)):
                    found.setdefault(v.key, v)
    return found


def m(key: str):
    return messages()[key]


def group_title(s: str) -> str:
    """A settings title without its leading emoji, as the Mini App shows it."""
    return re.sub(r"^[^\w\s]+\s+", "", s)


def label_lead(s: str) -> str:
    """The lead of a label ("Off" of "Off - busy card only"), as the Mini
    App's collapsed row shows it."""
    cut = s.find(" - ")
    return s[:cut] if cut > 0 else s


def schema(rows: list[dict]) -> list[dict]:
    return [{
        "field": r["field"],
        "title": group_title(r["title"]),
        "options": [{
            "value": o["value"],
            "label": o["label"],
            "lead": label_lead(o["label"]),
            "help": o["help"],
            **({"swatch": o["swatch"]} if "swatch" in o else {}),
        } for o in r["options"]],
    } for r in rows]


def app(code: str) -> dict:
    """The Mini App, as the site's mock of it shows it: its own words, in
    this language, from the same schema the real app renders."""
    tr = get(code)
    t = tr.text
    n = tr.n
    return {
        "tabs": {"sessions": t(m("ui.tab.sessions")), "settings": t(m("ui.tab.settings"))},
        "uptime": t(m("ui.daemon.uptime"), n=141),
        "pulse": {
            "need1": n(m("ui.pulse.need"), 1, kind="text"),
            "working2": n(m("ui.pulse.working"), 2, kind="text"),
            "working3": n(m("ui.pulse.working"), 3, kind="text"),
            "resting1": n(m("ui.pulse.resting"), 1, kind="text"),
            "finished12": n(m("ui.pulse.finished"), 12, kind="text"),
            "spent": t(m("ui.pulse.spent"), cost="{cost}"),
        },
        "needsYou": t(m("ui.grid.needs_you")),
        "answerInChat": t(m("ui.btn.answer_in_chat")),
        "answerSent": t(m("ui.answer.sent")),
        "newSession": t(m("ui.btn.new_session")),
        "state": {k: t(m(f"ui.state.{k}")) for k in ("busy", "idle", "waiting", "gone")},
        "finished12": n(m("ui.grid.finished_n"), 12, kind="text"),
        "line": {
            "resting": t(m("ui.state_line.resting_since"), age="{age}"),
            "working": t(m("ui.state_line.working_for"), clock="{clock}"),
            "needs": t(m("ui.state_line.needs_you_kind"), kind=t(m("ui.kind_word.permission"))),
            "finished": t(m("ui.state_line.finished")),
        },
        "age": {
            "s2": t(m("ui.age.seconds"), n=2),
            "s14": t(m("ui.age.seconds"), n=14),
            "m10": t(m("ui.age.minutes"), n=10),
            "m40": t(m("ui.age.minutes"), n=40),
            "h3": t(m("ui.age.hours"), n=3),
            "d2": t(m("ui.age.days"), n=2),
        },
        "clock": {"a": tr.clock(194), "b": tr.clock(862), "c": tr.clock(41)},
        "detail": {"latestReply": t(m("ui.detail.latest_reply")), "sessionSettings": t(m("ui.detail.session_settings"))},
        "fact": {k: t(m(f"app.fact.{v}")) for k, v in (("model", "model"), ("context", "context"), ("cost", "cost"),
                                                     ("lastActive", "last_active"), ("mode", "mode"), ("cwd", "cwd"), ("working", "working"))},
        "modelTitle": t(m("ui.model.title")),
        "resetDefaults": t(m("ui.btn.reset_defaults")),
        "resetDone": t(m("ui.settings.reset_done")),
        "saved": t(m("ui.settings.saved")),
        "changed3": n(m("ui.diff.title_n"), 3, kind="text"),
        "changedNone": t(m("ui.diff.title_none")),
        "change": {k: t(m(f"ui.diff.change.{k}")) for k in ("added", "modified", "deleted")},
        "timeline5": n(m("ui.timeline.title_n"), 5, kind="text"),
        "timelineEmpty": t(m("ui.timeline.title_empty")),
        "timelineNote": t(m("ui.timeline.note")),
        "action": {k: t(m(f"ui.btn.action.{k}")) for k in ("stop", "restart", "compact", "rename", "kill", "resume", "delete")},
        "done": {k: t(m(f"ui.done.{k}")) for k in ("stop", "restart", "compact", "rename", "kill", "resume", "delete")},
        "update": {"title": t(m("ui.update.title")), "upToDate": t(m("ui.update.up_to_date")),
                   "check": t(m("ui.btn.check_updates")), "checking": t(m("ui.btn.checking"))},
        "language": {"title": t(m("app.language.title")), "hint": t(m("app.language.hint")), "auto": t(m("lang.auto"))},
        "chatPrefs": t(m("ui.settings.chat_prefs")),
        "prefsIntro": t(m("ui.settings.intro")),
        "appearance": t(m("ui.settings.appearance")),
        "appearanceIntro": t(m("ui.settings.appearance_intro")),
        "defaultTag": t(m("ui.settings.default_tag")),
        "groups": schema(settings_schema(tr)),
        "looks": schema(appearance_schema(tr)),
        "report": {
            "btn": t(m("ui.btn.report")),
            "card": t(m("ui.report.card_text")),
            "title": t(m("ui.report.title")),
            "privacy": t(m("ui.report.privacy")),
            "noteLabel": t(m("ui.report.note_label")),
            "notePlaceholder": t(m("ui.report.note_placeholder")),
            "asWritten": t(m("ui.report.as_written")),
            "whatSent": t(m("ui.report.what_sent")),
            "system": t(m("ui.report.label.system")),
            "setup": t(m("ui.report.label.setup")),
            "setupLine": t(m("ui.report.setup_line_no_groups"), mode=t(m("ui.report.setup.scope")),
                           dms=n(m("ui.report.n_private_chats"), 2, kind="text"), uptime=t(m("ui.report.uptime.1h_24h"))),
            "errors": n(m("ui.report.errors_n"), 2, kind="text"),
            "err1": t(m("ui.report.err.type_in"), type="TimeoutError", area=t(m("rep.area.animation"))),
            "err1Sub": t(m("ui.report.err_sub"), times=n(m("ui.report.times"), 3, kind="text"), day="2026-10-17"),
            "err2": t(m("ui.report.err.logged_in"), area=t(m("rep.area.notify"))),
            "err2Sub": t(m("ui.report.err_sub"), times=t(m("ui.report.once")), day="2026-10-16"),
            "foot": t(m("ui.report.foot")),
            "send": t(m("ui.btn.send_report")),
            "sending": t(m("ui.btn.sending")),
            "sent": t(m("ui.report.sent_title")),
            "thanks": t(m("ui.report.thanks")),
        },
        "new": {
            "title": t(m("ui.new.title")),
            "sub": t(m("ui.new.sub")),
            "name": t(m("ui.new.name")),
            "where": t(m("ui.new.where")),
            "recent": t(m("ui.new.chips_recent")),
            "suggested": t(m("ui.new.chips_suggested")),
            "cwdTitle": t(m("ui.new.cwd_title")),
            "newFolder": t(m("ui.new.new_folder")),
            "newFolderHelp": t(m("ui.new.new_folder_help")),
            "default": t(m("ui.new.default")),
            "defaultModelHelp": t(m("ui.new.default_model_help")),
            "otherModel": t(m("ui.new.other_model")),
            "otherModelHelp": t(m("ui.new.other_model_help"), example="claude-opus-5"),
            "modelName": t(m("ui.new.model_name")),
            "modelNeeded": t(m("ui.new.model_needed")),
            "more": t(m("ui.new.more")),
            "modeTitle": t(m("ui.new.mode_title")),
            "modes": {k: t(m(f"ui.new.mode_{k}")) for k in ("ask", "auto", "full")},
            "modeHelp": {k: t(m(f"ui.new.mode_{k}_help")) for k in ("ask", "auto", "full")},
            "summary": {k: t(m(f"ui.new.summary_{k}"), where="{where}", model="{model}") for k in ("ask", "auto", "full")},
            "summaryNamed": {k: t(m(f"ui.new.summary_named_{k}"), name="{name}", where="{where}", model="{model}") for k in ("ask", "auto", "full")},
            "cliModel": t(m("ui.new.cli_model")),
            "start": t(m("ui.btn.start_session")),
            "creating": t(m("ui.new.creating")),
            "created": t(m("ui.new.created")),
        },
    }


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
        "app": app(code),
    }


def main() -> None:
    codes = [c for c, loc in LOCALES.items() if loc.enabled]
    data = [render(c) for c in codes]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"✓ {len(data)} languages written to {OUT}")


if __name__ == "__main__":
    main()
