"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { ANNOUNCE, MEGA, NAV } from "@/data/site";
import { useCart, cartCount } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { useHydrated } from "@/hooks/useHydrated";
import { cn } from "@/lib/utils";

function Badge({ n, tone, bump }: { n: number; tone: string; bump?: number }) {
  if (!n) return null;
  return (
    <AnimatePresence mode="popLayout">
      <motion.span key={`${n}-${bump}`} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 14 }} className={cn("t-label-sm absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px]", tone)}>{n}</motion.span>
    </AnimatePresence>
  );
}

export function Header() {
  const pathname = usePathname();
  const ready = useHydrated();
  const items = useCart((s) => s.items);
  const wl = useWishlist((s) => s.ids.length);
  const { menuOpen, setMenu, setCart, setSearch, bump } = useUI();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { setMenu(false); }, [pathname, setMenu]);
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const marquee = [...ANNOUNCE, ...ANNOUNCE, ...ANNOUNCE, ...ANNOUNCE];
  const ib = "relative flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container hover:text-primary";

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex flex-col">
        <div className="flex h-8 select-none items-center overflow-hidden border-b border-white/5 bg-tertiary-container text-tertiary-fixed">
          <div className="t-label-sm flex w-max animate-marquee items-center gap-8 whitespace-nowrap text-[11px] hover:[animation-play-state:paused]">
            {marquee.map((m, i) => <span key={i} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed-dim" />{m}</span>)}
          </div>
        </div>
        <header className={cn("w-full backdrop-blur-xl transition-all duration-300", scrolled ? "bg-surface-bright/95 shadow-[0_1px_12px_rgba(0,0,0,0.06)]" : "bg-surface-bright/80")}>
          <div className="px-page flex h-16 items-center justify-between gap-4 lg:h-20">
            <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Little Things Studio, home">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container font-serif text-lg italic text-tertiary-fixed transition-transform duration-500 group-hover:rotate-12">L</span>
              <span className="flex flex-col"><span className="t-headline-sm !text-[1.15rem] leading-none text-primary">Little Things</span><span className="t-label-sm mt-0.5 text-[9px] tracking-[0.2em] text-on-surface-variant">Made Personal</span></span>
            </Link>
            <nav className="hidden h-full items-center gap-5 xl:gap-7 lg:flex" aria-label="Primary">
              {NAV.map((n) => n.mega ? (
                <div key={n.href} className="group flex h-full items-center">
                  <Link href={n.href} className={cn("t-label-md flex h-full items-center gap-1 border-b py-2 transition-colors", active(n.href) ? "border-primary font-bold text-primary" : "border-transparent text-on-surface-variant group-hover:text-primary")}>
                    {n.label}<ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" aria-hidden />
                  </Link>
                  <div className="pointer-events-none fixed left-0 top-[6.5rem] z-50 w-screen -translate-y-2 border-t border-primary/5 bg-white/95 opacity-0 shadow-[0_20px_48px_-12px_rgba(41,39,35,0.1)] backdrop-blur-2xl transition-all duration-300 focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="px-page grid grid-cols-5 gap-6 py-8">
                      {MEGA.map((m) => (
                        <Link key={m.href} href={m.href} className="group/m flex flex-col gap-1.5">
                          <span className="t-label-sm text-on-surface-variant">{m.group}</span>
                          <span className="t-headline-sm text-primary transition-colors group-hover/m:text-on-tertiary-container">{m.title}</span>
                          <span className="t-body-sm text-on-surface-variant">{m.blurb}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined} className={cn("t-label-md flex h-full items-center whitespace-nowrap border-b py-2 transition-colors", active(n.href) ? "border-primary font-bold text-primary" : "border-transparent text-on-surface-variant hover:text-primary")}>{n.label}</Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center gap-1">
              <span className="t-label-sm mr-1 hidden rounded bg-surface-container px-2.5 py-1.5 text-on-surface sm:inline-block" title="Prices shown in Indian Rupees">INR ₹</span>
              <button type="button" aria-label="Search the studio" className={ib} onClick={() => setSearch(true)}><Search size={19} /></button>
              <Link href="/wishlist" aria-label={`Wishlist${ready && wl ? `, ${wl} items` : ""}`} className={ib}><Heart size={19} />{ready && <Badge n={wl} tone="bg-tertiary-container text-on-tertiary" />}</Link>
              <button type="button" aria-label={`Open bag${ready ? `, ${cartCount(items)} items` : ""}`} className={ib} onClick={() => setCart(true)}><ShoppingBag size={19} />{ready && <Badge n={cartCount(items)} tone="bg-primary text-on-primary" bump={bump} />}</button>
              <Link href="/track-order" aria-label="Track an order" className={cn(ib, "hidden sm:flex")}><User size={19} /></Link>
              <button type="button" aria-label="Open menu" aria-expanded={menuOpen} className={cn(ib, "lg:hidden")} onClick={() => setMenu(true)}><Menu size={21} /></button>
            </div>
          </div>
        </header>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div className="fixed inset-0 z-[85] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm" onClick={() => setMenu(false)} aria-hidden />
            <motion.aside role="dialog" aria-modal="true" aria-label="Menu" data-lenis-prevent initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }} className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-surface p-6 shadow-l2">
              <div className="flex items-center justify-between"><span className="t-headline-sm text-primary">Little Things</span><button type="button" aria-label="Close menu" onClick={() => setMenu(false)} className={ib}><X size={20} /></button></div>
              <nav className="mt-8 flex flex-col" aria-label="Mobile">
                {NAV.map((n, i) => (
                  <motion.div key={n.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                    <Link href={n.href} className={cn("flex items-center justify-between border-b border-primary/10 py-4 font-serif text-2xl", active(n.href) ? "text-on-tertiary-container" : "text-primary")}>{n.label}</Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <Link href="/wishlist" className="btn btn-soft">Wishlist</Link>
                <Link href="/track-order" className="btn btn-soft">Track order</Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
