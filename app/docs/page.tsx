import { DocsContent } from "@/components/docs-content";
import { getDoc } from "@/lib/docs";

export const metadata = {
  title: "Docs — aipager",
  description: "Reference documentation for aipager: architecture, hooks, commands, troubleshooting, security.",
};

export default function DocsIndex() {
  const doc = getDoc("");
  return <DocsContent source={doc.source} />;
}
