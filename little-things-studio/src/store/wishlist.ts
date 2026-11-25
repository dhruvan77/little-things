"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
interface W { ids: string[]; toggle: (id: string) => boolean; remove: (id: string) => void }
export const useWishlist = create<W>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
        return !has;
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
    }),
    { name: "lts-wishlist", storage: createJSONStorage(() => localStorage), skipHydration: true }
  )
);
