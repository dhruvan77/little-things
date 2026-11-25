"use client";
/** Infinite occasions marquee. Two rows run in opposite directions; scrolling reverses them and speeds them up with velocity. */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const WORDS = ["Birthday", "Anniversary", "Wedding", "Baby Shower", "Surprise"];

function Row({ reverse, outline }: { reverse?: boolean; outline?: boolean }) {
  const half = (k: string) => (
    <div key={k} className="flex shrink-0 items-center" aria-hidden={k === "b"}>
      {[...WORDS, ...WORDS].map((w, i) => (
        <span key={i} className="flex items-center">
          <span className={`px-6 font-serif text-5xl md:px-10 md:text-7xl ${outline ? "text-transparent [-webkit-text-stroke:1px_var(--color-primary)]" : "italic text-primary"}`}>{w}</span>
          <span className="text-2xl text-terracotta md:text-3xl">&#10022;</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden" data-marquee-row data-reverse={reverse ? "1" : "0"}>
      <div data-marquee-track className="flex w-max will-change-transform">{half("a")}{half("b")}</div>
    </div>
  );
}

export function OccasionMarquee() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = root.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const tweens = gsap.utils.toArray<HTMLElement>("[data-marquee-row]").map((row) => {
        const rev = row.dataset.reverse === "1";
        const track = row.querySelector("[data-marquee-track]")!;
        return gsap.fromTo(track, { xPercent: rev ? -50 : 0 }, { xPercent: rev ? 0 : -50, duration: 38, ease: "none", repeat: -1 });
      });
      ScrollTrigger.create({
        start: 0, end: "max",
        onUpdate: (self) => { // scroll direction flips the marquee; velocity speeds it up
          const boost = 1 + Math.min(4, Math.abs(self.getVelocity()) / 500);
          tweens.forEach((t) => gsap.to(t, { timeScale: self.direction * boost, duration: 0.5, overwrite: true }));
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="space-y-2 overflow-hidden border-y border-primary/10 py-8 md:py-12" aria-label="Occasions we make gifts for">
      <Row />
      <Row reverse outline />
    </section>
  );
}
