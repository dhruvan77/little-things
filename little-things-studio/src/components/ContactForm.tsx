"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check } from "lucide-react";

const schema = z.object({ name: z.string().trim().min(2, "Please tell us your name"), email: z.string().email("Enter a valid email"), topic: z.string().min(1, "Choose a topic"), message: z.string().trim().min(10, "A few more words please (10+ characters)") });
type F = z.infer<typeof schema>;
export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<F>({ resolver: zodResolver(schema), mode: "onTouched" });
  const onSubmit = async () => { await new Promise((r) => setTimeout(r, 800)); toast.success("Message sent to the concierge", { description: "Demo only: nothing was actually sent." }); reset({}, { keepIsSubmitSuccessful: true }); };
  const E = (k: keyof F) => <p id={`${k}-e`} role="alert" className="t-label-sm mt-1 min-h-4 normal-case tracking-normal text-error">{errors[k]?.message}</p>;
  if (isSubmitSuccessful) return <div className="card flex flex-col items-center gap-3 p-10 text-center"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container"><Check /></span><h2 className="t-headline-sm text-primary">Thank you, we&rsquo;ll be in touch.</h2><p className="t-body-sm text-on-surface-variant">This is a demo form, so no message was sent.</p></div>;
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-1 p-6 md:p-8">
      <div><label htmlFor="c-name" className="t-label-sm mb-1.5 block text-on-surface-variant">Name</label><input id="c-name" className="field" aria-invalid={!!errors.name} aria-describedby="name-e" {...register("name")} />{E("name")}</div>
      <div><label htmlFor="c-email" className="t-label-sm mb-1.5 block text-on-surface-variant">Email</label><input id="c-email" type="email" className="field" aria-invalid={!!errors.email} aria-describedby="email-e" {...register("email")} />{E("email")}</div>
      <div><label htmlFor="c-topic" className="t-label-sm mb-1.5 block text-on-surface-variant">Topic</label><select id="c-topic" className="field" defaultValue="" aria-invalid={!!errors.topic} aria-describedby="topic-e" {...register("topic")}><option value="">Select a topic</option><option>Personalisation help</option><option>Corporate or bulk order</option><option>Wedding favours</option><option>Order support</option></select>{E("topic")}</div>
      <div><label htmlFor="c-msg" className="t-label-sm mb-1.5 block text-on-surface-variant">Message</label><textarea id="c-msg" rows={5} className="field resize-none" aria-invalid={!!errors.message} aria-describedby="message-e" {...register("message")} />{E("message")}</div>
      <button className="btn btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send message"}</button>
    </form>
  );
}
