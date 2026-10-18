/**
 * The social card (app/opengraph-image.tsx, app/twitter-image.tsx), named in
 * every page's share metadata. Next replaces a parent's openGraph and
 * twitter objects wholesale when a page sets its own, so a page that names
 * its title and description and not the card shares with no picture at all,
 * which is what every page did.
 */
const ALT = "aipager: Telegram remote-control for Claude Code";

export const OG_IMAGES = [{ url: "/opengraph-image", width: 1200, height: 630, alt: ALT }];
export const TWITTER_IMAGES = [{ url: "/twitter-image", width: 1200, height: 630, alt: ALT }];
