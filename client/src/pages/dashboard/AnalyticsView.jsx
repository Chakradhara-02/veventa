import { TrendingUp, Users, Calendar, IndianRupee } from 'lucide-react';
import { analyticsData } from '../../data/mockData';

export default function AnalyticsView() {
  const { registrationsByMonth, categoryBreakdown } = analyticsData;
  const maxCount = Math.max(...registrationsByMonth.map(d => d.count));

  const barColors = ['#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#0284C7', '#22D3EE'];

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>Platform performance and insights</p>
      </div>

      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Registrations', value: analyticsData.totalRegistrations.toLocaleString(), icon: <Users size={20} />, color: '#0EA5E9', delta: '+18%' },
          { label: 'Active Events', value: analyticsData.activeEvents, icon: <Calendar size={20} />, color: '#06B6D4', delta: '+2' },
          { label: 'Total Revenue', value: analyticsData.totalRevenue, icon: <IndianRupee size={20} />, color: '#14B8A6', delta: '+24%' },
          { label: 'New Users', value: analyticsData.newUsersThisMonth, icon: <TrendingUp size={20} />, color: '#10B981', delta: '+12%' },
        ].map((s, i) => (
          <div key={i} className="glass-surface" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: s.color + '18', border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
              <span style={{ color: '#10B981', fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '999px' }}>
                {s.delta}
              </span>
            </div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.5rem', margin: 0, fontFamily: 'Poppins' }}>{s.value}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
        {/* Bar chart */}
        <div className="glass-surface" style={{ borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Registrations Over Time</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '24px' }}>Monthly registration trend</p>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '160px' }}>
            {registrationsByMonth.map((d, i) => {
              const h = Math.round((d.count / maxCount) * 140);
              const isLast = i === registrationsByMonth.length - 1;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--primary-light)', fontSize: '0.72rem', fontWeight: 600 }}>{d.count}</span>
                  <div style={{
                    width: '100%',
                    height: `${h}px`,
                    background: isLast
                      ? 'linear-gradient(180deg, var(--primary), var(--accent))'
                      : `${barColors[i]}40`,
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 0.6s ease, background 0.3s',
                    cursor: 'default',
                    position: 'relative',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(180deg, var(--primary), var(--accent))'; }}
                    onMouseLeave={e => { if (!isLast) e.currentTarget.style.background = `${barColors[i]}40`; }}
                  />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass-surface" style={{ borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '6px' }}>Category Breakdown</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '24px' }}>Registrations by event type</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryBreakdown.map((c, i) => {
              const colors = ['#0EA5E9', '#06B6D4', '#14B8A6', '#10B981', '#3B82F6'];
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{c.category}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.82rem' }}>{c.pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '99px' }}>
                    <div style={{
                      height: '100%',
                      width: `${c.pct}%`,
                      background: colors[i % colors.length],
                      borderRadius: '99px',
                      transition: 'width 0.8s ease',
                      boxShadow: `0 0 8px ${colors[i % colors.length]}40`,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 340px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
