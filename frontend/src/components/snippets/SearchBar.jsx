import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search snippets...' }) {
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <span style={{
        position: 'absolute',
        left: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        display: 'flex',
        pointerEvents: 'none',
      }}>
        <Search size={16} />
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px 14px 10px 42px',
          fontSize: '14px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          transition: 'var(--transition-fast)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--orange-500)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-primary)'}
      />
      <span style={{
        position: 'absolute',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '11px',
        color: 'var(--text-muted)',
        backgroundColor: 'var(--bg-tertiary)',
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid var(--border-primary)',
        pointerEvents: 'none',
      }}>
        ⌘K
      </span>
    </div>
  );
}
