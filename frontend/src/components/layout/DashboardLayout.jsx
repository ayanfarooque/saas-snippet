import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import UpgradeSheet from '../ui/UpgradeSheet';
import CreateFolderModal from '../ui/CreateFolderModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';

export default function DashboardLayout() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [tags, setTags] = useState([]);
  const [folders, setFolders] = useState([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const fetchMeta = async () => {
    try {
      const [tagsRes, foldersRes] = await Promise.all([
        api.get('/tags'),
        api.get('/folders'),
      ]);
      setTags(tagsRes.data || []);
      setFolders(foldersRes.data || []);
    } catch (err) {
      console.error('Failed to fetch metadata:', err);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  const handleCreateFolder = async (name) => {
    try {
      await api.post('/folders', { name });
      addToast('Folder created!', 'success');
      fetchMeta();
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to create folder', 'error');
    }
  };

  const handleUpgrade = async () => {
    setShowUpgrade(false);
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
      rzp.on('payment.failed', (response) => {
        addToast('Payment failed: ' + response.error.description, 'error');
      });
      rzp.open();
    } catch (err) {
      addToast('Failed to initialize checkout', 'error');
    }
  };

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, location.search]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Mobile sidebar toggle */}
      <button
        className="mobile-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          display: 'none',
          position: 'fixed',
          top: '12px',
          left: '12px',
          zIndex: 200,
          padding: '8px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar
          tags={tags}
          folders={folders}
          activeTagName={new URLSearchParams(location.search).get('tag')}
          activeFolderId={new URLSearchParams(location.search).get('folder_id') ? parseInt(new URLSearchParams(location.search).get('folder_id')) : null}
          onTagClick={(tag) => navigate(`/dashboard?tag=${encodeURIComponent(tag)}`)}
          onFolderClick={(folderId) => navigate(`/dashboard?folder_id=${folderId}`)}
          onShowAll={() => navigate('/dashboard')}
          onUpgrade={() => setShowUpgrade(true)}
          onNewFolderClick={() => setIsCreateFolderOpen(true)}
        />
      </div>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 49,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          className="mobile-sidebar-backdrop"
        />
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Outlet context={{ setShowUpgrade, tags, folders }} />
      </div>

      <UpgradeSheet
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgrade={handleUpgrade}
      />

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSubmit={handleCreateFolder}
      />

      <style>{`
        @media (max-width: 767px) {
          .mobile-sidebar-toggle { display: flex !important; }
          .sidebar-container { display: none; position: fixed; top: 0; left: 0; z-index: 50; height: 100vh; }
          .sidebar-container.sidebar-open { display: block; }
          .desktop-only { display: none; }
          .mobile-spacer { display: block; }
        }
        @media (min-width: 768px) {
          .mobile-sidebar-toggle { display: none !important; }
          .mobile-sidebar-backdrop { display: none !important; }
          .mobile-spacer { display: none !important; }
        }
      `}</style>
    </div>
  );
}
