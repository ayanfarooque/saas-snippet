import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import Button from '../components/ui/Button';
import TagPill from '../components/ui/TagPill';

export default function PublicSnippet() {
  const { slug } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const res = await api.get(`/s/${slug}`);
        setSnippet(res.data);
      } catch (err) {
        setError(err.response?.status === 404 ? 'Snippet not found' : 'Failed to load snippet');
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, [slug]);

  const handleCopy = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: 'var(--bg-primary)',
      }}>
        <Loader2 size={24} style={{ color: 'var(--orange-500)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: 'var(--bg-primary)', gap: '16px', padding: '24px',
      }}>
        <AlertCircle size={32} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)' }}>{error}</h2>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="sm">Go home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Minimal navbar */}
      <nav style={{
        borderBottom: '1px solid var(--border-primary)',
        padding: '0 24px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '5px',
            backgroundColor: 'var(--orange-500)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="10" height="1.5" rx="0.5" fill="white" />
              <rect x="2" y="5.5" width="7" height="1.5" rx="0.5" fill="white" />
              <rect x="2" y="9" width="10" height="1.5" rx="0.5" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 400, color: 'var(--text-primary)' }}>
            snip<span style={{ fontWeight: 700, color: 'var(--orange-500)' }}>vault</span>
          </span>
        </Link>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="sm">Sign up free →</Button>
        </Link>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px 64px' }}>
        <div className="animate-fade-in">
          {/* Title */}
          <h1 className="heading-lg" style={{
            fontSize: '28px',
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            {snippet.title}
          </h1>

          {/* Meta */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}>
            <span>{snippet.language !== 'plaintext' ? snippet.language : 'Plain text'}</span>
            <span>·</span>
            <span>{new Date(snippet.created_at).toLocaleDateString()}</span>
          </div>

          {/* Tags */}
          {snippet.tags?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
              {snippet.tags.map((tag, i) => (
                <TagPill key={i} name={typeof tag === 'string' ? tag : tag.name} />
              ))}
            </div>
          )}

          {/* Content block */}
          <div style={{
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-card)',
            fontSize: '14px',
            fontFamily: snippet.language !== 'plaintext' ? 'monospace' : 'var(--font-sans)',
            color: 'var(--text-primary)',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            marginBottom: '24px',
          }}>
            {snippet.content}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button variant="primary" onClick={handleCopy}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy to clipboard'}
            </Button>
            <Button variant="secondary" onClick={() => {
              sessionStorage.setItem('snipvault_pending_save', JSON.stringify({
                title: snippet.title,
                content: snippet.content,
                language: snippet.language,
                tags: snippet.tags?.map(t => typeof t === 'string' ? t : t.name) || [],
                is_public: false,
              }));
              window.location.href = '/signup';
            }}>
              Save to my library
            </Button>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        borderTop: '1px solid var(--border-primary)',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Shared via <span style={{ fontWeight: 600, color: 'var(--orange-500)' }}>SnipVault</span>
        </p>
        <Link to="/signup" style={{
          fontSize: '13px',
          color: 'var(--orange-500)',
          textDecoration: 'none',
          fontWeight: 500,
        }}>
          Build your own library →
        </Link>
      </div>
    </div>
  );
}
