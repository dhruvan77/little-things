import type { Metadata } from "next";
import { Clock, Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Breadcrumb } from "@/components/ui";
export const metadata: Metadata = { title: "Contact the Studio Concierge", description: "Questions about personalisation, bulk orders or weddings? Write to the Little Things Studio concierge." };
export default function Page() {
  return (
    <div className="px-page py-8 lg:py-12"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="mt-6 grid gap-12 lg:grid-cols-2">
        <div data-anim="up"><h1 className="t-display-lg text-primary">Studio Concierge</h1><p className="t-body-md mt-4 max-w-md text-on-surface-variant">Planning a wedding, a corporate programme or one very particular gift? Tell us about it.</p>
          <ul className="t-body-md mt-8 space-y-4 text-on-surface-variant"><li className="flex gap-3"><MapPin className="shrink-0 text-on-tertiary-container" size={20} />Studio: 44, Civil Lines • C-Scheme, Jaipur 302001</li><li className="flex gap-3"><Mail className="shrink-0 text-on-tertiary-container" size={20} /><a className="link-u" href="mailto:concierge@littlethingsstudio.in">concierge@littlethingsstudio.in</a></li><li className="flex gap-3"><Clock className="shrink-0 text-on-tertiary-container" size={20} />Mon to Sat, 10am to 7pm IST</li></ul></div>
        <ContactForm />
      </div></div>
  );
}
