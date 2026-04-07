import { useApp } from '../../context/AppContext';
import { Users, MessageSquare, UserCheck } from 'lucide-react';

const demoParticipants = [
  { id: 1, name: 'Arjun Sharma', email: 'arjun@example.com', avatar: 'https://i.pravatar.cc/40?img=3', event: 'TechFest 2026', status: 'Confirmed', joined: '2026-03-10' },
  { id: 2, name: 'Priya Kumar', email: 'priya@example.com', avatar: 'https://i.pravatar.cc/40?img=7', event: 'TechFest 2026', status: 'Confirmed', joined: '2026-03-11' },
  { id: 3, name: 'Karthik Rajan', email: 'karthik@example.com', avatar: 'https://i.pravatar.cc/40?img=12', event: 'AI Hackathon 48H', status: 'Confirmed', joined: '2026-03-12' },
  { id: 4, name: 'Ananya T', email: 'ananya@example.com', avatar: 'https://i.pravatar.cc/40?img=20', event: 'Startup Pitch Battle', status: 'Pending', joined: '2026-03-14' },
  { id: 5, name: 'Vikram R', email: 'vikram@example.com', avatar: 'https://i.pravatar.cc/40?img=15', event: 'TechFest 2026', status: 'Confirmed', joined: '2026-03-15' },
  { id: 6, name: 'Meera K', email: 'meera@example.com', avatar: 'https://i.pravatar.cc/40?img=10', event: 'AI Hackathon 48H', status: 'Confirmed', joined: '2026-03-16' },
];

export default function ParticipantsView() {
  const { events, currentUser } = useApp();
  const myEvents = events.filter(e => e.organizer.id === currentUser?.id);

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Participants</h1>
        <p style={{ color: 'var(--text-muted)' }}>People registered for your events</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Total Participants', value: demoParticipants.length, icon: <Users size={20} />, color: '#0EA5E9' },
          { label: 'Confirmed', value: demoParticipants.filter(p => p.status === 'Confirmed').length, icon: <UserCheck size={20} />, color: '#10B981' },
          { label: 'Pending', value: demoParticipants.filter(p => p.status === 'Pending').length, icon: <Users size={20} />, color: '#F59E0B' },
          { label: 'Active Events', value: myEvents.length, icon: <MessageSquare size={20} />, color: '#06B6D4' },
        ].map((s, i) => (
          <div key={i} className="glass-surface" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.color + '18', border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
            </div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.5rem', margin: 0, fontFamily: 'Poppins' }}>{s.value}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Participants table */}
      <div className="glass-surface" style={{ borderRadius: '18px', overflow: 'hidden' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', margin: 0 }}>All Participants</h2>
          <span className="badge badge-sky">{demoParticipants.length} total</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-hover)' }}>
                {['Participant', 'Email', 'Event', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demoParticipants.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border-light)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={p.avatar} alt={p.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-medium)' }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{p.email}</td>
                  <td style={{ padding: '12px 16px' }}><span className="badge badge-sky" style={{ fontSize: '0.72rem' }}>{p.event}</span></td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{p.joined}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span className={`badge ${p.status === 'Confirmed' ? 'badge-green' : 'badge-amber'}`}>{p.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{
                      background: 'var(--bg-hover)', border: '1px solid var(--border-light)',
                      borderRadius: '8px', padding: '5px 10px', color: 'var(--primary-light)', cursor: 'pointer',
                      fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.25s',
                    }}>
                      Message
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
