"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, Save, Settings } from "lucide-react";

const SETTINGS_FIELDS = [
  { key: "hero_headline", label: "Hero Headline", placeholder: "What do you need to get done today?", type: "text" },
  { key: "hero_subtext", label: "Hero Subtext", placeholder: "24hours.lk guides you to the right services...", type: "textarea" },
  { key: "footer_tagline", label: "Footer Tagline", placeholder: "Sri Lanka's Unified Service Hub", type: "text" },
];

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin/settings")
        .then((res) => res.json())
        .then((data) => {
          setSettings(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage("Settings saved successfully");
      } else {
        setMessage("Failed to save settings");
      }
    } catch {
      setMessage("Failed to save settings");
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold text-brand-ink">Site Settings</h1>
          <p className="text-sm text-gray-600 mt-1">Manage homepage content and site-wide text</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-3 rounded-lg text-sm ${
          message.includes("success")
            ? "bg-green-50 border border-green-200 text-green-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-gray-500" />
          <h2 className="text-lg font-bold text-brand-ink">Homepage Content</h2>
        </div>

        <div className="space-y-6">
          {SETTINGS_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={settings[field.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={settings[field.key] || ""}
                  onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red"
                />
              )}
              <p className="mt-1 text-xs text-gray-400">Key: {field.key}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
