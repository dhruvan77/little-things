import type { Customisation, PreviewType } from "./types";

export const FONTS = [
  { id: "royal-serif", label: "Royal Serif", note: "Classical editorial elegance", family: "var(--font-serif)", style: "italic" as const, upper: false, weight: 500 },
  { id: "modern-sans", label: "Modern Sans", note: "Clean architectural layout", family: "var(--font-sans)", style: "normal" as const, upper: true, weight: 600 },
  { id: "amour-script", label: "Amour Script", note: "Flowing romantic signature", family: "'Great Vibes', 'Playfair Display', cursive", style: "normal" as const, upper: false, weight: 400 },
  { id: "heritage-emblem", label: "Heritage Emblem", note: "Understated monogram seal", family: "'Cormorant Garamond', 'Playfair Display', serif", style: "normal" as const, upper: true, weight: 700 },
];
export const INKS = [
  { id: "gold", label: "24k Matte Gold", note: "Warm gleam", hex: "#B98A2E", foil: "linear-gradient(135deg,#8c6420,#e3c26a 45%,#9a7022)" },
  { id: "rose", label: "Rose Gold Luxe", note: "Blush sheen", hex: "#B76E79", foil: "linear-gradient(135deg,#8f4a55,#e6a5a8 45%,#a05b66)" },
  { id: "silver", label: "Sterling Silver", note: "Polished cool", hex: "#8f9399", foil: "linear-gradient(135deg,#6f7378,#dfe2e6 45%,#80848a)" },
  { id: "blind", label: "Blind Engraved", note: "Pure matte", hex: "#00000033", foil: "" },
];
export const DESIGNS = [
  { id: "plain", label: "Plain" },
  { id: "sprig", label: "Botanical Sprig" },
  { id: "frame", label: "Fine Frame" },
  { id: "stars", label: "Starfield" },
];
export const PACKAGING = [
  { id: "ivory-box", label: "Rigid Ivory Studio Box & Terracotta Silk Ribbon", price: 0, tag: "Complimentary", copy: "Heavyweight embossed gift box padded with unbleached cotton tissue and finished with a hand-tied raw silk bow." },
  { id: "wax-note", label: "Handwritten Botanical Note Card & Wax Seal", price: 150, tag: "+ ₹150", copy: "Artisanal 350 GSM deckle-edge paper pressed with botanical vines and sealed with an antique brass terracotta stamp." },
  { id: "linen-trunk", label: "Hardbound Linen Keepsake Box", price: 350, tag: "+ ₹350", copy: "A hardbound linen box with a magnetic lid, lined in raw cotton, made to be kept long after the gift is opened." },
];
export const GLAZES = [
  { name: "Travertine", hex: "#E9DFD0", note: "Speckled stone" },
  { name: "Terracotta", hex: "#C98C58", note: "Warm clay" },
  { name: "French Sage", hex: "#B9C6B1", note: "Soft herbal" },
  { name: "Onyx Black", hex: "#2A2825", note: "Deep basalt" },
];
export const STUDIO_TYPES: { type: PreviewType; label: string; slug: string }[] = [
  { type: "tumbler", label: "Ceramic Tumbler", slug: "the-sandstone-tumbler" },
  { type: "journal", label: "Leather Journal", slug: "artisan-leather-journal" },
  { type: "bottle", label: "Thermal Flask", slug: "minimalist-matte-thermal-flask" },
  { type: "box", label: "Wood Keepsake Box", slug: "keepsake-pine-trunk-hamper" },
];
export const defaultCustomisation = (glaze = "Travertine"): Customisation => ({
  name: "", subline: "", message: "", fontId: "royal-serif", inkId: "gold", designId: "plain",
  packagingId: "ivory-box", glaze, letterCase: "title",
});
export const NAME_MAX = 15;
export const SUBLINE_MAX = 35;
export const MESSAGE_MAX = 140;
