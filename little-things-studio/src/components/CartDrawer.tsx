"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Gift, ShoppingBag, X } from "lucide-react";
import { useCart, cartCount, cartSubtotal } from "@/store/cart";
import { useUI } from "@/store/ui";
import { FREE_SHIP_AT } from "@/lib/pricing";
import { inr } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { SafeImg } from "./SafeImg";
import { EmptyState, QtyStepper } from "./ui";

export function CartLine({ item }: { item: ReturnType<typeof useCart.getState>["items"][number] }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  return (
    <motion.li layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }} transition={{ duration: 0.3 }} className="flex gap-3 rounded-lg bg-surface-container-low p-3">
      <Link href={`/product/${item.slug}`} className="h-24 w-20 shrink-0 overflow-hidden rounded bg-surface-container-highest"><SafeImg src={item.image} alt={item.name} className="h-full w-full object-cover" /></Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-base font-semibold leading-tight text-primary">{item.name}</h3>
          <span className="t-label-md tracking-normal text-primary">{inr(item.unitPrice * item.qty)}</span>
        </div>
        <p className="t-label-sm mt-1 normal-case tracking-normal text-on-tertiary-container">{item.summary || [item.colour, ...Object.values(item.variants ?? {})].filter(Boolean).join(" • ")}</p>
        <div className="mt-2 flex items-center justify-between">
          <QtyStepper small qty={item.qty} onChange={(n) => setQty(item.key, n)} />
          <button type="button" className="t-label-sm text-outline transition-colors hover:text-error" onClick={() => remove(item.key)}>Remove</button>
        </div>
      </div>
    </motion.li>
  );
}

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCart);
  const ready = useHydrated();
  const items = useCart((s) => s.items);
  const sub = cartSubtotal(items);
  const left = Math.max(0, FREE_SHIP_AT - sub);
  const pct = Math.min(100, Math.round((sub / FREE_SHIP_AT) * 100));
  useEffect(() => {
    if (!open) return;
    const f = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [open, setOpen]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[88]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <motion.aside role="dialog" aria-modal="true" aria-label="Your bespoke bag" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} className="absolute inset-y-0 right-0 flex w-full flex-col bg-surface-container-lowest shadow-l2 sm:w-[440px]">
            <div className="flex items-center justify-between border-b border-surface-container bg-surface-container-low p-5">
              <div className="flex items-center gap-2"><ShoppingBag size={18} /><span className="t-headline-sm text-primary">Bespoke Bag</span><span className="t-label-sm text-on-surface-variant">({ready ? cartCount(items) : 0} {cartCount(items) === 1 ? "item" : "items"})</span></div>
              <button type="button" aria-label="Close bag" onClick={() => setOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"><X size={20} /></button>
            </div>
            {ready && items.length > 0 && (
              <div className="bg-surface-container-high px-5 py-3">
                <div className="t-label-sm mb-1.5 flex items-center justify-between text-primary">
                  <span className="flex items-center gap-1.5"><Gift size={13} />{left === 0 ? "Unlocked: Complimentary Studio Courier" : `Add ${inr(left)} for free delivery`}</span>
                  <span className="font-bold text-on-secondary-container">{pct}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest"><motion.div className="h-full bg-secondary" initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} /></div>
              </div>
            )}
            <div className="flex-1 overflow-y-auto p-5" data-lenis-prevent>
              {!ready ? null : items.length === 0 ? (
                <div className="flex h-full items-center"><EmptyState icon={<ShoppingBag size={24} />} title="Your bag is empty" body="Little things are waiting. Start with a personalised tumbler or a leather journal." cta="Explore the collection" href="/shop" /></div>
              ) : (
                <ul className="space-y-3"><AnimatePresence initial={false}>{items.map((i) => <CartLine key={i.key} item={i} />)}</AnimatePresence></ul>
              )}
            </div>
            <div className="space-y-3 bg-surface-container-low p-5">
              <div className="flex items-center justify-between"><span className="t-label-md text-on-surface-variant">Subtotal</span><span className="t-headline-sm text-primary">{inr(ready ? sub : 0)}</span></div>
              <p className="t-label-sm normal-case tracking-normal text-on-surface-variant">Taxes included. Gift packaging and note included. Demo store.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/cart" onClick={() => setOpen(false)} className="btn btn-secondary !px-4">View bag</Link>
                {items.length ? <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary !px-4">Checkout</Link> : <button type="button" className="btn btn-primary !px-4" disabled>Checkout</button>}
              </div>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
