import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "24hours.lk - Sri Lanka's Unified Service Hub",
  description: "24hours.lk guides you to the right services, exactly when you need them. No signup required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} ${syne.variable} font-sans antialiased text-ink bg-mist`}>
        {children}
      </body>
    </html>
  );
}
