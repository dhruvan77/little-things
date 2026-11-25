"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useHydrated";

gsap.registerPlugin(ScrollTrigger);
const DEFAULT_BG = "#fff8f0";

export function PageFX() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    let timer = 0;
    const run = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const q = <T extends HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));
        const st = (el: Element, start = "top 88%") => ({ trigger: el, start, once: true });

        q("[data-anim]").forEach((el) => {
          const type = el.dataset.anim;
          const delay = Number(el.dataset.delay || 0);
          const base = { duration: 0.95, ease: "power3.out", delay, scrollTrigger: st(el) };
          if (type === "up") gsap.from(el, { y: 44, opacity: 0, ...base });
          else if (type === "left") gsap.from(el, { x: -70, opacity: 0, ...base });
          else if (type === "right") gsap.from(el, { x: 70, opacity: 0, ...base });
          else if (type === "fade") gsap.from(el, { opacity: 0, ...base });
          else if (type === "scale") gsap.from(el, { scale: 0.9, opacity: 0, ...base });
          else if (type === "clip") {
            gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.3, ease: "power4.inOut", delay, scrollTrigger: st(el, "top 90%") });
            const img = el.querySelector("img");
            if (img) gsap.from(img, { scale: 1.25, duration: 1.8, ease: "power3.out", delay, scrollTrigger: st(el, "top 90%") });
          } else if (type === "words") {
            gsap.from(el.querySelectorAll(".w"), { yPercent: 115, opacity: 0, duration: 0.95, ease: "power4.out", stagger: 0.055, delay, scrollTrigger: st(el, "top 92%") });
          }
        });

        q("[data-stagger]").forEach((box) => {
          const items = box.querySelectorAll("[data-stagger-item]");
          if (items.length) gsap.from(items, { y: 48, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, scrollTrigger: st(box, "top 85%") });
        });

        q("[data-parallax]").forEach((el) => {
          const amt = Number(el.dataset.parallax || 8);
          gsap.fromTo(el, { yPercent: -amt }, { yPercent: amt, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, scrub: true, start: "top bottom", end: "bottom top" } });
        });

        q("[data-counter]").forEach((el) => {
          const target = Number(el.dataset.counter), pre = el.dataset.prefix ?? "", suf = el.dataset.suffix ?? "";
          const o = { v: 0 };
          gsap.to(o, { v: target, duration: 1.8, ease: "power2.out", scrollTrigger: st(el, "top 92%"), onUpdate: () => { el.textContent = pre + Math.round(o.v).toLocaleString("en-IN") + suf; } });
        });

        q("[data-bg]").forEach((el) => {
          const to = (c: string) => gsap.to(document.body, { backgroundColor: c, duration: 0.8, overwrite: "auto" });
          ScrollTrigger.create({ trigger: el, start: "top 55%", end: "bottom 55%", onEnter: () => to(el.dataset.bg!), onEnterBack: () => to(el.dataset.bg!), onLeave: () => to(DEFAULT_BG), onLeaveBack: () => to(DEFAULT_BG) });
        });

        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px)", () => {
          q("[data-hscroll]").forEach((sec) => {
            const track = sec.querySelector<HTMLElement>("[data-hscroll-track]");
            const bar = sec.querySelector<HTMLElement>("[data-hscroll-progress]");
            if (!track) return;
            const dist = () => Math.max(0, track.scrollWidth - window.innerWidth + 128);
            gsap.to(track, { x: () => -dist(), ease: "none", scrollTrigger: { trigger: sec, pin: true, scrub: 0.6, start: "top top", end: () => "+=" + dist(), invalidateOnRefresh: true, anticipatePin: 1, onUpdate: (self) => { if (bar) bar.style.transform = `scaleX(${self.progress})`; } } });
          });
        });

        const bar = document.getElementById("scroll-progress");
        if (bar) gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });
      });
      ScrollTrigger.refresh();
    };
    if (window.__ltsPreloading) window.addEventListener("lts-ready", run, { once: true });
    else timer = window.setTimeout(run, 80);
    // late-mounted content (client-rendered grids) shifts layout; refresh after images/layout settle
    const late = window.setTimeout(() => ScrollTrigger.refresh(), 1200);
    return () => { cancelled = true; clearTimeout(timer); clearTimeout(late); window.removeEventListener("lts-ready", run); ctx?.revert(); };
  }, [pathname, reduced]);

  return <div id="scroll-progress" aria-hidden className="fixed left-0 top-0 z-[120] h-[2px] w-full origin-left scale-x-0 bg-terracotta" />;
}
