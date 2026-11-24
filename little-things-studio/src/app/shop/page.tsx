import type { Metadata } from "next";
import { Suspense } from "react";
import { Award, Gift, PenLine, ShieldCheck } from "lucide-react";
import { ShopClient } from "@/components/ShopClient";
import { Breadcrumb, Skeleton } from "@/components/ui";
import { PRODUCTS } from "@/data/products";

export const metadata: Metadata = { title: "Shop All Bespoke Gifts", description: "Discover handcrafted, personalisable gifts: tumblers, leather journals, hampers, keychains and more." };

export default function Page() {
  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop All Collections" }]} />
      <header className="mt-6 mb-10 max-w-3xl" data-anim="up">
        <p className="t-label-md text-on-tertiary-container">Handcrafted in Jaipur • Made to Order</p>
        <h1 className="t-display-lg mt-1 text-primary">All Bespoke Gifts &amp; Personalised Treasures</h1>
        <p className="t-body-md mt-3 text-on-surface-variant">Discover {PRODUCTS.length} thoughtfully curated and custom-embossed gifts, handcrafted to celebrate life&rsquo;s everyday and milestone moments.</p>
      </header>
      <Suspense fallback={<Skeleton className="h-96" />}><ShopClient /></Suspense>
      <section className="mt-20 grid gap-6 border-t border-primary/10 pt-12 md:grid-cols-3" data-stagger aria-label="Studio promises">
        {[[Gift, "Complimentary Studio Box", "Every order over ₹1,999 is shipped in a hardbound keepsake linen box tied with silk ribbons."], [PenLine, "Handwritten Studio Note", "Include a custom gift message penned on botanical deckle-edge cardstock at checkout."], [ShieldCheck, "Artisanal Quality Guarantee", "Each monogram and deboss is meticulously inspected by our master craftsmen before sealing."]].map(([I, t, d]) => {
          const Icon = I as typeof Award;
          return <div key={t as string} data-stagger-item className="flex gap-4"><Icon size={24} className="mt-1 shrink-0 text-on-tertiary-container" /><div><h2 className="t-headline-sm text-primary">{t as string}</h2><p className="t-body-sm mt-1 text-on-surface-variant">{d as string}</p></div></div>;
        })}
      </section>
    </div>
  );
}
