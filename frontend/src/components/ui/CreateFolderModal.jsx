import React, { useState, useEffect, useRef } from 'react';
import { X, FolderPlus } from 'lucide-react';
import Button from './Button';

export default function CreateFolderModal({ isOpen, onClose, onSubmit }) {
  const [folderName, setFolderName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setFolderName('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSubmit(folderName.trim());
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Modal content */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '400px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-primary)',
            overflow: 'hidden',
            animation: 'slideUp 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-primary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                backgroundColor: 'var(--orange-glow)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--orange-500)'
              }}>
                <FolderPlus size={18} />
              </div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                New Folder
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', borderRadius: '4px'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Folder Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g. Work Projects"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--orange-500)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border-primary)'}
            />

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={!folderName.trim()}>
                Create Folder
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
