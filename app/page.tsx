import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CopyButton, GitHubIcon } from "@/components/brand";
import { InstallLine } from "@/components/install-line";
import { Desktop } from "@/components/tg/desktop";
import { Ask, Languages, Modes, Places, Saved, Trust, Under } from "@/components/tg/sections";

const INSTALL = "curl -fsSL aipager.run/install | sh";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden pb-20 pt-[72px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_30%_0%,rgb(42_171_238/0.16),transparent_62%)]" />
          <div className="wrap relative grid !max-w-[92rem] items-center gap-10 xl:grid-cols-[26rem_minmax(0,1fr)] xl:gap-14">
            {/* what it is, and the one command — never below the fold */}
            <div className="text-center xl:text-left">
              <h1 className="text-[clamp(36px,3.6vw,52px)] font-semibold leading-[1.02] tracking-[-0.045em]">
                Claude is one more chat<span className="text-[#2aabee]">.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed text-fg-2 xl:mx-0">
                aipager puts your Claude Code sessions in Telegram, between your family, your friends and your team. It runs on your machine.
              </p>
              <div className="mt-7">
                <InstallLine cmd={INSTALL} />
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] text-fg-3 xl:justify-start">
                <a href="#install" className="transition-colors hover:text-foreground">
                  Let your agent install it
                </a>
                <a href="/docs" className="transition-colors hover:text-foreground">
                  Docs
                </a>
                <a href="/docs/security" className="transition-colors hover:text-foreground">
                  Security
                </a>
                <a href="https://github.com/dev-aly3n/aipager" className="inline-flex items-center gap-2 transition-colors hover:text-foreground">
                  <GitHubIcon size={14} /> GitHub
                </a>
              </div>
              <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.14em] text-fg-4">Linux &amp; macOS · MIT · about a minute</p>
            </div>

            {/* the evening itself, with the height it needs */}
            <div className="min-w-0">
              <Desktop />
            </div>
          </div>
        </section>
        <Modes />
        <Places />
        <Languages />
        <Under />
        <Trust />
        <Saved />
        <Ask />
        <section className="relative overflow-hidden border-t border-white/[0.06] py-36">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgb(42_171_238/0.14),transparent_55%)]" />
          <div className="wrap relative text-center">
            <h2 className="text-[clamp(48px,6.5vw,100px)] font-semibold leading-[0.95] tracking-[-0.055em]">
              Add Claude to your chats<span className="text-[#2aabee]">.</span>
            </h2>
            <p className="mt-6 text-[19px] text-fg-2">Then close the terminal and go live your evening.</p>
            <div className="mx-auto mt-10 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1014] py-2.5 pl-5 pr-2.5 font-mono text-[15px]">
              <span className="text-accent">$</span>
              <span className="min-w-0 flex-1 truncate text-left text-foreground">{INSTALL}</span>
              <CopyButton text={INSTALL} className="rounded-xl border border-white/12 px-4 py-2 text-[13px] text-fg-2 transition-colors hover:border-accent hover:text-foreground" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
