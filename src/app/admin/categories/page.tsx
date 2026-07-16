"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Plus, Search } from "lucide-react";

export default function CategoriesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categories</h1>
          <p className="text-gray-600">Organize services into categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50"
          />
        </div>
      </div>

      {/* Categories Grid Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">No categories yet</h3>
        <p className="text-gray-500 mb-6">Create categories to organize your services</p>
        <button className="px-6 py-3 bg-brand-red hover:bg-brand-red-dk text-white rounded-lg font-medium transition-colors">
          Create Your First Category
        </button>
      </div>
    </div>
  );
}
