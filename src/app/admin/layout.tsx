"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Layers,
  ListOrdered,
  Map,
  Settings,
  Users,
  LogOut,
  Award,
  Image,
  Ticket,
  Wallet,
  FileText,
  Loader2,
  Mail,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Services", href: "/admin/services", icon: Layers },
  { title: "Partner Tiers", href: "/admin/partners", icon: Award },
  { title: "Categories", href: "/admin/categories", icon: ListOrdered },
  { title: "Task Guides", href: "/admin/guides", icon: Map },
  { title: "Banner Ads", href: "/admin/banners", icon: Image },
  { title: "Referrals", href: "/admin/referrals", icon: FileText },
  { title: "Points Ledger", href: "/admin/points", icon: Wallet },
  { title: "Promo Codes", href: "/admin/promo-codes", icon: Ticket },
  { title: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { title: "Site Settings", href: "/admin/settings", icon: Settings },
  { title: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Login page — no sidebar, just render children
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  // Not authenticated or not admin — middleware handles redirect,
  // but render nothing here as a safety net
  if (!session || (session.user as any).role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b dark:border-gray-700">
          <Link href="/admin" className="font-bold text-xl hover:opacity-80 transition-opacity">
            <span className="text-brand-red">24</span>hours Admin
          </Link>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center text-xs font-bold">
              {session.user?.name?.[0] || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session.user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 z-30">
        <Link href="/admin" className="font-bold text-lg">
          <span className="text-brand-red">24</span>hours Admin
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-gray-500 hover:text-gray-700"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <main className="flex-1 overflow-y-auto md:pt-0 pt-14">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
