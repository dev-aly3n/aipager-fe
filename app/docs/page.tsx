import { DocsPage } from "@/components/docs-page";
import { getDoc } from "@/lib/docs";

export const metadata = {
  title: "Docs — aipager",
  description: "Reference documentation for aipager: architecture, hooks, commands, troubleshooting, security.",
};

export default function DocsIndex() {
  return <DocsPage doc={getDoc("")} />;
}
