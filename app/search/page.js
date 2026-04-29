// app/search/page.js
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Sidebar from "@/components/layout/Sidebar";
import { api } from "@/lib/api";
import Link from "next/link";

// Chips that show the user what the backend understands
const SUGGESTIONS = [
  { label: "female adults", query: "female adults" },
  { label: "males in nigeria", query: "male in nigeria" },
  { label: "seniors", query: "senior" },
  { label: "young females", query: "young female" },
  { label: "above 40", query: "above 40" },
  { label: "children in ghana", query: "child in ghana" },
  { label: "teenagers in kenya", query: "teenager in kenya" },
  { label: "males under 30", query: "male under 30" },
];

const COUNTRY_MAP = {
  nigeria: "NG", kenya: "KE", angola: "AO",
  tanzania: "TZ", ghana: "GH", uganda: "UG",
};

// Parse query client-side to show the user what was interpreted
function interpretQuery(q) {
  const text = q.toLowerCase().trim();
  const tags = [];

  if ("female" in text.split("") && text.includes("female")) tags.push({ label: "Female", color: "pink" });
  else if (text.includes("male")) tags.push({ label: "Male", color: "blue" });

  if (text.includes("young")) tags.push({ label: "Age 16–24", color: "amber" });
  if (text.includes("child")) tags.push({ label: "Children", color: "green" });
  if (text.includes("teenager")) tags.push({ label: "Teenagers", color: "teal" });
  if (text.includes("adult")) tags.push({ label: "Adults", color: "purple" });
  if (text.includes("senior")) tags.push({ label: "Seniors", color: "gray" });

  const ageMatch = text.match(/(above|over|below|under|at)\s+(\d+)/);
  if (ageMatch) {
    const [, cond, val] = ageMatch;
    const label = cond === "at" ? `Age = ${val}` : `Age ${cond} ${val}`;
    tags.push({ label, color: "orange" });
  }

  for (const [name, code] of Object.entries(COUNTRY_MAP)) {
    if (text.includes(name)) {
      tags.push({ label: `Country: ${code}`, color: "indigo" });
      break;
    }
  }

  return tags;
}

const TAG_COLORS = {
  pink:   "bg-pink-100 text-pink-700 border-pink-200",
  blue:   "bg-blue-100 text-blue-700 border-blue-200",
  amber:  "bg-amber-100 text-amber-700 border-amber-200",
  green:  "bg-green-100 text-green-700 border-green-200",
  teal:   "bg-teal-100 text-teal-700 border-teal-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  gray:   "bg-gray-100 text-gray-600 border-gray-200",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
};

function GenderBadge({ gender }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      gender === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
    }`}>
      {gender}
    </span>
  );
}

function AgeGroupBadge({ group }) {
  const colors = {
    child: "bg-green-100 text-green-700",
    teenager: "bg-teal-100 text-teal-700",
    adult: "bg-purple-100 text-purple-700",
    senior: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[group] || "bg-gray-100 text-gray-600"}`}>
      {group}
    </span>
  );
}

function ProbabilityBar({ value, color = "blue" }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-${color}-400 transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right">{pct}%</span>
    </div>
  );
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [page, setPage] = useState(1);
  const inputRef = useRef(null);

  const interpretedTags = query ? interpretQuery(query) : [];

  const runSearch = useCallback(async (q, p = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const params = new URLSearchParams({ q, page: p, limit: 10 });
      const response = await api.get(`/api/profiles/search?${params}`);
      const data = await response.json();

      if (!response.ok) {
        // 400 = empty query (shouldn't reach here), 422 = uninterpretable
        setError(data.message || "Could not interpret your search. Try phrases like \"female adults in nigeria\" or \"males above 30\".");
        setResults([]);
        setPagination(null);
        return;
      }

      setResults(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setResults([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    setQuery(inputValue);
    setPage(1);
    runSearch(inputValue, 1);
  };

  const handleSuggestion = (q) => {
    setInputValue(q);
    setQuery(q);
    setPage(1);
    runSearch(q, 1);
    inputRef.current?.focus();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    runSearch(query, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Focus search on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-50 min-h-screen">
          {/* Search header */}
          <div className="bg-white border-b border-gray-200 px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Natural Language Search</h1>
            <p className="text-sm text-gray-500 mb-6">
              Describe the profiles you're looking for in plain English
            </p>

            {/* Search bar */}
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder='e.g. "female adults in nigeria" or "males above 30"'
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="px-5 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "Searching…" : "Search"}
              </button>
            </form>

            {/* Interpreted tags — shown when a search is active */}
            {query && interpretedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 items-center">
                <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Interpreting:</span>
                {interpretedTags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${TAG_COLORS[tag.color]}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 mt-5 items-center">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Try:</span>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.query}
                  onClick={() => handleSuggestion(s.query)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 rounded-full border border-gray-200 hover:border-blue-200 transition"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results area */}
          <div className="px-8 py-6">
            {/* Error state */}
            {error && (
              <div className="max-w-2xl">
                <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  <svg className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <div>
                    <p className="font-medium mb-1">Couldn't interpret that</p>
                    <p className="text-amber-700">{error}</p>
                    <p className="mt-2 text-amber-600">
                      Supported: gender (male/female), age groups (child/teenager/adult/senior/young),
                      age ranges (above/below/over/under/at N), countries (nigeria/kenya/angola/tanzania/ghana/uganda)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-3 bg-gray-100 rounded w-48" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state — no results */}
            {!loading && hasSearched && !error && results.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-300">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No profiles matched your search</p>
                <p className="text-sm text-gray-400 mt-1">Try different terms or broaden your criteria</p>
              </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
              <>
                {/* Result count */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-800">{pagination?.total ?? results.length}</span> profile{(pagination?.total ?? results.length) !== 1 ? "s" : ""} found
                    {query && <span className="text-gray-400"> for <em>"{query}"</em></span>}
                  </p>
                </div>

                {/* Results list */}
                <div className="space-y-3">
                  {results.map((profile) => (
                    <div
                      key={profile.id}
                      className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-150 p-4"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold ${
                          profile.gender === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                        }`}>
                          {profile.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 capitalize">{profile.name}</span>
                            <GenderBadge gender={profile.gender} />
                            <AgeGroupBadge group={profile.age_group} />
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{profile.country_id}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{profile.age} yrs</span>
                          </div>

                          {/* Probability bars */}
                          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 max-w-xs">
                            <div className="text-xs text-gray-400">Gender confidence</div>
                            <div className="text-xs text-gray-400">Country confidence</div>
                            <ProbabilityBar value={profile.gender_probability} color="blue" />
                            <ProbabilityBar value={profile.country_probability} color="green" />
                          </div>
                        </div>

                        {/* View link */}
                        <Link
                          href={`/profiles/${profile.id}`}
                          className="flex-shrink-0 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      Page {pagination.page} of {pagination.pages} · {pagination.total} total
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        ← Previous
                      </button>

                      {/* Page number pills */}
                      <div className="flex gap-1">
                        {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                          const p = i + 1;
                          return (
                            <button
                              key={p}
                              onClick={() => handlePageChange(p)}
                              className={`w-8 h-8 text-sm rounded-lg transition ${
                                p === page
                                  ? "bg-blue-600 text-white"
                                  : "border border-gray-200 hover:bg-gray-50 text-gray-600"
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                        {pagination.pages > 5 && (
                          <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                        )}
                      </div>

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === pagination.pages}
                        className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Initial empty state */}
            {!hasSearched && !loading && (
              <div className="text-center py-20">
                <div className="w-14 h-14 mx-auto mb-4 text-gray-200">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">Search profiles using plain English</p>
                <p className="text-sm text-gray-300 mt-1">Try one of the suggestions above to get started</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

