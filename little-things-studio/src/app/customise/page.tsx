import type { Metadata } from "next";
import { Suspense } from "react";
import { Gift, MailCheck, Sparkles } from "lucide-react";
import { Customiser } from "@/components/Customiser";
import { Accordion, Skeleton } from "@/components/ui";
import { FAQS } from "@/data/site";

export const metadata: Metadata = { title: "Personalisation Studio", description: "Design your own engraved tumbler, journal, flask or keepsake box with a live preview before it is crafted." };

const STANDARD = [
  { icon: Sparkles, t: "Permanent Thermal Bonding", d: "Our 24k metallic foils and blind debossing are cured at 180°C with pressure-locked matrices, guaranteed against peeling or dulling under gentle care." },
  { icon: MailCheck, t: "Digital Atelier Proof Check", d: "Spotted a typo after ordering? Our concierge sends a final confirmation summary before any engraving matrix is cut. Changes are free within 6 hours." },
  { icon: Gift, t: "Gift-Ready Direct Dispatch", d: "Sending directly to the recipient? Invoices and price tags are never placed inside the package." },
];
export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="px-page py-12"><Skeleton className="h-[480px]" /></div>}><Customiser /></Suspense>
      <section className="px-page py-16" data-bg="#f9f3eb" aria-labelledby="std-h">
        <p className="t-label-md text-on-tertiary-container">The Studio Standard</p>
        <h2 id="std-h" className="t-headline-lg mt-1 text-primary">Impeccable Craft, Guaranteed.</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3" data-stagger>
          {STANDARD.map(({ icon: I, t, d }) => (
            <div key={t} data-stagger-item className="card p-6"><I size={22} className="text-on-tertiary-container" /><h3 className="t-headline-sm mt-3 text-primary">{t}</h3><p className="t-body-sm mt-2 text-on-surface-variant">{d}</p></div>
          ))}
        </div>
        <div className="mx-auto mt-12 max-w-3xl"><Accordion defaultOpen={null} items={FAQS.slice(0, 3).map((f, i) => ({ id: `f${i}`, title: f.q, content: f.a }))} /></div>
      </section>
    </>
  );
}
