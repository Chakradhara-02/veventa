import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, ChevronRight, PieChart, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Sidebar({ onClose }) {
  const location = useLocation();
  const { currentUser, logout } = useApp();

  const isOrganizer = currentUser?.role === 'organizer';
  const isAdmin = currentUser?.role === 'admin';

  let navItems = [];
  if (isOrganizer) {
    navItems = [
      { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
      { path: '/dashboard/my-events', label: 'My Events', icon: <Calendar size={20} /> },
      { path: '/dashboard/participants', label: 'Participants', icon: <Users size={20} /> },
      { path: '/dashboard/analytics', label: 'Analytics', icon: <Activity size={20} /> },
    ];
  } else if (isAdmin) {
    navItems = [
      { path: '/dashboard', label: 'Platform Overview', icon: <LayoutDashboard size={20} /> },
      { path: '/dashboard/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
      { path: '/dashboard/participants', label: 'All Users', icon: <Users size={20} /> },
    ];
  } else {
    navItems = [
      { path: '/dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
      { path: '/dashboard/my-events', label: 'Registered Apps', icon: <Calendar size={20} /> },
    ];
  }

  return (
    <div style={{
      width: '260px',
      background: 'var(--bg-glass-strong)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={currentUser?.avatar} alt="" style={{ width: '48px', height: '48px', borderRadius: '14px', border: '2px solid var(--border-medium)', objectFit: 'cover' }} />
          <div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, margin: 0 }}>{currentUser?.name}</h3>
            <p style={{ color: 'var(--primary-light)', fontSize: '0.75rem', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{currentUser?.role}</p>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px', borderRadius: '12px',
                  color: active ? '#F0F9FF' : 'var(--text-muted)',
                  background: active ? 'linear-gradient(90deg, var(--bg-hover) 0%, transparent 100%)' : 'transparent',
                  borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                  textDecoration: 'none', fontSize: '0.9rem', fontWeight: active ? 600 : 500,
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: active ? 'var(--primary-light)' : 'var(--text-muted)' }}>{item.icon}</span>
                  {item.label}
                </div>
                {active && <ChevronRight size={16} color="var(--primary-light)" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', padding: '24px', borderTop: '1px solid var(--border-light)' }}>
        <button
          onClick={() => { logout(); onClose && onClose(); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
            padding: '12px 16px', borderRadius: '12px',
            color: '#FCA5A5', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)',
            cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
            transition: 'all 0.2s',
          }}
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </div>
  );
}
