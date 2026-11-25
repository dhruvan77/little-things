"use client";
/** Section transition: the section opens from an inset rounded clip-path as it scrolls into view (scrubbed). */
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export function ClipReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const small = window.innerWidth < 768;
      gsap.fromTo(el, { clipPath: small ? "inset(4% 3% 0% 3% round 20px)" : "inset(9% 5% 0% 5% round 36px)" }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none", scrollTrigger: { trigger: el, start: "top 98%", end: "top 45%", scrub: true }, onComplete: () => { gsap.set(el, { clearProps: "clipPath" }); } });
    });
    return () => mm.revert();
  }, []);
  return <div ref={ref}>{children}</div>;
}
