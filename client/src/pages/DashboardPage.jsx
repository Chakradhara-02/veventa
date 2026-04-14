import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import DashboardOverview from './dashboard/DashboardOverview';
import MyEvents from './dashboard/MyEvents';
import CreateEvent from './dashboard/CreateEvent';
import ParticipantsView from './dashboard/ParticipantsView';
import AnalyticsView from './dashboard/AnalyticsView';

export default function DashboardPage() {
  const { currentUser, isAuthLoading } = useApp();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isAuthLoading) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--primary-light)', fontSize: '1.05rem' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <p style={{ color: 'var(--primary-light)', fontSize: '1.1rem' }}>You need to be logged in</p>
        <button className="btn-primary" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: 'var(--bg-deep)', position: 'relative' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'var(--overlay)', zIndex: 40, backdropFilter: 'blur(6px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'relative', zIndex: 50,
        display: sidebarOpen ? 'flex' : undefined,
      }}
        className="sidebar-wrapper"
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Mobile header */}
        <div style={{
          display: 'none',
          padding: '16px',
          background: 'var(--bg-glass-strong)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-light)',
          alignItems: 'center',
          gap: '12px',
        }}
          className="mobile-dash-header"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
          >
            <Menu size={22} />
          </button>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>Dashboard</h2>
        </div>

        <Routes>
          <Route index element={<DashboardOverview />} />
          <Route path="my-events" element={<MyEvents />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="participants" element={<ParticipantsView />} />
          <Route path="analytics" element={<AnalyticsView />} />
        </Routes>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-wrapper {
            position: fixed !important;
            left: 0; top: 0; bottom: 0; z-index: 50;
            transform: translateX(${sidebarOpen ? '0' : '-100%'});
            transition: transform 0.3s ease;
          }
          .mobile-dash-header {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
