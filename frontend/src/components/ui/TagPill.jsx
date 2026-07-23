import React from 'react';

const TAG_COLORS = {
  'ai': { bg: 'rgba(249, 115, 22, 0.12)', color: '#FB923C', border: 'rgba(249, 115, 22, 0.2)' },
  'ai prompt': { bg: 'rgba(249, 115, 22, 0.12)', color: '#FB923C', border: 'rgba(249, 115, 22, 0.2)' },
  'gpt': { bg: 'rgba(249, 115, 22, 0.12)', color: '#FB923C', border: 'rgba(249, 115, 22, 0.2)' },
  'code': { bg: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', border: 'rgba(59, 130, 246, 0.2)' },
  'code review': { bg: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', border: 'rgba(59, 130, 246, 0.2)' },
  'javascript': { bg: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', border: 'rgba(59, 130, 246, 0.2)' },
  'python': { bg: 'rgba(59, 130, 246, 0.12)', color: '#60A5FA', border: 'rgba(59, 130, 246, 0.2)' },
  'sql': { bg: 'rgba(34, 197, 94, 0.12)', color: '#4ADE80', border: 'rgba(34, 197, 94, 0.2)' },
  'pagination': { bg: 'rgba(34, 197, 94, 0.12)', color: '#4ADE80', border: 'rgba(34, 197, 94, 0.2)' },
  'meetings': { bg: 'rgba(168, 85, 247, 0.12)', color: '#C084FC', border: 'rgba(168, 85, 247, 0.2)' },
  'meeting': { bg: 'rgba(168, 85, 247, 0.12)', color: '#C084FC', border: 'rgba(168, 85, 247, 0.2)' },
};

const DEFAULT_COLOR = { bg: 'var(--orange-glow)', color: 'var(--text-secondary)', border: 'var(--border-primary)' };

function getTagColor(tagName) {
  const lower = tagName.toLowerCase();
  for (const key of Object.keys(TAG_COLORS)) {
    if (lower.includes(key)) return TAG_COLORS[key];
  }
  return DEFAULT_COLOR;
}

export default function TagPill({
  name,
  active = false,
  removable = false,
  onClick,
  onRemove,
  size = 'sm',
}) {
  const colors = getTagColor(name);
  const isSmall = size === 'sm';

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: isSmall ? '2px 8px' : '4px 12px',
        fontSize: isSmall ? '11px' : '12px',
        fontWeight: 500,
        fontFamily: 'var(--font-sans)',
        borderRadius: '99px',
        backgroundColor: active ? 'var(--orange-500)' : colors.bg,
        color: active ? '#FFFFFF' : colors.color,
        border: `1px solid ${active ? 'var(--orange-500)' : colors.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-fast)',
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
        userSelect: 'none',
      }}
    >
      {name}
      {removable && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            fontSize: isSmall ? '13px' : '14px',
            lineHeight: 1,
            display: 'flex',
            opacity: 0.7,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
