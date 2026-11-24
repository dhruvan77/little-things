"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Check, Gift, MapPin, PenLine, Truck } from "lucide-react";
import type { Product } from "@/data/types";
import { CATEGORY_NAMES, relatedProducts } from "@/data/products";
import { addProduct } from "@/lib/cart-actions";
import { defaultVariants, unitPriceFor } from "@/lib/pricing";
import { cn, discountPct, inr } from "@/lib/utils";
import { SafeImg } from "./SafeImg";
import { Accordion, Breadcrumb, QtyStepper, StarRating, WishlistButton } from "./ui";
import { ProductCard } from "./ProductCard";
import { Magnetic } from "./Magnetic";

function Gallery({ p }: { p: Product }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState(0);
  return (
    <div className="grid gap-3 md:grid-cols-[84px_1fr]">
      <div className="order-2 hidden gap-3 md:order-1 md:flex md:flex-col" role="tablist" aria-label="Product images">
        {p.images.map((s, k) => (
          <button key={k} role="tab" aria-selected={k === i} aria-label={`Image ${k + 1}`} onClick={() => setI(k)} className={cn("aspect-[4/5] overflow-hidden rounded border-2 transition-all", k === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}><SafeImg src={s} alt="" className="h-full w-full object-cover" /></button>
        ))}
      </div>
      <div className="order-1 md:order-2">
        <div className="relative hidden aspect-[4/5] cursor-zoom-in overflow-hidden rounded-xl bg-surface-container-low shadow-l1 md:block" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }} onPointerLeave={() => setZoom(null)} data-cursor="Zoom">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <SafeImg eager src={p.images[i]} alt={`${p.name}, image ${i + 1}`} className="h-full w-full object-cover transition-transform duration-200 ease-out" style={{ transform: zoom ? "scale(2)" : "scale(1)", transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center" }} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div ref={strip} onScroll={(e) => { const el = e.currentTarget; setDot(Math.round(el.scrollLeft / el.clientWidth)); }} className="flex snap-x snap-mandatory overflow-x-auto rounded-xl md:hidden" data-lenis-prevent>
          {p.images.map((s, k) => <div key={k} className="aspect-[4/5] w-full shrink-0 snap-center bg-surface-container-low"><SafeImg eager={k === 0} src={s} alt={`${p.name}, image ${k + 1}`} className="h-full w-full object-cover" /></div>)}
        </div>
        {p.images.length > 1 && <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>{p.images.map((_, k) => <span key={k} className={cn("h-1.5 rounded-full transition-all", k === dot ? "w-5 bg-primary" : "w-1.5 bg-outline-variant")} />)}</div>}
      </div>
    </div>
  );
}

function PinCheck() {
  const [pin, setPin] = useState("");
  const [res, setRes] = useState<{ ok: boolean; msg: string } | null>(null);
  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pin)) return setRes({ ok: false, msg: "Enter a valid 6-digit PIN code." });
    if (!/^[1-8]/.test(pin)) return setRes({ ok: false, msg: "Sorry, we can't deliver to this PIN code yet." });
    const d = new Date(); d.setDate(d.getDate() + 3 + (Number(pin[0]) % 3));
    setRes({ ok: true, msg: `Delivered by ${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}. Express available at checkout.` });
  };
  return (
    <form onSubmit={check} className="mt-4" noValidate>
      <label htmlFor="pin" className="t-label-sm mb-1.5 flex items-center gap-1.5 text-on-surface-variant"><MapPin size={13} />Check delivery</label>
      <div className="flex gap-2"><input id="pin" inputMode="numeric" maxLength={6} placeholder="Enter PIN code" className="field" value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setRes(null); }} aria-describedby="pin-res" /><button className="btn btn-secondary !px-5">Check</button></div>
      <p id="pin-res" role="status" className={cn("t-body-sm mt-2 min-h-5", res?.ok ? "text-on-secondary-container" : "text-error")}>{res?.msg}</p>
    </form>
  );
}

export function ProductDetail({ p }: { p: Product }) {
  const [colour, setColour] = useState(p.colours[0]?.name ?? "");
  const [vars, setVars] = useState(defaultVariants(p));
  const [qty, setQty] = useState(1);
  const [sticky, setSticky] = useState(false);
  const cta = useRef<HTMLDivElement>(null);
  const unit = unitPriceFor(p, vars);
  const save = discountPct(p.price, p.originalPrice);
  const personal = p.personalisation.type !== "none";
  const out = p.stock === "out";
  const related = relatedProducts(p);

  useEffect(() => {
    const el = cta.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el); return () => io.disconnect();
  }, []);

  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: CATEGORY_NAMES[p.category], href: `/collections/${p.category}` }, { label: p.name }]} />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Gallery p={p} />
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            {p.badge && <span className="t-label-sm rounded bg-blush/50 px-2 py-1 text-primary">{p.badge}</span>}
            {p.isNew && <span className="t-label-sm rounded bg-sage/50 px-2 py-1 text-primary">New</span>}
            <StarRating value={p.rating} count={p.reviewCount} />
          </div>
          <h1 className="t-headline-lg text-primary">{p.name}</h1>
          <div className="flex items-baseline gap-3"><span className="t-headline-md text-primary">{inr(unit)}</span>{p.originalPrice && <span className="t-body-md text-outline line-through">{inr(p.originalPrice)}</span>}{save > 0 && <span className="t-label-sm text-on-secondary-container">Save {save}%</span>}</div>
          <p className="t-body-md text-on-surface-variant">{p.description}</p>
          <p className="t-label-sm flex items-center gap-2 normal-case tracking-normal" role="status">
            <span className={cn("h-2 w-2 rounded-full", p.stock === "in" ? "bg-secondary" : p.stock === "low" ? "bg-terracotta" : "bg-error")} />
            {p.stock === "in" ? "In stock, dispatches in 48 hours" : p.stock === "low" ? `Only ${p.stockCount} left, order soon` : "Currently sold out. Add it to your wishlist for restock."}
          </p>

          {p.colours.length > 1 && (
            <div><p className="t-label-sm mb-2 text-on-surface-variant">Colour: <span className="text-primary">{colour}</span></p>
              <div className="flex gap-3">{p.colours.map((c) => <button key={c.name} type="button" aria-label={c.name} aria-pressed={colour === c.name} onClick={() => setColour(c.name)} className={cn("h-9 w-9 rounded-full border border-primary/15 ring-offset-2 transition-all hover:scale-110", colour === c.name && "ring-1 ring-terracotta")} style={{ background: c.hex }} />)}</div></div>
          )}
          {p.variations.map((v) => (
            <div key={v.id}><p className="t-label-sm mb-2 text-on-surface-variant">{v.label}: <span className="text-primary">{vars[v.id]}</span></p>
              <div className="flex flex-wrap gap-2">{v.options.map((o) => <button key={o.label} type="button" className="chip" aria-pressed={vars[v.id] === o.label} onClick={() => setVars({ ...vars, [v.id]: o.label })}>{o.label}{o.priceDelta ? ` (${o.priceDelta > 0 ? "+" : ""}${inr(o.priceDelta)})` : ""}</button>)}</div></div>
          ))}

          <div ref={cta} className="flex flex-col gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <QtyStepper qty={qty} onChange={setQty} />
              <Magnetic className="flex-1"><button type="button" disabled={out} className={cn("btn w-full", personal ? "btn-secondary" : "btn-primary")} onClick={() => addProduct(p, { colour, variants: vars, qty })}>{out ? "Sold out" : "Add to bag"}</button></Magnetic>
              <WishlistButton id={p.id} name={p.name} className="border border-primary/10" size={20} />
            </div>
            {personal && !out && <Magnetic><Link href={`/customise?product=${p.slug}`} className="btn btn-primary w-full"><PenLine size={16} />Personalise this piece</Link></Magnetic>}
          </div>
          <PinCheck />
          <ul className="t-body-sm grid gap-2 text-on-surface-variant sm:grid-cols-3">
            <li className="flex items-center gap-2"><Truck size={16} className="text-on-tertiary-container" />Free shipping above ₹999</li>
            <li className="flex items-center gap-2"><Gift size={16} className="text-on-tertiary-container" />Gift-ready packaging</li>
            <li className="flex items-center gap-2"><Check size={16} className="text-on-tertiary-container" />Craft guarantee</li>
          </ul>
          <Accordion items={[
            { id: "desc", title: "Description", content: <p>{p.description} {p.personalisation.craft && `Personalised with ${p.personalisation.craft.toLowerCase()}, complimentary with every order.`}</p> },
            { id: "spec", title: "Specifications", content: <dl className="grid grid-cols-[120px_1fr] gap-y-2">{p.specs.map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold text-primary">{k}</dt><dd>{v}</dd></div>)}</dl> },
            { id: "ship", title: "Delivery & Returns", content: <p>Dispatched within 48 hours, delivered in 3 to 6 days. Personalised pieces are made to order and cannot be returned, but we will remake any piece with a craft defect. Ready-to-ship items may be returned within 7 days.</p> },
          ]} />
        </div>
      </div>

      <section className="mt-20 grid gap-10 lg:grid-cols-[320px_1fr]" aria-labelledby="rev-h" data-anim="up">
        <div><h2 id="rev-h" className="t-headline-md text-primary">Loved by gift givers</h2><p className="mt-3 font-serif text-6xl text-primary">{p.rating.toFixed(1)}</p><StarRating value={p.rating} size={18} /><p className="t-body-sm mt-2 text-on-surface-variant">Based on {p.reviewCount} demo reviews</p></div>
        <ul className="grid gap-4 md:grid-cols-2">
          {p.reviews.map((r, i) => (
            <li key={i} className="card p-5"><div className="flex items-center justify-between"><StarRating value={r.rating} /><time className="t-label-sm text-outline" dateTime={r.date}>{new Date(r.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</time></div><h3 className="t-headline-sm !text-lg mt-2 text-primary">{r.title}</h3><p className="t-body-sm mt-1 text-on-surface-variant">{r.body}</p><p className="t-label-sm mt-3 text-on-surface-variant">{r.author} • {r.city}</p></li>
          ))}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="mt-20" aria-labelledby="rel-h"><h2 id="rel-h" className="t-headline-md mb-8 text-primary" data-anim="up">You may also love</h2>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">{related.map((r, i) => <ProductCard key={r.id} product={r} index={i} />)}</div></section>
      )}

      <AnimatePresence>
        {sticky && (
          <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={{ duration: 0.35 }} className="fixed inset-x-0 bottom-0 z-[55] border-t border-primary/10 bg-surface/95 backdrop-blur-xl">
            <div className="px-page flex items-center justify-between gap-3 py-3">
              <div className="min-w-0"><p className="truncate font-serif text-base text-primary">{p.name}</p><p className="t-label-sm normal-case tracking-normal text-on-surface-variant">{inr(unit * qty)}</p></div>
              {personal && !out ? <Link href={`/customise?product=${p.slug}`} className="btn btn-primary !py-3">Personalise</Link> : null}
              <button type="button" disabled={out} className={cn("btn !py-3", personal ? "btn-secondary" : "btn-primary")} onClick={() => addProduct(p, { colour, variants: vars, qty })}>{out ? "Sold out" : "Add to bag"}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
