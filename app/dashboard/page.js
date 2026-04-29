"use client";
import Sidebar from "@/components/layout/Sidebar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="flex bg-slate-50 min-h-screen">
        <Sidebar />

        <main className="flex-1 p-10">
          <header className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">System Overview</h1>
              <p className="text-slate-500">Real-time profile intelligence metrics</p>
            </div>

            <button
              onClick={logout}
              className="bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Logout</span>
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard title="Total Profiles" value="2,026" sub="↑ 12% this month" />
            <StatCard title="Active Analysts" value="12" sub="Currently online" />
            <StatCard title="Active Sessions" value="4" sub="Last 24 hours" />
          </div>
          
          <div className="mt-10 bg-white border border-slate-200 rounded-2xl p-8 h-64 flex items-center justify-center text-slate-400 italic">
            Chart Visualization Area (Pending Stage 4)
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ title, value, sub }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h2>
      <p className="text-4xl mt-4 font-bold text-slate-900">{value}</p>
      <p className="text-sm mt-2 text-blue-600 font-medium">{sub}</p>
    </div>
  );
}


