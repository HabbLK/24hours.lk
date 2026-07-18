"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus, Loader2, Trash2, Eye, MousePointer, Play, Pause, Pencil, X, Check } from "lucide-react";

const SLOT_LABELS: Record<string, string> = {
  homepage: "Homepage",
  category: "Category Page",
  search: "Search Results",
};

export default function AdminBannersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    destinationUrl: "",
    slotType: "homepage",
    categorySlug: "",
    startDate: "",
    endDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/banners")
        .then((res) => res.json())
        .then((data) => {
          setBanners(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const resetForm = () => {
    setForm({ title: "", imageUrl: "", destinationUrl: "", slotType: "homepage", categorySlug: "", startDate: "", endDate: "" });
    setEditingId(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/admin/banners/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            startDate: new Date(form.startDate),
            endDate: new Date(form.endDate),
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setBanners((prev) => prev.map((b) => (b._id === editingId ? updated : b)));
          resetForm();
          setShowForm(false);
        }
      } else {
        const res = await fetch("/api/admin/banners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            startDate: new Date(form.startDate),
            endDate: new Date(form.endDate),
          }),
        });
        if (res.ok) {
          const banner = await res.json();
          setBanners((prev) => [banner, ...prev]);
          resetForm();
          setShowForm(false);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (banner: any) => {
    setForm({
      title: banner.title,
      imageUrl: banner.imageUrl,
      destinationUrl: banner.destinationUrl,
      slotType: banner.slotType,
      categorySlug: banner.categorySlug || "",
      startDate: new Date(banner.startDate).toISOString().split("T")[0],
      endDate: new Date(banner.endDate).toISOString().split("T")[0],
    });
    setEditingId(banner._id);
    setShowForm(true);
  };

  const handlePublishNow = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish-now" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBanners((prev) => prev.map((b) => (b._id === id ? updated : b)));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-active" }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBanners((prev) => prev.map((b) => (b._id === id ? updated : b)));
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
    if (res.ok) setBanners((prev) => prev.filter((b) => b._id !== id));
  };

  const now = new Date();

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
          <h1 className="text-2xl font-bold text-brand-ink">Banner Ads</h1>
          <p className="text-sm text-gray-600 mt-1">Manage banner placements across the site</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-brand-ink mb-4">{editingId ? "Edit Banner" : "Create Banner"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
              <input
                type="url"
                value={form.destinationUrl}
                onChange={(e) => setForm({ ...form, destinationUrl: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slot</label>
              <select
                value={form.slotType}
                onChange={(e) => setForm({ ...form, slotType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              >
                <option value="homepage">Homepage</option>
                <option value="category">Category Page</option>
                <option value="search">Search Results</option>
              </select>
            </div>
            {form.slotType === "category" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Slug</label>
                <input
                  type="text"
                  value={form.categorySlug}
                  onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  placeholder="e.g. transport"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? "Update Banner" : "Create Banner"}
            </button>
            <button
              type="button"
              onClick={() => { resetForm(); setShowForm(false); }}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Banner</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slot</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Dates</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stats</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => {
              const isLive = banner.active && new Date(banner.startDate) <= now && new Date(banner.endDate) >= now;
              const isExpired = new Date(banner.endDate) < now;
              const isScheduled = new Date(banner.startDate) > now;
              const isBusy = actionLoading === banner._id;
              return (
                <tr key={banner._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={banner.imageUrl} alt="" className="w-16 h-10 object-cover rounded" />
                      <span className="text-sm font-medium text-brand-ink">{banner.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{SLOT_LABELS[banner.slotType]}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {new Date(banner.startDate).toLocaleDateString()} — {new Date(banner.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      isLive ? "bg-green-100 text-green-700" :
                      isExpired ? "bg-gray-100 text-gray-500" :
                      isScheduled ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {isLive ? "Live" : isExpired ? "Expired" : isScheduled ? "Scheduled" : "Paused"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {banner.impressions}</span>
                    <span className="flex items-center gap-1"><MousePointer className="w-3 h-3" /> {banner.clicks}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {/* Publish Now — only for scheduled or expired banners */}
                      {(isScheduled || isExpired) && (
                        <button
                          onClick={() => handlePublishNow(banner._id)}
                          disabled={isBusy}
                          title="Publish Now"
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        </button>
                      )}
                      {/* Toggle Active/Inactive */}
                      <button
                        onClick={() => handleToggleActive(banner._id)}
                        disabled={isBusy}
                        title={banner.active ? "Pause" : "Resume"}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                          banner.active ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"
                        }`}
                      >
                        {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : banner.active ? <Pause className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(banner)}
                        title="Edit"
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(banner._id)}
                        title="Delete"
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {banners.length === 0 && (
          <div className="text-center py-12 text-gray-500">No banners yet</div>
        )}
      </div>
    </div>
  );
}
