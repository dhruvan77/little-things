/**
 * Mini confetti burst at the last pointer position (used on "Add to bag").
 * Uses the Web Animations API with transform/opacity only; self-cleaning.
 */
let lx = 0, ly = 0, bound = false;
function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  const f = (e: PointerEvent) => { lx = e.clientX; ly = e.clientY; };
  window.addEventListener("pointerdown", f, { passive: true });
  window.addEventListener("pointermove", f, { passive: true });
}
if (typeof window !== "undefined") bind();

export function confettiBurst(count = 22) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cs = getComputedStyle(document.documentElement);
  const cols = ["--color-terracotta", "--color-blush", "--color-sage", "--color-tertiary-fixed-dim"].map((v) => cs.getPropertyValue(v).trim() || "#c98c58");
  const x0 = lx || window.innerWidth / 2, y0 = ly || window.innerHeight / 2;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const s = 5 + Math.random() * 6;
    Object.assign(el.style, { position: "fixed", left: `${x0}px`, top: `${y0}px`, width: `${s}px`, height: `${s * (Math.random() > 0.5 ? 1 : 2.2)}px`, background: cols[i % cols.length], borderRadius: Math.random() > 0.6 ? "50%" : "1px", pointerEvents: "none", zIndex: "300", willChange: "transform, opacity" });
    document.body.appendChild(el);
    const a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 90;
    const dx = Math.cos(a) * d, dy = Math.sin(a) * d - 50;
    const anim = el.animate(
      [{ transform: "translate(-50%,-50%) rotate(0deg) scale(1)", opacity: 1 }, { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 90}px)) rotate(${Math.random() * 720 - 360}deg) scale(.6)`, opacity: 0 }],
      { duration: 700 + Math.random() * 500, easing: "cubic-bezier(.15,.7,.3,1)", fill: "forwards" }
    );
    anim.onfinish = () => el.remove();
  }
}
