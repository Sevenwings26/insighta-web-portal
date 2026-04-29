// components/layout/Sidebar.js

"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const links = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    { name: "Profiles",  href: "/profiles",  icon: "👥" }, // Points to app/profiles/page.js
    { name: "Search",    href: "/profiles/search", icon: "🔍" }, // Points to app/profiles/search/page.js
  ]

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-slate-300 p-6 flex flex-col border-r border-slate-800">
      <div className="mb-10 px-2">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Insighta <span className="text-blue-500">Labs+</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <span>{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 uppercase tracking-tighter">
        System Status: Online
      </div>
    </aside>
  )
}

