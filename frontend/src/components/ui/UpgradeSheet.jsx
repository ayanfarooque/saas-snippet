import React from 'react';
import { X, Sparkles } from 'lucide-react';
import Button from './Button';

export default function UpgradeSheet({ isOpen, onClose, onUpgrade }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 998,
        }}
      />
      {/* Sheet */}
      <div
        className="animate-slide-up"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-primary)',
          borderTopLeftRadius: 'var(--radius-xl)',
          borderTopRightRadius: 'var(--radius-xl)',
          padding: '32px',
          maxWidth: '560px',
          margin: '0 auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
          }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--orange-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={24} style={{ color: 'var(--orange-500)' }} />
          </div>

          <h3 className="heading-lg" style={{ fontSize: '22px', color: 'var(--text-primary)' }}>
            Unlock unlimited snippets
          </h3>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: 1.6 }}>
            You&apos;ve hit the free plan limit. Upgrade to Pro for unlimited snippets,
            folders, public sharing, and full-text search.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={onClose}>Maybe later</Button>
            <Button variant="primary" onClick={onUpgrade}>
              <Sparkles size={14} />
              Upgrade to Pro — ₹750/mo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
