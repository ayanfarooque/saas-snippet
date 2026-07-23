import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Copy, Check, Edit3, Share2, MoreHorizontal, Trash2, Star } from 'lucide-react';
import TagPill from '../ui/TagPill';

function timeAgo(dateStr) {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}

export default function SnippetCard({ snippet, onDelete, onCopy, isFavorite, onToggleFavorite }) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    onCopy?.(snippet.id);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/dashboard/${snippet.id}`);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    if (snippet.slug) {
      const url = `${window.location.origin}/s/${snippet.slug}`;
      navigator.clipboard.writeText(url);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm('Delete this snippet?')) onDelete?.(snippet.id);
  };

  return (
    <div
      onClick={() => navigate(`/dashboard/${snippet.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '20px',
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--bg-secondary)',
        boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative',
      }}
    >
      {/* Title row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{
          fontSize: '15px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          marginRight: '8px',
        }}>
          {snippet.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(snippet.id);
          }}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            color: isFavorite ? 'var(--orange-500)' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--orange-500)'}
          onMouseLeave={e => e.currentTarget.style.color = isFavorite ? 'var(--orange-500)' : 'var(--text-muted)'}
        >
          <Star 
            size={16} 
            fill={isFavorite ? 'currentColor' : 'none'} 
            strokeWidth={isFavorite ? 0 : 2}
          />
        </button>
      </div>

      {/* Content preview */}
      <div style={{
        fontSize: '12px',
        fontFamily: 'monospace',
        color: 'var(--text-muted)',
        lineHeight: 1.5,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {snippet.content}
      </div>

      {/* Tags */}
      {snippet.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {snippet.tags.map(tag => (
            <TagPill key={tag.id || tag.name} name={tag.name || tag} size="sm" />
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '4px',
      }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {timeAgo(snippet.created_at)}
          {snippet.language && snippet.language !== 'plaintext' && (
            <> · {snippet.language}</>
          )}
        </span>

        {/* Action buttons — visible on hover */}
        <div style={{
          display: 'flex',
          gap: '4px',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s ease',
        }}>
          <button
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: copied ? 'var(--orange-500)' : 'var(--bg-tertiary)',
              color: copied ? '#fff' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition-fast)',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
          </button>
          <button
            onClick={handleEdit}
            title="Edit"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '5px', borderRadius: 'var(--radius-sm)', border: 'none',
              backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)',
              cursor: 'pointer', transition: 'var(--transition-fast)',
            }}
          >
            <Edit3 size={13} />
          </button>
          <button
            onClick={handleDelete}
            title="Delete"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '5px', borderRadius: 'var(--radius-sm)', border: 'none',
              backgroundColor: 'var(--bg-tertiary)', color: 'var(--red-500)',
              cursor: 'pointer', transition: 'var(--transition-fast)',
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
