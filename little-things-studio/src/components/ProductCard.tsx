"use client";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ArrowRight, Eye, PenLine } from "lucide-react";
import type { Product } from "@/data/types";
import { CATEGORY_NAMES } from "@/data/products";
import { discountPct, inr } from "@/lib/utils";
import { addProduct } from "@/lib/cart-actions";
import { useUI } from "@/store/ui";
import { SafeImg } from "./SafeImg";
import { StarRating, WishlistButton } from "./ui";
import { useReducedMotion } from "@/hooks/useHydrated";

export function ProductCard({ product: p, index = 0 }: { product: Product; index?: number }) {
  const setQuickView = useUI((s) => s.setQuickView);
  const reduced = useReducedMotion();
  // 3D tilt: pointer position -> spring-smoothed rotation (mouse only)
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 12);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };
  const save = discountPct(p.price, p.originalPrice);
  const personal = p.personalisation.type !== "none";
  const out = p.stock === "out";
  return (
    <motion.article initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -8% 0px" }} transition={{ duration: 0.7, delay: (index % 4) * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={{ y: -4 }} onPointerMove={onMove} onPointerLeave={onLeave} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} className="group card relative flex flex-col overflow-hidden transition-shadow duration-500 hover:shadow-l2">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
        <Link href={`/product/${p.slug}`} aria-label={`View ${p.name}`} data-cursor="View" className="block h-full">
          <SafeImg src={p.images[0]} alt={p.name} className="absolute inset-0 h-full w-full object-cover transition-all duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.04] group-hover:opacity-0" />
          <SafeImg src={p.images[1] ?? p.images[0]} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-[1.04] object-cover opacity-0 transition-all duration-[600ms] group-hover:scale-100 group-hover:opacity-100" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {p.badge && <span className="t-label-sm rounded bg-white/90 px-2 py-1 text-primary backdrop-blur">{p.badge}</span>}
          {p.isNew && !p.badge && <span className="t-label-sm rounded bg-sage/60 px-2 py-1 text-primary">New</span>}
          {out && <span className="t-label-sm rounded bg-error-container px-2 py-1 text-error">Sold out</span>}
          {p.stock === "low" && <span className="t-label-sm rounded bg-blush/70 px-2 py-1 text-primary">Only a few left</span>}
        </div>
        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <WishlistButton id={p.id} name={p.name} />
          <button type="button" onClick={() => setQuickView(p.id)} aria-label={`Quick view ${p.name}`} className="flex h-9 w-9 translate-x-3 items-center justify-center rounded-full bg-white/90 opacity-0 shadow-sm backdrop-blur transition-all duration-300 hover:bg-white focus-visible:translate-x-0 focus-visible:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"><Eye size={16} /></button>
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 focus-within:translate-y-0 focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 max-lg:translate-y-0 max-lg:opacity-100">
          {personal ? (
            <Link href={`/customise?product=${p.slug}`} className="btn btn-primary group/b w-full !py-3"><PenLine size={14} />Personalise<ArrowRight size={14} className="transition-transform group-hover/b:translate-x-1" /></Link>
          ) : (
            <button type="button" disabled={out} onClick={() => addProduct(p)} className="btn btn-primary group/b w-full !py-3">{out ? "Sold out" : "Quick add"}{!out && <ArrowRight size={14} className="transition-transform group-hover/b:translate-x-1" />}</button>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="t-label-sm text-on-surface-variant">{CATEGORY_NAMES[p.category]}</span>
          <StarRating value={p.rating} count={p.reviewCount} size={12} />
        </div>
        <h3 className="t-headline-sm !text-[1.15rem] !leading-snug text-primary"><Link href={`/product/${p.slug}`} className="link-u">{p.name}</Link></h3>
        {p.perk && <p className="t-label-sm normal-case tracking-normal text-on-tertiary-container">{p.perk}</p>}
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="t-label-lg tracking-normal text-primary">{inr(p.price)}</span>
            {p.originalPrice && <span className="t-body-sm text-outline line-through">{inr(p.originalPrice)}</span>}
            {save > 0 && <span className="t-label-sm text-on-secondary-container">Save {save}%</span>}
          </div>
          {p.colours.length > 1 && (
            <div className="flex gap-1" aria-label={`${p.colours.length} colours`}>
              {p.colours.slice(0, 4).map((c) => <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border border-primary/15" style={{ background: c.hex }} />)}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
