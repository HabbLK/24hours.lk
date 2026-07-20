import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import Providers from "@/components/Providers";
import FloatingChatBot from "@/components/FloatingChatBot";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "24hours.lk - Sri Lanka's Unified Service Hub | Find Any Service Anytime",
  description: "24hours.lk is your one-stop destination for finding and accessing essential services across Sri Lanka. Search for government services, healthcare, transportation, and more - all in one place, 24/7.",
  keywords: ["Sri Lanka services", "government services", "online services", "service directory", "24hours.lk", "healthcare", "transportation", "utilities"],
  authors: [{ name: "HABB PVT LTD" }],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "24hours.lk",
  },
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A1A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} ${poppins.variable} font-sans antialiased text-ink bg-mist`}>
        <Providers>
          {children}
          <FloatingChatBot />
          <InstallPrompt />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  );
}
