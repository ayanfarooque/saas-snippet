import React from 'react';
import { ArchiveX, Star } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function DashboardPlaceholder() {
  const location = useLocation();
  const isTrash = location.pathname.includes('trash');
  
  const Icon = isTrash ? ArchiveX : Star;
  const title = isTrash ? 'Trash is empty' : 'No favorites yet';
  const description = isTrash 
    ? 'Items in trash will appear here before they are permanently deleted.'
    : 'Star your most used snippets to access them quickly here.';

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px',
      textAlign: 'center',
      backgroundColor: 'var(--bg-primary)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
      }}>
        <Icon size={28} style={{ color: 'var(--text-muted)' }} />
      </div>
      <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {title}
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '320px' }}>
        {description}
      </p>
    </div>
  );
}
