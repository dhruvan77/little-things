import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, PRODUCTS, IMG_ALT } from "@/data/products";
import { SafeImg } from "@/components/SafeImg";
import { Breadcrumb } from "@/components/ui";
import { inr } from "@/lib/utils";
import { IMG } from "@/data/products";

export const metadata: Metadata = { title: "Bespoke Collections", description: "Browse every Little Things Studio collection: drinkware, journals, hampers, weddings, corporate gifting and more." };
export default function Page() {
  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Bespoke Collections" }]} />
      <h1 className="t-display-lg mt-6 text-primary" data-anim="up">Bespoke Collections</h1>
      <p className="t-body-md mt-3 max-w-xl text-on-surface-variant">Eight collections, each handcrafted in small batches and made personal.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
        {CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} data-stagger-item data-cursor="Explore" className="group card overflow-hidden">
            <div className="aspect-[4/5] overflow-hidden bg-surface-container-low"><SafeImg src={IMG(c.image)} alt={IMG_ALT(c.image)} className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.05]" /></div>
            <div className="flex items-start justify-between gap-2 p-4"><div><h2 className="t-headline-sm !text-lg text-primary">{c.name}</h2><p className="t-body-sm text-on-surface-variant">{PRODUCTS.filter((p) => p.category === c.slug).length} pieces • From {inr(c.from)}</p></div><ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
