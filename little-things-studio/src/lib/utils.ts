export function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(" ");
}
const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
export const inr = (n: number) => fmt.format(n);
export const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
export const discountPct = (price: number, original?: number) =>
  original && original > price ? Math.round(((original - price) / original) * 100) : 0;
