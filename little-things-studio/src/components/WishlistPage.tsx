"use client";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { getProductById } from "@/data/products";
import { useWishlist } from "@/store/wishlist";
import { addProduct } from "@/lib/cart-actions";
import { inr } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { ProductCard } from "./ProductCard";
import { Breadcrumb, EmptyState, Skeleton } from "./ui";

export function WishlistPage() {
  const ready = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const prods = ids.map(getProductById).filter(Boolean) as NonNullable<ReturnType<typeof getProductById>>[];
  const moveAll = () => { let n = 0; prods.forEach((p) => { if (p.personalisation.type === "none" || true) { if (p.stock !== "out") { addProduct(p); remove(p.id); n++; } } }); if (!n) toast.error("Nothing available to move."); };
  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <div className="mt-6 mb-10 flex flex-wrap items-end justify-between gap-4"><h1 className="t-display-lg text-primary">Your Wishlist</h1>{ready && prods.length > 0 && <button type="button" className="btn btn-primary" onClick={moveAll}>Move all to bag ({inr(prods.filter((p) => p.stock !== "out").reduce((a, p) => a + p.price, 0))})</button>}</div>
      {!ready ? <Skeleton className="h-64" /> : prods.length === 0 ? (
        <EmptyState icon={<Heart size={26} />} title="Nothing saved yet" body="Tap the heart on any gift to save it here for later." cta="Discover gifts" href="/shop" />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">{prods.map((p, i) => <div key={p.id} className="flex flex-col gap-2"><ProductCard product={p} index={i} />{p.stock !== "out" && <button type="button" className="btn btn-secondary !py-3" onClick={() => { if (addProduct(p)) { remove(p.id); } }}>Move to bag</button>}</div>)}</div>
          <p className="t-body-sm mt-8 text-on-surface-variant">Moving a piece adds it with default options. Want to personalise it? <Link className="link-u text-primary" href="/customise">Open the studio</Link>.</p>
        </>
      )}
    </div>
  );
}
