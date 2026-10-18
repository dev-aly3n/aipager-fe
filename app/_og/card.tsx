import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getAipagerVersion } from "@/lib/version";

/**
 * The social card, drawn at build time (and again within the hour after a
 * release, as the page itself is), so its version is always the one on
 * PyPI. It used to be a picture, made once, with v0.4.3 painted in and its
 * small lines in a fallback serif because the fonts never reached it.
 * The folder starts with an underscore so it is not a route.
 */

export const SIZE = { width: 1200, height: 630 };
export const ALT = "aipager: Telegram remote-control for Claude Code";

const font = (name: string) => readFile(join(process.cwd(), "app", "_og", name));

// the site's mark, as the nav draws it
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="2" y="2" width="60" height="60" rx="14" fill="#181C20" stroke="#3a4048" stroke-width="1"/><path d="M16 24 L26 32 L16 40" stroke="#F6F7F8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="30" y="29" width="8" height="6" rx="1" fill="#F6F7F8"/><circle cx="48" cy="20" r="6" fill="#3FA9F5" fill-opacity="0.22"/><circle cx="48" cy="20" r="3" fill="#3FA9F5"/></svg>`;

export async function card(): Promise<ImageResponse> {
  const [regular, semibold, mono, version] = await Promise.all([font("geist-400.ttf"), font("geist-600.ttf"), font("geist-mono-400.ttf"), getAipagerVersion()]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 72px 64px",
          backgroundColor: "#0d1015",
          backgroundImage:
            "radial-gradient(circle at 18% 6%, rgba(39, 84, 128, 0.55), rgba(13, 16, 21, 0) 46%), radial-gradient(circle at 86% 96%, rgba(76, 52, 128, 0.42), rgba(13, 16, 21, 0) 44%)",
          fontFamily: "Geist",
          color: "#f4f6f8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/svg+xml;utf8,${encodeURIComponent(MARK)}`} width={64} height={64} alt="" />
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>aipager</div>
          </div>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 20, color: "#8b95a1" }}>v{version} · MIT</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 94, fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.045em" }}>
          <div style={{ display: "flex" }}>Telegram remote-control</div>
          <div style={{ display: "flex" }}>
            for&nbsp;<span style={{ color: "#3fa9f5" }}>Claude Code</span>.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 22 }}>
          <div style={{ display: "flex", color: "#9aa4af" }}>aipager.run</div>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 21, color: "#c3cbd4" }}>
            <span style={{ color: "#3fa9f5" }}>$</span>&nbsp;curl -fsSL aipager.run/install | sh
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    },
  );
}
