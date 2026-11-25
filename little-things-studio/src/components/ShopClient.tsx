"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { PackageSearch, SlidersHorizontal, X } from "lucide-react";
import { CATEGORY_NAMES, PRODUCTS, searchProducts } from "@/data/products";
import type { CategorySlug, Product } from "@/data/types";
import { cn, inr } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { EmptyState, Skeleton } from "./ui";

const SORTS = [["featured", "Curated & Featured"], ["best", "Bestselling Creations"], ["low", "Price: Low to High"], ["high", "Price: High to Low"], ["new", "New Studio Arrivals"], ["rating", "Top Rated"]] as const;
const OCCASIONS = ["Birthday", "Wedding & Anniv", "Housewarming", "Bridesmaid", "Corporate", "Anniversary"];
const MAX = 6000;

export function ShopClient({ fixedCategory }: { fixedCategory?: CategorySlug }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const cat = (fixedCategory ?? sp.get("category") ?? "") as CategorySlug | "";
  const occasion = sp.get("occasion") ?? "";
  const sort = sp.get("sort") ?? "featured";
  const [maxPrice, setMaxPrice] = useState(MAX);
  const [personalOnly, setPersonalOnly] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const setParam = (k: string, v: string) => { const p = new URLSearchParams(sp.toString()); if (v) p.set(k, v); else p.delete(k); router.replace(`${pathname}?${p.toString()}`, { scroll: false }); };
  const reset = () => { setMaxPrice(MAX); setPersonalOnly(false); setInStock(false); const p = new URLSearchParams(); if (q) p.set("q", q); router.replace(`${pathname}${p.toString() ? `?${p}` : ""}`, { scroll: false }); };

  const list = useMemo(() => {
    let r: Product[] = q ? searchProducts(q) : PRODUCTS.slice();
    if (cat) r = r.filter((p) => p.category === cat);
    if (occasion) r = r.filter((p) => p.occasions.some((o) => o.toLowerCase().includes(occasion.toLowerCase())));
    r = r.filter((p) => p.price <= maxPrice);
    if (personalOnly) r = r.filter((p) => p.personalisation.type !== "none");
    if (inStock) r = r.filter((p) => p.stock !== "out");
    const by: Record<string, (a: Product, b: Product) => number> = {
      low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price,
      new: (a, b) => Number(b.isNew) - Number(a.isNew) || b.rating - a.rating,
      best: (a, b) => Number(b.bestseller) - Number(a.bestseller) || b.reviewCount - a.reviewCount,
      rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
      featured: (a, b) => Number(b.bestseller) - Number(a.bestseller) || Number(!!b.badge) - Number(!!a.badge),
    };
    return r.sort(by[sort] ?? by.featured);
  }, [q, cat, occasion, maxPrice, personalOnly, inStock, sort]);

  // brief skeleton on any filter change so results feel responsive and intentional
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync state on prop/external change
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 320); return () => clearTimeout(t); }, [q, cat, occasion, maxPrice, personalOnly, inStock, sort]);

  const active = [cat && { k: "category", l: CATEGORY_NAMES[cat] }, occasion && { k: "occasion", l: occasion }, maxPrice < MAX && { k: "price", l: `Under ${inr(maxPrice)}` }, personalOnly && { k: "personal", l: "Personalisation available" }, inStock && { k: "stock", l: "In stock" }].filter(Boolean) as { k: string; l: string }[];
  const clear = (k: string) => { if (k === "price") setMaxPrice(MAX); else if (k === "personal") setPersonalOnly(false); else if (k === "stock") setInStock(false); else setParam(k, ""); };

  const filters = (
    <div className="space-y-7">
      {!fixedCategory && (
        <fieldset><legend className="t-label-md mb-3 text-primary">Categories</legend>
          <ul className="space-y-1.5">
            <li><button type="button" onClick={() => setParam("category", "")} className={cn("t-body-sm flex w-full justify-between py-1 hover:text-primary", !cat ? "font-bold text-primary" : "text-on-surface-variant")}>All gifts<span className="opacity-60">({PRODUCTS.length})</span></button></li>
            {(Object.keys(CATEGORY_NAMES) as CategorySlug[]).map((s) => (
              <li key={s}><button type="button" aria-pressed={cat === s} onClick={() => setParam("category", cat === s ? "" : s)} className={cn("t-body-sm flex w-full justify-between py-1 transition-colors hover:text-primary", cat === s ? "font-bold text-primary" : "text-on-surface-variant")}>{CATEGORY_NAMES[s]}<span className="opacity-60">({PRODUCTS.filter((p) => p.category === s).length})</span></button></li>
            ))}
          </ul>
        </fieldset>
      )}
      <fieldset><legend className="t-label-md mb-3 text-primary">Price (INR)</legend>
        <input type="range" min={500} max={MAX} step={250} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} aria-label="Maximum price" className="w-full accent-primary" />
        <div className="t-label-sm mt-1 flex justify-between text-on-surface-variant"><span>{inr(500)}</span><span className="text-primary">{maxPrice >= MAX ? "Any price" : `Up to ${inr(maxPrice)}`}</span></div>
      </fieldset>
      <fieldset><legend className="t-label-md mb-3 text-primary">Gifting Occasion</legend>
        <div className="flex flex-wrap gap-2">{OCCASIONS.map((o) => <button key={o} type="button" className="chip" aria-pressed={occasion === o} onClick={() => setParam("occasion", occasion === o ? "" : o)}>{o}</button>)}</div>
      </fieldset>
      <fieldset><legend className="t-label-md mb-3 text-primary">Availability</legend>
        <label className="t-body-sm flex items-center gap-2 py-1"><input type="checkbox" checked={personalOnly} onChange={(e) => setPersonalOnly(e.target.checked)} className="h-4 w-4 accent-primary" />Personalisation available</label>
        <label className="t-body-sm flex items-center gap-2 py-1"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="h-4 w-4 accent-primary" />Hide sold-out pieces</label>
      </fieldset>
      <button type="button" onClick={reset} className="t-label-sm link-u text-primary">Reset all filters</button>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block"><div className="sticky top-32 card p-6" data-lenis-prevent>{filters}</div></aside>
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button type="button" className="btn btn-secondary !px-4 !py-2.5 lg:hidden" onClick={() => setOpen(true)}><SlidersHorizontal size={14} />Filters{active.length ? ` (${active.length})` : ""}</button>
            <p className="t-label-md text-on-surface-variant" aria-live="polite">{loading ? "Updating..." : `Showing ${list.length} handcrafted ${list.length === 1 ? "piece" : "pieces"}`}</p>
          </div>
          <div className="flex items-center gap-2"><label htmlFor="sort" className="t-label-sm text-on-surface-variant">Sort</label>
            <select id="sort" className="field !w-auto !py-2 text-sm" value={sort} onChange={(e) => setParam("sort", e.target.value === "featured" ? "" : e.target.value)}>{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </div>
        </div>
        {active.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2"><span className="t-label-sm text-on-surface-variant">Active:</span>
            {active.map((a) => <button key={a.k} type="button" onClick={() => clear(a.k)} className="chip flex items-center gap-1.5" aria-label={`Remove filter ${a.l}`}>{a.l}<X size={12} /></button>)}
            <button type="button" onClick={reset} className="t-label-sm link-u ml-1 text-primary">Clear all</button>
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-3" aria-busy="true">{Array.from({ length: 6 }).map((_, i) => <div key={i}><Skeleton className="aspect-[4/5]" /><Skeleton className="mt-3 h-4 w-2/3" /><Skeleton className="mt-2 h-4 w-1/3" /></div>)}</div>
        ) : list.length === 0 ? (
          <div className="py-10"><EmptyState icon={<PackageSearch size={26} />} title={q ? `Nothing matches "${q}"` : "No pieces match these filters"} body="Try widening the price range, removing a filter, or exploring a different category." cta="Browse everything" href="/shop" /></div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:gap-6 xl:grid-cols-3">{list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
        )}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[88] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
            <motion.div role="dialog" aria-modal="true" aria-label="Filters" data-lenis-prevent initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }} className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-xl bg-surface p-6 shadow-l2">
              <div className="mb-5 flex items-center justify-between"><h2 className="t-headline-sm text-primary">Filter Studio</h2><button type="button" aria-label="Close filters" onClick={() => setOpen(false)}><X size={20} /></button></div>
              {filters}
              <button type="button" className="btn btn-primary mt-6 w-full" onClick={() => setOpen(false)}>Show {list.length} pieces</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
