"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Preloader() {
  const [show, setShow] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const done = () => { setShow(false); window.__ltsPreloading = false; window.dispatchEvent(new Event("lts-ready")); };
    const seen = sessionStorage.getItem("lts-pre") === "1";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) { done(); return; }
    window.__ltsPreloading = true;
    sessionStorage.setItem("lts-pre", "1");
    const o = { v: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: done });
      tl.from(".pl-mark span", { yPercent: 110, duration: 0.7, stagger: 0.08, ease: "power4.out" })
        .to(o, { v: 100, duration: 0.9, ease: "power2.inOut", onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(2, "0"); } }, 0.1)
        .to(".pl-bar", { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0.1)
        .to(".pl-inner", { opacity: 0, y: -20, duration: 0.35 }, 1.05)
        .to(root.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, 1.1);
    }, root);
    const safety = window.setTimeout(done, 3500);
    return () => { clearTimeout(safety); ctx.revert(); };
  }, []);

  if (!show) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[200] flex items-center justify-center bg-surface-container-low" role="status" aria-label="Loading Little Things Studio">
      <div className="pl-inner flex w-64 flex-col items-center gap-6">
        <div className="pl-mark flex gap-3 font-serif text-4xl text-primary">
          <span className="inline-block overflow-hidden"><span className="inline-block">Little</span></span>
          <span className="inline-block overflow-hidden"><span className="inline-block italic text-on-tertiary-container">Things</span></span>
        </div>
        <div className="h-px w-full overflow-hidden bg-outline-variant"><div className="pl-bar h-full origin-left scale-x-0 bg-primary" /></div>
        <div className="t-label-sm flex w-full justify-between text-on-surface-variant"><span>Made personal</span><span ref={num}>00</span></div>
      </div>
    </div>
  );
}
