import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/ShopClient";
import { Breadcrumb, Skeleton } from "@/components/ui";

export const metadata: Metadata = { title: "Search", robots: { index: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <h1 className="t-display-lg mt-6 mb-10 text-primary">{q ? <>Results for <span className="italic text-on-tertiary-container">&ldquo;{q}&rdquo;</span></> : "Search the studio"}</h1>
      <Suspense fallback={<Skeleton className="h-96" />}><ShopClient /></Suspense>
    </div>
  );
}
