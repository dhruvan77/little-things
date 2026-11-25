"use client";
/** Rotating headline word. All words share one grid cell (so width never jumps); letters rise/exit with a stagger. */
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useHydrated";

const EASE = [0.2, 0.8, 0.2, 1] as const;
export function RotatingWord({ words, active }: { words: string[]; active: boolean }) {
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!active || reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, [active, reduced, words.length]);
  const prev = (i + words.length - 1) % words.length;
  return (
    <span className="relative inline-grid justify-items-center align-bottom italic text-on-tertiary-container" aria-live="polite">
      {words.map((w, wi) => (
        <span key={w} className="col-start-1 row-start-1 overflow-hidden whitespace-nowrap pb-[0.12em]" aria-hidden={wi !== i}>
          {w.split("").map((c, ci) => (
            <motion.span key={ci} className="inline-block" initial={{ y: wi === prev ? "-115%" : "115%" }} animate={{ y: !active ? (wi === prev ? "-115%" : "115%") : wi === i ? "0%" : wi === prev ? "-115%" : "115%" }} transition={wi === i || (wi === prev && active) ? { duration: 0.7, ease: EASE, delay: ci * 0.04 } : { duration: 0 }}>{c}</motion.span>
          ))}
        </span>
      ))}
    </span>
  );
}
