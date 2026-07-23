import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: {
    backgroundColor: 'var(--orange-500)',
    color: '#FFFFFF',
    border: 'none',
    hoverBg: 'var(--orange-600)',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-secondary)',
    hoverBg: 'var(--bg-tertiary)',
  },
  danger: {
    backgroundColor: 'transparent',
    color: 'var(--red-500)',
    border: '1px solid var(--red-500)',
    hoverBg: 'rgba(239, 68, 68, 0.1)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
    hoverBg: 'var(--bg-tertiary)',
  },
};

const sizes = {
  sm: { padding: '6px 12px', fontSize: '13px' },
  md: { padding: '10px 20px', fontSize: '14px' },
  lg: { padding: '12px 28px', fontSize: '15px' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  style = {},
  ...props
}) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 500,
        fontSize: s.fontSize,
        padding: s.padding,
        borderRadius: 'var(--radius-md)',
        backgroundColor: v.backgroundColor,
        color: v.color,
        border: v.border,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.55 : 1,
        transition: 'var(--transition-fast)',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        textDecoration: 'none',
        lineHeight: 1,
        ...style,
      }}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          e.currentTarget.style.backgroundColor = v.hoverBg;
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = v.backgroundColor;
      }}
      {...props}
    >
      {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
      {children}
    </button>
  );
}
