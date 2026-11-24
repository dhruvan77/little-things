# Little Things Studio

A frontend-only personalised gifting store built from the Google Stitch export (Atelier Editorial Luxury design system).
**Demo project: no backend, no real payments, no real orders.**

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production
```
Requires Node 20+.

## Deploy

- **Vercel (easiest):** push to GitHub, import the repo, accept the defaults.
- **Netlify / any Node host:** `npm run build`, then `npm start`.
- Update `metadataBase` in `src/app/layout.tsx` to your real domain.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS 4, Motion for React, GSAP + ScrollTrigger, Lenis, Zustand, React Hook Form + Zod, Sonner, Lucide.

## Structure

- `src/data/` products (30), categories, personalisation options, site copy, coupons, `images.json` (Stitch image URLs)
- `src/store/` Zustand stores (cart, wishlist, UI, last order), persisted to localStorage
- `src/lib/pricing.ts` totals, shipping and coupon logic
- `src/components/` UI. Animation layer: `SmoothScroll`, `PageFX`, `Preloader`, `Cursor`, `Magnetic`, `SplitText`
- `src/app/` routes

## Animation hooks

`PageFX` scans each page for data attributes: `data-anim` (up, left, right, fade, scale, clip, words), `data-stagger` / `data-stagger-item`, `data-parallax`, `data-counter`, `data-bg`, `data-hscroll`. GSAP owns those elements; product cards use Motion only. Everything is skipped under `prefers-reduced-motion`; the pinned horizontal gallery is desktop-only.

## Demo coupons

`LITTLE10` (10% off), `FLAT200` (₹200 off ₹1,000+), `WELCOME500` (₹500 off ₹2,500+), `FREESHIP`.

## Images

All imagery uses the original Stitch-hosted Google image URLs (hotlinked). They may expire; each image has a styled fallback. To self-host, download the URLs listed in `src/data/images.json` into `public/images/` and point the `src` values there.
