import type { Metadata } from "next";
import { TrackOrder } from "@/components/TrackOrder";
import { Breadcrumb } from "@/components/ui";
export const metadata: Metadata = { title: "Track Your Parcel (Demo)", robots: { index: false } };
export default function Page() {
  return (<div className="px-page mx-auto max-w-xl py-8 lg:py-12"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Track order" }]} /><h1 className="t-display-lg mt-6 mb-3 text-primary">Track your parcel</h1><p className="t-body-md mb-8 text-on-surface-variant">Enter the reference from your demo order confirmation.</p><TrackOrder /></div>);
}
