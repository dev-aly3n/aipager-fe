/**
 * A path, a command, a @username or the English prompt aipager types,
 * inside a right-to-left sentence. `~/.ssh` is one
 * left-to-right run as far as the reader is concerned, but the bidi
 * algorithm only sees `ssh` as strongly left-to-right and lays the rest out
 * around it, so it comes out as `ssh./~`. Isolating each run puts it back.
 * Left to right, this renders exactly what it was given.
 */
const PATH =
  /((?<![A-Za-z0-9])(?:~|\.{0,2})\/[A-Za-z0-9._~@\-/<>]+(?: [a-z<][A-Za-z0-9._~@\-<>]*)*|[A-Za-z0-9._-]+\.(?:ts|tsx|py|json|jsonl|yaml|yml|md|toml)|(?<![A-Za-z0-9])@[A-Za-z0-9_]{3,}|check th(?:is|ese): …)/g;

export function Bidi({ text }: { text: string }) {
  const parts = text.split(PATH);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return part;
        // a full stop after the command belongs to the sentence, not to the
        // command, so it stays outside and keeps the sentence's direction
        const [, run, tail] = part.match(/^([\s\S]*?)([.,:;]*)$/) ?? [, part, ""];
        return (
          <span key={i}>
            <bdi dir="ltr">{run}</bdi>
            {tail}
          </span>
        );
      })}
    </>
  );
}

/**
 * aipager writes its messages in Telegram's HTML, so a line that reaches the
 * demo carries the same `<b>`, `<i>` and `<code>` the real bot sends. This
 * renders those three and nothing else, so nothing else is parsed and a
 * person typing an angle bracket into a chat still sees an angle bracket.
 */
export function Rich({ html }: { html: string }) {
  const parts = html.split(/(<\/?(?:b|i|code)>)/);
  const out: React.ReactNode[] = [];
  let tag: "b" | "i" | "code" | null = null;
  parts.forEach((part, i) => {
    const open = part.match(/^<(b|i|code)>$/);
    if (open) return void (tag = open[1] as "b" | "i" | "code");
    if (/^<\/(b|i|code)>$/.test(part)) return void (tag = null);
    if (!part) return;
    if (tag === "b")
      out.push(
        <b key={i} className="font-semibold text-white">
          {part}
        </b>,
      );
    else if (tag === "i")
      out.push(
        <i key={i} className="text-fg-3">
          {part}
        </i>,
      );
    else if (tag === "code")
      out.push(
        <code key={i} className="font-mono text-[0.95em]" dir="ltr">
          {part}
        </code>,
      );
    else out.push(<span key={i}>{part}</span>);
  });
  return <>{out}</>;
}
