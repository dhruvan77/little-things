"use client";
/**
 * "The Unwrapping" - the animated home opener.
 *
 * Desktop: the section is pinned; scrolling untied the bow, lifts the lid, bursts gift tiles
 * out with spring easing, then settles the real product tiles into a grid.
 * Mobile / reduced-motion: simplified (no pin, no WebGL; reduced-motion shows the final state).
 * One scrubbed GSAP timeline drives both the 3D scene (via a mutable ref) and the DOM tiles.
 */
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "motion/react";
import { IMG, getProduct } from "@/data/products";
import { inr } from "@/lib/utils";
import { useIntroReady } from "@/hooks/useIntroReady";
import { useReducedMotion } from "@/hooks/useHydrated";
import { SafeImg } from "@/components/SafeImg";
import { CssGiftBox } from "./CssGiftBox";
import { RotatingWord } from "./RotatingWord";
import type { SceneState } from "./GiftScene";

gsap.registerPlugin(ScrollTrigger);
const GiftScene = dynamic(() => import("./GiftScene"), { ssr: false, loading: () => null });

const SLUGS = ["the-sandstone-tumbler", "artisan-leather-journal", "the-golden-hour-hamper", "italian-leather-brass-fob"];
const PRODUCTS = SLUGS.map((s) => getProduct(s)!).filter(Boolean);
// depth-layered floating gift tiles (image index, depth = parallax/travel multiplier)
const DECOR = [{ img: 14, depth: 0.7, bx: -0.38, by: -0.32, r: -16, size: 110 }, { img: 16, depth: 1.2, bx: 0.4, by: -0.3, r: 14, size: 96 }, { img: 17, depth: 1.6, bx: -0.44, by: 0.18, r: 10, size: 130 }, { img: 18, depth: 0.9, bx: 0.42, by: 0.2, r: -12, size: 104 }];
const BURST = [{ x: -0.3, y: -0.24, r: -12 }, { x: -0.1, y: -0.34, r: 8 }, { x: 0.12, y: -0.32, r: -7 }, { x: 0.32, y: -0.2, r: 13 }];
const EASE = [0.2, 0.8, 0.2, 1] as const;

function Letters({ text, ready, delay = 0 }: { text: string; ready: boolean; delay?: number }) {
  let n = 0;
  return (
    <>
      {text.split(" ").map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {w.split("").map((c, ci) => (
            <span key={ci} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span className="inline-block" initial={{ y: "115%" }} animate={ready ? { y: "0%" } : undefined} transition={{ duration: 0.85, ease: EASE, delay: delay + 0.04 * n++ }}>{c}</motion.span>
            </span>
          ))}
          &nbsp;
        </span>
      ))}
    </>
  );
}

export function UnwrapStory() {
  const root = useRef<HTMLElement>(null);
  const state = useRef<SceneState>({ ribbon: 0, lid: 0, fade: 0 });
  const ready = useIntroReady();
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<"css" | "3d">("css");
  const [canvasReady, setCanvasReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);

  // choose 3D only for capable desktop devices
  useEffect(() => {
    if (reduced || window.innerWidth < 768) return;
    try {
      const c = document.createElement("canvas");
      if (c.getContext("webgl2") || c.getContext("webgl")) { // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after mount
        setMode("3d");
      }
    } catch { /* stay on CSS box */ }
  }, [reduced]);

  // pause rendering when the story is off screen or the tab is hidden
  useEffect(() => {
    const el = root.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // pointer depth-parallax for floating tiles (desktop, motion allowed)
  useEffect(() => {
    if (reduced || !window.matchMedia("(min-width: 768px) and (pointer: fine)").matches) return;
    const inner = gsap.utils.toArray<HTMLElement>("[data-decor-inner]", root.current);
    const movers = inner.map((el) => ({ x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" }), y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" }), d: Number(el.dataset.depth) }));
    const f = (e: PointerEvent) => { const nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5; movers.forEach((m) => { m.x(-nx * 40 * m.d); m.y(-ny * 40 * m.d); }); };
    window.addEventListener("pointermove", f, { passive: true });
    return () => window.removeEventListener("pointermove", f);
  }, [reduced]);

  // the scroll story
  useEffect(() => {
    const el = root.current; if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(
      { desk: "(min-width: 768px) and (prefers-reduced-motion: no-preference)", mob: "(max-width: 767px) and (prefers-reduced-motion: no-preference)" },
      (ctx) => {
        const { desk } = ctx.conditions as { desk: boolean };
        const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", el);
        const slots = gsap.utils.toArray<HTMLElement>("[data-slot]", el);
        const decor = gsap.utils.toArray<HTMLElement>("[data-decor]", el);
        const st = state.current; st.ribbon = 0; st.lid = 0; st.fade = 0;

        if (!desk) { // simplified mobile version: no pin, light scrub + staggered tile reveal
          gsap.timeline({ scrollTrigger: { trigger: el, start: "top 60%", end: "center 30%", scrub: true } })
            .to("[data-css-bow]", { opacity: 0, y: -30, duration: 1 }, 0).to("[data-css-lid]", { yPercent: -75, rotate: -10, duration: 1 }, 0.25);
          gsap.from(tiles, { y: 50, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: "[data-slots]", start: "top 85%", once: true } });
          return;
        }

        const W = () => el.clientWidth, H = () => el.clientHeight;
        const toCenter = (i: number) => { // offset from a slot to the box centre (scroll-invariant)
          const r = slots[i].getBoundingClientRect(), s = el.getBoundingClientRect();
          return { x: s.left + s.width / 2 - (r.left + r.width / 2), y: s.top + s.height * 0.62 - (r.top + r.height / 2) };
        };
        gsap.set(tiles, { pointerEvents: "none" });
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, pin: true, scrub: 0.8, start: "top top", end: "+=480%", anticipatePin: 1, invalidateOnRefresh: true } });
        // 0-1  the ribbon unties
        tl.to(st, { ribbon: 1, duration: 1.6, ease: "power2.inOut" }, 0)
          .to("[data-css-bow]", { opacity: 0, y: -30, duration: 1.6 }, 0)
          .to("[data-hint]", { opacity: 0, duration: 0.3 }, 0)
          // 1-2.2  the lid lifts
          .to(st, { lid: 1, duration: 1.4, ease: "power3.out" }, 1.5)
          .to("[data-css-lid]", { yPercent: -75, rotate: -10, duration: 1.4, ease: "power3.out" }, 1.5);
        // 1.8-3.2  gifts burst out with spring easing
        tiles.forEach((t, i) => {
          tl.fromTo(t, { x: () => toCenter(i).x, y: () => toCenter(i).y, scale: 0.15, opacity: 0, rotation: BURST[i].r * 2 },
            { x: () => toCenter(i).x + BURST[i].x * W(), y: () => toCenter(i).y + BURST[i].y * H(), scale: 0.5, opacity: 1, rotation: BURST[i].r, duration: 1.4, ease: "back.out(1.9)" }, 2.2 + i * 0.1)
            // 3.4-5  ...then rearrange into the product grid
            .to(t, { x: 0, y: 0, scale: 1, rotation: 0, duration: 1.6, ease: "power3.inOut" }, 3.7 + i * 0.05);
        });
        decor.forEach((d, i) => {
          const c = DECOR[i];
          tl.fromTo(d, { x: 0, y: 0, scale: 0.1, opacity: 0, rotation: c.r * 2 }, { x: () => c.bx * W() * c.depth, y: () => c.by * H() * c.depth, scale: c.depth, opacity: 1, rotation: c.r, duration: 1.3, ease: "back.out(1.7)" }, 2.3 + i * 0.08)
            .to(d, { x: () => c.bx * W() * c.depth * 1.7, y: () => c.by * H() * c.depth * 1.7 - 90, opacity: 0, duration: 1.5, ease: "power2.in" }, 3.8);
        });
        // 4.8-6  box sinks away, headline gives way to the grid caption
        tl.to(st, { fade: 1, duration: 1, ease: "power2.in" }, 4.8)
          .to("[data-css-box]", { opacity: 0, duration: 0.8 }, 4.8)
          .to("[data-head]", { opacity: 0, y: -40, duration: 0.8 }, 4.7)
          .fromTo("[data-caption]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 5.2)
          .set(tiles, { pointerEvents: "auto" }, 5.4)
          .to({}, { duration: 0.6 }, 5.4); // hold the finished grid briefly before unpinning
      }
    );
    return () => mm.revert();
  }, []);

  const lifted = reduced; // reduced-motion users get the finished state
  return (
    <section ref={root} className="relative overflow-hidden px-page pb-12 pt-28 md:h-screen md:pb-0 md:pt-0" aria-labelledby="story-h">
      {/* 3D scene (desktop) over a CSS poster */}
      {mode === "3d" && (
        <div className="absolute inset-0 hidden md:block" style={{ opacity: canvasReady ? 1 : 0, transition: "opacity .8s" }}>
          <GiftScene state={state} active={onScreen} onReady={() => setCanvasReady(true)} />
        </div>
      )}
      <div data-css-box className="relative mt-6 md:absolute md:left-1/2 md:top-[62%] md:mt-0 md:-translate-x-1/2 md:-translate-y-1/2" style={mode === "3d" ? { opacity: canvasReady ? 0 : 1, transition: "opacity .8s" } : undefined}>
        <CssGiftBox lifted={lifted} />
      </div>

      {/* floating depth-layered gift tiles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] hidden motion-safe:md:block">
        {DECOR.map((c) => (
          <div key={c.img} data-decor className="absolute left-1/2 top-[62%] opacity-0" style={{ width: c.size, height: c.size * 1.2, marginLeft: -c.size / 2, marginTop: -c.size * 0.6 }}>
            <div data-decor-inner data-depth={c.depth} className="h-full w-full overflow-hidden rounded-lg border-4 border-white shadow-l2"><SafeImg src={IMG(c.img)} alt="" className="h-full w-full object-cover" /></div>
          </div>
        ))}
      </div>

      {/* headline */}
      <div data-head className="relative z-20 text-center md:absolute md:inset-x-0 md:top-32">
        <p className="t-label-md text-on-tertiary-container">The Unwrapping</p>
        <h2 id="story-h" className="t-display-xl mt-2 text-primary">
          <Letters text="Gifts for" ready={ready} />
          <RotatingWord words={["Mom", "Love", "Friends", "Everyone"]} active={ready} />
        </h2>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={ready ? { opacity: 1, y: 0 } : undefined} transition={{ delay: 0.9, duration: 0.8 }} className="t-body-md mx-auto mt-3 max-w-md text-on-surface-variant">Scroll to untie the ribbon and see what&rsquo;s inside.</motion.p>
      </div>
      <div data-hint aria-hidden className="absolute inset-x-0 bottom-6 z-20 hidden flex-col items-center gap-2 md:flex"><span className="t-label-sm text-on-surface-variant">Scroll to unwrap</span><span className="h-10 w-px animate-pulse bg-primary/40" /></div>

      {/* final product grid: slots hold the real products */}
      <div data-slots className="relative z-10 mt-8 md:absolute md:inset-x-0 md:bottom-6 md:top-28 md:mt-0 md:flex md:items-center md:justify-center md:px-16">
        <div className="mx-auto w-full max-w-5xl">
          <p data-caption className="t-label-md mb-4 text-center text-on-tertiary-container motion-safe:md:opacity-0">Unwrapped for you</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {PRODUCTS.map((p) => (
              <div key={p.id} data-slot>
                <Link data-tile data-cursor="View" href={`/product/${p.slug}`} className="story-tile card block overflow-hidden transition-shadow hover:shadow-l2">
                  <div className="aspect-[4/5] overflow-hidden bg-surface-container-low"><SafeImg src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /></div>
                  <div className="p-3"><p className="font-serif text-sm font-semibold leading-tight text-primary">{p.name}</p><p className="t-label-sm mt-1 normal-case tracking-normal text-on-surface-variant">{inr(p.price)}</p></div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
