import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

function Logo() {
  return (
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
  );
}

export { Logo };

export default function Navbar({ variant = 'landing' }) {
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = variant === 'landing';
  const navLinks = isLanding ? [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ] : [];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: isDark ? 'rgba(12, 12, 12, 0.8)' : 'rgba(250, 250, 248, 0.8)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-primary)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Left: Logo */}
        <Logo />

        {/* Center: Nav links (desktop) */}
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center',
        }}
        className="desktop-nav"
        >
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'var(--transition-fast)',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              padding: '6px',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition-fast)',
            }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">Dashboard →</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="sm">Get started free →</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '4px',
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="mobile-nav-menu"
          style={{
            padding: '16px 24px 24px',
            borderTop: '1px solid var(--border-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: 'var(--bg-primary)',
          }}
        >
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                padding: '8px 0',
              }}
            >
              {link.label}
            </a>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="primary" fullWidth>Dashboard →</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" fullWidth>Sign in</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                  <Button variant="primary" fullWidth>Get started free →</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .mobile-nav-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
