export type CategorySlug =
  | "mugs-tumblers" | "bottles-flasks" | "leather-journals" | "keepsake-hampers"
  | "wedding-favours" | "corporate-gifting" | "keychains-accessories" | "stationery-notes" | "home-desk";

export type PreviewType = "tumbler" | "mug" | "bottle" | "journal" | "card" | "box" | "keychain" | "robe" | "none";
export type Audience = "her" | "him" | "wedding" | "work";

export interface Review { author: string; city: string; rating: number; title: string; body: string; date: string }
export interface Variation { id: string; label: string; options: { label: string; priceDelta?: number }[] }
export interface Product {
  id: string; slug: string; name: string; category: CategorySlug; description: string;
  price: number; originalPrice?: number; images: string[];
  colours: { name: string; hex: string }[]; variations: Variation[];
  personalisation: { type: PreviewType; craft: string };
  specs: [string, string][]; rating: number; reviewCount: number; reviews: Review[];
  bestseller: boolean; isNew: boolean; stock: "in" | "low" | "out"; stockCount: number;
  tags: string[]; occasions: string[]; audience: Audience[]; badge?: string; perk?: string; hamperEligible?: boolean;
}
export interface Customisation {
  name: string; subline: string; message: string; fontId: string; inkId: string; designId: string;
  packagingId: string; glaze: string; letterCase: "caps" | "title";
}
export interface HamperSnapshot {
  boxId: string; itemIds: string[]; cardId: string; message: string; recipient: string; wrapId: string;
}
