import { CopyButton, GitHubIcon, Mark } from "@/components/brand";

const INSTALL = "curl -fsSL aipager.run/install | sh";

export function Outro() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgb(63_169_245/0.13),transparent_55%)]" />
      <div className="wrap relative text-center">
        <div className="relative mx-auto w-fit">
          <Mark size={104} />
          <span className="absolute left-[75%] top-[31.25%] h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full dot-pulse" />
        </div>
        <h2 className="mt-10 text-[clamp(56px,8vw,120px)] font-semibold leading-[0.92] tracking-[-0.055em]">Go outside.</h2>
        <p className="mt-6 text-[clamp(18px,1.6vw,22px)] text-fg-2">aipager will page you when Claude needs you.</p>
        <div className="mx-auto mt-12 flex max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1014] py-2.5 pl-5 pr-2.5 font-mono text-[15px]">
          <span className="text-accent">$</span>
          <span className="min-w-0 flex-1 truncate text-left text-foreground">{INSTALL}</span>
          <CopyButton text={INSTALL} className="rounded-xl border border-white/12 px-4 py-2 text-[13px] text-fg-2 transition-colors hover:border-accent hover:text-foreground" />
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <a
            href="https://github.com/dev-aly3n/aipager"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-medium text-[#0a0c0f] transition-opacity hover:opacity-90"
          >
            <GitHubIcon size={15} /> Star on GitHub
          </a>
          <a href="/docs" className="rounded-full border border-white/12 px-5 py-2.5 text-[14px] text-fg-2 transition-colors hover:border-white/30 hover:text-foreground">
            Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}
