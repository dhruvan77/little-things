import type { Metadata } from "next";
import Link from "next/link";
import { Accordion, Breadcrumb } from "@/components/ui";
import { FAQS } from "@/data/site";
export const metadata: Metadata = { title: "FAQs", description: "Answers about personalisation, shipping, care and returns at Little Things Studio." };
export default function Page() {
  const ld = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <div className="px-page mx-auto max-w-3xl py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "FAQs" }]} />
      <h1 className="t-display-lg mt-6 mb-8 text-primary" data-anim="up">Frequently asked questions</h1>
      <Accordion items={FAQS.map((f, i) => ({ id: `q${i}`, title: f.q, content: f.a }))} />
      <p className="t-body-md mt-10 text-on-surface-variant">Still curious? <Link href="/contact" className="link-u text-primary">Write to our concierge</Link>.</p>
    </div>
  );
}
