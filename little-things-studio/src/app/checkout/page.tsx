import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
export const metadata: Metadata = { title: "Checkout (Demo)", robots: { index: false } };
export default function Page() { return <CheckoutForm />; }
