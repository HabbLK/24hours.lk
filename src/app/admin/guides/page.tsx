"use client";

import { useAdminSession } from "@/hooks/useAdminSession";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus, Search, Loader2, Trash2, Pencil, X, GripVertical } from "lucide-react";

type Step = { title: string; description: string; externalUrl: string; linkLabel: string };

const EMPTY_STEP: Step = { title: "", description: "", externalUrl: "", linkLabel: "" };

const EMPTY_FORM = {
  title: "",
  slug: "",
  keywords: "",
  active: true,
  steps: [{ ...EMPTY_STEP }] as Step[],
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function GuidesPage() {
  const { session, status } = useAdminSession();
  const router = useRouter();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  const loadGuides = () => {
    fetch("/api/admin/guides")
      .then((res) => res.json())
      .then((data) => {
        setGuides(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "authenticated") loadGuides();
  }, [status]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (guide: any) => {
    setEditingId(guide._id);
    setForm({
      title: guide.title || "",
      slug: guide.slug || "",
      keywords: (guide.keywords || []).join(", "),
      active: guide.active ?? true,
      steps: (guide.steps || []).length
        ? guide.steps
            .sort((a: any, b: any) => a.stepNumber - b.stepNumber)
            .map((s: any) => ({
              title: s.title || "",
              description: s.description || "",
              externalUrl: s.externalUrl || "",
              linkLabel: s.linkLabel || "",
            }))
        : [{ ...EMPTY_STEP }],
    });
    setError("");
    setShowForm(true);
  };

  const updateStep = (index: number, field: keyof Step, value: string) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const addStep = () => setForm((prev) => ({ ...prev, steps: [...prev.steps, { ...EMPTY_STEP }] }));

  const removeStep = (index: number) =>
    setForm((prev) => ({ ...prev, steps: prev.steps.filter((_, i) => i !== index) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      active: form.active,
      steps: form.steps
        .filter((s) => s.title.trim())
        .map((s, i) => ({ ...s, stepNumber: i + 1 })),
    };

    if (payload.steps.length === 0) {
      setError("Add at least one step");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        editingId ? `/api/admin/guides/${editingId}` : "/api/admin/guides",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save guide");
        return;
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
      loadGuides();
    } catch {
      setError("Failed to save guide");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this guide?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
      if (res.ok) setGuides((prev) => prev.filter((g) => g._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = guides.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()));

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Guides</h1>
          <p className="text-gray-600">Create step-by-step guides for users</p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Guide
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">{editingId ? "Edit Guide" : "Create Guide"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder={slugify(form.title) || "auto-generated-from-title"}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="license, driving, motor traffic"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="guide-active"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="guide-active" className="text-sm text-gray-700">Active (visible on site)</label>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-gray-700">Steps</h4>
              <button type="button" onClick={addStep} className="text-xs font-medium text-brand-red hover:text-brand-red-dk flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>
            <div className="space-y-3">
              {form.steps.map((step, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <GripVertical className="w-4 h-4 text-gray-300" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Step {index + 1}</span>
                    {form.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="ml-auto text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => updateStep(index, "title", e.target.value)}
                      placeholder="Step title"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                    />
                    <input
                      type="text"
                      value={step.linkLabel}
                      onChange={(e) => updateStep(index, "linkLabel", e.target.value)}
                      placeholder="Link label (optional)"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                    />
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(index, "description", e.target.value)}
                      placeholder="Step description"
                      rows={2}
                      className="w-full md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                    />
                    <input
                      type="url"
                      value={step.externalUrl}
                      onChange={(e) => updateStep(index, "externalUrl", e.target.value)}
                      placeholder="External URL (optional)"
                      className="w-full md:col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-brand-red hover:bg-brand-red-dk text-white font-bold rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? "Save Changes" : "Create Guide"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No guides yet</h3>
          <p className="text-gray-500 mb-6">Help users complete tasks with detailed guides</p>
          <button onClick={openCreateForm} className="px-6 py-3 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg font-medium transition-colors">
            Create Your First Guide
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Steps</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((guide) => (
                <tr key={guide._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-sm text-brand-ink">{guide.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">{guide.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{guide.steps?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                      guide.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {guide.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEditForm(guide)} className="text-gray-400 hover:text-brand-red">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(guide._id)} disabled={deleting === guide._id} className="text-red-400 hover:text-red-600 disabled:opacity-50">
                        {deleting === guide._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
