import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "24hours.lk - Sri Lanka's Unified Service Hub | Find Any Service Anytime",
  description: "24hours.lk is your one-stop destination for finding and accessing essential services across Sri Lanka. Search for government services, healthcare, transportation, and more - all in one place, 24/7.",
  keywords: ["Sri Lanka services", "government services", "online services", "service directory", "24hours.lk", "healthcare", "transportation", "utilities"],
  authors: [{ name: "HABB PVT LTD" }],
  openGraph: {
    title: "24hours.lk - Sri Lanka's Unified Service Hub",
    description: "Find and access any service in Sri Lanka - government, healthcare, transportation, and more. Available 24/7.",
    url: "https://24hours.lk",
    siteName: "24hours.lk",
    locale: "en_LK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "24hours.lk - Sri Lanka's Unified Service Hub",
    description: "Find and access any service in Sri Lanka, 24/7",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} ${syne.variable} font-sans antialiased text-ink bg-mist`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
