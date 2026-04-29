import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
          Insighta <span className="text-blue-600">Labs+</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-lg mx-auto">
          Secure Profile Intelligence & Multi-Interface Data Analysis.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login"
            className="bg-slate-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-all"
          >
            Get Started
          </Link>
          <Link 
            href="/dashboard"
            className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

