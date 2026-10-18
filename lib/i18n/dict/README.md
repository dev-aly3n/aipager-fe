# Translating aipager.run

One file per language, `<code>.ts`, holding the whole site's words. The
English in `en.ts` is the source; `types.ts` is the contract.

## The rules are aipager's own

Read these first, in this order, from the aipager repo (`../aipager`):

1. `tools/i18n/TRANSLATING.md` — how aipager is translated. All of it applies.
2. `tools/i18n/style/<code>.md` — this language's own decisions and its
   vocabulary table.
3. `tools/i18n/glossary/<code>.json` — the terms that must match the app.

The site must read like the app: same word for the same idea, in the same
register. A reader who switches between the bot and this page should not
notice two different voices.

## What this file does not contain

Nothing aipager itself says. Every card, button, prompt, pinned bar and
status line in the demo comes from aipager's own catalogs through
`lib/bot-strings.json` (rendered by `scripts/sync-bot-strings.py`). If a
string here looks like product UI, it is a mistake — say so instead of
translating it.

Claude Code's terminal output stays English, because Claude Code is English:
`Read(file)`, `Bash(cmd)`, `✻ Welcome to Claude Code!`, `18 passed (41s)`.

## Never translated

Product names (aipager, Claude, Claude Code, Anthropic, Telegram, Mini App,
GitHub, PyPI, BotFather), tool names (Bash, Read, Edit, Write, Grep, Glob,
WebFetch, Agent), model names (Sonnet, Opus, Haiku), commands (`/new`,
`/mode auto`, `/status`, `aipager config`), role names (`owner`, `admin`,
`user`, `read_only`), session names (`api`, `web`, `trip`), paths, flags,
file names, and anything inside backticks or a code span.

Personal names in the demo (Sara, Sam, Leo, Nima, Omid, Jim) stay as they
are. "Mom" is not a name but a word: use what a person in this language
calls their mother in a phone contact.

## Rules `check` would enforce

- No long dash (U+2014). Use a comma, a colon, or parentheses.
- Right-to-left languages write ← where the English writes →; the arrows in
  this file are drawn by code, so just never add one of your own.
- Keep every emoji, and keep it where it is.
- Digits: follow the style guide (fa and ar use their own digits in prose;
  numbers inside commands, versions and paths stay Latin).
- Keep the shape: same keys, same number of items in every list. The file
  must typecheck as `Dict`.
- `check this:` is the prompt aipager types into Claude when a file arrives
  with no caption. It sends that in English in every language, so the English
  stays in `day.items[1].b` too, quoted the way your language quotes.

## Where the number goes

`app.summary.*` are counted phrases. English puts the number
first, so the English values are bare words and the page writes
`1 needs you`. A language that wants the number somewhere else writes `{n}`
and places it itself:

```ts
summary: { needs: "{n} 个在等你回复", … }   // zh-Hans
summary: { needs: "بانتظارك: {n}", … }     // ar
```

A phrase with no placeholder still gets the number in front, as English
does. Either form is fine; pick the one that reads.

## The file

```ts
import type { Dict } from "./types";

export const es: Dict = {
  // every key of en.ts, in the same order
};
```

Then, from the site's root: `bunx tsc --noEmit` must print nothing, and
`node scripts/check-dict.mjs <code>` must pass.
