import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import SnippetEditor from '../components/snippets/SnippetEditor';

export default function NewSnippet() {
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const { folders } = useOutletContext();

  const handleSave = async (data) => {
    setSaving(true);
    try {
      await api.post('/snippets', data);
      addToast('Snippet created!', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create snippet:', err);
      addToast(err.response?.data?.detail || 'Failed to create snippet', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
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
          New snippet
        </span>
      </div>

      <SnippetEditor
        folders={folders}
        onSave={handleSave}
        onCancel={() => navigate('/dashboard')}
        saving={saving}
      />
    </div>
  );
}
