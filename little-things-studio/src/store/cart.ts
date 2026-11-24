"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Customisation, HamperSnapshot } from "@/data/types";
import { COUPONS } from "@/data/site";
import { couponDiscount } from "@/lib/pricing";

export interface CartItem {
  key: string; productId: string; slug: string; name: string; image: string; unitPrice: number; qty: number;
  colour?: string; variants?: Record<string, string>; customisation?: Customisation; hamper?: HamperSnapshot; summary?: string;
}
export const makeKey = (i: Pick<CartItem, "productId" | "colour" | "variants" | "customisation" | "hamper">) =>
  [i.productId, i.colour ?? "", JSON.stringify(i.variants ?? {}), JSON.stringify(i.customisation ?? {}), JSON.stringify(i.hamper ?? {})].join("|");

interface CartState {
  items: CartItem[]; coupon: string | null;
  add: (i: Omit<CartItem, "key" | "qty">, qty?: number) => string;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  updateCustomisation: (key: string, c: Customisation, unitPrice: number, summary?: string) => string;
  clear: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
}
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], coupon: null,
      add: (i, qty = 1) => {
        const key = makeKey(i);
        set((s) => {
          const ex = s.items.find((x) => x.key === key);
          return { items: ex ? s.items.map((x) => (x.key === key ? { ...x, qty: Math.min(10, x.qty + qty) } : x)) : [...s.items, { ...i, key, qty }] };
        });
        return key;
      },
      remove: (key) => set((s) => ({ items: s.items.filter((x) => x.key !== key) })),
      setQty: (key, qty) => set((s) => ({ items: qty <= 0 ? s.items.filter((x) => x.key !== key) : s.items.map((x) => (x.key === key ? { ...x, qty: Math.min(10, qty) } : x)) })),
      updateCustomisation: (key, c, unitPrice, summary) => {
        const old = get().items.find((x) => x.key === key);
        if (!old) return key;
        const next = { ...old, customisation: c, colour: c.glaze, unitPrice, summary: summary ?? old.summary };
        const nk = makeKey(next);
        set((s) => {
          const others = s.items.filter((x) => x.key !== key);
          const dup = others.find((x) => x.key === nk);
          return { items: dup ? others.map((x) => (x.key === nk ? { ...x, qty: Math.min(10, x.qty + old.qty) } : x)) : s.items.map((x) => (x.key === key ? { ...next, key: nk } : x)) };
        });
        return nk;
      },
      clear: () => set({ items: [], coupon: null }),
      applyCoupon: (raw) => {
        const code = raw.trim().toUpperCase();
        if (!code) return { ok: false, message: "Enter a coupon code." };
        if (!COUPONS[code]) return { ok: false, message: "That code isn't valid. Try LITTLE10." };
        const sub = get().items.reduce((a, i) => a + i.unitPrice * i.qty, 0);
        const r = couponDiscount(code, sub);
        if (!r.valid) return { ok: false, message: r.reason };
        set({ coupon: code });
        return { ok: true, message: `${code} applied: ${COUPONS[code].label}.` };
      },
      removeCoupon: () => set({ coupon: null }),
    }),
    { name: "lts-cart", storage: createJSONStorage(() => localStorage), skipHydration: true }
  )
);
export const cartCount = (items: CartItem[]) => items.reduce((a, i) => a + i.qty, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((a, i) => a + i.unitPrice * i.qty, 0);
