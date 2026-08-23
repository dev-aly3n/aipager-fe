import { Logo } from "@/components/landing/icons";
import { getAipagerVersion } from "@/lib/version";

export async function Footer() {
  const version = await getAipagerVersion();

  return (
    <footer className="border-t border-border py-8">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 text-sm text-dim">
        <div className="flex items-center gap-2.5">
          <Logo size={18} />
          <span>aipager · v{version}</span>
          <span aria-hidden>·</span>
          <a
            href="https://github.com/dev-aly3n/aipager/blob/main/LICENSE"
            className="hover:text-foreground"
          >
            MIT
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href="https://github.com/dev-aly3n/aipager" className="hover:text-foreground">
            GitHub
          </a>
          <a href="/docs" className="hover:text-foreground">
            Docs
          </a>
          <a href="https://pypi.org/project/aipager/" className="hover:text-foreground">
            PyPI
          </a>
          <a
            href="https://github.com/dev-aly3n/aipager/issues"
            className="hover:text-foreground"
          >
            Issues
          </a>
        </div>
      </div>
    </footer>
  );
}
