// app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    total_profiles: 0,
    gender_distribution: { male: 0, female: 0 },
    age_distribution: { child: 0, teenager: 0, adult: 0, senior: 0 },
    recent_profiles: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/profiles?limit=5");
      const data = await response.json();
      
      // Calculate stats from profiles (simplified)
      const profiles = data.data || [];
      const total = data.pagination?.total || 0;
      
      const genderCount = { male: 0, female: 0 };
      const ageCount = { child: 0, teenager: 0, adult: 0, senior: 0 };
      
      profiles.forEach(profile => {
        if (profile.gender) genderCount[profile.gender]++;
        if (profile.age_group) ageCount[profile.age_group]++;
      });
      
      setStats({
        total_profiles: total,
        gender_distribution: genderCount,
        age_distribution: ageCount,
        recent_profiles: profiles,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8 bg-gray-50 min-h-screen">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.username || user?.email}!
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-4xl mb-2">👥</div>
                  <h3 className="text-2xl font-bold">{stats.total_profiles}</h3>
                  <p className="text-gray-600 text-sm">Total Profiles</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-4xl mb-2">♂️</div>
                  <h3 className="text-2xl font-bold">{stats.gender_distribution.male}</h3>
                  <p className="text-gray-600 text-sm">Male Profiles</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-4xl mb-2">♀️</div>
                  <h3 className="text-2xl font-bold">{stats.gender_distribution.female}</h3>
                  <p className="text-gray-600 text-sm">Female Profiles</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="text-4xl mb-2">⭐</div>
                  <h3 className="text-2xl font-bold">{stats.age_distribution.adult}</h3>
                  <p className="text-gray-600 text-sm">Adult Profiles</p>
                </div>
              </div>

              {/* Age Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Age Distribution</h2>
                  <div className="space-y-3">
                    {Object.entries(stats.age_distribution).map(([group, count]) => (
                      <div key={group}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{group}</span>
                          <span>{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${stats.total_profiles ? (count / stats.total_profiles) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Profiles */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">Recent Profiles</h2>
                  <div className="space-y-3">
                    {stats.recent_profiles.map((profile) => (
                      <div key={profile.id} className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">{profile.name}</p>
                          <p className="text-sm text-gray-500">
                            {profile.age} years • {profile.gender} • {profile.country_id}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

// // app/dashboard/page.js
// "use client";

// import ProtectedRoute from "@/components/auth/ProtectedRoute";
// import Sidebar from "@/components/layout/Sidebar";
// import { useAuth } from "@/context/AuthContext";

// export default function DashboardPage() {
//   const { user, logout } = useAuth();

//   return (
//     <ProtectedRoute>
//       <div className="flex">
//         <Sidebar />
        
//         <main className="flex-1 p-8">
//           <div className="flex justify-between items-center mb-8">
//             <h1 className="text-3xl font-bold">Dashboard</h1>
//             <button
//               onClick={logout}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
//             >
//               Logout
//             </button>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <p>Welcome back, {user?.username || user?.email}!</p>
//             <p className="text-sm text-gray-500 mt-2">Role: {user?.role}</p>
//           </div>
          
//           <div className="grid grid-cols-3 gap-6 mt-8">
//             <div className="border rounded-xl p-6">
//               <h2 className="text-lg font-semibold">Profiles</h2>
//               <p className="text-4xl mt-3 font-bold">0</p>
//             </div>
//             <div className="border rounded-xl p-6">
//               <h2 className="text-lg font-semibold">Analysts</h2>
//               <p className="text-4xl mt-3 font-bold">0</p>
//             </div>
//             <div className="border rounded-xl p-6">
//               <h2 className="text-lg font-semibold">Active Sessions</h2>
//               <p className="text-4xl mt-3 font-bold">1</p>
//             </div>
//           </div>
//         </main>
//       </div>
//     </ProtectedRoute>
//   );
// }




// // "use client";
// // import Sidebar from "@/components/Sidebar";
// // import ProtectedRoute from "@/components/auth/ProtectedRoute";
// // import { useAuth } from "@/context/AuthContext";

// // export default function DashboardPage() {
// //   const { logout } = useAuth();

// //   return (
// //     <ProtectedRoute>
// //       <div className="flex bg-slate-50 min-h-screen">
// //         <Sidebar />

// //         <main className="flex-1 p-10">
// //           <header className="flex items-center justify-between mb-10">
// //             <div>
// //               <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
// //               <p className="text-slate-500">Real-time profile intelligence metrics</p>
// //             </div>

// //             <button
// //               onClick={logout}
// //               className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-2 shadow-sm"
// //             >
// //               <span>Logout</span>
// //             </button>
// //           </header>

// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// //             <StatCard title="Total Profiles" value="2,026" sub="↑ 12% this month" />
// //             <StatCard title="Active Analysts" value="12" sub="Currently online" />
// //             <StatCard title="Active Sessions" value="4" sub="Last 24 hours" />
// //           </div>
          
// //           <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-8 h-64 flex items-center justify-center text-slate-400 italic">
// //             Chart Visualization Area (Pending Stage 4)
// //           </div>
// //         </main>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // }

// // function StatCard({ title, value, sub }) {
// //   return (
// //     <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
// //       <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h2>
// //       <p className="text-4xl mt-4 font-bold text-slate-900">{value}</p>
// //       <p className="text-sm mt-2 text-blue-600 font-medium">{sub}</p>
// //     </div>
// //   );
// // }

