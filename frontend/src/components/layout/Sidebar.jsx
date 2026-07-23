import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FileText, Folder, Star, Trash2, Settings, LogOut, Sparkles, Lock, Sun, Moon, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TagPill from '../ui/TagPill';

export default function Sidebar({
  tags = [],
  folders = [],
  activeTagName,
  activeFolderId,
  onTagClick,
  onFolderClick,
  onShowAll,
  onUpgrade,
  onNewFolderClick,
}) {
  const { user, logout, isPro } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'All Snippets', icon: FileText, path: '/dashboard', onClick: onShowAll },
    { label: 'Folders', icon: Folder, path: '/dashboard/folders', pro: true },
    { label: 'Favorites', icon: Star, path: '/dashboard/favorites' },
    { label: 'Trash', icon: Trash2, path: '/dashboard/trash' },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-primary)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
      transition: 'var(--transition-theme)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-primary)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: 'var(--orange-500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="10" height="1.5" rx="0.5" fill="white" />
              <rect x="2" y="5.5" width="7" height="1.5" rx="0.5" fill="white" />
              <rect x="2" y="9" width="10" height="1.5" rx="0.5" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: '17px', fontWeight: 400, color: 'var(--text-primary)' }}>
            snip<span style={{ fontWeight: 700, color: 'var(--orange-500)' }}>vault</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div style={{ padding: '12px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {navItems.map(item => {
          const isActive = item.path === '/dashboard' && !activeTagName && !activeFolderId && location.pathname === '/dashboard';
          const isDisabled = item.pro && !isPro;

          return (
            <div
              key={item.label}
              style={{ position: 'relative' }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.children[0].style.backgroundColor = 'var(--bg-tertiary)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.children[0].style.backgroundColor = 'transparent';
              }}
            >
              <button
                onClick={() => {
                  if (isDisabled) return onUpgrade?.();
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--orange-500)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--orange-glow)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '2px solid var(--orange-500)' : '2px solid transparent',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition-fast)',
                  opacity: isDisabled ? 0.5 : 1,
                }}
              >
                <item.icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.pro && !isPro && <Lock size={12} style={{ color: 'var(--text-muted)' }} />}
              </button>
              
              {item.label === 'Folders' && isPro && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNewFolderClick) onNewFolderClick();
                  }}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    borderRadius: '4px',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--orange-500)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  title="Create new folder"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
          );
        })}

        {/* Folder list */}
        {isPro && folders.length > 0 && (
          <div style={{ marginTop: '8px', paddingLeft: '12px' }}>
            {folders.map(f => (
              <button
                key={f.id}
                onClick={() => onFolderClick?.(f.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '12px',
                  fontWeight: activeFolderId === f.id ? 600 : 400,
                  color: activeFolderId === f.id ? 'var(--orange-500)' : 'var(--text-muted)',
                  backgroundColor: activeFolderId === f.id ? 'var(--orange-glow)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                  transition: 'var(--transition-fast)',
                }}
              >
                <Folder size={13} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Tags filter */}
        {tags.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '0 12px',
              marginBottom: '10px',
            }}>
              Filter by tag
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '0 12px' }}>
              {tags.map(t => (
                <TagPill
                  key={t.id}
                  name={t.name}
                  active={activeTagName === t.name}
                  onClick={() => onTagClick?.(t.name)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom user section */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-primary)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--orange-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--orange-500)',
              flexShrink: 0,
            }}>
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {user.email}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '99px',
                  backgroundColor: isPro ? 'var(--orange-glow)' : 'var(--bg-tertiary)',
                  color: isPro ? 'var(--orange-500)' : 'var(--text-muted)',
                  border: isPro ? '1px solid rgba(249,115,22,0.2)' : '1px solid var(--border-primary)',
                }}>
                  {isPro ? 'Pro' : 'Free'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={toggleTheme}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition-fast)',
            }}
          >
            {isDark ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <Link
            to="/account"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              textDecoration: 'none',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition-fast)',
            }}
          >
            <Settings size={13} />
          </Link>
          <button
            onClick={logout}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '7px',
              fontSize: '12px',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              transition: 'var(--transition-fast)',
            }}
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
