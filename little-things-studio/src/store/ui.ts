"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "./cart";

export interface Order {
  ref: string; placedAt: string; items: CartItem[]; subtotal: number; discount: number; shipping: number; total: number;
  coupon: string | null; delivery: string;
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; pin: string };
}
interface UI {
  cartOpen: boolean; searchOpen: boolean; menuOpen: boolean; quickView: string | null; bump: number;
  setCart: (v: boolean) => void; setSearch: (v: boolean) => void; setMenu: (v: boolean) => void; setQuickView: (id: string | null) => void; bumpCart: () => void;
}
export const useUI = create<UI>((set) => ({
  cartOpen: false, searchOpen: false, menuOpen: false, quickView: null, bump: 0,
  setCart: (v) => set({ cartOpen: v }), setSearch: (v) => set({ searchOpen: v }), setMenu: (v) => set({ menuOpen: v }),
  setQuickView: (id) => set({ quickView: id }), bumpCart: () => set((s) => ({ bump: s.bump + 1 })),
}));
interface OrderStore { order: Order | null; setOrder: (o: Order | null) => void }
export const useOrder = create<OrderStore>()(
  persist((set) => ({ order: null, setOrder: (order) => set({ order }) }), { name: "lts-order", storage: createJSONStorage(() => localStorage), skipHydration: true })
);
