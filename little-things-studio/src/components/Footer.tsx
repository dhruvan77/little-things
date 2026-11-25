import Link from "next/link";
import { Mail, MapPin, Clock } from "lucide-react";

const COLS: { title: string; links: [string, string][] }[] = [
  { title: "Curated Gifting", links: [["Festive Collections", "/shop?sort=new"], ["Wedding Favours", "/collections/wedding-favours"], ["Housewarming Trunks", "/shop?occasion=Housewarming"], ["Anniversary Keepsakes", "/shop?occasion=Anniversary"], ["New Born Welcome", "/collections/keepsake-hampers"]] },
  { title: "Bespoke Services", links: [["Monogramming Atelier", "/customise"], ["Custom Box Builder", "/hamper"], ["Corporate Programmes", "/collections/corporate-gifting"], ["Bulk Wedding Orders", "/contact"], ["Gift Calligraphy", "/collections/stationery-notes"]] },
  { title: "Customer Care", links: [["Studio Concierge", "/contact"], ["Shipping & Dispatch", "/info/shipping-policy"], ["Personalisation FAQs", "/faq"], ["Track Your Parcel", "/track-order"], ["Care & Returns", "/info/returns"]] },
];
export function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-surface-container-low">
      <div className="px-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <p className="t-headline-sm text-primary">Little Things Studio</p>
          <p className="t-body-sm max-w-xs text-on-surface-variant">Made personal. Made memorable. Designing soulful bespoke keepsakes and artisanal gift trunks handcrafted by generational craftsmen in India.</p>
          <ul className="t-body-sm space-y-2 text-on-surface-variant">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" aria-hidden />Studio: 44, Civil Lines • C-Scheme, Jaipur 302001</li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" aria-hidden /><a className="link-u" href="mailto:concierge@littlethingsstudio.in">concierge@littlethingsstudio.in</a></li>
            <li className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0" aria-hidden />Mon to Sat, 10am to 7pm IST</li>
          </ul>
          <span className="t-label-sm w-fit rounded bg-sage/40 px-2 py-1 text-primary">Demo store: no real orders</span>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h2 className="t-label-md mb-4 text-primary">{c.title}</h2>
            <ul className="space-y-2.5">{c.links.map(([l, h]) => <li key={l}><Link href={h} className="t-body-sm link-u text-on-surface-variant transition-colors hover:text-primary">{l}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="px-page t-label-sm flex flex-col items-center justify-between gap-3 border-t border-primary/10 py-5 text-on-surface-variant sm:flex-row">
        <span>© 2026 Little Things Studio. Frontend demo project.</span>
        <span className="flex gap-4"><Link href="/info/terms" className="link-u">Terms</Link><Link href="/info/privacy" className="link-u">Privacy</Link><Link href="/info/shipping-policy" className="link-u">Shipping</Link></span>
      </div>
    </footer>
  );
}
