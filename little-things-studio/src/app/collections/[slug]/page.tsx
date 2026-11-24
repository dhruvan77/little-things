import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CATEGORIES, CATEGORY_NAMES } from "@/data/products";
import type { CategorySlug } from "@/data/types";
import { ShopClient } from "@/components/ShopClient";
import { Breadcrumb, Skeleton } from "@/components/ui";

export function generateStaticParams() { return [...Object.keys(CATEGORY_NAMES)].map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = CATEGORY_NAMES[slug as CategorySlug];
  return n ? { title: n, description: `Shop personalised ${n.toLowerCase()} handcrafted by Little Things Studio.` } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = CATEGORY_NAMES[slug as CategorySlug];
  if (!name) notFound();
  const meta = CATEGORIES.find((c) => c.slug === slug);
  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: name }]} />
      <header className="mt-6 mb-10 max-w-2xl" data-anim="up"><h1 className="t-display-lg text-primary">{meta?.name ?? name}</h1>{meta && <p className="t-body-md mt-3 text-on-surface-variant">{meta.blurb}. Every piece can be made personal.</p>}</header>
      <Suspense fallback={<Skeleton className="h-96" />}><ShopClient fixedCategory={slug as CategorySlug} /></Suspense>
    </div>
  );
}
