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

        <p style={{ fontSize: '18px', fontWeight: 600, color: '#FAFAF8', marginBottom: '16px', lineHeight: 1.4 }}>
          Start saving your best prompts today
        </p>
        <p style={{ fontSize: '14px', color: '#A1A1AA', lineHeight: 1.6 }}>
          Join 2,800+ developers, designers, and writers who trust SnipVault to keep their snippets organized and accessible.
        </p>
      </div>
    </div>
  );
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(email, password);
      addToast('Account created! Welcome to SnipVault.', 'success');
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string' && detail.toLowerCase().includes('already')) {
        setErrors({ email: detail });
      } else {
        setErrors({ general: detail || 'An error occurred during sign up.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="auth-brand-panel" style={{ flex: 1, display: 'flex' }}>
        <BrandPanel />
      </div>

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
            Create your account
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Free forever. No credit card required.
          </p>

          {errors.general && (
            <div style={{
              padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: '20px',
              backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              fontSize: '13px', color: 'var(--red-500)',
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              id="signup-email"
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={Mail}
              error={errors.email}
              required
            />
            <Input
              id="signup-password"
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              error={errors.password}
              required
            />
            <Input
              id="signup-confirm"
              label="Confirm password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              icon={Lock}
              error={errors.confirmPassword}
              required
            />
            <Button type="submit" variant="primary" fullWidth loading={loading} style={{ marginTop: '8px' }}>
              Create account
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: '24px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--orange-500)', fontWeight: 500, textDecoration: 'none' }}>
              Sign in
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
