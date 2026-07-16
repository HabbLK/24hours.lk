"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session.user?.name || session.user?.email}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder for Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Services</h3>
          <p className="text-3xl font-bold mt-2 text-brand-red">-</p>
          <p className="text-xs text-gray-400 mt-2">View all services</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Categories</h3>
          <p className="text-3xl font-bold mt-2 text-brand-red">-</p>
          <p className="text-xs text-gray-400 mt-2">Manage categories</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Task Guides</h3>
          <p className="text-3xl font-bold mt-2 text-brand-red">-</p>
          <p className="text-xs text-gray-400 mt-2">Create new guides</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 text-sm font-medium">Admin Users</h3>
          <p className="text-3xl font-bold mt-2 text-brand-red">-</p>
          <p className="text-xs text-gray-400 mt-2">Manage admins</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Start</h3>
        <p className="text-sm text-blue-700 mb-4">
          Get started by adding services, categories, and task guides to help users find what they need.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/admin/services" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Add Service
          </a>
          <a href="/admin/categories" className="px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 rounded-lg text-sm font-medium transition-colors">
            Add Category
          </a>
          <a href="/admin/guides" className="px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 rounded-lg text-sm font-medium transition-colors">
            Create Guide
          </a>
        </div>
      </div>
    </div>
  );
}
