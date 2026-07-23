import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Check, X, Shield, Share2, Folder, Search, Code, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0e1322] backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-indigo-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            SnipLibrary
          </span>
        </div>
        <div className="flex items-center gap-4">
          {token ? (
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-2"
            >
              Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold hover:text-indigo-400 transition">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="h-3 w-3" /> Zero to Subscriber - Launch in a Day
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Save, Tag, and Search Your <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
            Reusable Code Snippets & Prompts
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          The ultimate productivity companion for developers and AI prompt engineers. Keep your best snippets accessible, organized, and shareable.
        </p>
        <div className="flex gap-4">
          <Link
            to={token ? "/dashboard" : "/signup"}
            className="px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 transition duration-200"
          >
            Create Free Account
          </Link>
          <a
            href="#pricing"
            className="px-8 py-4 text-base font-semibold rounded-xl border border-gray-700 bg-gray-800/40 hover:bg-gray-800 text-gray-300 transition duration-200"
          >
            View Pricing
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 border-t border-gray-800/60 bg-[#0c111e]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Packed with Hackathon-Speed Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/60">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Search</h3>
              <p className="text-gray-400 text-sm">
                Instantly filter your snippets by title, content, or tags. Find any code or prompt in milliseconds.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/60">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5">
                <Folder className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Folder Organization</h3>
              <p className="text-gray-400 text-sm">
                Group snippets into folders for project-specific structures. Access clean directories anytime (Pro).
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800/60">
              <div className="h-12 w-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-5">
                <Share2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Public Share Links</h3>
              <p className="text-gray-400 text-sm">
                Generate lightweight, readable public view links for any snippet. Share them with teammates or customers (Pro).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="pricing" className="py-20 px-6 max-w-5xl mx-auto w-full">
        <h2 className="text-4xl font-extrabold text-center mb-4">Transparent, Simple Pricing</h2>
        <p className="text-gray-400 text-center mb-16 max-w-md mx-auto">
          Start for free, upgrade when you need unlimited power.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-gray-900/40 border border-gray-800 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">Free Starter</h3>
              <p className="text-gray-400 text-sm mb-6">Perfect for testing the waters.</p>
              <div className="text-4xl font-black mb-6">$0 <span className="text-sm font-normal text-gray-500">/ forever</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-green-400 shrink-0" /> Max 10 Snippets
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-green-400 shrink-0" /> Max 3 Tags per Snippet
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500 line-through">
                  <X className="h-4 w-4 text-red-500 shrink-0" /> Folder Organization
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-500 line-through">
                  <X className="h-4 w-4 text-red-500 shrink-0" /> Public Shareable Links
                </li>
              </ul>
            </div>
            <Link
              to={token ? "/dashboard" : "/signup"}
              className="w-full py-3 text-center rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold transition"
            >
              {token ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-indigo-950/40 to-slate-900/40 border-2 border-indigo-500/80 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-indigo-500 text-white text-xs font-semibold">
              POPULAR
            </div>
            <div>
              <h3 className="text-2xl font-bold text-indigo-300 mb-2">Snippet Pro</h3>
              <p className="text-gray-400 text-sm mb-6">For power users and prompt masters.</p>
              <div className="text-4xl font-black mb-6">$9 <span className="text-sm font-normal text-gray-500">/ month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Unlimited Snippets & Prompts
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Unlimited Tags
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Full Folder Hierarchy
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-indigo-400 shrink-0" /> Shareable /s/[slug] Public Links
                </li>
              </ul>
            </div>
            <Link
              to={token ? "/dashboard" : "/signup"}
              className="w-full py-3 text-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#070b12] py-8 text-center text-xs text-gray-500 px-6">
        <p>© 2026 SnipLibrary. Hackathon Project for "Zero to Subscriber — Full-Stack SaaS in a Day".</p>
      </footer>
    </div>
  );
}
