"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Loader2, Mail, Phone, Shield, UserCheck, UserX } from "lucide-react";

export default function AdminUsersPage() {
  const { session, status } = useAdminSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterProvider, setFilterProvider] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/users")
        .then((res) => res.json())
        .then((data) => {
          setUsers(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const filtered = users.filter((u) => {
    const matchSearch =
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.phone || "").toLowerCase().includes(search.toLowerCase());
    const matchProvider = filterProvider === "all" || u.provider === filterProvider;
    return matchSearch && matchProvider;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.active).length,
    email: users.filter((u) => u.provider === "email").length,
    oauth: users.filter((u) => u.provider === "google").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-ink">Users</h1>
          <p className="text-sm text-gray-600 mt-1">Manage registered users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">Total</span>
          </div>
          <p className="text-2xl font-bold text-brand-ink">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-gray-600">Active</span>
          </div>
          <p className="text-2xl font-bold text-brand-ink">{stats.active}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Email</span>
          </div>
          <p className="text-2xl font-bold text-brand-ink">{stats.email}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserX className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-600">OAuth</span>
          </div>
          <p className="text-2xl font-bold text-brand-ink">{stats.oauth}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
            />
          </div>
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          >
            <option value="all">All Providers</option>
            <option value="email">Email</option>
            <option value="google">Google</option>
            <option value="phone">Phone</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-red to-brand-red-dk text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        (user.name || "U").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-brand-ink">{user.name || "Unnamed"}</p>
                      <p className="text-xs text-gray-500">{user.email || "No email"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-gray-400" />
                    {user.phone || "—"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.provider === "google" ? "bg-red-50 text-red-700" :
                    user.provider === "phone" ? "bg-green-50 text-green-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {user.provider}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
}
