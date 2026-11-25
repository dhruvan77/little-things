"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: sync state on prop/external change
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    return () => document.documentElement.classList.remove("has-cursor");
  }, []);

  useEffect(() => {
    if (!on || !dot.current || !ring.current) return;
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08 }), dy = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" }), ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
    const move = (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const cur = t.closest("[data-cursor]") as HTMLElement | null;
      const hot = t.closest("a,button,input,textarea,select,[role=button]");
      setLabel(cur?.dataset.cursor ?? "");
      gsap.to(ring.current, { scale: cur ? 2.6 : hot ? 1.7 : 1, backgroundColor: cur ? "rgba(41,39,35,.9)" : "rgba(41,39,35,0)", duration: 0.3 });
      gsap.to(dot.current, { opacity: cur ? 0 : 1, duration: 0.2 });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over); };
  }, [on]);

  if (!on) return null;
  return (
    <>
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[190] -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-primary/40">
        <span className="t-label-sm text-[5px] text-inverse-on-surface" style={{ fontSize: 4 }}>{label}</span>
      </div>
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[191] -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-primary" />
    </>
  );
}
