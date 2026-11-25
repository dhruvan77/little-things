import type { Customisation, Product } from "@/data/types";
import { PACKAGING } from "@/data/personalisation";
import { COUPONS } from "@/data/site";

export const FREE_SHIP_AT = 999;
export const SHIPPING_FEE = 99;
export const EXPRESS_FEE = 199;

export function unitPriceFor(p: Product, variants: Record<string, string>, c?: Customisation) {
  let n = p.price;
  for (const v of p.variations) {
    const opt = v.options.find((o) => o.label === variants[v.id]);
    n += opt?.priceDelta ?? 0;
  }
  if (c) n += PACKAGING.find((x) => x.id === c.packagingId)?.price ?? 0;
  return n;
}
export const defaultVariants = (p: Product) =>
  Object.fromEntries(p.variations.map((v) => [v.id, v.options[0].label])) as Record<string, string>;

export function couponDiscount(code: string | null, subtotal: number) {
  if (!code) return { discount: 0, freeShip: false, valid: false, reason: "" };
  const c = COUPONS[code];
  if (!c) return { discount: 0, freeShip: false, valid: false, reason: "That code isn't valid." };
  if (c.min && subtotal < c.min) return { discount: 0, freeShip: false, valid: false, reason: `Add ₹${(c.min - subtotal).toLocaleString("en-IN")} more to use ${code}.` };
  if (c.type === "pct") return { discount: Math.round((subtotal * c.value) / 100), freeShip: false, valid: true, reason: "" };
  if (c.type === "flat") return { discount: c.value, freeShip: false, valid: true, reason: "" };
  return { discount: 0, freeShip: true, valid: true, reason: "" };
}
export function totals(subtotal: number, code: string | null, express = false) {
  const cd = couponDiscount(code, subtotal);
  const after = Math.max(0, subtotal - cd.discount);
  const baseShip = subtotal === 0 || after >= FREE_SHIP_AT || cd.freeShip ? 0 : SHIPPING_FEE;
  const shipping = baseShip + (express && subtotal > 0 ? EXPRESS_FEE : 0);
  return { subtotal, discount: cd.discount, shipping, total: after + shipping, couponOk: cd.valid, couponReason: cd.reason };
}
