// app/profiles/export/page.js
"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function ExportPage() {
  const [filters, setFilters] = useState({
    gender: "",
    country_id: "",
    age_group: "",
    min_age: "",
    max_age: "",
    min_gender_probability: "",
    min_country_probability: "",
  });
  const [exporting, setExporting] = useState(false);
  const { user } = useAuth();

  const handleExport = async () => {
    setExporting(true);
    
    // Build query params
    const params = new URLSearchParams();
    params.append("format", "csv");
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.append(key, value);
      }
    });
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profiles/export?${params}`,
        {
          credentials: "include",
        }
      );
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `profiles_${new Date().toISOString().slice(0, 19)}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        alert("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Data</h1>
            <p className="text-gray-600 mb-8">Export profile data as CSV with custom filters</p>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Export Filters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Group
                  </label>
                  <select
                    value={filters.age_group}
                    onChange={(e) => setFilters({ ...filters, age_group: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All</option>
                    <option value="child">Child</option>
                    <option value="teenager">Teenager</option>
                    <option value="adult">Adult</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Age
                    </label>
                    <input
                      type="number"
                      value={filters.min_age}
                      onChange={(e) => setFilters({ ...filters, min_age: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Age
                    </label>
                    <input
                      type="number"
                      value={filters.max_age}
                      onChange={(e) => setFilters({ ...filters, max_age: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {exporting ? "Exporting..." : "Export to CSV"}
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  📊 The export will include: ID, Name, Gender, Probability, Age, Age Group, Country, and Timestamp
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
