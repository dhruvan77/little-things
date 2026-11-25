"use client";
import type { CSSProperties } from "react";
import type { Customisation, PreviewType } from "@/data/types";
import { DESIGNS, FONTS, INKS, PACKAGING } from "@/data/personalisation";

const titleCase = (s: string) => s.toLowerCase().replace(/(^|\s|\.)\S/g, (m) => m.toUpperCase());
const initials = (s: string) => s.split(/\s+/).filter(Boolean).map((w) => w[0].toUpperCase()).join(" • ") || "A • M";

export function engravingText(c: Customisation) {
  const font = FONTS.find((f) => f.id === c.fontId) ?? FONTS[0];
  const raw = c.name.trim() || "Your Name";
  let t = font.id === "heritage-emblem" ? initials(c.name.trim() || "Anna M") : c.letterCase === "caps" ? raw.toUpperCase() : titleCase(raw);
  if (font.upper && font.id !== "heritage-emblem") t = t.toUpperCase();
  return { text: t, font, empty: !c.name.trim() };
}
export function inkStyle(inkId: string): CSSProperties {
  const ink = INKS.find((i) => i.id === inkId) ?? INKS[0];
  if (!ink.foil) return { color: "rgba(30,24,16,0.28)", textShadow: "0 1px 0 rgba(255,255,255,0.45), 0 -1px 0 rgba(0,0,0,0.18)" };
  return { backgroundImage: ink.foil, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" };
}
const inkStroke = (inkId: string) => (inkId === "blind" ? "rgba(30,24,16,0.28)" : INKS.find((i) => i.id === inkId)?.hex ?? "#B98A2E");

function Ornament({ id, ink, w }: { id: string; ink: string; w: number }) {
  const s = inkStroke(ink);
  if (id === "sprig") return <svg viewBox="0 0 120 24" width={w} height={w / 5} fill="none" stroke={s} strokeWidth="1.2" strokeLinecap="round" aria-hidden><path d="M8 12 C 40 2, 80 22, 112 12" /><path d="M36 8 q4 -6 9 -3 M62 14 q4 6 10 3 M86 8 q3 -6 9 -4" /><circle cx="60" cy="12" r="1.6" fill={s} /></svg>;
  if (id === "stars") return <svg viewBox="0 0 120 24" width={w} height={w / 5} fill={s} aria-hidden><path d="M20 12l1.6 3.4 3.6.4-2.7 2.5.8 3.6L20 20l-3.3 1.9.8-3.6-2.7-2.5 3.6-.4z" transform="scale(.8) translate(8 -4)" /><path d="M60 4l2 4.2 4.5.5-3.4 3.1 1 4.5L60 14l-4.1 2.3 1-4.5-3.4-3.1 4.5-.5z" /><path d="M100 12l1.6 3.4 3.6.4-2.7 2.5.8 3.6L100 20l-3.3 1.9.8-3.6-2.7-2.5 3.6-.4z" transform="scale(.8) translate(24 -4)" /></svg>;
  return null;
}

function Engraving({ c, size, maxW = "86%", lines = true }: { c: Customisation; size: number; maxW?: string; lines?: boolean }) {
  const { text, font, empty } = engravingText(c);
  const len = Math.max(4, text.length);
  const fs = Math.min(size, (size * 9) / len + size * 0.35);
  return (
    <div className="flex flex-col items-center text-center" style={{ maxWidth: maxW }}>
      {c.designId !== "frame" && <Ornament id={c.designId} ink={c.inkId} w={size * 6} />}
      <div style={{ fontFamily: font.family, fontStyle: font.style, fontWeight: font.weight, fontSize: `${fs}cqw`, lineHeight: 1.15, letterSpacing: font.upper ? "0.12em" : "0", opacity: empty ? 0.45 : 1, wordBreak: "break-word", ...inkStyle(c.inkId) }}>{text}</div>
      {lines && c.subline.trim() && <div style={{ fontFamily: "var(--font-sans)", fontSize: `${size * 0.26}cqw`, letterSpacing: "0.22em", textTransform: "uppercase", marginTop: `${size * 0.12}cqw`, ...inkStyle(c.inkId) }}>{c.subline}</div>}
    </div>
  );
}
const Frame = ({ ink, children }: { ink: string; children: React.ReactNode }) => (
  <div className="relative flex items-center justify-center" style={{ border: `1px solid ${inkStroke(ink)}`, outline: `1px solid ${inkStroke(ink)}`, outlineOffset: 3, padding: "6% 8%" }}>{children}</div>
);

const sheen = "linear-gradient(90deg, rgba(0,0,0,.12), rgba(255,255,255,.22) 28%, rgba(255,255,255,.04) 55%, rgba(0,0,0,.14))";

function Body({ type, hex, c }: { type: PreviewType; hex: string; c: Customisation }) {
  const framed = c.designId === "frame";
  const eng = (size: number, maxW?: string) => (framed ? <Frame ink={c.inkId}><Engraving c={c} size={size} maxW={maxW} /></Frame> : <Engraving c={c} size={size} maxW={maxW} />);
  switch (type) {
    case "mug":
      return (
        <div className="relative" style={{ width: "46%" }}>
          <div className="absolute -right-[22%] top-[18%] h-[52%] w-[34%] rounded-r-full border-[10px]" style={{ borderColor: hex, borderLeft: "none" }} />
          <div className="relative flex aspect-[1/0.95] items-center justify-center rounded-b-[2rem] rounded-t-md shadow-l2" style={{ background: `${sheen}, ${hex}`, backgroundBlendMode: "overlay, normal" }}>{eng(7.2, "78%")}</div>
        </div>
      );
    case "bottle":
      return (
        <div className="relative flex flex-col items-center" style={{ width: "26%" }}>
          <div className="h-[9cqw] w-[44%] rounded-t-md" style={{ background: "#2a2825" }} />
          <div className="h-[3cqw] w-[58%]" style={{ background: "#3b3833" }} />
          <div className="flex aspect-[1/2.7] w-full items-center justify-center rounded-b-[2.4rem] rounded-t-[1.6rem] shadow-l2" style={{ background: `${sheen}, ${hex}`, backgroundBlendMode: "overlay, normal" }}>{eng(5.6, "86%")}</div>
        </div>
      );
    case "journal":
      return (
        <div className="relative flex aspect-[3/4] items-center justify-center rounded-r-xl rounded-l-md shadow-l2" style={{ width: "44%", background: `linear-gradient(90deg, rgba(0,0,0,.28) 0 4%, rgba(255,255,255,.12) 5% 9%, transparent 10%), ${hex}` }}>
          <div className="absolute inset-y-0 right-[9%] w-[3%] bg-black/20" aria-hidden />
          <div className="ml-[8%]">{eng(7, "74%")}</div>
        </div>
      );
    case "card":
      return (
        <div className="relative flex aspect-[4/3] items-center justify-center bg-[#fbf7ee] shadow-l2" style={{ width: "62%", clipPath: "polygon(0 1%,3% 0,8% 1.2%,14% 0,22% 1%,30% 0,40% 1.2%,52% 0,64% 1%,78% 0,90% 1.2%,100% 0,99% 12%,100% 28%,99% 44%,100% 60%,99% 78%,100% 100%,88% 99%,70% 100%,52% 98.8%,34% 100%,18% 99%,0 100%,1% 80%,0 60%,1% 40%,0 20%)" }}>
          <div className="flex flex-col items-center gap-[2cqw]">{eng(8, "86%")}{c.message.trim() && <p className="px-[6cqw] text-center font-serif italic text-on-surface-variant" style={{ fontSize: "2.4cqw", maxWidth: "36cqw" }}>{c.message}</p>}</div>
        </div>
      );
    case "box":
      return (
        <div className="relative flex aspect-[4/3] items-center justify-center rounded-md shadow-l2" style={{ width: "58%", background: `${sheen}, ${hex}`, backgroundBlendMode: "overlay, normal" }}>
          <div className="absolute inset-x-0 top-[26%] h-px bg-black/20" aria-hidden />
          <div className="absolute inset-y-0 left-1/2 w-[6%] -translate-x-1/2 bg-terracotta/70" aria-hidden />
          <div className="relative rounded px-[3cqw] py-[1.5cqw]" style={{ background: `${hex}` }}>{eng(6, "40cqw")}</div>
        </div>
      );
    case "keychain":
      return (
        <div className="relative flex flex-col items-center" style={{ width: "30%" }}>
          <div className="h-[11cqw] w-[11cqw] rounded-full border-[1.4cqw]" style={{ borderColor: "#B58B3C" }} />
          <div className="-mt-[2cqw] flex aspect-[3/4] w-full items-center justify-center rounded-b-[2.2rem] rounded-t-lg shadow-l2" style={{ background: `${sheen}, ${hex}`, backgroundBlendMode: "overlay, normal", outline: "1px dashed rgba(255,255,255,.4)", outlineOffset: "-8px" }}>{eng(8, "80%")}</div>
        </div>
      );
    case "robe":
      return (
        <div className="relative flex aspect-[5/3] items-end justify-center rounded-xl p-[5cqw] shadow-l2" style={{ width: "66%", background: `radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,.55), transparent 55%), ${hex}` }}>
          <div className="absolute inset-x-0 bottom-0 h-[38%] rounded-b-xl bg-black/5" aria-hidden />
          <div className="relative z-10 pb-[1cqw]">{eng(6, "50cqw")}</div>
        </div>
      );
    default:
      return (
        <div className="relative flex aspect-[3/4.2] items-center justify-center rounded-b-[2.4rem] rounded-t-xl shadow-l2" style={{ width: "36%", background: `${sheen}, ${hex}`, backgroundBlendMode: "overlay, normal" }}>
          <div className="absolute inset-x-0 top-0 h-[9%] rounded-t-xl bg-black/10" aria-hidden />
          {eng(7.4, "82%")}
        </div>
      );
  }
}

export function ProductPreview({ type, colourHex, c, view = "front", tilt = 0, label, className = "" }: { type: PreviewType; colourHex: string; c: Customisation; view?: "front" | "boxed"; tilt?: number; label?: string; className?: string }) {
  const pack = PACKAGING.find((p) => p.id === c.packagingId) ?? PACKAGING[0];
  const ribbon = pack.id === "wax-note" ? "#B76E79" : pack.id === "linen-trunk" ? "#8f9a86" : "#C98C58";
  const box = pack.id === "linen-trunk" ? "#E3D9C6" : "#F5EEDD";
  const t = type === "tumbler" || type === "none" ? "tumbler" : type;
  return (
    <div className={`relative flex aspect-[5/4] w-full items-center justify-center overflow-hidden rounded-xl ${className}`} style={{ containerType: "inline-size", background: "radial-gradient(90% 70% at 50% 35%, #fffaf2, #efe6d6 70%, #e6dccb)" }} role="img" aria-label={`Live preview of your personalised ${label ?? "gift"}: ${c.name || "no name yet"}`}>
      <div className="absolute bottom-[10%] left-1/2 h-[6%] w-[48%] -translate-x-1/2 rounded-[50%] bg-black/15 blur-xl" aria-hidden />
      <div key={view} className="relative flex h-full w-full items-center justify-center" style={{ perspective: 900, animation: "none" }}>
        {view === "front" ? (
          <div className="flex h-full w-full items-center justify-center transition-transform duration-300" style={{ transform: `rotateY(${tilt}deg)`, transformStyle: "preserve-3d" }}>
            <Body type={t as PreviewType} hex={colourHex} c={c} />
          </div>
        ) : (
          <div className="relative flex aspect-[4/3] items-center justify-center rounded-md shadow-l2" style={{ width: "52%", background: box }}>
            <div className="absolute inset-x-0 top-[28%] h-px bg-black/10" aria-hidden />
            <div className="absolute inset-y-0 left-1/2 w-[8%] -translate-x-1/2" style={{ background: ribbon }} aria-hidden />
            <div className="absolute inset-x-0 top-[44%] h-[8%]" style={{ background: ribbon }} aria-hidden />
            <div className="absolute left-1/2 top-[44%] z-10 h-[11%] w-[11%] -translate-x-1/2 -translate-y-1/4 rounded-full" style={{ background: ribbon, boxShadow: "inset 0 -3px 6px rgba(0,0,0,.25)" }} aria-hidden />
            {pack.id === "wax-note" && <div className="absolute bottom-[12%] right-[10%] z-10 h-[16%] w-[16%] rounded-full bg-[#9c4a3a] shadow-md" aria-hidden />}
            <span className="absolute -bottom-[7%] left-1/2 -translate-x-1/2 rounded bg-white px-3 py-1 font-serif text-[2.4cqw] italic text-primary shadow-md">For {c.name.trim() || "you"}</span>
          </div>
        )}
      </div>
    </div>
  );
}
export { DESIGNS };
