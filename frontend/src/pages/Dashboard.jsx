import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Code, LogOut, Folder, Plus, Tag, Search, Copy, Check, Share2,
  Lock, Trash2, Edit3, X, FolderPlus, Sparkles, AlertCircle
} from "lucide-react";
import api from "../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // User & Data States
  const [user, setUser] = useState(null);
  const [snippets, setSnippets] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedTagName, setSelectedTagName] = useState(null);

  // UI States
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState(null);
  const [copiedShareSlug, setCopiedShareSlug] = useState(null);
  const [notification, setNotification] = useState("");

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderError, setFolderError] = useState("");

  // Editor Modal Form State
  const [snippetTitle, setSnippetTitle] = useState("");
  const [snippetContent, setSnippetContent] = useState("");
  const [snippetLanguage, setSnippetLanguage] = useState("plaintext");
  const [snippetFolderId, setSnippetFolderId] = useState("");
  const [snippetTagsString, setSnippetTagsString] = useState("");
  const [snippetIsPublic, setSnippetIsPublic] = useState(false);
  const [editorError, setEditorError] = useState("");

  useEffect(() => {
    // Check if Stripe Checkout Success
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      setNotification("Successfully upgraded to Pro! Welcome to unlimited snippets.");
      // Clean query params
      setSearchParams({});
    }
    fetchInitialData();
  }, []);

  // Fetch all user snippets whenever filters change
  useEffect(() => {
    fetchSnippets();
  }, [searchQuery, selectedFolderId, selectedTagName]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const userRes = await api.get("/me");
      setUser(userRes.data);

      const foldersRes = await api.get("/folders");
      setFolders(foldersRes.data);

      const tagsRes = await api.get("/tags");
      setTags(tagsRes.data);

      await fetchSnippets();
    } catch (err) {
      console.error("Failed to load initial data", err);
      // Unauthorized or invalid token -> will be caught by axios response interceptor
    } finally {
      setLoading(false);
    }
  };

  const fetchSnippets = async () => {
    try {
      let url = "/snippets?";
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
      if (selectedFolderId) url += `folder_id=${selectedFolderId}&`;
      if (selectedTagName) url += `tag=${encodeURIComponent(selectedTagName)}&`;

      const res = await api.get(url);
      setSnippets(res.data);
    } catch (err) {
      console.error("Failed to fetch snippets", err);
    }
  };

  const fetchFoldersAndTags = async () => {
    try {
      const foldersRes = await api.get("/folders");
      setFolders(foldersRes.data);
      const tagsRes = await api.get("/tags");
      setTags(tagsRes.data);
      // Refresh user details to update usage limits
      const userRes = await api.get("/me");
      setUser(userRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Auth Operations
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleUpgrade = async () => {
    try {
      setStripeLoading(true);
      const response = await api.post("/create-razorpay-order");
      const { order_id, amount, currency, key_id } = response.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "SnipLibrary Pro",
        description: "Unlock Unlimited Snippets & Folders",
        order_id: order_id,
        handler: async function (paymentResponse) {
          try {
            const verifyResponse = await api.post("/verify-payment", {
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });
            if (verifyResponse.data.status === "success") {
              setNotification("Successfully upgraded to Pro! Welcome to unlimited snippets.");
              fetchFoldersAndTags();
            }
          } catch (err) {
            alert("Payment verification failed: " + (err.response?.data?.detail || err.message));
          }
        },
        prefill: {
          email: user?.email || "",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        alert("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (err) {
      alert("Failed to initialize payment checkout: " + (err.response?.data?.detail || err.message));
    } finally {
      setStripeLoading(false);
    }
  };

  // Folder Operations
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    setFolderError("");
    if (!newFolderName.trim()) return;

    try {
      await api.post("/folders", { name: newFolderName });
      setNewFolderName("");
      setIsFolderModalOpen(false);
      await fetchFoldersAndTags();
      setNotification("Folder created successfully!");
    } catch (err) {
      setFolderError(err.response?.data?.detail || "Failed to create folder");
    }
  };

  // Snippet Operations
  const handleCopySnippet = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleCopyShareLink = (slug) => {
    const shareLink = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(shareLink);
    setCopiedShareSlug(slug);
    setTimeout(() => setCopiedShareSlug(null), 2000);
  };

  const handleDeleteSnippet = async (id) => {
    if (!confirm("Are you sure you want to delete this snippet?")) return;
    try {
      await api.delete(`/snippets/${id}`);
      setNotification("Snippet deleted.");
      fetchSnippets();
      fetchFoldersAndTags();
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.detail || err.message));
    }
  };

  // Editor Modal Opening
  const openEditor = (snippet = null) => {
    setEditorError("");
    if (snippet) {
      setEditingSnippet(snippet);
      setSnippetTitle(snippet.title);
      setSnippetContent(snippet.content);
      setSnippetLanguage(snippet.language);
      setSnippetFolderId(snippet.folder_id || "");
      setSnippetTagsString(snippet.tags.map(t => t.name).join(", "));
      setSnippetIsPublic(snippet.is_public);
    } else {
      setEditingSnippet(null);
      setSnippetTitle("");
      setSnippetContent("");
      setSnippetLanguage("plaintext");
      setSnippetFolderId("");
      setSnippetTagsString("");
      setSnippetIsPublic(false);
    }
    setIsEditorOpen(true);
  };

  // Editor Form Submit
  const handleSaveSnippet = async (e) => {
    e.preventDefault();
    setEditorError("");

    const tagsArray = snippetTagsString
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = {
      title: snippetTitle,
      content: snippetContent,
      language: snippetLanguage,
      folder_id: snippetFolderId ? parseInt(snippetFolderId) : null,
      is_public: snippetIsPublic,
      tags: tagsArray
    };

    try {
      if (editingSnippet) {
        await api.put(`/snippets/${editingSnippet.id}`, payload);
        setNotification("Snippet updated successfully!");
      } else {
        await api.post("/snippets", payload);
        setNotification("Snippet created successfully!");
      }
      setIsEditorOpen(false);
      fetchSnippets();
      fetchFoldersAndTags();
    } catch (err) {
      setEditorError(err.response?.data?.detail || "Failed to save snippet.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-200 flex flex-col md:flex-row">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-xl bg-gray-900 border border-indigo-500/30 text-indigo-300 shadow-2xl flex items-center justify-between gap-4 max-w-sm">
          <span className="text-sm font-semibold">{notification}</span>
          <button onClick={() => setNotification("")} className="text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0e1322] border-r border-gray-800 flex flex-col justify-between shrink-0">
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Code className="h-6 w-6 text-indigo-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              SnipLibrary
            </span>
          </div>

          {/* User Details */}
          {user && (
            <div className="p-4 rounded-xl bg-gray-900/40 border border-gray-800">
              <div className="text-xs text-gray-400 truncate mb-1">{user.email}</div>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${user.is_pro ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "bg-gray-800 text-gray-400"}`}>
                  {user.is_pro ? "Pro Member" : "Free Account"}
                </span>
                {!user.is_pro && (
                  <button
                    onClick={handleUpgrade}
                    disabled={stripeLoading}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="h-3 w-3" /> Upgrade
                  </button>
                )}
              </div>
            </div>
          )}

          {/* New Snippet Button */}
          <button
            onClick={() => openEditor()}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
          >
            <Plus className="h-4 w-4" /> New Snippet
          </button>

          {/* Filters List */}
          <div className="flex flex-col gap-4">
            {/* All Snippets */}
            <button
              onClick={() => { setSelectedFolderId(null); setSelectedTagName(null); }}
              className={`w-full py-2 px-3 text-left rounded-lg text-sm transition flex items-center justify-between font-medium ${!selectedFolderId && !selectedTagName ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" : "text-gray-400 hover:bg-gray-900"}`}
            >
              <span>All Snippets</span>
            </button>

            {/* Folders Section */}
            <div>
              <div className="flex justify-between items-center px-1 mb-2">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Folders</span>
                {user?.is_pro ? (
                  <button
                    onClick={() => setIsFolderModalOpen(true)}
                    className="text-gray-400 hover:text-indigo-400 transition"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </button>
                ) : (
                  <span className="text-gray-600"><Lock className="h-3.5 w-3.5" /></span>
                )}
              </div>
              <div className="space-y-1">
                {folders.map(f => (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedFolderId(f.id); setSelectedTagName(null); }}
                    className={`w-full py-1.5 px-3 text-left rounded-lg text-xs transition flex items-center gap-2 ${selectedFolderId === f.id ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/15" : "text-gray-400 hover:bg-gray-900"}`}
                  >
                    <Folder className="h-3.5 w-3.5" />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
                {folders.length === 0 && (
                  <div className="text-[11px] text-gray-600 px-3">No folders yet</div>
                )}
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <div className="px-1 mb-2">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Tags</span>
              </div>
              <div className="flex flex-wrap gap-1 px-1">
                {tags.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setSelectedTagName(t.name === selectedTagName ? null : t.name); setSelectedFolderId(null); }}
                    className={`text-[10px] px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${selectedTagName === t.name ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40" : "bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gray-700"}`}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    <span>{t.name}</span>
                  </button>
                ))}
                {tags.length === 0 && (
                  <div className="text-[11px] text-gray-600">No tags used yet</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Free Tier Usage Counter & Logout */}
        <div className="p-6 border-t border-gray-800 bg-gray-950/40 space-y-4">
          {user && !user.is_pro && (
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
              <div className="text-[11px] text-gray-400 flex justify-between font-semibold mb-1.5">
                <span>Free Tier Limit</span>
                <span className="text-indigo-400">{snippets.length} / 10 Used</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-500 h-1.5 transition-all duration-300"
                  style={{ width: `${Math.min((snippets.length / 10) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-2 text-center text-xs font-semibold rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0d16]">
        {/* Search & Top Action Bar */}
        <header className="p-6 border-b border-gray-800 flex justify-between items-center gap-4 bg-[#0e1322]/20">
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-gray-900/60 border border-gray-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm transition"
              placeholder="Search title, description, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* Snippets Area */}
        <section className="flex-1 p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading snippets...</div>
          ) : snippets.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl max-w-xl mx-auto flex flex-col items-center justify-center">
              <Code className="h-10 w-10 text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-400">No Snippets Found</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6 px-10">
                Create a new code block or prompt by clicking the button in the sidebar.
              </p>
              <button
                onClick={() => openEditor()}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
              >
                Create First Snippet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {snippets.map(s => (
                <div
                  key={s.id}
                  className="p-5 rounded-2xl bg-[#0e1322]/60 border border-gray-800 hover:border-gray-700/80 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-100">{s.title}</h3>
                        <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          {s.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditor(s)}
                          className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-gray-800/80 rounded transition"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSnippet(s.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-800/80 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Code Editor Preview */}
                    <div className="relative bg-gray-950/80 rounded-xl border border-gray-800 p-4 mb-4 select-text">
                      <pre className="text-xs font-mono overflow-x-auto text-gray-300 leading-relaxed max-h-48 whitespace-pre-wrap">
                        <code>{s.content}</code>
                      </pre>
                      <button
                        onClick={() => handleCopySnippet(s.id, s.content)}
                        className="absolute top-3 right-3 p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition"
                      >
                        {copiedSnippetId === s.id ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-auto pt-3 border-t border-gray-800/60">
                    <div className="flex items-center gap-1.5">
                      {s.tags.map(t => (
                        <span key={t.id} className="text-[9px] px-2 py-0.5 rounded-full bg-gray-900 border border-gray-800 text-gray-400 font-medium">
                          #{t.name}
                        </span>
                      ))}
                    </div>

                    {/* Sharing Option */}
                    <div className="flex items-center gap-2">
                      {s.is_public ? (
                        <button
                          onClick={() => handleCopyShareLink(s.slug)}
                          className="text-[10px] text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded border border-indigo-500/20 flex items-center gap-1"
                        >
                          <Share2 className="h-3 w-3" />
                          <span>{copiedShareSlug === s.slug ? "Copied Share URL!" : "Copy Share Link"}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-500 flex items-center gap-1">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-2xl bg-[#0e1322] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingSnippet ? "Edit Snippet" : "Create Snippet"}</h2>
              <button onClick={() => setIsEditorOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSnippet} className="p-6 space-y-4">
              {editorError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{editorError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Center a Div or OpenAI prompt helper"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm transition"
                  value={snippetTitle}
                  onChange={(e) => setSnippetTitle(e.target.value)}
                />
              </div>

              {/* Code/Prompt Content */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Content</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste your code block or prompt text here..."
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm font-mono transition"
                  value={snippetContent}
                  onChange={(e) => setSnippetContent(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Language Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Language</label>
                  <select
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm transition"
                    value={snippetLanguage}
                    onChange={(e) => setSnippetLanguage(e.target.value)}
                  >
                    <option value="plaintext">Plaintext / Prompt</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="sql">SQL</option>
                    <option value="bash">Bash / Shell</option>
                  </select>
                </div>

                {/* Folder Select */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase flex items-center justify-between">
                    <span>Folder</span>
                    {!user?.is_pro && <Lock className="h-3 w-3 text-gray-500" />}
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    value={snippetFolderId}
                    onChange={(e) => setSnippetFolderId(e.target.value)}
                    disabled={!user?.is_pro}
                  >
                    <option value="">Uncategorized</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags input */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. react, hooks, prompt (max 3 tags on free tier)"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm transition"
                  value={snippetTagsString}
                  onChange={(e) => setSnippetTagsString(e.target.value)}
                />
              </div>

              {/* Public sharing toggle */}
              <div className="flex items-center justify-between py-2 border-t border-b border-gray-800/80">
                <div>
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    <span>Share Publicly</span>
                    {!user?.is_pro && <Lock className="h-3.5 w-3.5 text-gray-500" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">Generate a shareable public view link</p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-indigo-500 disabled:opacity-50"
                  checked={snippetIsPublic}
                  onChange={(e) => setSnippetIsPublic(e.target.checked)}
                  disabled={!user?.is_pro}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Folder Creation Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md bg-[#0e1322] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">New Folder</h2>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="p-6 space-y-4">
              {folderError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{folderError}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase">Folder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prompt Helpers or Styling UI"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl focus:border-indigo-500 focus:outline-none text-sm transition"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-900 border border-gray-800 hover:bg-gray-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
