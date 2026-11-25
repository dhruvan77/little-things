"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductById } from "@/data/products";
import { useUI } from "@/store/ui";
import { addProduct } from "@/lib/cart-actions";
import { defaultVariants, unitPriceFor } from "@/lib/pricing";
import { inr } from "@/lib/utils";
import { Modal, QtyStepper, StarRating, WishlistButton } from "./ui";
import { SafeImg } from "./SafeImg";
import { cn } from "@/lib/utils";

export function QuickView() {
  const id = useUI((s) => s.quickView);
  const set = useUI((s) => s.setQuickView);
  const p = id ? getProductById(id) : undefined;
  const [colour, setColour] = useState("");
  const [vars, setVars] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync state on prop/external change
  useEffect(() => { if (p) { setColour(p.colours[0]?.name ?? ""); setVars(defaultVariants(p)); setQty(1); setImg(0); } }, [p]);
  return (
    <Modal open={!!p} onClose={() => set(null)} label={p ? `Quick view: ${p.name}` : "Quick view"} wide>
      {p && (
        <div className="grid md:grid-cols-2">
          <div className="bg-surface-container-low">
            <div className="aspect-[4/5]"><SafeImg src={p.images[img]} alt={p.name} className="h-full w-full object-cover" /></div>
            {p.images.length > 1 && <div className="flex gap-2 p-3">{p.images.map((s, i) => <button key={i} type="button" onClick={() => setImg(i)} aria-label={`Image ${i + 1}`} className={cn("h-14 w-12 overflow-hidden rounded border-2", i === img ? "border-primary" : "border-transparent opacity-70")}><SafeImg src={s} alt="" className="h-full w-full object-cover" /></button>)}</div>}
          </div>
          <div className="flex flex-col gap-4 p-6 md:p-8">
            <StarRating value={p.rating} count={p.reviewCount} />
            <h2 className="t-headline-md text-primary">{p.name}</h2>
            <p className="t-body-sm text-on-surface-variant">{p.description}</p>
            <p className="t-headline-sm text-primary">{inr(unitPriceFor(p, vars) * qty)}</p>
            {p.colours.length > 1 && (
              <div>
                <p className="t-label-sm mb-2 text-on-surface-variant">Colour: <span className="text-primary">{colour}</span></p>
                <div className="flex gap-2">{p.colours.map((c) => <button key={c.name} type="button" aria-label={c.name} aria-pressed={colour === c.name} onClick={() => setColour(c.name)} className={cn("h-8 w-8 rounded-full border border-primary/15 ring-offset-2 transition-all", colour === c.name && "ring-1 ring-terracotta")} style={{ background: c.hex }} />)}</div>
              </div>
            )}
            {p.variations.map((v) => (
              <div key={v.id}>
                <p className="t-label-sm mb-2 text-on-surface-variant">{v.label}</p>
                <div className="flex flex-wrap gap-2">{v.options.map((o) => <button key={o.label} type="button" className="chip" aria-pressed={vars[v.id] === o.label} onClick={() => setVars({ ...vars, [v.id]: o.label })}>{o.label}</button>)}</div>
              </div>
            ))}
            <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
              <QtyStepper qty={qty} onChange={setQty} />
              <button type="button" className="btn btn-primary flex-1" disabled={p.stock === "out"} onClick={() => { if (addProduct(p, { colour, variants: vars, qty })) set(null); }}>{p.stock === "out" ? "Sold out" : "Add to bag"}</button>
              <WishlistButton id={p.id} name={p.name} className="border border-primary/10" />
            </div>
            <Link href={`/product/${p.slug}`} onClick={() => set(null)} className="t-label-md link-u self-start text-primary">View full details</Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
