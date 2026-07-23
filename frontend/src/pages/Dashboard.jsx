import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import useDebounce from '../hooks/useDebounce';
import api from '../lib/api';
import SearchBar from '../components/snippets/SearchBar';
import SnippetGrid from '../components/snippets/SnippetGrid';
import Button from '../components/ui/Button';

export default function Dashboard() {
  const { isPro } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { setShowUpgrade } = useOutletContext();

  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  // Parse filters from URL
  const searchParams = new URLSearchParams(window.location.search);
  const activeTagName = searchParams.get('tag');
  const activeFolderId = searchParams.get('folder_id') ? parseInt(searchParams.get('folder_id')) : null;

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchSnippets = useCallback(async () => {
    try {
      let url = '/snippets?';
      if (debouncedSearch) url += `search=${encodeURIComponent(debouncedSearch)}&`;
      if (activeTagName) url += `tag=${encodeURIComponent(activeTagName)}&`;
      if (activeFolderId) url += `folder_id=${activeFolderId}&`;
      const res = await api.get(url);
      let data = res.data || [];
      if (sortOrder === 'oldest') data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      else if (sortOrder === 'az') data.sort((a, b) => a.title.localeCompare(b.title));
      else data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setSnippets(data);
    } catch (err) {
      console.error('Failed to fetch snippets:', err);
    }
  }, [debouncedSearch, activeTagName, activeFolderId, sortOrder]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchSnippets();
      setLoading(false);
    };
    load();
  }, [fetchSnippets]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/snippets/${id}`);
      addToast('Snippet deleted', 'success');
      fetchSnippets();
      // We don't trigger fetchMeta here, it's handled by Layout, but snippets update is enough.
    } catch (err) {
      addToast('Failed to delete snippet', 'error');
    }
  };

  const handleCopy = () => {
    addToast('Copied to clipboard!', 'success');
  };

  const handleNewSnippet = () => {
    if (!isPro && snippets.length >= 10) {
      setShowUpgrade(true);
      return;
    }
    navigate('/dashboard/new');
  };

  const clearTag = () => navigate('/dashboard' + (activeFolderId ? `?folder_id=${activeFolderId}` : ''));
  const clearFolder = () => navigate('/dashboard' + (activeTagName ? `?tag=${encodeURIComponent(activeTagName)}` : ''));

  const snippetCount = snippets.length;
  const snippetLimit = 10;

  return (
    <>
      {/* Top bar */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'var(--bg-primary)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ width: '40px' }} className="mobile-spacer" />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <select
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          style={{
            padding: '9px 12px',
            fontSize: '13px',
            fontFamily: 'var(--font-sans)',
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="az">A-Z</option>
        </select>
        <Button variant="primary" size="sm" onClick={handleNewSnippet}>
          <Plus size={15} />
          <span className="desktop-only">New snippet</span>
        </Button>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {(activeTagName || activeFolderId) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Filtered by:</span>
            {activeTagName && (
              <span
                onClick={clearTag}
                style={{
                  padding: '3px 10px', borderRadius: '99px', cursor: 'pointer',
                  backgroundColor: 'var(--orange-glow)', color: 'var(--orange-500)',
                  border: '1px solid rgba(249,115,22,0.2)', fontSize: '12px', fontWeight: 500,
                }}
              >
                {activeTagName} ×
              </span>
            )}
            {activeFolderId && (
              <span
                onClick={clearFolder}
                style={{
                  padding: '3px 10px', borderRadius: '99px', cursor: 'pointer',
                  backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                  border: '1px solid var(--border-primary)', fontSize: '12px', fontWeight: 500,
                }}
              >
                Folder ×
              </span>
            )}
          </div>
        )}
        <SnippetGrid
          snippets={snippets}
          loading={loading}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onNew={handleNewSnippet}
        />
      </div>

      {/* Free tier limit bar */}
      {!isPro && !loading && (
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
        }}>
          <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            {snippetCount} of {snippetLimit} snippets used
          </span>
          <div style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'var(--bg-tertiary)',
            overflow: 'hidden',
            maxWidth: '200px',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (snippetCount / snippetLimit) * 100)}%`,
              backgroundColor: snippetCount >= snippetLimit ? 'var(--red-500)' : 'var(--orange-500)',
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            }} />
          </div>
          <button
            onClick={() => setShowUpgrade(true)}
            style={{
              fontSize: '13px', fontWeight: 500, color: 'var(--orange-500)',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Upgrade to Pro
          </button>
        </div>
      )}
    </>
  );
}
