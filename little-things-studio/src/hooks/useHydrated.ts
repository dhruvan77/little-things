"use client";
import { useSyncExternalStore } from "react";

const noop = () => () => {};
/** False during SSR/hydration, true afterwards (avoids persisted-store mismatches). */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => { const m = window.matchMedia("(prefers-reduced-motion: reduce)"); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}
