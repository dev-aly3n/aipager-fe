import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { CopyButton, GitHubIcon } from "@/components/brand";
import { Desktop } from "@/components/tg/desktop";
import { Ask, Languages, Modes, Places, Saved, Trust, Under } from "@/components/tg/sections";

const INSTALL = "curl -fsSL aipager.run/install | sh";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden pb-24 pt-[84px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_50%_0%,rgb(42_171_238/0.16),transparent_60%)]" />
          <div className="wrap relative !max-w-[86rem]">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-[clamp(38px,4.3vw,66px)] font-semibold leading-[1] tracking-[-0.05em]">
                Claude is one more chat<span className="text-[#2aabee]">.</span>
              </h1>
              <p className="mx-auto mt-3.5 max-w-3xl text-[17px] leading-relaxed text-fg-2">
                aipager puts your Claude Code sessions in Telegram, between your family, your friends and your team. It runs on your machine.
              </p>
            </div>
            <div className="mt-6">
              <Desktop />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <div className="flex w-[27rem] max-w-full items-center gap-2.5 rounded-xl border border-white/10 bg-[#0d1014] py-2 pl-4 pr-2 font-mono text-[13.5px]">
                <span className="text-fg-4">$</span>
                <span className="min-w-0 flex-1 truncate text-left text-fg-2">{INSTALL}</span>
                <CopyButton text={INSTALL} className="rounded-lg border border-white/10 px-3 py-1.5 text-[12px] text-fg-3 transition-colors hover:border-accent hover:text-foreground" />
              </div>
              <a href="https://github.com/dev-aly3n/aipager" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-[#0a0c0f] transition-opacity hover:opacity-90">
                <GitHubIcon size={15} /> Star on GitHub
              </a>
              <a href="/docs" className="rounded-full border border-white/12 px-5 py-2.5 text-[14px] text-fg-2 transition-colors hover:border-white/30 hover:text-foreground">
                Read the docs
              </a>
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
