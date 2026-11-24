"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Info, Loader2, ShoppingBag } from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { useOrder } from "@/store/ui";
import { totals } from "@/lib/pricing";
import { cn, inr } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { SafeImg } from "./SafeImg";
import { Breadcrumb, EmptyState, Skeleton } from "./ui";
import { CouponBox } from "./CartPage";

const STATES = ["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  address: z.string().trim().min(8, "Please enter your full delivery address"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().min(1, "Select a state"),
  pin: z.string().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code"),
  delivery: z.enum(["standard", "express", "scheduled"]),
  note: z.string().max(200).optional(),
});
type F = z.infer<typeof schema>;

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="t-label-sm mb-1.5 block text-on-surface-variant">{label}</label>{children}<p id={`${id}-err`} role="alert" className="t-label-sm mt-1 min-h-4 normal-case tracking-normal text-error">{error}</p></div>;
}

export function CheckoutForm() {
  const ready = useHydrated();
  const router = useRouter();
  const items = useCart((s) => s.items);
  const coupon = useCart((s) => s.coupon);
  const clear = useCart((s) => s.clear);
  const setOrder = useOrder((s) => s.setOrder);
  const [placing, setPlacing] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema), defaultValues: { delivery: "standard", state: "" }, mode: "onTouched" });
  const delivery = watch("delivery");
  const t = totals(cartSubtotal(items), coupon, delivery === "express");
  const inv = (k: keyof F) => ({ "aria-invalid": !!errors[k], "aria-describedby": `${k}-err` });

  const onSubmit = async (d: F) => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 1400));
    const ref = `LTS-${Date.now().toString(36).toUpperCase().slice(-6)}${Math.floor(10 + Math.random() * 89)}`;
    setOrder({ ref, placedAt: new Date().toISOString(), items, subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, total: t.total, coupon, delivery: d.delivery, customer: { name: d.name, email: d.email, phone: d.phone, address: d.address, city: d.city, state: d.state, pin: d.pin } });
    clear();
    router.push("/order-confirmation");
  };
  const onInvalid = () => toast.error("Please fix the highlighted fields.");

  if (!ready) return <div className="px-page py-12"><Skeleton className="h-96" /></div>;
  if (items.length === 0 && !placing) return <div className="px-page py-16"><EmptyState icon={<ShoppingBag size={26} />} title="Nothing to check out" body="Your bag is empty. Add a gift or two first." cta="Shop all gifts" href="/shop" /></div>;

  return (
    <div className="px-page py-8 lg:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Bag", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="t-display-lg mt-6 mb-6 text-primary">Checkout</h1>
      <div role="note" className="mb-8 flex gap-3 rounded-lg border border-terracotta/40 bg-tertiary-fixed/50 p-4"><Info size={18} className="mt-0.5 shrink-0 text-on-tertiary-container" /><p className="t-body-sm text-primary"><strong>Demo checkout.</strong> No real order or payment is processed. Please do not enter real card details. Use any fictional address.</p></div>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <fieldset className="card p-6"><legend className="sr-only">Contact</legend><h2 className="t-headline-sm mb-4 text-primary">Contact</h2>
            <div className="grid gap-x-4 sm:grid-cols-2">
              <Field id="name" label="Full name" error={errors.name?.message}><input id="name" autoComplete="name" className="field" {...inv("name")} {...register("name")} /></Field>
              <Field id="phone" label="Mobile number" error={errors.phone?.message}><input id="phone" inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="9876543210" className="field" {...inv("phone")} {...register("phone")} /></Field>
              <div className="sm:col-span-2"><Field id="email" label="Email" error={errors.email?.message}><input id="email" type="email" autoComplete="email" className="field" {...inv("email")} {...register("email")} /></Field></div>
            </div></fieldset>
          <fieldset className="card p-6"><legend className="sr-only">Delivery address</legend><h2 className="t-headline-sm mb-4 text-primary">Delivery address</h2>
            <div className="grid gap-x-4 sm:grid-cols-2">
              <div className="sm:col-span-2"><Field id="address" label="Address" error={errors.address?.message}><input id="address" autoComplete="street-address" className="field" {...inv("address")} {...register("address")} /></Field></div>
              <Field id="city" label="City" error={errors.city?.message}><input id="city" autoComplete="address-level2" className="field" {...inv("city")} {...register("city")} /></Field>
              <Field id="state" label="State" error={errors.state?.message}><select id="state" className="field" {...inv("state")} {...register("state")}><option value="">Select state</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field id="pin" label="PIN code" error={errors.pin?.message}><input id="pin" inputMode="numeric" maxLength={6} autoComplete="postal-code" className="field" {...inv("pin")} {...register("pin")} /></Field>
            </div></fieldset>
          <fieldset className="card p-6"><legend className="t-headline-sm mb-4 text-primary">Delivery preference</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {([["standard", "Standard", "3 to 6 days", "Free above ₹999"], ["express", "Express", "1 to 2 days", "+ ₹199"], ["scheduled", "Gift-timed", "Pick a date by note", "Same as standard"]] as const).map(([v, l, d, p]) => (
                <label key={v} className={cn("cursor-pointer rounded-lg border p-4 transition-all", delivery === v ? "border-primary bg-surface-container-low" : "border-primary/10 hover:border-primary/30")}><input type="radio" value={v} className="sr-only" {...register("delivery")} /><span className="font-serif text-base text-primary">{l}</span><span className="t-body-sm block text-on-surface-variant">{d}</span><span className="t-label-sm text-on-tertiary-container">{p}</span></label>
              ))}
            </div>
            <div className="mt-4"><label htmlFor="note" className="t-label-sm mb-1.5 block text-on-surface-variant">Delivery note (optional)</label><input id="note" className="field" placeholder="e.g. Deliver on 14 Feb, ring the bell twice" {...register("note")} /></div>
          </fieldset>
        </div>
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="card space-y-4 p-6">
            <h2 className="t-headline-sm text-primary">Order Summary</h2>
            <ul className="max-h-64 space-y-3 overflow-y-auto" data-lenis-prevent>{items.map((i) => <li key={i.key} className="flex gap-3"><div className="relative h-16 w-14 shrink-0 overflow-hidden rounded"><SafeImg src={i.image} alt="" className="h-full w-full object-cover" /><span className="t-label-sm absolute -right-0 -top-0 rounded-bl bg-primary px-1.5 text-[10px] text-white">{i.qty}</span></div><div className="min-w-0 flex-1"><p className="truncate font-serif text-sm font-semibold text-primary">{i.name}</p><p className="t-label-sm truncate normal-case tracking-normal text-on-surface-variant">{i.summary}</p></div><span className="t-label-md tracking-normal">{inr(i.unitPrice * i.qty)}</span></li>)}</ul>
            <CouponBox />
            <dl className="t-body-sm space-y-2 border-t border-primary/10 pt-4 text-on-surface-variant">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
              {t.discount > 0 && <div className="flex justify-between text-on-secondary-container"><dt>Discount</dt><dd>- {inr(t.discount)}</dd></div>}
              <div className="flex justify-between"><dt>Shipping</dt><dd>{t.shipping === 0 ? "Free" : inr(t.shipping)}</dd></div>
            </dl>
            <div className="flex items-end justify-between border-t border-primary/10 pt-4"><span className="t-label-md text-on-surface-variant">Total</span><span className="t-headline-md text-primary">{inr(t.total)}</span></div>
            <button type="submit" disabled={placing} className="btn btn-primary w-full">{placing ? <><Loader2 size={16} className="animate-spin" />Placing demo order...</> : "Place demo order"}</button>
            <Link href="/cart" className="t-label-sm link-u block text-center text-on-surface-variant">Back to bag</Link>
          </div>
        </aside>
      </form>
    </div>
  );
}
