import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INFO_PAGES } from "@/data/site";
import { Breadcrumb } from "@/components/ui";
export function generateStaticParams() { return Object.keys(INFO_PAGES).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; return { title: INFO_PAGES[slug]?.title ?? "Not found" }; }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const pg = INFO_PAGES[slug]; if (!pg) notFound();
  return (
    <div className="px-page mx-auto max-w-3xl py-8 lg:py-12"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: pg.title }]} /><h1 className="t-display-lg mt-6 mb-6 text-primary">{pg.title}</h1><div className="space-y-4">{pg.body.map((b, i) => <p key={i} className="t-body-md text-on-surface-variant">{b}</p>)}</div></div>
  );
}
