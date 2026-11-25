import type { Metadata } from "next";
import { Suspense } from "react";
import { HamperBuilder } from "@/components/HamperBuilder";
import { Skeleton } from "@/components/ui";
export const metadata: Metadata = { title: "Build a Hamper", description: "Choose a keepsake box, hand-pick gifts, add a card and silk ribbon, and watch your hamper come together live." };
export default function Page() { return <Suspense fallback={<div className="px-page py-12"><Skeleton className="h-[500px]" /></div>}><HamperBuilder /></Suspense>; }
