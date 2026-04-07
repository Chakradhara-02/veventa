import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Notification() {
  const { notification, showNotification } = useApp();
  if (!notification) return null;

  const config = {
    success: { icon: <CheckCircle size={18} />, color: '#10B981', borderColor: 'rgba(16,185,129,0.3)' },
    info:    { icon: <Info size={18} />,        color: '#0EA5E9', borderColor: 'rgba(14,165,233,0.3)' },
    error:   { icon: <AlertCircle size={18} />, color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' },
  };

  const c = config[notification.type] || config.info;

  return (
    <div
      id="notification-toast"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        minWidth: '280px',
        maxWidth: '380px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${c.borderColor}`,
        borderRadius: '14px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 12px ${c.borderColor}`,
        animation: 'slideInRight 0.35s ease',
      }}
    >
      <div style={{ color: c.color, display: 'flex', flexShrink: 0 }}>
        {c.icon}
      </div>
      <span style={{ fontSize: '0.875rem', color: '#F0F9FF', flex: 1 }}>{notification.message}</span>
      <button
        onClick={() => showNotification(null)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: 0, display: 'flex', transition: 'color 0.2s' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
