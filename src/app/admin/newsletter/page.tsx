"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Search, Mail, Trash2, Download } from "lucide-react";

export default function AdminNewsletterPage() {
  const { session, status } = useAdminSession();
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/newsletter")
        .then((res) => res.json())
        .then((data) => {
          setSubscribers(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    setRemoving(id);
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, { method: "DELETE" });
      if (res.ok) setSubscribers((prev) => prev.filter((s) => s._id !== id));
    } finally {
      setRemoving(null);
    }
  };

  const handleExport = () => {
    const csv = ["Email,Subscribed At", ...filtered.map((s) => `${s.email},${new Date(s.createdAt).toISOString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) => s.email?.toLowerCase().includes(search.toLowerCase()));
  const activeCount = subscribers.filter((s) => s.active).length;

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
          <h1 className="text-2xl font-bold text-brand-ink">Newsletter Subscribers</h1>
          <p className="text-sm text-gray-600 mt-1">{activeCount} active of {subscribers.length} total subscribers</p>
        </div>
        <button
          onClick={handleExport}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dk disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg text-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Subscribed</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-brand-ink">{sub.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    sub.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {sub.active ? "Active" : "Unsubscribed"}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleRemove(sub._id)}
                    disabled={removing === sub._id}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    {removing === sub._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No subscribers found</div>
        )}
      </div>
    </div>
  );
}
