"use client";
/**
 * Welcome intro ("The Unwrapping", part 1).
 * A satin ribbon draws itself across the screen (SVG stroke animation), ties into a bow,
 * then the two halves of the screen split open like curtains to reveal the page.
 * Plays once per browser session. Skipped for reduced-motion users.
 * While it plays it sets window.__ltsPreloading so PageFX / the hero wait for the "lts-ready" event.
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const STRANDS = [
  // incoming ribbon from each side
  { d: "M-340 156 C -180 156, 40 110, 160 142 S 196 150, 200 150", w: 7 },
  { d: "M740 156 C 580 156, 360 110, 240 142 S 204 150, 200 150", w: 7 },
  // bow loops
  { d: "M200 150 C 150 62, 84 66, 104 122 C 114 158, 172 152, 200 150", w: 6 },
  { d: "M200 150 C 250 62, 316 66, 296 122 C 286 158, 228 152, 200 150", w: 6 },
  // tails
  { d: "M200 150 C 186 196, 164 236, 128 270", w: 6 },
  { d: "M200 150 C 214 196, 236 236, 272 270", w: 6 },
];

export function Intro() {
  const [show, setShow] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const finish = () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      setShow(false);
      window.__ltsPreloading = false;
      window.dispatchEvent(new Event("lts-ready"));
    };
    finishRef.current = finish;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (sessionStorage.getItem("lts-intro") === "1" || reduce) { finish(); return; }
    sessionStorage.setItem("lts-intro", "1");
    window.__ltsPreloading = true;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    let opened = false;
    const open = () => { // let the page start animating as the curtains part
      if (opened) return; opened = true;
      window.__ltsPreloading = false;
      window.dispatchEvent(new Event("lts-ready"));
    };
    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>(".rb-path");
      gsap.set(".rb-knot", { opacity: 1, scale: 0, transformOrigin: "50% 50%" });
      gsap.set(".in-letter", { yPercent: 120 });
      gsap.set(".in-brand", { opacity: 1 });
      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;
      tl.to(paths.slice(0, 2), { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut" })
        .to(paths.slice(2, 4), { strokeDashoffset: 0, duration: 1.3, ease: "power2.out", stagger: 0.15 }, 1.3)
        .to(paths.slice(4), { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", stagger: 0.12 }, 1.9)
        .to(".rb-knot", { scale: 1, duration: 0.7, ease: "back.out(2.6)" }, 2.6)
        .to(".rb-fill", { opacity: 1, duration: 0.8 }, 2.7)
        .to(".in-letter", { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.04 }, 2.6)
        .to(".in-tag", { opacity: 1, duration: 0.6 }, 3.3)
        // hold on the finished bow, then it "pops" and the curtains split open
        .to(".rb-svg", { scale: 1.1, duration: 0.5, ease: "power2.out" }, 4.1)
        .add(open, 4.6)
        .to(".rb-svg, .in-brand", { opacity: 0, scale: 1.5, duration: 0.7, ease: "power3.in" }, 4.6)
        .to(".in-left", { xPercent: -101, duration: 1.2, ease: "power4.inOut" }, 4.7)
        .to(".in-right", { xPercent: 101, duration: 1.2, ease: "power4.inOut" }, 4.7)
        .to(".in-skip", { opacity: 0, duration: 0.2 }, 4.6);
    }, root);
    const safety = window.setTimeout(() => { tlRef.current?.kill(); finishRef.current(); }, 9000);
    return () => { clearTimeout(safety); ctx.revert(); document.documentElement.style.overflow = ""; };
  }, []);

  if (!show) return null;
  const word = "Little Things Studio";
  return (
    <div ref={root} data-intro-root className="fixed inset-0 z-[200]" role="status" aria-label="Welcome to Little Things Studio">
      <div className="in-left absolute inset-y-0 left-0 w-1/2 bg-surface-container-low"><div className="absolute inset-y-0 right-0 w-px bg-terracotta/40" /></div>
      <div className="in-right absolute inset-y-0 right-0 w-1/2 bg-surface-container-low"><div className="absolute inset-y-0 left-0 w-px bg-terracotta/40" /></div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
        <svg className="rb-svg w-[max(100vw,880px)] max-w-none overflow-visible" viewBox="-340 0 1080 300" fill="none" aria-hidden>
          <g className="rb-fill" opacity="0"><path d="M200 150 C 150 62, 84 66, 104 122 C 114 158, 172 152, 200 150Z" fill="var(--color-terracotta)" fillOpacity=".18" /><path d="M200 150 C 250 62, 316 66, 296 122 C 286 158, 228 152, 200 150Z" fill="var(--color-terracotta)" fillOpacity=".18" /></g>
          {STRANDS.map((s, i) => <path key={i} className="rb-path" d={s.d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} stroke="var(--color-terracotta)" strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round" />)}
          <circle className="rb-knot" cx="200" cy="150" r="13" fill="var(--color-terracotta)" opacity="0" />
        </svg>
        <div className="in-brand flex flex-col items-center gap-2 opacity-0">
          <div className="flex font-serif text-3xl text-primary md:text-5xl" aria-label={word}>
            {word.split("").map((c, i) => <span key={i} aria-hidden className="inline-block overflow-hidden pb-1"><span className="in-letter inline-block">{c === " " ? "\u00A0" : c}</span></span>)}
          </div>
          <p className="in-tag t-label-sm text-on-surface-variant opacity-0">Made personal • Made memorable</p>
        </div>
      </div>
      <button type="button" className="in-skip t-label-sm absolute bottom-6 right-6 text-on-surface-variant underline-offset-4 hover:text-primary hover:underline" onClick={() => { tlRef.current?.kill(); finishRef.current(); }}>Skip intro</button>
    </div>
  );
}
