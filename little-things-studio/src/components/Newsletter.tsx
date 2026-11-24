"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";

const schema = z.object({ email: z.string().min(1, "Please enter your email").email("That email doesn't look right") });
type F = z.infer<typeof schema>;

export function Newsletter() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) });
  const onSubmit = async () => { await new Promise((r) => setTimeout(r, 600)); toast.success("Welcome to the studio", { description: "Use WELCOME500 on orders above ₹2,500. (Demo, no email was sent.)" }); reset(); };
  return (
    <section className="px-page py-16" aria-labelledby="nl-h">
      <div className="gradient-warm mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-xl border border-primary/5 p-8 text-center shadow-l1 md:flex-row md:justify-between md:p-12 md:text-left">
        <div data-anim="up">
          <p className="t-label-sm text-on-tertiary-container">Studio Notes &amp; Privilege</p>
          <h2 id="nl-h" className="t-headline-lg mt-1 text-primary">Get a little more thoughtful.</h2>
          <p className="t-body-sm mt-2 max-w-md text-on-surface-variant">Receive quiet studio notes, exclusive collection releases, and ₹500 off your first bespoke order.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full max-w-sm">
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1"><Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" aria-hidden /><input id="nl-email" type="email" placeholder="Enter your email address" aria-invalid={!!errors.email} className="field !pl-9" {...register("email")} /></div>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? "Joining..." : "Join the Studio"}</button>
          </div>
          {errors.email && <p role="alert" className="t-label-sm mt-2 normal-case tracking-normal text-error">{errors.email.message}</p>}
        </form>
      </div>
    </section>
  );
}
