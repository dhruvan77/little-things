"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { PackageCheck } from "lucide-react";
import { useOrder } from "@/store/ui";
import { inr } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { EmptyState, Skeleton } from "./ui";
import { SafeImg } from "./SafeImg";

function GiftBox() {
  const dots = Array.from({ length: 14 }, (_, i) => i);
  const cols = ["#C98C58", "#E9BFC1", "#B9C6B1", "#B98A2E"];
  return (
    <div className="relative mx-auto h-44 w-44" aria-hidden>
      <div className="absolute bottom-0 left-1/2 h-24 w-36 -translate-x-1/2 rounded-md bg-[#F3E7D3] shadow-l2"><div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-terracotta" /></div>
      <motion.div initial={{ rotateX: 0, y: 0 }} animate={{ rotateX: -110, y: -26 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }} style={{ transformOrigin: "50% 100%", perspective: 400 }} className="absolute bottom-24 left-1/2 h-10 w-40 -translate-x-1/2 rounded-md bg-[#EAD9BC] shadow-md"><div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 bg-terracotta" /></motion.div>
      {dots.map((i) => <motion.span key={i} className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full" style={{ background: cols[i % 4] }} initial={{ opacity: 0, x: 0, y: 20 }} animate={{ opacity: [0, 1, 0], x: Math.cos(i * 0.9) * (60 + (i % 3) * 22), y: -70 - (i % 4) * 22 }} transition={{ delay: 0.9 + i * 0.03, duration: 1.4 }} />)}
    </div>
  );
}

export function OrderConfirmation() {
  const ready = useHydrated();
  const order = useOrder((s) => s.order);
  if (!ready) return <div className="px-page py-12"><Skeleton className="h-96" /></div>;
  if (!order) return <div className="px-page py-16"><EmptyState icon={<PackageCheck size={26} />} title="No recent order" body="Place a demo order to see your confirmation here." cta="Shop all gifts" href="/shop" /></div>;
  return (
    <div className="px-page py-12 lg:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <GiftBox />
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="t-label-md mt-6 text-on-secondary-container">Demo order placed</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="t-display-lg mt-2 text-primary">Thank you, {order.customer.name.split(" ")[0]}.</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }} className="t-body-md mt-3 text-on-surface-variant">Your reference is <strong className="text-primary">{order.ref}</strong>. This was a demonstration, so nothing will be shipped and no payment was taken.</motion.p>
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }} className="card mx-auto mt-10 grid max-w-3xl gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:p-8">
        <ul className="space-y-4">{order.items.map((i) => <li key={i.key} className="flex gap-3"><SafeImg src={i.image} alt="" className="h-20 w-16 shrink-0 rounded object-cover" /><div className="min-w-0 flex-1"><p className="font-serif text-base font-semibold text-primary">{i.name}</p><p className="t-body-sm text-on-surface-variant">{i.summary} • Qty {i.qty}</p></div><span className="t-label-md tracking-normal">{inr(i.unitPrice * i.qty)}</span></li>)}</ul>
        <div className="space-y-4">
          <dl className="t-body-sm space-y-1.5 text-on-surface-variant"><div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>{order.discount > 0 && <div className="flex justify-between"><dt>Discount</dt><dd>- {inr(order.discount)}</dd></div>}<div className="flex justify-between"><dt>Shipping</dt><dd>{order.shipping ? inr(order.shipping) : "Free"}</dd></div><div className="flex justify-between border-t border-primary/10 pt-2 font-bold text-primary"><dt>Total</dt><dd>{inr(order.total)}</dd></div></dl>
          <div className="t-body-sm text-on-surface-variant"><p className="t-label-sm mb-1 text-primary">Delivering to</p><p>{order.customer.name}<br />{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.pin}</p></div>
        </div>
      </motion.div>
      <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/shop" className="btn btn-primary">Continue shopping</Link><Link href="/track-order" className="btn btn-secondary">Track this order</Link></div>
    </div>
  );
}
