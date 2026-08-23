import fallback from "./version-fallback.json";

// Kept current by scripts/sync-docs.sh, which copies the version out of the
// aipager repo's pyproject.toml. Used when the PyPI lookup is unavailable
// (offline builds, rate limits), so the site never shows a stale hardcode.
export const FALLBACK_VERSION: string = fallback.version;

export async function getAipagerVersion(): Promise<string> {
  try {
    const res = await fetch("https://pypi.org/pypi/aipager/json", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return FALLBACK_VERSION;
    const data = (await res.json()) as { info?: { version?: string } };
    return data.info?.version ?? FALLBACK_VERSION;
  } catch {
    return FALLBACK_VERSION;
  }
}
