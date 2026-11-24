import Link from "next/link";
import { ArrowRight, ArrowUpRight, Gift, PenTool, Star, Truck } from "lucide-react";
import { CATEGORIES, IMG, IMG_ALT, PRODUCTS } from "@/data/products";
import { TESTIMONIALS } from "@/data/site";
import { SafeImg } from "@/components/SafeImg";
import { SplitText } from "@/components/SplitText";
import { Magnetic } from "@/components/Magnetic";
import { Bestsellers, HamperConcierge, StudioTeaser } from "@/components/home/Interactive";
import { inr } from "@/lib/utils";

const MOMENTS = [
  { t: "Birthdays", d: "Monogrammed pieces that get used every single morning.", img: 25, href: "/shop?occasion=Birthday" },
  { t: "Weddings", d: "Bridal party suites, silk robes and wax-sealed letters.", img: 26, href: "/collections/wedding-favours" },
  { t: "Housewarmings", d: "Stoneware candles and pine trunks for new beginnings.", img: 27, href: "/shop?occasion=Housewarming" },
  { t: "Corporate", d: "Branded onboarding and gala hampers that feel considered.", img: 28, href: "/collections/corporate-gifting" },
  { t: "Anniversaries", d: "Names, dates and notes that stay with the gift for life.", img: 29, href: "/shop?occasion=Anniversary" },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="px-page relative grid items-center gap-10 pb-16 pt-6 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-10">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-10 h-72 w-72 animate-float rounded-full bg-blush/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 animate-float rounded-full bg-sage/40 blur-3xl [animation-delay:2s]" />
        <div className="relative z-10 flex flex-col gap-6">
          <p className="t-label-sm flex w-fit items-center gap-2 rounded bg-surface-container px-3 py-1.5 text-on-tertiary-container" data-anim="fade"><Star size={12} className="fill-current" />The Bespoke Autumn Collection</p>
          <SplitText as="h1" className="t-display-xl text-primary" parts={[{ t: "Gifts that feel like they were" }, { br: true, t: "" }, { t: "made just for them.", em: true }]} />
          <p className="t-body-lg max-w-lg text-on-surface-variant" data-anim="up" data-delay="0.3">Thoughtfully personalised, beautifully packed, and handcrafted in India. Add a name, a message, a monogram, and turn an everyday object into a keepsake.</p>
          <div className="flex flex-wrap gap-3" data-anim="up" data-delay="0.45">
            <Magnetic><Link href="/shop" className="btn btn-primary group">Explore collection<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link></Magnetic>
            <Magnetic><Link href="/#hamper-builder" className="btn btn-secondary">Create your own gift</Link></Magnetic>
          </div>
          <dl className="mt-4 grid max-w-md grid-cols-3 gap-4 border-t border-primary/10 pt-6" data-anim="up" data-delay="0.55">
            <div><dt className="t-label-sm text-on-surface-variant">Made-to-order</dt><dd className="font-serif text-2xl text-primary"><span data-counter="100" data-suffix="%">100%</span></dd></div>
            <div><dt className="t-label-sm text-on-surface-variant">Foil stamping</dt><dd className="font-serif text-2xl text-primary"><span data-counter="24" data-suffix="k">24k</span></dd></div>
            <div><dt className="t-label-sm text-on-surface-variant">Dispatch in</dt><dd className="font-serif text-2xl text-primary"><span data-counter="48" data-suffix=" hrs">48 hrs</span></dd></div>
          </dl>
        </div>
        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-l2" data-anim="clip"><SafeImg eager src={IMG(1)} alt={IMG_ALT(1)} className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" data-parallax="6" /></div>
          <div className="absolute -bottom-5 -left-3 hidden animate-float items-center gap-3 rounded-lg border border-primary/5 bg-white/95 p-3 shadow-l2 backdrop-blur sm:flex md:-left-8"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-container"><PenTool size={16} /></span><div><p className="t-label-sm text-on-surface-variant">Live foil monogramming</p><p className="font-serif text-sm text-primary">A.M Ceramic Tumbler • {inr(1650)}</p></div></div>
          <div className="absolute -right-2 top-6 hidden animate-float items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-l2 [animation-delay:1.5s] sm:flex"><Truck size={14} className="text-on-secondary-container" /><span className="t-label-sm">Free shipping ₹999+</span></div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="px-page py-16 lg:py-24" aria-labelledby="col-h">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="t-label-md text-on-tertiary-container" data-anim="up">Curated Collections</p><SplitText as="h2" className="t-headline-lg mt-1 text-primary" parts={[{ t: "Shop by Bespoke Category" }]} /></div><Link href="/shop" className="t-label-md link-u text-primary">View full catalogue ({PRODUCTS.length})</Link></div>
        <h2 id="col-h" className="sr-only">Collections</h2>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4" data-stagger>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} data-stagger-item data-cursor="Explore" className="group relative block overflow-hidden rounded-lg">
              <div className="aspect-[4/5] overflow-hidden bg-surface-container-low"><SafeImg src={IMG(c.image)} alt={IMG_ALT(c.image)} className="h-full w-full object-cover transition-transform duration-[700ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.07]" /></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
              {c.tag && <span className="t-label-sm absolute left-3 top-3 rounded bg-white/90 px-2 py-1">{c.tag}</span>}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white"><div><h3 className="font-serif text-lg leading-tight">{c.name}</h3><p className="t-label-sm mt-1 normal-case tracking-normal text-white/80">From {inr(c.from)}</p></div><ArrowUpRight size={18} className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></div>
            </Link>
          ))}
        </div>
      </section>

      <Bestsellers />
      <StudioTeaser />
      <HamperConcierge />

      {/* PINNED HORIZONTAL GIFTING MOMENTS */}
      <section data-hscroll className="relative overflow-hidden bg-surface-container-low py-16 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0" aria-labelledby="mom-h">
        <div className="px-page mb-8 flex items-end justify-between"><div><p className="t-label-md text-on-tertiary-container">Gifting Moments</p><h2 id="mom-h" className="t-headline-lg mt-1 text-primary">For every little occasion.</h2></div><p className="t-label-sm hidden text-on-surface-variant lg:block">Scroll to explore</p></div>
        <div className="overflow-x-auto px-5 max-lg:snap-x max-lg:snap-mandatory lg:overflow-visible lg:px-16" data-lenis-prevent-touch>
          <div data-hscroll-track className="flex w-max gap-6 pr-6">
            {MOMENTS.map((m, i) => (
              <Link key={m.t} href={m.href} data-cursor="Explore" className="group relative block w-[78vw] shrink-0 snap-center overflow-hidden rounded-xl sm:w-[52vw] lg:w-[34vw] lg:max-w-[520px]">
                <div className="aspect-[4/5] lg:aspect-[5/6]"><SafeImg src={IMG(m.img)} alt={IMG_ALT(m.img)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="t-label-sm text-white/70">0{i + 1}</p><h3 className="t-headline-md">{m.t}</h3><p className="t-body-sm mt-1 max-w-xs text-white/85">{m.d}</p></div>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-page mt-8 hidden lg:block"><div className="h-px w-full bg-outline-variant"><div data-hscroll-progress className="h-full origin-left scale-x-0 bg-primary" /></div></div>
      </section>

      {/* CRAFT */}
      <section className="px-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-28" data-bg="#ece5da" aria-labelledby="craft-h">
        <div className="relative"><div className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-l2" data-anim="clip"><SafeImg src={IMG(20)} alt={IMG_ALT(20)} className="absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" data-parallax="6" /></div><div className="absolute -bottom-6 -right-2 hidden w-40 rotate-3 overflow-hidden rounded-lg border-4 border-white shadow-l2 md:block md:-right-8 md:w-48" data-anim="scale"><SafeImg src={IMG(21)} alt={IMG_ALT(21)} className="aspect-square w-full object-cover" /></div></div>
        <div className="flex flex-col gap-5">
          <p className="t-label-md text-on-tertiary-container">Craft Philosophy</p>
          <SplitText as="h2" className="t-headline-lg text-primary" parts={[{ t: "Small things." }, { t: "Big feelings.", em: true }]} />
          <p className="t-body-lg text-on-surface-variant" data-anim="up">We founded Little Things Studio on a simple realisation: in an era of mass consumption, the gifts that remain treasured for decades are those imbued with deep intentionality and personal identity.</p>
          <p className="t-body-md text-on-surface-variant" data-anim="up">Every ceramic vessel is hand-poured, leather covers are shaped by master saddle-makers, and every initial is struck individually with authentic 24-karat gold foil.</p>
          <div className="mt-2 grid grid-cols-3 gap-4 border-t border-primary/10 pt-6">
            {[["Artisan led", 18, "+", "years of craft"], ["Zero plastic", 100, "%", "compostable boxes"], ["Handwritten", 12000, "+", "notes penned"]].map(([t, n, s, d]) => <div key={t as string}><p className="font-serif text-3xl text-primary"><span data-counter={n as number} data-suffix={s as string}>{n}{s}</span></p><p className="t-label-sm mt-1 text-on-surface-variant">{t as string}</p><p className="t-body-sm text-xs text-outline">{d as string}</p></div>)}
          </div>
          <Link href="/about" className="btn btn-secondary w-fit">Read our story<ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* PRESS */}
      <section className="px-page py-12 text-center" aria-label="As featured in"><p className="t-label-sm text-on-surface-variant" data-anim="fade">As featured in luxury press</p><div className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 font-serif text-xl tracking-widest text-outline" data-stagger>{["VOGUE INDIA", "ELLE DÉCOR", "ARCHITECTURAL DIGEST", "HARPER'S BAZAAR"].map((n) => <span key={n} data-stagger-item>{n}</span>)}</div></section>

      {/* TESTIMONIALS */}
      <section className="px-page py-16 lg:py-24" aria-labelledby="test-h">
        <div className="mb-10 text-center"><p className="t-label-md text-on-tertiary-container" data-anim="up">Unboxing Memories</p><h2 id="test-h" className="t-headline-lg mt-1 text-primary" data-anim="up">Cherished by gift givers</h2></div>
        <div className="grid gap-6 md:grid-cols-3" data-stagger>
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} data-stagger-item className="card flex flex-col gap-4 p-6"><div className="flex gap-0.5" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={14} className="fill-terracotta text-terracotta" />)}</div><blockquote className="font-serif text-lg italic leading-relaxed text-primary">&ldquo;{t.quote}&rdquo;</blockquote><figcaption className="mt-auto flex items-center gap-3"><SafeImg src={IMG(t.img)} alt="" className="h-11 w-11 rounded-full object-cover" /><span><span className="block text-sm font-semibold text-primary">{t.name}</span><span className="t-label-sm normal-case tracking-normal text-on-surface-variant">{t.meta}</span></span></figcaption></figure>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="px-page pb-16 lg:pb-24" aria-labelledby="com-h">
        <div className="mb-6 flex items-end justify-between"><div><p className="t-label-md text-on-tertiary-container">Community &amp; Keepsakes</p><h2 id="com-h" className="t-headline-md mt-1 text-primary">Tagged #LittleThingsStudio</h2></div><span className="t-label-md hidden text-on-surface-variant sm:block">Follow @littlethingsstudio</span></div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5" data-stagger>{[25, 26, 27, 28, 29].map((i) => <div key={i} data-stagger-item className="group aspect-square overflow-hidden rounded-lg"><SafeImg src={IMG(i)} alt={IMG_ALT(i)} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>)}</div>
        <p className="t-label-sm mt-6 flex items-center justify-center gap-2 text-on-surface-variant"><Gift size={14} />Every order arrives gift-ready, with a handwritten note.</p>
      </section>
    </>
  );
}
