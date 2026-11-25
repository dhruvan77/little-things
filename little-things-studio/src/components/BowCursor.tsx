"use client";
/**
 * Custom cursor: a small bow that follows the pointer, tilts with movement,
 * grows over interactive elements and turns into an "Open" bubble over products.
 * Desktop pointer devices only; disabled for reduced-motion.
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function BowCursor() {
  const wrap = useRef<HTMLDivElement>(null);
  const bow = useRef<HTMLDivElement>(null);
  const bubble = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- feature-detect once on mount
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    if (!on || !wrap.current || !bow.current || !bubble.current) return;
    const x = gsap.quickTo(wrap.current, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(wrap.current, "y", { duration: 0.35, ease: "power3" });
    const rot = gsap.quickTo(bow.current, "rotation", { duration: 0.5, ease: "power3" });
    let lastX = 0;
    const move = (e: PointerEvent) => { x(e.clientX); y(e.clientY); rot(gsap.utils.clamp(-35, 35, (e.clientX - lastX) * 1.2)); lastX = e.clientX; };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const tag = t.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "";
      const hot = !!t.closest("a,button,input,textarea,select,[role=button],label");
      setLabel(tag === "View" ? "Open" : tag);
      gsap.to(bow.current, { scale: tag ? 0.01 : hot ? 1.6 : 1, duration: 0.3, ease: "back.out(2)" });
      gsap.to(bubble.current, { scale: tag ? 1 : 0, duration: 0.4, ease: "back.out(1.8)" });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over); };
  }, [on]);

  if (!on) return null;
  return (
    <div ref={wrap} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[190]">
      <div ref={bow} className="absolute -left-3 -top-3 h-6 w-6 text-terracotta drop-shadow-sm">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12C9 6 3 5 3 9.5c0 3 5 3 9 2.5Z" opacity=".9" /><path d="M12 12c3-6 9-7 9-2.500 0 3-5 3-9 2.500Z" opacity=".9" /><path d="M12 12 8 21l4-3 4 3-4-9Z" opacity=".75" /><circle cx="12" cy="12" r="2.2" /></svg>
      </div>
      <div ref={bubble} className="absolute -left-9 -top-9 flex h-[72px] w-[72px] scale-0 items-center justify-center rounded-full bg-primary-container text-inverse-on-surface">
        <span className="t-label-sm text-[10px]">{label}</span>
      </div>
    </div>
  );
}
