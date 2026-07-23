import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Code, Copy, Check, Sparkles, ExternalLink, Calendar } from "lucide-react";
import axios from "axios";

export default function PublicSnippet() {
  const { slug } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPublicSnippet();
  }, [slug]);

  const fetchPublicSnippet = async () => {
    try {
      setLoading(true);
      setError("");
      // Call public endpoint without auth headers
      const response = await axios.get(`http://localhost:8000/s/${slug}`);
      setSnippet(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        "Public snippet not found or it has been set to private."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!snippet) return;
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0e1322]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Code className="h-6 w-6 text-indigo-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            SnipLibrary
          </span>
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5"
        >
          Create Your Own <ExternalLink className="h-3 w-3" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">Loading public snippet...</div>
        ) : error ? (
          <div className="text-center py-16 border border-dashed border-gray-800 rounded-3xl p-8 max-w-md mx-auto">
            <AlertIcon className="h-10 w-10 text-red-400/80 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-300">Snippet Unavailable</h3>
            <p className="text-sm text-gray-500 mt-2 mb-6 leading-relaxed">{error}</p>
            <Link
              to="/"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white transition"
            >
              Go to Home Page
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Meta Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">{snippet.title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                    {snippet.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(snippet.created_at)}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5">
                {snippet.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-gray-900 border border-gray-800 text-gray-400 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative bg-gray-950 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
              {/* Copy Bar */}
              <div className="flex justify-between items-center px-6 py-3 border-b border-gray-900 bg-gray-900/40 select-none">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Shared Snippet</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700/80 hover:text-white text-gray-400 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* Code Area */}
              <div className="p-6 overflow-x-auto select-text">
                <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                  <code>{snippet.content}</code>
                </pre>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/40 to-indigo-950/40 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 select-none">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-200">Save Your Own Reusable Snippets</h4>
                  <p className="text-xs text-gray-400">Keep your AI prompts and code templates in one central place.</p>
                </div>
              </div>
              <Link
                to="/signup"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition text-center shrink-0"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#070b12] py-8 text-center text-xs text-gray-500 px-6 select-none">
        <p>© 2026 SnipLibrary. Shareable Public link.</p>
      </footer>
    </div>
  );
}

// Simple fallback alert icon
function AlertIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}
