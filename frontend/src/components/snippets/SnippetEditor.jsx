import React, { useState } from 'react';
import { Lock, Link2, Copy, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import TagPill from '../ui/TagPill';
import Button from '../ui/Button';

const LANGUAGES = ['plaintext', 'javascript', 'python', 'sql', 'bash', 'ai-prompt', 'other'];

export default function SnippetEditor({
  initialData = {},
  folders = [],
  onSave,
  onDelete,
  onCancel,
  saving = false,
}) {
  const { isPro } = useAuth();

  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [language, setLanguage] = useState(initialData.language || 'plaintext');
  const [isPublic, setIsPublic] = useState(initialData.is_public || false);
  const [folderId, setFolderId] = useState(initialData.folder_id || '');
  const [tags, setTags] = useState(
    initialData.tags?.map(t => typeof t === 'string' ? t : t.name) || []
  );
  const [tagInput, setTagInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [previewTab, setPreviewTab] = useState('preview');

  const maxTags = isPro ? Infinity : 3;
  const slug = initialData.slug;

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(',', '');
      if (val && !tags.includes(val) && tags.length < maxTags) {
        setTags([...tags, val]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagName) => {
    setTags(tags.filter(t => t !== tagName));
  };

  const handleSubmit = () => {
    onSave?.({
      title,
      content,
      language,
      is_public: isPublic,
      folder_id: folderId ? parseInt(folderId) : null,
      tags,
    });
  };

  const handleCopyLink = () => {
    if (slug) {
      navigator.clipboard.writeText(`${window.location.origin}/s/${slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0',
      flex: 1,
      minHeight: 0,
    }}
    className="editor-layout"
    >
      {/* Left — Editor panel */}
      <div style={{
        padding: '28px',
        borderRight: '1px solid var(--border-primary)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Snippet title..."
          style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            letterSpacing: '-0.02em',
            width: '100%',
          }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* Language selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Language / Type
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                outline: 'none',
                width: '100%',
              }}
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1).replace('-', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Folder selector */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              Folder
            </label>
            <select
              value={folderId}
              onChange={e => setFolderId(e.target.value)}
              disabled={!isPro}
              style={{
                padding: '8px 12px',
                fontSize: '13px',
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                cursor: isPro ? 'pointer' : 'not-allowed',
                outline: 'none',
                width: '100%',
                opacity: isPro ? 1 : 0.6,
              }}
            >
              <option value="">No folder</option>
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            {!isPro && (
              <div style={{ fontSize: '11px', color: 'var(--orange-500)', marginTop: '4px' }}>
                Pro feature
              </div>
            )}
          </div>
        </div>

        {/* Content textarea */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
            Content
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Paste your snippet, prompt, or code here..."
            rows={12}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '13px',
              fontFamily: 'monospace',
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              resize: 'vertical',
              lineHeight: 1.6,
              transition: 'var(--transition-fast)',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--orange-500)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
          />
        </div>

        {/* Tags */}
        <div>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tags</span>
            <span style={{
              color: tags.length >= maxTags ? 'var(--orange-500)' : 'var(--text-muted)',
              fontWeight: tags.length >= maxTags ? 600 : 400,
            }}>
              {tags.length}/{isPro ? '∞' : maxTags}
            </span>
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            padding: '10px 12px',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-input)',
            minHeight: '42px',
            alignItems: 'center',
          }}>
            {tags.map(t => (
              <TagPill key={t} name={t} removable onRemove={() => handleRemoveTag(t)} />
            ))}
            {tags.length < maxTags && (
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? 'Type tag, press Enter' : ''}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  flex: 1,
                  minWidth: '80px',
                  padding: 0,
                }}
              />
            )}
          </div>
        </div>

        {/* Public toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
              Make public
            </label>
            {!isPro && <Lock size={13} style={{ color: 'var(--text-muted)' }} />}
          </div>
          <button
            onClick={() => isPro && setIsPublic(!isPublic)}
            style={{
              width: '40px',
              height: '22px',
              borderRadius: '11px',
              backgroundColor: isPublic ? 'var(--orange-500)' : 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              cursor: isPro ? 'pointer' : 'not-allowed',
              position: 'relative',
              transition: 'var(--transition-fast)',
              opacity: isPro ? 1 : 0.4,
              padding: 0,
            }}
          >
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              position: 'absolute',
              top: '2px',
              left: isPublic ? '20px' : '2px',
              transition: 'left 0.15s ease',
            }} />
          </button>
        </div>

        {/* Public URL */}
        {isPublic && slug && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            backgroundColor: 'var(--orange-glow)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(249,115,22,0.2)',
          }}>
            <Link2 size={14} style={{ color: 'var(--orange-500)', flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {window.location.origin}/s/{slug}
            </span>
            <button
              onClick={handleCopyLink}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                color: copiedLink ? 'var(--green-500)' : 'var(--orange-500)',
              }}
            >
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Right — Preview panel */}
      <div style={{
        padding: '28px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-primary)',
      }}>
        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          gap: '0',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-primary)',
        }}>
          {['preview', 'raw'].map(tab => (
            <button
              key={tab}
              onClick={() => setPreviewTab(tab)}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                color: previewTab === tab ? 'var(--orange-500)' : 'var(--text-muted)',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: previewTab === tab ? '2px solid var(--orange-500)' : '2px solid transparent',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'var(--transition-fast)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Preview content */}
        {title && (
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
        )}
        <div style={{
          flex: 1,
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-card)',
          fontSize: '13px',
          fontFamily: previewTab === 'raw' || language !== 'plaintext' ? 'monospace' : 'var(--font-sans)',
          color: 'var(--text-primary)',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflow: 'auto',
        }}>
          {content || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Start typing to see a preview...</span>}
        </div>

        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' }}>
            {tags.map(t => <TagPill key={t} name={t} />)}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={{
        gridColumn: '1 / -1',
        padding: '16px 28px',
        borderTop: '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-secondary)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          {onDelete && (
            <Button variant="danger" size="sm" onClick={onDelete}>
              Delete snippet
            </Button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            loading={saving}
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            Save changes
          </Button>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .editor-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
