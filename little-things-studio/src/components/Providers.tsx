"use client";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useOrder } from "@/store/ui";
import { Preloader } from "./Preloader";
import { SmoothScroll } from "./SmoothScroll";
import { PageFX } from "./PageFX";
import { Cursor } from "./Cursor";
import { CartDrawer } from "./CartDrawer";
import { SearchOverlay } from "./SearchOverlay";
import { QuickView } from "./QuickView";
import { BackToTop } from "./ui";

export function Providers() {
  useEffect(() => { useCart.persist.rehydrate(); useWishlist.persist.rehydrate(); useOrder.persist.rehydrate(); }, []);
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <PageFX />
      <Cursor />
      <CartDrawer />
      <SearchOverlay />
      <QuickView />
      <BackToTop />
      <Toaster position="bottom-right" closeButton={false} toastOptions={{ className: "!font-sans" }} />
    </>
  );
}
