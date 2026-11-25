import type { Metadata } from "next";
import Link from "next/link";
import { Leaf, PenTool, Hammer } from "lucide-react";
import { IMG, IMG_ALT } from "@/data/products";
import { SafeImg } from "@/components/SafeImg";
import { SplitText } from "@/components/SplitText";

export const metadata: Metadata = { title: "Our Story", description: "Little Things Studio is a Jaipur atelier making personalised keepsakes with generational craftspeople." };
export default function Page() {
  return (
    <>
      <section className="px-page grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
        <div><p className="t-label-md text-on-tertiary-container" data-anim="up">Our Story</p><SplitText as="h1" className="t-display-xl mt-2 text-primary" parts={[{ t: "Small things." }, { br: true, t: "" }, { t: "Big feelings.", em: true }]} />
          <p className="t-body-lg mt-6 text-on-surface-variant" data-anim="up">We founded Little Things Studio on a simple realisation: in an era of mass consumption, the gifts that remain treasured for decades are those imbued with deep intentionality and personal identity.</p>
          <p className="t-body-md mt-4 text-on-surface-variant" data-anim="up">Every ceramic vessel is hand-poured in small batches, leather covers are shaped by master saddle-makers in Rajasthan, and every initial is struck individually with authentic 24-karat gold foil.</p></div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-l2" data-anim="clip"><SafeImg eager src={IMG(20)} alt={IMG_ALT(20)} className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" data-parallax="6" /></div>
      </section>
      <section className="px-page grid gap-6 pb-16 md:grid-cols-3" data-stagger>
        {[[Hammer, "Artisan Led", "Preserving time-honoured Indian craft traditions."], [Leaf, "Zero Plastic", "100% compostable boxes, raw pine and cotton ribbons."], [PenTool, "Calligraphy Included", "Every box features our studio scribe's handwritten note."]].map(([I, t, d]) => { const Icon = I as typeof Leaf; return <div key={t as string} data-stagger-item className="card p-6"><Icon size={24} className="text-on-tertiary-container" /><h2 className="t-headline-sm mt-3 text-primary">{t as string}</h2><p className="t-body-sm mt-2 text-on-surface-variant">{d as string}</p></div>; })}
      </section>
      <section className="px-page pb-20 text-center"><Link href="/shop" className="btn btn-primary">Explore the collection</Link></section>
    </>
  );
}
