"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Plus } from "lucide-react";
import { HAMPER_ITEMS, PRODUCTS, getProduct } from "@/data/products";
import { FONTS, INKS, NAME_MAX, defaultCustomisation } from "@/data/personalisation";
import type { Customisation } from "@/data/types";
import { addCustomised } from "@/lib/cart-actions";
import { cn, inr } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import { ProductPreview } from "@/components/ProductPreview";
import { SafeImg } from "@/components/SafeImg";
import { toast } from "sonner";

const TABS = [["all", "All Gifts"], ["her", "For Her"], ["him", "For Him"], ["wedding", "Wedding & Anniversaries"], ["work", "Work & Desk"]] as const;
export function Bestsellers() {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("all");
  const list = PRODUCTS.filter((p) => tab === "all" || p.audience.includes(tab)).sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || b.rating - a.rating).slice(0, 4);
  return (
    <section className="px-page py-16 lg:py-24" aria-labelledby="best-h">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div data-anim="up"><p className="t-label-md text-on-tertiary-container">Best Engraved Gifts</p><h2 id="best-h" className="t-headline-lg mt-1 text-primary">Gifts That Feel Personal</h2></div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter gifts">{TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="chip">{l}</button>)}</div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">{list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</motion.div>
      </AnimatePresence>
      <div className="mt-10 text-center"><Link href="/shop" className="btn btn-secondary">View all gifts<ArrowRight size={14} /></Link></div>
    </section>
  );
}

export function StudioTeaser() {
  const p = getProduct("the-sandstone-tumbler")!;
  const [c, setC] = useState<Customisation>({ ...defaultCustomisation("Sandstone"), name: "A.M" });
  const set = <K extends keyof Customisation>(k: K, v: Customisation[K]) => setC((o) => ({ ...o, [k]: v }));
  const colour = p.colours.find((x) => x.name === c.glaze) ?? p.colours[0];
  const add = () => { if (!c.name.trim()) return toast.error("Add your initials first"); addCustomised(p, c, { size: "380ml" }, colour.name); };
  return (
    <section className="px-page py-16 lg:py-24" data-bg="#f3ede5" aria-labelledby="studio-h">
      <div className="mx-auto mb-10 max-w-2xl text-center" data-anim="up"><p className="t-label-md text-on-tertiary-container">The Personalisation Studio</p><h2 id="studio-h" className="t-headline-lg mt-1 text-primary">Preview Your Gift, Perfectly.</h2><p className="t-body-md mt-3 text-on-surface-variant">Use our simulator to choose your initials, typography and finishing. Your chosen options are previewed instantly.</p></div>
      <div className="mx-auto grid max-w-6xl items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="card p-3"><ProductPreview type="tumbler" colourHex={colour.hex} c={c} label={p.name} /></div>
        <div className="card space-y-5 p-6">
          <div><div className="mb-1.5 flex justify-between"><label htmlFor="t-name" className="t-label-sm text-on-surface-variant">1. Recipient initials / name</label><span className="t-label-sm text-outline">{c.name.length} / {NAME_MAX}</span></div><input id="t-name" className="field" maxLength={NAME_MAX} value={c.name} onChange={(e) => set("name", e.target.value)} /></div>
          <div><span className="t-label-sm mb-1.5 block text-on-surface-variant">2. Typography style</span><div className="grid grid-cols-2 gap-2">{FONTS.map((f) => <button key={f.id} type="button" className="chip !py-2.5 normal-case tracking-normal" aria-pressed={c.fontId === f.id} onClick={() => set("fontId", f.id)}>{f.label}</button>)}</div></div>
          <div><span className="t-label-sm mb-1.5 block text-on-surface-variant">3. Stamping & finish</span><div className="grid grid-cols-2 gap-2">{INKS.map((f) => <button key={f.id} type="button" className="chip !py-2.5 normal-case tracking-normal" aria-pressed={c.inkId === f.id} onClick={() => set("inkId", f.id)}>{f.label}</button>)}</div></div>
          <div><span className="t-label-sm mb-1.5 block text-on-surface-variant">4. Ceramic body shade</span><div className="flex gap-3">{p.colours.map((x) => <button key={x.name} type="button" aria-label={x.name} aria-pressed={c.glaze === x.name} onClick={() => set("glaze", x.name)} className={cn("h-9 w-9 rounded-full border border-primary/15 ring-offset-2", c.glaze === x.name && "ring-1 ring-terracotta")} style={{ background: x.hex }} />)}</div></div>
          <div className="flex items-end justify-between border-t border-primary/10 pt-4"><span className="t-label-sm text-on-surface-variant">Total</span><span className="t-headline-sm text-primary">{inr(p.price)}</span></div>
          <button type="button" className="btn btn-primary w-full" onClick={add}>Add custom tumbler to bag</button>
          <Link href={`/customise?product=${p.slug}`} className="t-label-sm link-u block text-center text-primary">Open the full studio</Link>
        </div>
      </div>
    </section>
  );
}

export function HamperConcierge() {
  const router = useRouter();
  const pool = HAMPER_ITEMS.slice(0, 6);
  const [sel, setSel] = useState<string[]>([pool[0].id, pool[1].id, pool[2].id]);
  const chosen = pool.filter((p) => sel.includes(p.id));
  const total = chosen.reduce((a, p) => a + p.price, 0);
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <section id="hamper-builder" className="px-page py-16 lg:py-24" aria-labelledby="hc-h">
      <div className="mb-10" data-anim="up"><p className="t-label-md text-on-tertiary-container">Interactive Gifting Concierge</p><h2 id="hc-h" className="t-headline-lg mt-1 text-primary">Build a Hamper That Speaks Their Language</h2><p className="t-body-md mt-2 max-w-xl text-on-surface-variant">Tap to add pieces to your trunk and watch the total update. Then personalise it all.</p></div>
      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3" data-stagger>
          {pool.map((p) => { const on = sel.includes(p.id); return (
            <button key={p.id} data-stagger-item type="button" aria-pressed={on} onClick={() => toggle(p.id)} className={cn("card overflow-hidden text-left transition-all hover:-translate-y-1", on && "!border-primary ring-1 ring-primary")}>
              <div className="relative aspect-[4/5]"><SafeImg src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /><span className={cn("t-label-sm absolute left-2 top-2 flex items-center gap-1 rounded px-2 py-1", on ? "bg-primary-container text-white" : "bg-white/90")}>{on ? <><Check size={11} />Added</> : <><Plus size={11} />Add</>}</span></div>
              <div className="p-3"><p className="font-serif text-sm font-semibold text-primary">{p.name}</p><p className="t-label-sm mt-1 normal-case tracking-normal text-on-surface-variant">{inr(p.price)}</p></div>
            </button>); })}
        </div>
        <div className="card h-fit space-y-3 p-6">
          <h3 className="t-headline-sm text-primary">Your Curated Trunk</h3>
          <ul className="t-body-sm space-y-1.5 text-on-surface-variant">{chosen.map((p) => <li key={p.id} className="flex justify-between gap-3"><span className="truncate">{p.name}</span><span>{inr(p.price)}</span></li>)}{chosen.length === 0 && <li>No gifts selected yet.</li>}</ul>
          <div className="flex items-end justify-between border-t border-primary/10 pt-3"><span className="t-label-sm text-on-surface-variant">Gifts total</span><motion.span key={total} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="t-headline-md text-primary">{inr(total)}</motion.span></div>
          <button type="button" className="btn btn-primary w-full" onClick={() => router.push(`/hamper?items=${chosen.map((p) => p.slug).join(",")}`)}>Complete &amp; customise hamper</button>
        </div>
      </div>
    </section>
  );
}
