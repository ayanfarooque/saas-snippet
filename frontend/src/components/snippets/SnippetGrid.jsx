import React from 'react';
import { FileText, Plus } from 'lucide-react';
import SnippetCard from './SnippetCard';
import SkeletonCard from '../ui/SkeletonCard';
import Button from '../ui/Button';

export default function SnippetGrid({ snippets, loading, onDelete, onCopy, onNew }) {
  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px',
      }}>
        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!snippets || snippets.length === 0) {
    return (
      <div className="animate-fade-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--orange-glow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <FileText size={28} style={{ color: 'var(--orange-500)' }} />
        </div>
        <h3 className="heading-md" style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Save your first snippet
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '320px', marginBottom: '24px' }}>
          Start building your personal library of code snippets, AI prompts, and reusable text.
        </p>
        <Button variant="primary" onClick={onNew}>
          <Plus size={16} />
          New snippet
        </Button>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '16px',
    }}>
      {snippets.map(snippet => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}
