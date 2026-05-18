import { notFound } from "next/navigation";
import { DocsContent } from "@/components/docs-content";
import { getDoc, listSlugs } from "@/lib/docs";

export function generateStaticParams() {
  return listSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const doc = getDoc(slug);
    return {
      title: `${doc.title} — aipager docs`,
      description: doc.description,
    };
  } catch {
    return { title: "Doc not found" };
  }
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let doc;
  try {
    doc = getDoc(slug);
  } catch {
    notFound();
  }
  return <DocsContent source={doc.source} />;
}
