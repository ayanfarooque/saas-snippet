import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function BrandPanel() {
  return (
    <div style={{
      flex: 1,
      backgroundColor: '#0C0C0C',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '48px',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '300px',
    }}>
      {/* Glow orb */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        height: '350px',
        background: 'radial-gradient(ellipse, rgba(249,115,22,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '360px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            backgroundColor: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="2" width="10" height="1.5" rx="0.5" fill="white" />
              <rect x="2" y="5.5" width="7" height="1.5" rx="0.5" fill="white" />
              <rect x="2" y="9" width="10" height="1.5" rx="0.5" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 400, color: '#FAFAF8' }}>
            snip<span style={{ fontWeight: 700, color: '#F97316' }}>vault</span>
          </span>
        </div>

        <p style={{ fontSize: '18px', fontWeight: 600, color: '#FAFAF8', marginBottom: '32px', lineHeight: 1.4 }}>
          Your prompts, always ready.
        </p>

        {/* Testimonials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { initials: 'SK', quote: '"Replaced my entire Notion snippets database in 10 minutes."' },
            { initials: 'AM', quote: '"The search is insanely fast. I find any prompt instantly."' },
            { initials: 'RJ', quote: '"Public sharing links are a game-changer for my team."' },
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px', textAlign: 'left',
              padding: '12px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.04)',
            }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: 'rgba(249,115,22,0.15)', color: '#FB923C',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', fontWeight: 600,
              }}>
                {t.initials}
              </div>
              <span style={{ fontSize: '13px', color: '#A1A1AA', lineHeight: 1.5, fontStyle: 'italic' }}>
                {t.quote}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left brand panel — hidden on mobile */}
      <div className="auth-brand-panel" style={{ flex: 1, display: 'flex' }}>
        <BrandPanel />
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        backgroundColor: 'var(--bg-primary)',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h1 className="heading-lg" style={{ fontSize: '28px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Sign in to access your snippet library
          </p>

          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '20px',
              backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              fontSize: '13px', color: 'var(--red-500)',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              id="login-email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              required
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              required
            />
            <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: '8px' }}>
              Sign in
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px' }}>
            Don&apos;t have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--orange-500)', fontWeight: 500, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
