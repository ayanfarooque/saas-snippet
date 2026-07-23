import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import SnippetEditor from '../components/snippets/SnippetEditor';

export default function EditSnippet() {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { folders } = useOutletContext();

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const res = await api.get(`/snippets/${id}`);
        setSnippet(res.data);
      } catch (err) {
        console.error('Failed to fetch snippet:', err);
        addToast('Snippet not found', 'error');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await api.put(`/snippets/${id}`, data);
      addToast('Snippet updated!', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update snippet:', err);
      addToast(err.response?.data?.detail || 'Failed to update snippet', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;
    try {
      await api.delete(`/snippets/${id}`);
      addToast('Snippet deleted', 'success');
      navigate('/dashboard');
    } catch (err) {
      addToast('Failed to delete snippet', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flex: 1, backgroundColor: 'var(--bg-primary)',
      }}>
        <Loader2 size={24} style={{ color: 'var(--orange-500)', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg-primary)' }}>
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'var(--bg-secondary)',
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontSize: '13px', fontFamily: 'var(--font-sans)',
          }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
          Edit snippet
        </span>
      </div>

      {snippet && (
        <SnippetEditor
          folders={folders}
          initialData={snippet}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => navigate('/dashboard')}
          saving={saving}
        />
      )}
    </div>
  );
}
