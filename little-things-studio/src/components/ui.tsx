"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, ChevronDown, ChevronRight, Heart, Minus, Plus, Star, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/store/wishlist";
import { useHydrated } from "@/hooks/useHydrated";

export function StarRating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-on-surface-variant" aria-label={`Rated ${value} out of 5`}>
      <Star size={size} className="fill-terracotta text-terracotta" aria-hidden />
      <span className="t-label-sm normal-case tracking-normal">{value.toFixed(1)}</span>
      {count !== undefined && <span className="t-label-sm normal-case tracking-normal opacity-70">({count})</span>}
    </span>
  );
}

export function Accordion({ items, defaultOpen = 0 }: { items: { id: string; title: string; content: React.ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<string | null>(defaultOpen === null ? null : items[defaultOpen]?.id ?? null);
  return (
    <div className="divide-y divide-primary/10 border-y border-primary/10">
      {items.map((it) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id}>
            <h3>
              <button type="button" aria-expanded={isOpen} aria-controls={`acc-${it.id}`} onClick={() => setOpen(isOpen ? null : it.id)} className="flex w-full items-center justify-between gap-4 py-4 text-left font-serif text-lg text-primary">
                {it.title}
                <ChevronDown size={18} className={cn("shrink-0 transition-transform duration-300", isOpen && "rotate-180")} aria-hidden />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div id={`acc-${it.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }} className="overflow-hidden">
                  <div className="t-body-sm pb-5 text-on-surface-variant">{it.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export function QtyStepper({ qty, onChange, min = 1, max = 10, small }: { qty: number; onChange: (n: number) => void; min?: number; max?: number; small?: boolean }) {
  const s = small ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded border border-primary/15 bg-white" role="group" aria-label="Quantity">
      <button type="button" className={cn(s, "flex items-center justify-center transition-colors hover:bg-surface-container disabled:opacity-30")} onClick={() => onChange(qty - 1)} disabled={qty <= min} aria-label="Decrease quantity"><Minus size={14} /></button>
      <div className={cn("relative overflow-hidden text-center t-label-lg tabular-nums", small ? "w-7" : "w-9")} aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={qty} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.2 }} className="inline-block">{qty}</motion.span>
        </AnimatePresence>
      </div>
      <button type="button" className={cn(s, "flex items-center justify-center transition-colors hover:bg-surface-container disabled:opacity-30")} onClick={() => onChange(qty + 1)} disabled={qty >= max} aria-label="Increase quantity"><Plus size={14} /></button>
    </div>
  );
}

export function EmptyState({ icon, title, body, cta, href }: { icon: React.ReactNode; title: string; body: string; cta?: string; href?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-xl border border-dashed border-primary/15 bg-surface-container-low px-8 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-high text-on-tertiary-container">{icon}</div>
      <h2 className="t-headline-sm text-primary">{title}</h2>
      <p className="t-body-sm text-on-surface-variant">{body}</p>
      {cta && href && <Link href={href} className="btn btn-primary mt-2">{cta}</Link>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="t-label-sm flex flex-wrap items-center gap-1.5 text-on-surface-variant">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5">
          {it.href ? <Link href={it.href} className="link-u">{it.label}</Link> : <span className="text-primary" aria-current="page">{it.label}</span>}
          {i < items.length - 1 && <ChevronRight size={12} aria-hidden />}
        </span>
      ))}
    </nav>
  );
}

export function Modal({ open, onClose, label, children, wide }: { open: boolean; onClose: () => void; label: string; children: React.ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const f = ref.current.querySelectorAll<HTMLElement>("a[href],button:not(:disabled),input,select,textarea,[tabindex]:not([tabindex='-1'])");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    return () => { document.removeEventListener("keydown", onKey); prev?.focus(); };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <div className="absolute inset-0 bg-inverse-surface/45 backdrop-blur-md" onClick={onClose} aria-hidden />
          <motion.div ref={ref} role="dialog" aria-modal="true" aria-label={label} data-lenis-prevent initial={{ y: 30, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }} className={cn("relative max-h-[92vh] w-full overflow-y-auto rounded-xl bg-surface-container-lowest shadow-l2", wide ? "max-w-4xl" : "max-w-lg")}>
            <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-on-surface-variant backdrop-blur transition-colors hover:text-primary"><X size={18} /></button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WishlistButton({ id, name, className, size = 18 }: { id: string; name: string; className?: string; size?: number }) {
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const ready = useHydrated();
  const on = ready && ids.includes(id);
  return (
    <motion.button type="button" whileTap={{ scale: 0.8 }} aria-pressed={on} aria-label={on ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); const added = toggle(id); toast(added ? "Saved to your wishlist" : "Removed from wishlist", { description: name }); }}
      className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm backdrop-blur transition-colors hover:bg-white", className)}>
      <motion.span key={String(on)} initial={{ scale: on ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 12 }} className="flex">
        <Heart size={size} className={cn("transition-colors", on ? "fill-terracotta text-terracotta" : "")} />
      </motion.span>
    </motion.button>
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(window.scrollY > 900); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} aria-label="Back to top"
          onClick={() => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          className="fixed bottom-5 left-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-inverse-on-surface shadow-l2 transition-transform hover:-translate-y-1">
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function Skeleton({ className }: { className?: string }) { return <div className={cn("skeleton", className)} aria-hidden />; }
