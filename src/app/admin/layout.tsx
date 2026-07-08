"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Layers,
  ListOrdered,
  Map,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Services", href: "/admin/services", icon: Layers },
  { title: "Categories", href: "/admin/categories", icon: ListOrdered },
  { title: "Task Guides", href: "/admin/guides", icon: Map },
  { title: "Site Settings", href: "/admin/settings", icon: Settings },
  { title: "Admin Users", href: "/admin/users", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b dark:border-gray-700">
          <h1 className="font-bold text-xl">24hours.lk Admin</h1>
        </div>
        <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
