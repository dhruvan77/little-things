import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/OrderConfirmation";
export const metadata: Metadata = { title: "Order Confirmed (Demo)", robots: { index: false } };
export default function Page() { return <OrderConfirmation />; }
