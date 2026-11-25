import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "Page not found" };
export default function NotFound() {
  return (
    <section className="px-page flex min-h-[60vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <p className="t-label-md text-on-tertiary-container">Error 404</p>
      <h1 className="t-display-lg text-primary">This little thing <span className="italic text-on-tertiary-container">went missing.</span></h1>
      <p className="t-body-md max-w-md text-on-surface-variant">The page you are looking for has moved or never existed. Let us help you find something thoughtful instead.</p>
      <div className="flex flex-wrap justify-center gap-3"><Link href="/" className="btn btn-primary">Back to home</Link><Link href="/shop" className="btn btn-secondary">Shop all gifts</Link></div>
    </section>
  );
}
