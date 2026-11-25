/* eslint-disable react-hooks/set-state-in-effect -- intentional: sync local form state when the product or edited cart line changes */
"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { BadgeCheck, Check, Clock, Save, Share2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS, getProduct } from "@/data/products";
import { DESIGNS, FONTS, INKS, MESSAGE_MAX, NAME_MAX, PACKAGING, STUDIO_TYPES, SUBLINE_MAX, defaultCustomisation } from "@/data/personalisation";
import type { Customisation } from "@/data/types";
import { defaultVariants, unitPriceFor } from "@/lib/pricing";
import { addCustomised } from "@/lib/cart-actions";
import { cn, inr } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useHydrated } from "@/hooks/useHydrated";
import { Breadcrumb } from "./ui";
import { ProductPreview, engravingText, inkStyle } from "./ProductPreview";

const personalisable = PRODUCTS.filter((p) => p.personalisation.type !== "none");
const DEFAULT_SLUG = "the-sandstone-tumbler";

function Section({ n, title, aside, children }: { n: number; title: string; aside?: string; children: React.ReactNode }) {
  return (
    <section className="card p-5 md:p-6" aria-labelledby={`sec-${n}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={`sec-${n}`} className="flex items-center gap-3 font-serif text-xl text-primary"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-container font-sans text-xs text-inverse-on-surface">{n}</span>{title}</h2>
        {aside && <span className="t-label-sm text-on-tertiary-container">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

export function Customiser() {
  const router = useRouter();
  const sp = useSearchParams();
  const ready = useHydrated();
  const items = useCart((s) => s.items);
  const setCart = useUI((s) => s.setCart);
  const slug = sp.get("product") ?? DEFAULT_SLUG;
  const editKey = sp.get("edit");
  const product = getProduct(slug) && getProduct(slug)!.personalisation.type !== "none" ? getProduct(slug)! : getProduct(DEFAULT_SLUG)!;

  const [c, setC] = useState<Customisation>(() => {
    const base = defaultCustomisation(product.colours[0]?.name);
    try { const raw = sp.get("cfg"); if (raw) return { ...base, ...JSON.parse(raw) }; } catch { /* ignore bad share link */ }
    return base;
  });
  const [vars, setVars] = useState<Record<string, string>>(() => defaultVariants(product));
  const [view, setView] = useState<"front" | "boxed">("front");
  const [tilt, setTilt] = useState(0);
  const [touched, setTouched] = useState(false);
  const [loadedEdit, setLoadedEdit] = useState(false);

  useEffect(() => { // product switched: reset product-specific choices, keep text
    setVars(defaultVariants(product));
    setC((o) => (product.colours.some((x) => x.name === o.glaze) ? o : { ...o, glaze: product.colours[0]?.name ?? "" }));
  }, [product]);
  useEffect(() => { // editing an existing cart line
    if (!editKey || !ready || loadedEdit) return;
    const it = items.find((i) => i.key === editKey);
    if (it?.customisation) {
      setC(it.customisation); if (it.variants) setVars(it.variants); setLoadedEdit(true); }
  }, [editKey, ready, items, loadedEdit]);

  const set = <K extends keyof Customisation>(k: K, v: Customisation[K]) => setC((o) => ({ ...o, [k]: v }));
  const colour = product.colours.find((x) => x.name === c.glaze) ?? product.colours[0];
  const price = unitPriceFor(product, vars, c);
  const pack = PACKAGING.find((p) => p.id === c.packagingId)!;
  const nameError = touched && !c.name.trim() ? "Please enter a name or initials to personalise this piece." : "";
  const sampleName = useMemo(() => c.name.trim() || "Sophia M.", [c.name]);

  const submit = () => {
    setTouched(true);
    if (!c.name.trim()) { document.getElementById("name")?.focus(); toast.error("Add a name or initials first"); return; }
    const ok = addCustomised(product, c, vars, colour.name, editKey ?? undefined);
    if (ok && editKey) router.push("/cart");
  };
  const share = async () => {
    const url = `${location.origin}/customise?product=${product.slug}&cfg=${encodeURIComponent(JSON.stringify(c))}`;
    try { await navigator.clipboard.writeText(url); toast.success("Proof link copied", { description: "Anyone with the link can preview your design." }); } catch { toast.error("Couldn't copy the link"); }
  };
  const save = () => { try { const k = "lts-designs"; const all = JSON.parse(localStorage.getItem(k) ?? "[]"); all.unshift({ slug: product.slug, c, at: Date.now() }); localStorage.setItem(k, JSON.stringify(all.slice(0, 10))); toast.success("Design saved in this browser"); } catch { toast.error("Couldn't save the design"); } };
  const pick = (s: string) => router.replace(`/customise?product=${s}`, { scroll: false });

  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Personalisation Studio", href: "/customise" }, { label: product.name }]} />
      <header className="mt-6 max-w-2xl" data-anim="up">
        <p className="t-label-md text-on-tertiary-container">Bespoke Atelier</p>
        <h1 className="t-display-lg mt-1 text-primary">Product Personalisation Studio</h1>
        <p className="t-body-md mt-3 text-on-surface-variant">See your letters stamped in foil, debossed or engraved before our Jaipuri artisans begin crafting.</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Choose a piece to personalise">
        {STUDIO_TYPES.map((t) => (
          <button key={t.slug} role="tab" aria-selected={product.slug === t.slug} onClick={() => pick(t.slug)} className="chip !py-2.5">{t.label}</button>
        ))}
        <label className="sr-only" htmlFor="other-piece">Other personalisable pieces</label>
        <select id="other-piece" value={product.slug} onChange={(e) => pick(e.target.value)} className="field !w-auto !py-2 text-xs">
          {personalisable.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
        </select>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7 lg:order-1 order-2">
          <Section n={1} title="Monogram & Personalised Copy" aside="Complimentary">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className="mb-1.5 flex justify-between"><label htmlFor="name" className="t-label-sm text-on-surface-variant">Primary initials or full name</label><span className="t-label-sm text-outline">{c.name.length} / {NAME_MAX}</span></div>
                <input id="name" className="field" value={c.name} maxLength={NAME_MAX} placeholder="e.g. Sophia M." aria-invalid={!!nameError} aria-describedby="name-err" onChange={(e) => set("name", e.target.value)} onBlur={() => setTouched(true)} />
                <p id="name-err" role="alert" className="t-label-sm mt-1.5 min-h-4 normal-case tracking-normal text-error">{nameError}</p>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between"><label htmlFor="sub" className="t-label-sm text-on-surface-variant">Optional subline or special year</label><span className="t-label-sm text-outline">{c.subline.length} / {SUBLINE_MAX}</span></div>
                <input id="sub" className="field" value={c.subline} maxLength={SUBLINE_MAX} placeholder="e.g. Est. 2026" onChange={(e) => set("subline", e.target.value)} />
              </div>
              <div>
                <span className="t-label-sm mb-1.5 block text-on-surface-variant">Letter case</span>
                <div className="flex gap-2">{([["caps", "ALL CAPS"], ["title", "Title Case"]] as const).map(([v, l]) => <button key={v} type="button" className="chip flex-1 !py-3" aria-pressed={c.letterCase === v} onClick={() => set("letterCase", v)}>{l}</button>)}</div>
              </div>
            </div>
          </Section>

          <Section n={2} title="Typography Style & Character" aside="Select 1 of 4">
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Typography">
              {FONTS.map((f) => {
                const sel = c.fontId === f.id;
                const sample = engravingText({ ...c, fontId: f.id, name: sampleName }).text;
                return (
                  <button key={f.id} type="button" role="radio" aria-checked={sel} onClick={() => set("fontId", f.id)} className={cn("relative rounded-lg border p-4 text-left transition-all hover:-translate-y-0.5", sel ? "border-primary bg-surface-container-low shadow-l1" : "border-primary/10 bg-white")}>
                    {sel && <Check size={14} className="absolute right-3 top-3 text-primary" />}
                    <span className="t-label-sm text-on-surface-variant">{f.label}</span>
                    <span className="mt-1 block truncate text-2xl text-primary" style={{ fontFamily: f.family, fontStyle: f.style, fontWeight: f.weight, letterSpacing: f.upper ? "0.1em" : 0 }}>{sample}</span>
                    <span className="t-body-sm text-on-surface-variant">{f.note}</span>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section n={3} title="Foil & Inscription Finish">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Finish">
              {INKS.map((i) => (
                <button key={i.id} type="button" role="radio" aria-checked={c.inkId === i.id} onClick={() => set("inkId", i.id)} className={cn("rounded-lg border p-3 text-center transition-all hover:-translate-y-0.5", c.inkId === i.id ? "border-primary bg-surface-container-low shadow-l1" : "border-primary/10 bg-white")}>
                  <span className="block font-serif text-3xl" style={inkStyle(i.id)}>Aa</span>
                  <span className="t-label-sm mt-1 block text-primary">{i.label}</span>
                  <span className="t-body-sm text-xs text-on-surface-variant">{i.note}</span>
                </button>
              ))}
            </div>
            <p className="t-label-sm mb-2 mt-5 text-on-surface-variant">Ornament</p>
            <div className="flex flex-wrap gap-2">{DESIGNS.map((d) => <button key={d.id} type="button" className="chip" aria-pressed={c.designId === d.id} onClick={() => set("designId", d.id)}>{d.label}</button>)}</div>
          </Section>

          <Section n={4} title={`${product.personalisation.type === "tumbler" || product.personalisation.type === "mug" ? "Ceramic Glaze" : "Colour & Size"}`} aside={colour?.name}>
            <div className="flex flex-wrap gap-4">
              {product.colours.map((x) => (
                <button key={x.name} type="button" aria-label={x.name} aria-pressed={c.glaze === x.name} onClick={() => set("glaze", x.name)} className={cn("flex flex-col items-center gap-1.5")}>
                  <span className={cn("block h-11 w-11 rounded-full border border-primary/15 ring-offset-2 transition-all", c.glaze === x.name && "ring-1 ring-terracotta")} style={{ background: x.hex }} />
                  <span className="t-label-sm text-[10px] text-on-surface-variant">{x.name}</span>
                </button>
              ))}
            </div>
            {product.variations.map((v) => (
              <div key={v.id} className="mt-5">
                <p className="t-label-sm mb-2 text-on-surface-variant">{v.label}</p>
                <div className="flex flex-wrap gap-2">{v.options.map((o) => <button key={o.label} type="button" className="chip" aria-pressed={vars[v.id] === o.label} onClick={() => setVars({ ...vars, [v.id]: o.label })}>{o.label}{o.priceDelta ? ` (${o.priceDelta > 0 ? "+" : ""}${inr(o.priceDelta)})` : ""}</button>)}</div>
              </div>
            ))}
          </Section>

          <Section n={5} title="Artisanal Packaging & Note" aside="Included free">
            <div className="space-y-3" role="radiogroup" aria-label="Packaging">
              {PACKAGING.map((p) => (
                <button key={p.id} type="button" role="radio" aria-checked={c.packagingId === p.id} onClick={() => set("packagingId", p.id)} className={cn("flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all", c.packagingId === p.id ? "border-primary bg-surface-container-low" : "border-primary/10 bg-white hover:border-primary/30")}>
                  <span className={cn("mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", c.packagingId === p.id ? "border-primary" : "border-primary/30")}>{c.packagingId === p.id && <span className="h-2 w-2 rounded-full bg-terracotta" />}</span>
                  <span className="flex-1"><span className="flex justify-between gap-3"><span className="font-serif text-base text-primary">{p.label}</span><span className="t-label-sm shrink-0 text-on-tertiary-container">{p.tag}</span></span><span className="t-body-sm text-on-surface-variant">{p.copy}</span></span>
                </button>
              ))}
            </div>
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between"><label htmlFor="msg" className="t-label-sm text-on-surface-variant">Personal gift message (written with fountain pen)</label><span className="t-label-sm text-outline">{c.message.length} / {MESSAGE_MAX}</span></div>
              <textarea id="msg" rows={3} className="field resize-none font-serif italic" maxLength={MESSAGE_MAX} value={c.message} placeholder="May your morning coffee be as warm and bright as your spirit. Love always, Anna." onChange={(e) => set("message", e.target.value)} />
            </div>
          </Section>
        </div>

        <aside className="order-1 lg:order-2 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <div className="card overflow-hidden p-3 md:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="t-label-sm flex items-center gap-1.5 text-on-secondary-container"><span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />Live proof simulation</span>
                <div className="flex gap-1.5" role="tablist" aria-label="Preview angle">
                  {(["front", "boxed"] as const).map((v) => <button key={v} role="tab" aria-selected={view === v} className="chip !px-3 !py-1.5 !text-[10px]" onClick={() => setView(v)}>{v === "front" ? "Front" : "Boxed"}</button>)}
                </div>
              </div>
              <ProductPreview type={product.personalisation.type} colourHex={colour?.hex ?? "#E3D6C1"} c={c} view={view} tilt={tilt} label={product.name} />
              {view === "front" && (
                <div className="mt-3 flex items-center gap-3 px-1">
                  <label htmlFor="tilt" className="t-label-sm text-on-surface-variant">360° tilt</label>
                  <input id="tilt" type="range" min={-35} max={35} value={tilt} onChange={(e) => setTilt(Number(e.target.value))} className="h-1 flex-1 accent-primary" />
                </div>
              )}
              <p className="t-label-sm mt-3 flex items-center justify-center gap-1.5 text-center text-on-surface-variant"><BadgeCheck size={13} />Jaipur Atelier • Proof #4092</p>
            </div>
            <div className="card mt-4 p-5">
              <h2 className="font-serif text-lg text-primary">{product.name}</h2>
              <dl className="t-body-sm mt-3 space-y-2 text-on-surface-variant">
                <div className="flex justify-between"><dt>Base piece</dt><dd>{inr(product.price)}</dd></div>
                {Object.entries(vars).map(([k, v]) => { const d = product.variations.find((x) => x.id === k)?.options.find((o) => o.label === v)?.priceDelta; return d ? <div key={k} className="flex justify-between"><dt>{v}</dt><dd>{d > 0 ? "+" : ""}{inr(d)}</dd></div> : null; })}
                <div className="flex justify-between"><dt>{product.personalisation.craft || "Personalisation"}</dt><dd className="text-on-secondary-container">Complimentary</dd></div>
                {pack.price > 0 && <div className="flex justify-between"><dt>{pack.label}</dt><dd>{inr(pack.price)}</dd></div>}
              </dl>
              <div className="mt-4 flex items-end justify-between border-t border-primary/10 pt-4"><span className="t-label-md text-on-surface-variant">Total investment</span><motion.span key={price} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="t-headline-md text-primary">{inr(price)}</motion.span></div>
              <button type="button" className="btn btn-primary mt-4 w-full" onClick={submit} disabled={product.stock === "out"}><ShoppingBag size={16} />{editKey ? "Update personalised piece" : product.stock === "out" ? "Sold out" : "Add personalised piece to bag"}</button>
              <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" className="btn btn-secondary !px-3 !py-3" onClick={save}><Save size={14} />Save design</button><button type="button" className="btn btn-secondary !px-3 !py-3" onClick={share}><Share2 size={14} />Share proof</button></div>
              <p className="t-label-sm mt-3 flex items-center justify-center gap-1.5 normal-case tracking-normal text-on-surface-variant"><Clock size={13} />Handcrafted and dispatched within 48 hours</p>
              {ready && items.length > 0 && <button type="button" onClick={() => setCart(true)} className="t-label-sm link-u mx-auto mt-3 block text-primary">View my bag</button>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
