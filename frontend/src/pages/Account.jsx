import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Download, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/api';
import Button from '../components/ui/Button';

export default function Account() {
  const { user, isPro, refreshUser, logout } = useAuth();
  const { addToast } = useToast();
  const [snippetCount, setSnippetCount] = useState(0);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await api.get('/snippets');
        setSnippetCount(res.data?.length || 0);
      } catch {}
    };
    fetchCount();
  }, []);

  const handleUpgrade = async () => {
    try {
      const response = await api.post('/create-razorpay-order');
      const { order_id, amount, currency, key_id } = response.data;

      const options = {
        key: key_id,
        amount,
        currency,
        name: 'SnipVault Pro',
        description: 'Unlock Unlimited Snippets & Folders',
        order_id,
        handler: async function (paymentResponse) {
          try {
            await api.post('/verify-payment', {
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_signature: paymentResponse.razorpay_signature,
            });
            addToast('Successfully upgraded to Pro!', 'success');
            refreshUser();
          } catch (err) {
            addToast('Payment verification failed', 'error');
          }
        },
        prefill: { email: user?.email || '' },
        theme: { color: '#F97316' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      addToast('Failed to initialize checkout', 'error');
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your Pro subscription? You will lose access to Pro features.')) return;
    setCancelling(true);
    try {
      await api.post('/cancel-subscription');
      addToast('Subscription cancelled', 'info');
      refreshUser();
    } catch (err) {
      addToast('Failed to cancel subscription', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleExport = async () => {
    if (!isPro) {
      addToast('Export is a Pro feature', 'info');
      return;
    }
    try {
      const res = await api.get('/snippets');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'snipvault-export.json';
      a.click();
      URL.revokeObjectURL(url);
      addToast('Snippets exported!', 'success');
    } catch (err) {
      addToast('Export failed', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: '0 24px' }}>
      {/* Header */}
      <div style={{
        maxWidth: '640px',
        margin: '0 auto',
        padding: '20px 0',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <Link
          to="/dashboard"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'none',
            transition: 'var(--transition-fast)',
          }}
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
        <h1 className="heading-lg" style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '16px' }}>
          Account
        </h1>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '32px 0 64px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Plan section */}
        <div style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Current plan</h2>
            <span style={{
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: isPro ? 'var(--orange-glow)' : 'var(--bg-tertiary)',
              color: isPro ? 'var(--orange-500)' : 'var(--text-muted)',
              border: isPro ? '1px solid rgba(249,115,22,0.2)' : '1px solid var(--border-primary)',
            }}>
              {isPro ? 'Pro plan ✓' : 'Free plan'}
            </span>
          </div>

          {/* Usage meter */}
          {!isPro && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Snippets used</span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {snippetCount} of 10
                </span>
              </div>
              <div style={{
                height: '6px',
                borderRadius: '3px',
                backgroundColor: 'var(--bg-tertiary)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(100, (snippetCount / 10) * 100)}%`,
                  backgroundColor: snippetCount >= 10 ? 'var(--red-500)' : 'var(--orange-500)',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          )}

          {isPro ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                You have unlimited access to all SnipVault features.
              </p>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                style={{
                  fontSize: '13px',
                  color: 'var(--red-500)',
                  background: 'none',
                  border: 'none',
                  cursor: cancelling ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)',
                  textAlign: 'left',
                  padding: 0,
                  opacity: cancelling ? 0.5 : 0.7,
                  transition: 'var(--transition-fast)',
                }}
              >
                {cancelling ? 'Cancelling...' : 'Cancel subscription'}
              </button>
            </div>
          ) : (
            <Button variant="primary" onClick={handleUpgrade}>
              <Sparkles size={14} />
              Upgrade to Pro
            </Button>
          )}
        </div>

        {/* Profile section */}
        <div style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Profile</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Email</label>
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{user?.email}</span>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Member since</label>
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Data section */}
        <div style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-secondary)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Data</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Button
              variant={isPro ? 'secondary' : 'ghost'}
              onClick={handleExport}
              disabled={!isPro}
              size="sm"
            >
              <Download size={14} />
              Export all snippets (JSON)
              {!isPro && <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}> · Pro only</span>}
            </Button>
          </div>
        </div>

        {/* Danger zone */}
        <div style={{
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--red-500)', marginBottom: '12px' }}>Danger zone</h2>
          <Button variant="danger" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
