export const NAV = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop", mega: true },
  { label: "Bespoke Collections", href: "/collections" },
  { label: "Personalisation Studio", href: "/customise" },
  { label: "Build a Hamper", href: "/hamper" },
  { label: "Corporate Gifting", href: "/collections/corporate-gifting" },
  { label: "Our Story", href: "/about" },
];
export const MEGA = [
  { group: "Drinkware & Mugs", title: "Personalised Tumblers", blurb: "Custom monogrammed thermal steel & ceramics.", href: "/collections/mugs-tumblers" },
  { group: "Stationery", title: "Leather Journals", blurb: "Gold-foil debossed full-grain keepsake diaries.", href: "/collections/leather-journals" },
  { group: "Signature Hampers", title: "Curated Gift Boxes", blurb: "Hand-tied ribboned keepsake trunk curations.", href: "/collections/keepsake-hampers" },
  { group: "Weddings", title: "Bridesmaid Sets", blurb: "Silken robes, champagne flutes & tags.", href: "/collections/wedding-favours" },
  { group: "Everyday Luxury", title: "Keepsake Keychains", blurb: "Solid brass and hand-stitched saddle leather.", href: "/collections/keychains-accessories" },
];
export const ANNOUNCE = ["Free shipping above ₹999 across India", "Thoughtfully personalised gifts", "Handcrafted with love in our Jaipur & Mumbai studios", "Make every occasion memorable"];
export const COUPONS: Record<string, { label: string; type: "pct" | "flat" | "ship"; value: number; min?: number }> = {
  LITTLE10: { label: "10% off your order", type: "pct", value: 10 },
  WELCOME500: { label: "₹500 off orders above ₹2,500", type: "flat", value: 500, min: 2500 },
  FLAT200: { label: "₹200 off orders above ₹1,000", type: "flat", value: 200, min: 1000 },
  FREESHIP: { label: "Free delivery", type: "ship", value: 0 },
};
export const FAQS = [
  { q: "How long does personalisation take?", a: "Most pieces are crafted and dispatched within 48 hours. Hampers and bulk orders take 3 to 5 business days." },
  { q: "Can I engrave in Hindi or other regional scripts?", a: "Yes. We regularly engrave in Devanagari, Bengali, Urdu and Gurmukhi. Paste your text into the name field, or select Custom Inscription at checkout." },
  { q: "Is the personalised tumbler dishwasher and microwave safe?", a: "Because of the 24k metallic foil layer we advise gentle hand-washing with a soft sponge. Please do not microwave foil-embellished drinkware." },
  { q: "Can I change my text after ordering?", a: "Our concierge sends a confirmation summary before any engraving matrix is cut. Changes are free within 6 hours of ordering." },
  { q: "Do you ship directly to the recipient?", a: "Yes. Invoices and price tags are never placed inside the parcel, so it arrives as a clean gift." },
  { q: "What is your return policy?", a: "Personalised items are made to order and cannot be returned, but we will remake any piece with a craft defect at no cost. Ready-to-ship items can be returned within 7 days." },
  { q: "Is this a real store?", a: "This is a frontend demonstration. No real orders, payments or personal data are processed." },
];
export const TESTIMONIALS = [
  { quote: "The gold foil embossing on the cognac leather journal brought my sister to tears on her graduation day. The raw paper texture is divine. Exceeded every expectation.", name: "Ananya Deshmukh", meta: "Purchased: Artisan Leather Journal • Mumbai", img: 22 },
  { quote: "Ordered 45 custom monogrammed tumblers for our leadership summit in Udaipur. Delivered seamlessly within 5 days, perfectly packaged with our executives' initials.", name: "Rohit Singhania", meta: "Purchased: Corporate Welcome Suite • Delhi", img: 23 },
  { quote: "The bespoke bridal hamper was the highlight of my best friend's bachelorette morning. The wax-sealed handwritten letter alone made it feel like a royal heirloom.", name: "Kavya Mehta", meta: "Purchased: Signature Golden Trunk • Bangalore", img: 24 },
];
export const HAMPER_BOXES = [
  { id: "pine", name: "Natural Pine Trunk", price: 0, cap: 6, note: "Free with every hamper", hex: "#D8B98A" },
  { id: "walnut", name: "Smoked Walnut Chest", price: 450, cap: 6, note: "Deep-stained, brass clasp", hex: "#6B4A32" },
  { id: "linen", name: "Hardbound Linen Box", price: 300, cap: 4, note: "Magnetic lid, cotton lined", hex: "#E9DFD0" },
];
export const HAMPER_CARDS = [
  { id: "letterpress", name: "Letterpress Card", price: 0 },
  { id: "botanical", name: "Botanical Deckle Card", price: 120 },
  { id: "calligraphy", name: "Hand-Calligraphed Card", price: 250 },
];
export const HAMPER_WRAPS = [
  { id: "terracotta", name: "Terracotta Raw Silk Ribbon", price: 0, hex: "#C98C58" },
  { id: "blush", name: "Blush Satin & Wax Seal", price: 150, hex: "#E9BFC1" },
  { id: "sage", name: "Sage Linen & Brass Tag", price: 150, hex: "#B9C6B1" },
];
export const INFO_PAGES: Record<string, { title: string; body: string[] }> = {
  "shipping-policy": { title: "Shipping Policy", body: ["Free standard shipping on orders above ₹999 across India; ₹99 below that. Express delivery is available for ₹199 extra.", "Personalised items are dispatched within 48 hours, and hampers within 3 to 5 business days. Delivery usually takes 2 to 6 days after dispatch.", "This is a demo store, so no parcels will actually be shipped."] },
  terms: { title: "Terms & Conditions", body: ["This website is a frontend demonstration of a personalised gifting store. No real transactions take place.", "Product names, prices, reviews and testimonials are fictional and for illustration only.", "Do not enter real card details or sensitive personal information anywhere on this site."] },
  privacy: { title: "Privacy Policy", body: ["This demo stores your cart, wishlist and demo order in your own browser's local storage only. Nothing is sent to a server.", "You can clear this at any time by clearing your browser's site data."] },
  returns: { title: "Care & Returns", body: ["Personalised items are made to order and cannot be returned, but we remake any piece with a craft defect.", "Ready-to-ship items can be returned within 7 days in original packaging.", "Hand-wash all foil-embellished drinkware with a soft sponge."] },
};
