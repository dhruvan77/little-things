import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Newsletter } from "@/components/Newsletter";
import { Providers } from "@/components/Providers";
import { AmbientBackground } from "@/components/AmbientBackground";

export const metadata: Metadata = {
  metadataBase: new URL("https://little-things-studio.example"),
  title: { default: "Little Things Studio | Bespoke & Personalised Gifting", template: "%s | Little Things Studio" },
  description: "Bespoke personalised gifts handcrafted in Jaipur: monogrammed tumblers, gold-foil leather journals, keepsake hampers and more. A frontend demo store.",
  openGraph: { title: "Little Things Studio", description: "Gifts that feel like they were made just for them.", type: "website", siteName: "Little Things Studio", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = { themeColor: "#fff8f0", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;700&family=Great+Vibes&family=Manrope:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-on-primary">Skip to content</a>
        <AmbientBackground />
        <Providers />
        <Header />
        <main id="main" className="min-h-screen pt-24 lg:pt-28">{children}</main>
        <Newsletter />
        <Footer />
      </body>
    </html>
  );
}
