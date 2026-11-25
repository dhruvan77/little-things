"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, PenLine, ShoppingBag, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { useCart, cartSubtotal } from "@/store/cart";
import { COUPONS } from "@/data/site";
import { totals } from "@/lib/pricing";
import { inr } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { SafeImg } from "./SafeImg";
import { Breadcrumb, EmptyState, QtyStepper, Skeleton } from "./ui";

export function CouponBox() {
  const coupon = useCart((s) => s.coupon);
  const apply = useCart((s) => s.applyCoupon);
  const removeC = useCart((s) => s.removeCoupon);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  if (coupon) return <div className="flex items-center justify-between rounded-lg bg-secondary-container px-3 py-2.5"><span className="t-label-sm flex items-center gap-2 text-on-secondary-container"><Tag size={14} />{coupon}: {COUPONS[coupon]?.label}</span><button type="button" aria-label="Remove coupon" onClick={removeC}><X size={16} /></button></div>;
  return (
    <form onSubmit={(e) => { e.preventDefault(); const r = apply(code); setErr(r.ok ? "" : r.message); if (r.ok) { toast.success(r.message); setCode(""); } }} noValidate>
      <label htmlFor="coupon" className="t-label-sm mb-1.5 block text-on-surface-variant">Coupon code</label>
      <div className="flex gap-2"><input id="coupon" className="field uppercase" placeholder="Try LITTLE10" value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }} aria-invalid={!!err} aria-describedby="coupon-err" /><button className="btn btn-secondary !px-5">Apply</button></div>
      <p id="coupon-err" role="alert" className="t-label-sm mt-1.5 min-h-4 normal-case tracking-normal text-error">{err}</p>
    </form>
  );
}

export function Summary({ express = false, cta }: { express?: boolean; cta?: React.ReactNode }) {
  const items = useCart((s) => s.items);
  const coupon = useCart((s) => s.coupon);
  const t = totals(cartSubtotal(items), coupon, express);
  return (
    <div className="card space-y-4 p-6">
      <h2 className="t-headline-sm text-primary">Order Summary</h2>
      <CouponBox />
      <dl className="t-body-sm space-y-2 text-on-surface-variant">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
        {t.discount > 0 && <div className="flex justify-between text-on-secondary-container"><dt>Discount ({coupon})</dt><dd>- {inr(t.discount)}</dd></div>}
        <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping === 0 ? "Free" : inr(t.shipping)}</dd></div>
      </dl>
      <div className="flex items-end justify-between border-t border-primary/10 pt-4"><span className="t-label-md text-on-surface-variant">Total</span><span className="t-headline-md text-primary">{inr(t.total)}</span></div>
      <p className="t-label-sm normal-case tracking-normal text-outline">Taxes included. Demo store, no real payment.</p>
      {cta}
    </div>
  );
}

export function CartPage() {
  const ready = useHydrated();
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Your Bag" }]} />
      <h1 className="t-display-lg mt-6 mb-10 text-primary">Your Bespoke Bag</h1>
      {!ready ? <Skeleton className="h-64" /> : items.length === 0 ? (
        <EmptyState icon={<ShoppingBag size={26} />} title="Your bag is empty" body="Little things are waiting. Start with a personalised tumbler or build a hamper." cta="Shop all gifts" href="/shop" />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {items.map((i) => (
                <motion.li key={i.key} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }} className="card flex gap-4 p-4">
                  <Link href={i.hamper ? "/hamper" : `/product/${i.slug}`} className="h-32 w-28 shrink-0 overflow-hidden rounded bg-surface-container-low"><SafeImg src={i.image} alt={i.name} className="h-full w-full object-cover" /></Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="flex justify-between gap-3"><div className="min-w-0"><h2 className="font-serif text-lg font-semibold leading-tight text-primary">{i.name}</h2><p className="t-body-sm mt-1 text-on-surface-variant">{i.summary || [i.colour, ...Object.values(i.variants ?? {})].filter(Boolean).join(" • ")}</p>{i.customisation?.message && <p className="mt-1 truncate font-serif text-sm italic text-on-surface-variant">&ldquo;{i.customisation.message}&rdquo;</p>}{i.hamper?.message && <p className="mt-1 truncate font-serif text-sm italic text-on-surface-variant">&ldquo;{i.hamper.message}&rdquo;</p>}</div><span className="t-label-lg tracking-normal text-primary">{inr(i.unitPrice * i.qty)}</span></div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <QtyStepper qty={i.qty} onChange={(n) => setQty(i.key, n)} />
                      <div className="flex gap-4">{i.customisation && <Link href={`/customise?product=${i.slug}&edit=${encodeURIComponent(i.key)}`} className="t-label-sm link-u flex items-center gap-1 text-primary"><PenLine size={12} />Edit personalisation</Link>}<button type="button" className="t-label-sm link-u text-outline hover:text-error" onClick={() => { remove(i.key); toast("Removed from your bag", { description: i.name }); }}>Remove</button></div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <Summary cta={<Link href="/checkout" className="btn btn-primary w-full">Proceed to checkout<ArrowRight size={16} /></Link>} />
        </div>
      )}
    </div>
  );
}
