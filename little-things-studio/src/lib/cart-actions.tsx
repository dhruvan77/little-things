"use client";
import { toast } from "sonner";
import type { Product } from "@/data/types";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { defaultVariants, unitPriceFor } from "./pricing";
import { inr } from "./utils";
import { SafeImg } from "@/components/SafeImg";
import { confettiBurst } from "./confetti";

export function notifyAdded(name: string, price: number, image: string, summary?: string) {
  confettiBurst();
  toast.custom((id) => (
    <div className="flex w-[340px] items-center gap-3 rounded-lg border border-primary/10 bg-white p-3 shadow-l2" role="status">
      <SafeImg src={image} alt="" className="h-14 w-12 shrink-0 rounded object-cover" />
      <div className="min-w-0 flex-1">
        <p className="t-label-sm text-on-secondary-container">Added to your bag</p>
        <p className="truncate font-serif text-sm font-semibold text-primary">{name}</p>
        <p className="t-label-sm truncate normal-case tracking-normal text-on-surface-variant">{summary ? `${summary} • ` : ""}{inr(price)}</p>
      </div>
      <button type="button" className="t-label-sm rounded bg-primary-container px-3 py-2 text-inverse-on-surface" onClick={() => { toast.dismiss(id); useUI.getState().setCart(true); }}>View bag</button>
    </div>
  ), { duration: 4500 });
}

export function addProduct(p: Product, opts?: { colour?: string; variants?: Record<string, string>; qty?: number }) {
  if (p.stock === "out") { toast.error("This piece is currently out of stock.", { description: p.name }); return false; }
  const variants = opts?.variants ?? defaultVariants(p);
  const colour = opts?.colour ?? p.colours[0]?.name;
  const unitPrice = unitPriceFor(p, variants);
  useCart.getState().add({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0], unitPrice, colour, variants }, opts?.qty ?? 1);
  useUI.getState().bumpCart();
  notifyAdded(p.name, unitPrice, p.images[0], colour);
  return true;
}

import type { Customisation } from "@/data/types";
import { engravingText } from "@/components/ProductPreview";

export function customisationSummary(c: Customisation) {
  const { text, empty } = engravingText(c);
  return `${empty ? "No text" : `Engraved: '${text}'`} • ${c.glaze}`;
}
export function addCustomised(p: Product, c: Customisation, variants: Record<string, string>, colour: string, editKey?: string) {
  if (p.stock === "out") { toast.error("This piece is currently out of stock.", { description: p.name }); return false; }
  const unitPrice = unitPriceFor(p, variants, c);
  const summary = customisationSummary(c);
  const store = useCart.getState();
  if (editKey) { store.updateCustomisation(editKey, { ...c, glaze: colour }, unitPrice, summary); toast.success("Personalisation updated", { description: p.name }); return true; }
  store.add({ productId: p.id, slug: p.slug, name: p.name, image: p.images[0], unitPrice, colour, variants, customisation: { ...c, glaze: colour }, summary });
  useUI.getState().bumpCart();
  notifyAdded(p.name, unitPrice, p.images[0], summary);
  return true;
}
