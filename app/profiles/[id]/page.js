// app/profiles/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import { api } from "@/lib/api";
import Link from "next/link";

export default function ProfileDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profiles/${id}`);
      const data = await response.json();
      setProfile(data.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (probability) => {
    if (probability > 0.8) return "text-green-600";
    if (probability > 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getAgeGroupBadge = (group) => {
    const colors = {
      child: "bg-green-100 text-green-800",
      teenager: "bg-blue-100 text-blue-800",
      adult: "bg-purple-100 text-purple-800",
      senior: "bg-gray-100 text-gray-800",
    };
    return colors[group] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Profile not found</h2>
              <Link href="/profiles" className="text-blue-500 mt-4 inline-block">
                Back to Profiles
              </Link>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 bg-gray-50 min-h-screen">
          <div className="mb-6">
            <Link href="/profiles" className="text-blue-500 hover:text-blue-700">
              ← Back to Profiles
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile.name}
                </h1>
                <p className="text-blue-100">Profile Details</p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gender Section */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Gender</h3>
                    <p className="text-2xl font-semibold capitalize">{profile.gender}</p>
                    <p className={`text-sm mt-1 ${getProbabilityColor(profile.gender_probability)}`}>
                      Probability: {(profile.gender_probability * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Sample size: {profile.sample_size}
                    </p>
                  </div>

                  {/* Age Section */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Age</h3>
                    <p className="text-2xl font-semibold">{profile.age} years</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${getAgeGroupBadge(profile.age_group)}`}>
                      {profile.age_group}
                    </span>
                  </div>

                  {/* Country Section */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Country</h3>
                    <p className="text-2xl font-semibold">{profile.country_id}</p>
                    <p className={`text-sm mt-1 ${getProbabilityColor(profile.country_probability)}`}>
                      Probability: {(profile.country_probability * 100).toFixed(1)}%
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Metadata</h3>
                    <p className="text-sm">
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(profile.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">ID:</span>{" "}
                      <code className="text-xs">{profile.id}</code>
                    </p>
                  </div>
                </div>

                {/* Probability Visualization */}
                <div className="mt-6 border rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Data Confidence</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Gender Prediction</span>
                        <span>{(profile.gender_probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${profile.gender_probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Country Prediction</span>
                        <span>{(profile.country_probability * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${profile.country_probability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}