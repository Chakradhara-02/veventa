import { Users, Crown, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GroupCard({ group, event }) {
  const { currentUser, showNotification } = useApp();
  const isMember = group.members.some(m => m.id === currentUser?.id);
  const isFull = group.members.length >= (event.teamSize?.max || 99);

  return (
    <div className="glass-surface" style={{ borderRadius: '16px', padding: '20px', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {group.name}
            {isMember && <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>Your Team</span>}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} /> {group.members.length} / {event.teamSize?.max || '?'} Members
          </p>
        </div>
        {isFull ? (
          <span className="badge badge-amber">Full</span>
        ) : (
          <span className="badge badge-sky">Accepting</span>
        )}
      </div>

      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>Members:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {group.members.map(member => (
            <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={member.avatar} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid var(--border-medium)', objectFit: 'cover' }} />
              <div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, margin: 0 }}>
                  {member.name} {member.id === currentUser?.id && '(You)'}
                </p>
                {member.role === 'Leader' && (
                  <p style={{ color: '#FCD34D', fontSize: '0.7rem', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Crown size={10} /> Team Leader
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {group.interests.map(i => (
          <span key={i} style={{ padding: '2px 8px', background: 'var(--bg-hover)', borderRadius: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            {i}
          </span>
        ))}
      </div>

      {!isMember && !isFull && currentUser && (
        <button 
          className="btn-outline" 
          style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.85rem' }}
          onClick={() => showNotification('Join request sent to Team Leader.', 'success')}
        >
          Request to Join Team
        </button>
      )}
      {!currentUser && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, textAlign: 'center' }}>
          Log in to join this team.
        </p>
      )}
    </div>
  );
}
