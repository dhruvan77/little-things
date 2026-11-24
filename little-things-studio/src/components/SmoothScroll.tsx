"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUI } from "@/store/ui";

gsap.registerPlugin(ScrollTrigger);
declare global { interface Window { __lenis?: Lenis | null; __ltsPreloading?: boolean } }

export function SmoothScroll() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.origin !== location.origin || a.pathname !== location.pathname || !a.hash) return;
      const el = document.querySelector(a.hash);
      if (el) { e.preventDefault(); lenis.scrollTo(el as HTMLElement, { offset: -110 }); }
    };
    document.addEventListener("click", onClick);
    const unsub = useUI.subscribe((s) => { const lock = s.cartOpen || s.searchOpen || s.menuOpen || !!s.quickView; if (lock) lenis.stop(); else lenis.start(); });
    return () => { unsub(); document.removeEventListener("click", onClick); gsap.ticker.remove(tick); lenis.destroy(); window.__lenis = null; };
  }, []);
  useEffect(() => { window.__lenis?.scrollTo(0, { immediate: true }); }, [pathname]);
  return null;
}
