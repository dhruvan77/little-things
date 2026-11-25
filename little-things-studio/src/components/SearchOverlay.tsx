"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Search, SearchX, X } from "lucide-react";
import { searchProducts } from "@/data/products";
import { useUI } from "@/store/ui";
import { inr } from "@/lib/utils";
import { SafeImg } from "./SafeImg";

const POPULAR = ["Monogram Tumbler", "Leather Journal", "Bridesmaid", "Hamper", "Corporate", "Candle"];

export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearch);
  const router = useRouter();
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchProducts(q).slice(0, 5), [q]);
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync state on prop/external change
    setQ("");
    setTimeout(() => ref.current?.focus(), 80);
    const f = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [open, setOpen]);
  const go = (term: string) => { if (!term.trim()) return; setOpen(false); router.push(`/search?q=${encodeURIComponent(term.trim())}`); };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[95] flex flex-col items-center px-4 pt-20 sm:pt-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-md" onClick={() => setOpen(false)} aria-hidden />
          <motion.div role="dialog" aria-modal="true" aria-label="Search" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3 }} className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-surface-container-lowest shadow-l2">
            <form onSubmit={(e) => { e.preventDefault(); go(q); }} className="flex items-center gap-3 bg-surface p-4" role="search">
              <Search size={22} className="text-outline" aria-hidden />
              <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search gifts, products, bespoke materials..." aria-label="Search products" className="w-full bg-transparent font-serif text-lg text-primary outline-none placeholder:text-outline-variant" />
              <button type="button" aria-label="Close search" onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant hover:text-primary"><X size={20} /></button>
            </form>
            <div className="max-h-[60vh] overflow-y-auto border-t border-surface-container-high bg-surface-container-low p-4" data-lenis-prevent>
              {!q.trim() ? (
                <>
                  <span className="t-label-sm mb-3 block text-on-surface-variant">Popular Studio Searches</span>
                  <div className="flex flex-wrap gap-2">{POPULAR.map((t) => <button key={t} type="button" onClick={() => go(t)} className="chip normal-case tracking-normal">{t}</button>)}</div>
                </>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-8 text-center"><SearchX size={28} className="text-outline" /><p className="font-serif text-lg text-primary">No pieces match &ldquo;{q}&rdquo;</p><p className="t-body-sm text-on-surface-variant">Try &ldquo;tumbler&rdquo;, &ldquo;journal&rdquo; or &ldquo;wedding&rdquo;.</p></div>
              ) : (
                <>
                  <ul className="space-y-1" aria-label="Suggestions">
                    {results.map((p) => (
                      <li key={p.id}><Link href={`/product/${p.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white">
                        <SafeImg src={p.images[0]} alt="" className="h-14 w-12 rounded object-cover" />
                        <span className="min-w-0 flex-1"><span className="block truncate font-serif text-base text-primary">{p.name}</span><span className="t-label-sm normal-case tracking-normal text-on-surface-variant">{inr(p.price)}</span></span>
                        <ArrowRight size={16} className="text-outline" />
                      </Link></li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => go(q)} className="btn btn-secondary mt-3 w-full">See all results for &ldquo;{q}&rdquo;</button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
