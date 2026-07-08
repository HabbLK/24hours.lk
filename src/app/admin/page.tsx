"use client";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder for Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Services</h3>
          <p className="text-3xl font-bold mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Categories</h3>
          <p className="text-3xl font-bold mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Task Guides</h3>
          <p className="text-3xl font-bold mt-2">-</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Admin Users</h3>
          <p className="text-3xl font-bold mt-2">-</p>
        </div>
      </div>
    </div>
  );
}
