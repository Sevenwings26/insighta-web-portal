// app/profiles/create/page.js
"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // ✅ Track whether the profile already existed vs was freshly created
  const [notice, setNotice] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await api.post("/api/profiles", { name });
      const data = await response.json();

      if (response.ok) {
        // ✅ Backend returns message: "Profile already exists" when duplicate
        if (data.message === "Profile already exists") {
          setNotice("A profile for this name already exists. Redirecting…");
        }
        setTimeout(() => router.push("/profiles"), 1200);
      } else {
        setError(data.detail || "Failed to create profile");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8 bg-gray-50 min-h-screen">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Profile</h1>
            <p className="text-gray-600 mb-8">
              Enter a name to generate profile data from external APIs
            </p>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
              )}
              {/* ✅ Show when profile already existed */}
              {notice && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">{notice}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a name (e.g. John)"
                    disabled={loading}
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    The system will fetch gender, age, and nationality data from external APIs
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Profile"}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/profiles")}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Fetches gender data from genderize.io</li>
                <li>• Fetches age data from agify.io</li>
                <li>• Fetches nationality data from nationalize.io</li>
                <li>• Automatically classifies age groups (child, teenager, adult, senior)</li>
                <li>• Prevents duplicate profiles by name</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
