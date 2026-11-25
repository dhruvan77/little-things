"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

/** Remote image with graceful fallback if the source fails to load. */
export function SafeImg({ src, alt, className, eager, ...rest }: { src: string; alt: string; className?: string; eager?: boolean } & Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">) {
  const [failed, setFailed] = useState(false);
  if (failed || !src)
    return (
      <div role="img" aria-label={alt} className={cn("flex items-center justify-center bg-gradient-to-br from-surface-container-high to-surface-container-highest text-on-surface-variant", className)}>
        <span className="font-serif text-lg italic opacity-60">Little Things</span>
      </div>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading={eager ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} {...rest} />
  );
}
