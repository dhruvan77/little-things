"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { HAMPER_ITEMS, getProduct } from "@/data/products";
import { HAMPER_BOXES, HAMPER_CARDS, HAMPER_WRAPS } from "@/data/site";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { notifyAdded } from "@/lib/cart-actions";
import { cn, inr } from "@/lib/utils";
import { SafeImg } from "./SafeImg";
import { Breadcrumb } from "./ui";

const STEPS = ["Keepsake Box", "Choose 3-6 Gifts", "Letterpress Card", "Silk Ribbon & Seal"];
const MIN = 3;

export function HamperBuilder() {
  const sp = useSearchParams();
  const router = useRouter();
  const pre = (sp.get("items") ?? "").split(",").map((s) => getProduct(s)).filter((p) => p?.hamperEligible).map((p) => p!.id);
  const [step, setStep] = useState(0);
  const [boxId, setBoxId] = useState("pine");
  const [ids, setIds] = useState<string[]>(pre);
  const [cardId, setCardId] = useState("letterpress");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [wrapId, setWrapId] = useState("terracotta");
  const [error, setError] = useState("");
  const box = HAMPER_BOXES.find((b) => b.id === boxId)!;
  const card = HAMPER_CARDS.find((c) => c.id === cardId)!;
  const wrap = HAMPER_WRAPS.find((w) => w.id === wrapId)!;
  const items = ids.map((i) => HAMPER_ITEMS.find((p) => p.id === i)!).filter(Boolean);
  const itemsTotal = items.reduce((a, p) => a + p.price, 0);
  const total = itemsTotal + box.price + card.price + wrap.price;

  const toggle = (id: string) => { setError(""); setIds((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= box.cap ? (toast.error(`The ${box.name} holds up to ${box.cap} gifts.`), cur) : [...cur, id]); };
  const pickBox = (id: string) => { const b = HAMPER_BOXES.find((x) => x.id === id)!; setBoxId(id); setIds((c) => c.slice(0, b.cap)); };
  const validate = (s: number) => {
    if (s === 1 && ids.length < MIN) return `Choose at least ${MIN} gifts (${ids.length} selected).`;
    if (s === 2 && !recipient.trim()) return "Please add the recipient's name for the card.";
    return "";
  };
  const next = () => { const e = validate(step); if (e) return setError(e); setError(""); setStep((s) => Math.min(3, s + 1)); };
  const finish = () => {
    for (const s of [1, 2]) { const e = validate(s); if (e) { setStep(s); return setError(e); } }
    const snap = { boxId, itemIds: ids, cardId, message, recipient, wrapId };
    useCart.getState().add({ productId: "custom-hamper", slug: "hamper", name: `Custom Gift Hamper for ${recipient.trim()}`, image: items[0].images[0], unitPrice: total, hamper: snap, summary: `${box.name} • ${items.length} gifts • ${wrap.name}` });
    useUI.getState().bumpCart();
    notifyAdded(`Custom Hamper for ${recipient.trim()}`, total, items[0].images[0], `${items.length} gifts`);
    router.push("/cart");
  };
  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Build a Hamper" }]} />
      <header className="mt-6 max-w-2xl" data-anim="up"><p className="t-label-md text-on-tertiary-container">Interactive Gifting Concierge</p><h1 className="t-display-lg mt-1 text-primary">Build a Hamper That Speaks Their Language</h1><p className="t-body-md mt-3 text-on-surface-variant">Curate an unforgettable unboxing in four intuitive steps. Hand-packed in our Jaipur studio with handwritten notes.</p></header>

      <ol className="mt-8 grid grid-cols-4 gap-2" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s}><button type="button" onClick={() => i <= step && setStep(i)} disabled={i > step} aria-current={i === step ? "step" : undefined} className="w-full text-left">
            <span className={cn("block h-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-outline-variant")} />
            <span className="mt-2 flex items-center gap-2"><span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold", i < step ? "bg-secondary text-white" : i === step ? "bg-primary-container text-white" : "bg-surface-container-high text-outline")}>{i < step ? <Check size={12} /> : i + 1}</span><span className={cn("t-label-sm hidden sm:block", i === step ? "text-primary" : "text-outline")}>{s}</span></span>
          </button></li>
        ))}
      </ol>
      <span className="sr-only" role="status">Step {step + 1} of 4, {progress}% complete</span>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
              {step === 0 && (
                <div role="radiogroup" aria-label="Select keepsake box" className="grid gap-4 sm:grid-cols-3">
                  {HAMPER_BOXES.map((b) => (
                    <button key={b.id} type="button" role="radio" aria-checked={boxId === b.id} onClick={() => pickBox(b.id)} className={cn("card flex flex-col items-center gap-3 p-5 text-center transition-all hover:-translate-y-1", boxId === b.id && "!border-primary ring-1 ring-primary")}>
                      <span className="flex h-24 w-32 items-center justify-center rounded" style={{ background: b.hex }}><span className="h-full w-4 bg-terracotta/70" /></span>
                      <span className="font-serif text-lg text-primary">{b.name}</span><span className="t-body-sm text-on-surface-variant">{b.note}. Holds {b.cap} gifts.</span><span className="t-label-md text-on-tertiary-container">{b.price ? `+ ${inr(b.price)}` : "Free"}</span>
                    </button>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div>
                  <p className="t-label-md mb-4 text-on-surface-variant" aria-live="polite">{ids.length} of {box.cap} gifts selected{ids.length === MIN - 1 ? " • add 1 more to continue" : ""}</p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {HAMPER_ITEMS.map((p) => {
                      const on = ids.includes(p.id);
                      return (
                        <motion.button whileTap={{ scale: 0.97 }} key={p.id} type="button" aria-pressed={on} onClick={() => toggle(p.id)} className={cn("card overflow-hidden text-left transition-all", on && "!border-primary ring-1 ring-primary")}>
                          <div className="relative aspect-[4/5] bg-surface-container-low"><SafeImg src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                            <span className={cn("t-label-sm absolute left-2 top-2 flex items-center gap-1 rounded px-2 py-1", on ? "bg-primary-container text-white" : "bg-white/90 text-primary")}>{on ? <><Check size={11} />Added</> : <><Plus size={11} />Add</>}</span></div>
                          <div className="p-3"><p className="font-serif text-sm font-semibold leading-tight text-primary">{p.name}</p><p className="t-label-sm mt-1 normal-case tracking-normal text-on-surface-variant">{inr(p.price)}</p></div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-6">
                  <div role="radiogroup" aria-label="Greeting card" className="grid gap-3 sm:grid-cols-3">{HAMPER_CARDS.map((c) => <button key={c.id} type="button" role="radio" aria-checked={cardId === c.id} onClick={() => setCardId(c.id)} className={cn("card p-4 text-left transition-all", cardId === c.id && "!border-primary ring-1 ring-primary")}><span className="font-serif text-base text-primary">{c.name}</span><span className="t-label-sm mt-1 block text-on-tertiary-container">{c.price ? `+ ${inr(c.price)}` : "Included"}</span></button>)}</div>
                  <div><label htmlFor="rec" className="t-label-sm mb-1.5 block text-on-surface-variant">Recipient&rsquo;s name</label><input id="rec" className="field" maxLength={30} value={recipient} onChange={(e) => { setRecipient(e.target.value); setError(""); }} placeholder="e.g. Anna" aria-invalid={!!error && step === 2} /></div>
                  <div><div className="mb-1.5 flex justify-between"><label htmlFor="hmsg" className="t-label-sm text-on-surface-variant">Personal message</label><span className="t-label-sm text-outline">{message.length} / 200</span></div><textarea id="hmsg" rows={4} maxLength={200} className="field resize-none font-serif italic" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write something only you could say..." /></div>
                </div>
              )}
              {step === 3 && (
                <div role="radiogroup" aria-label="Wrapping" className="grid gap-3 sm:grid-cols-3">{HAMPER_WRAPS.map((w) => <button key={w.id} type="button" role="radio" aria-checked={wrapId === w.id} onClick={() => setWrapId(w.id)} className={cn("card flex flex-col items-center gap-3 p-5 text-center transition-all hover:-translate-y-1", wrapId === w.id && "!border-primary ring-1 ring-primary")}><span className="h-14 w-14 rounded-full border border-primary/10 shadow-inner" style={{ background: w.hex }} /><span className="font-serif text-base text-primary">{w.name}</span><span className="t-label-md text-on-tertiary-container">{w.price ? `+ ${inr(w.price)}` : "Complimentary"}</span></button>)}</div>
              )}
            </motion.div>
          </AnimatePresence>
          <p role="alert" className="t-body-sm mt-4 min-h-5 text-error">{error}</p>
          <div className="mt-2 flex items-center justify-between gap-3">
            <button type="button" className="btn btn-secondary" onClick={() => { setError(""); setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0}><ArrowLeft size={14} />Back</button>
            {step < 3 ? <button type="button" className="btn btn-primary" onClick={next}>Continue<ArrowRight size={14} /></button> : <button type="button" className="btn btn-primary" onClick={finish}>Add hamper to bag • {inr(total)}</button>}
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start" aria-label="Your curated trunk">
          <div className="card overflow-hidden">
            <div className="relative aspect-[5/4] p-6" style={{ background: "radial-gradient(90% 70% at 50% 30%, #fffaf2, #efe6d6)" }}>
              <div className="relative mx-auto flex h-full w-[86%] items-center justify-center rounded-md shadow-l2 transition-colors duration-500" style={{ background: box.hex }}>
                <div className="grid w-[82%] grid-cols-3 gap-1.5">
                  <AnimatePresence>{items.map((p) => <motion.div key={p.id} layout initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} className="group relative aspect-square overflow-hidden rounded bg-white shadow-sm"><SafeImg src={p.images[0]} alt={p.name} className="h-full w-full object-cover" /><button type="button" aria-label={`Remove ${p.name}`} onClick={() => toggle(p.id)} className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100"><X size={11} /></button></motion.div>)}</AnimatePresence>
                  {items.length === 0 && <p className="col-span-3 py-6 text-center font-serif italic text-on-surface-variant">Your trunk is waiting...</p>}
                </div>
                <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 opacity-90 transition-colors" style={{ background: wrap.hex }} aria-hidden />
                <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-md transition-colors" style={{ background: wrap.hex }} aria-hidden />
              </div>
            </div>
            <div className="space-y-2 p-5">
              <div className="flex items-center justify-between"><h2 className="t-headline-sm text-primary">Your Curated Trunk</h2><span className="t-label-sm text-on-surface-variant">{items.length} of {box.cap}</span></div>
              <dl className="t-body-sm space-y-1.5 text-on-surface-variant">
                <div className="flex justify-between"><dt>{box.name}</dt><dd>{box.price ? inr(box.price) : "Free"}</dd></div>
                {items.map((p) => <div key={p.id} className="flex justify-between gap-3"><dt className="truncate">{p.name}</dt><dd>{inr(p.price)}</dd></div>)}
                <div className="flex justify-between"><dt>{card.name}</dt><dd>{card.price ? inr(card.price) : "Included"}</dd></div>
                <div className="flex justify-between"><dt>{wrap.name}</dt><dd>{wrap.price ? inr(wrap.price) : "Complimentary"}</dd></div>
              </dl>
              <div className="flex items-end justify-between border-t border-primary/10 pt-3"><span className="t-label-md text-on-surface-variant">Box total</span><motion.span key={total} initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="t-headline-md text-primary">{inr(total)}</motion.span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
