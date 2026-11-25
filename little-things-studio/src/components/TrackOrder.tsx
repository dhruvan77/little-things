"use client";
import { useState } from "react";
import { Check, PackageSearch } from "lucide-react";
import { useOrder } from "@/store/ui";
import { cn } from "@/lib/utils";

const STAGES = ["Order placed", "Crafting in studio", "Quality proof check", "Dispatched", "Delivered"];
export function TrackOrder() {
  const order = useOrder((s) => s.order);
  const [ref, setRef] = useState("");
  const [res, setRes] = useState<number | "none" | null>(null);
  const submit = (e: React.FormEvent) => { e.preventDefault(); const r = ref.trim().toUpperCase(); if (!r) return setRes("none"); const known = order?.ref === r; const stage = known ? 1 : /^LTS-/.test(r) ? (r.length % 4) + 1 : -1; setRes(stage < 0 ? "none" : stage); };
  return (
    <div>
      <form onSubmit={submit} className="flex gap-2" noValidate><label htmlFor="ref" className="sr-only">Order reference</label><input id="ref" className="field uppercase" placeholder="e.g. LTS-AB12CD34" value={ref} onChange={(e) => { setRef(e.target.value); setRes(null); }} /><button className="btn btn-primary">Track</button></form>
      <div role="status" className="mt-6">
        {res === "none" && <p className="t-body-sm flex items-center gap-2 text-error"><PackageSearch size={16} />We couldn&rsquo;t find that reference. Demo references start with LTS-.</p>}
        {typeof res === "number" && <ol className="space-y-3">{STAGES.map((s, i) => <li key={s} className="flex items-center gap-3"><span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs", i <= res ? "bg-secondary text-white" : "bg-surface-container-high text-outline")}>{i <= res ? <Check size={14} /> : i + 1}</span><span className={cn("t-body-md", i <= res ? "text-primary" : "text-outline")}>{s}</span></li>)}</ol>}
      </div>
    </div>
  );
}
