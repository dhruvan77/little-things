/**
 * Lightweight CSS/SVG gift box: poster behind the 3D canvas while it loads, and the full
 * fallback on mobile, reduced-motion or no-WebGL. The story timeline animates
 * [data-css-lid] and [data-css-bow] directly.
 */
export function CssGiftBox({ lifted = false }: { lifted?: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-[min(62vw,340px)]" aria-hidden>
      <div className="absolute inset-x-[10%] bottom-[8%] h-[8%] rounded-[50%] bg-black/15 blur-xl" />
      <div className="absolute inset-x-[12%] bottom-[14%] h-[46%] rounded-md bg-surface-container-high shadow-l2"><div className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2 bg-terracotta" /></div>
      <div data-css-lid className="absolute inset-x-[8%] bottom-[56%] h-[17%] rounded-md bg-surface-container-highest shadow-md" style={lifted ? { transform: "translateY(-70%) rotate(-10deg)" } : undefined}>
        <div className="absolute inset-y-0 left-1/2 w-[15%] -translate-x-1/2 bg-terracotta" />
        <svg data-css-bow viewBox="0 0 120 70" className="absolute -top-[70%] left-1/2 w-[46%] -translate-x-1/2 text-terracotta" style={lifted ? { opacity: 0 } : undefined} fill="currentColor"><path d="M60 50C40 6 6 4 12 30c4 18 34 22 48 20Z" /><path d="M60 50C80 6 114 4 108 30c-4 18-34 22-48 20Z" /><circle cx="60" cy="50" r="8" /></svg>
      </div>
      {[["12%", "20%", "0s"], ["84%", "34%", ".6s"], ["22%", "70%", "1.1s"], ["74%", "78%", "1.6s"], ["52%", "8%", "2.1s"]].map(([l, t, d], i) => <span key={i} className="absolute h-1.5 w-1.5 rounded-full bg-tertiary-fixed-dim" style={{ left: l, top: t, animation: `twinkle 2.6s ease-in-out ${d} infinite` }} />)}
    </div>
  );
}
