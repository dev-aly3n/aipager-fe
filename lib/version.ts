import release from "./aipager-version.json";

/**
 * The aipager release the site shows, fixed when the site is built. It is
 * written into `lib/aipager-version.json` by scripts/sync-docs.sh from the
 * release tag's `pyproject.toml`, in the same run that copies that release's
 * docs, so the version and the docs on every page always belong together.
 * There is nothing to fetch: the pages are static, and a new release reaches
 * them by the next deploy.
 */
export const AIPAGER_VERSION: string = release.version;
