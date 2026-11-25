import type { Metadata } from "next";
import Link from "next/link";
import { PRODUCTS, getProduct } from "@/data/products";
import { ProductDetail } from "@/components/ProductDetail";

export function generateStaticParams() { return PRODUCTS.map((p) => ({ slug: p.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Product not found" };
  return { title: p.name, description: p.description, openGraph: { title: p.name, description: p.description, images: [p.images[0]], type: "website" } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return (
    <section className="px-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center"><h1 className="t-headline-lg text-primary">We couldn&rsquo;t find that piece</h1><p className="t-body-md text-on-surface-variant">It may have been retired from the collection.</p><Link href="/shop" className="btn btn-primary">Browse all gifts</Link></section>
  );
  const ld = { "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, image: p.images, aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount }, offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: p.stock === "out" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" } };
  return (<><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} /><ProductDetail p={p} /></>);
}
