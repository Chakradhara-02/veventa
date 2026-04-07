import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, TrendingUp, MessageSquare,
  ArrowRight, Star, Zap, UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EventCard from '../../components/EventCard';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { currentUser, events, getUserEvents, registrations } = useApp();

  const myEvents = getUserEvents();
  const recommended = events
    .filter(e => !registrations.some(r => r.userId === currentUser?.id && r.eventId === e.id))
    .filter(e => currentUser?.interests?.some(i => i === e.category))
    .slice(0, 3);

  const fallbackRec = events.slice(0, 3);

  const isOrganizer = currentUser?.role === 'organizer';
  const isAdmin = currentUser?.role === 'admin';

  const stats = isOrganizer ? [
    { label: 'Events Created', value: events.filter(e => e.organizer.id === currentUser.id).length, icon: <Calendar size={20} />, color: '#0EA5E9' },
    { label: 'Total Registrations', value: events.filter(e => e.organizer.id === currentUser.id).reduce((s, e) => s + e.registered, 0), icon: <Users size={20} />, color: '#06B6D4' },
    { label: 'Active Chats', value: 3, icon: <MessageSquare size={20} />, color: '#14B8A6' },
    { label: 'Revenue (₹)', value: '1,24,000', icon: <TrendingUp size={20} />, color: '#10B981' },
  ] : isAdmin ? [
    { label: 'Total Users', value: '12,489', icon: <Users size={20} />, color: '#0EA5E9' },
    { label: 'Active Events', value: events.length, icon: <Calendar size={20} />, color: '#06B6D4' },
    { label: 'Total Revenue', value: '₹4.8L+', icon: <TrendingUp size={20} />, color: '#14B8A6' },
    { label: 'Registrations', value: '1,182', icon: <UserCheck size={20} />, color: '#10B981' },
  ] : [
    { label: 'Events Registered', value: myEvents.length, icon: <Calendar size={20} />, color: '#0EA5E9' },
    { label: 'Memories Shared', value: 2, icon: <Star size={20} />, color: '#06B6D4' },
    { label: 'Chat Messages', value: 47, icon: <MessageSquare size={20} />, color: '#14B8A6' },
    { label: 'Connections', value: 12, icon: <Users size={20} />, color: '#10B981' },
  ];

  return (
    <div style={{ padding: '32px' }}>
      {/* Welcome */}
      <div className="glass-card" style={{
        padding: '24px 28px', marginBottom: '28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
            Welcome back, {currentUser?.name?.split(' ')[0]}!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isOrganizer ? 'Manage your events and connect with participants.'
              : isAdmin ? 'Platform overview and management.'
                : `You have ${myEvents.length} upcoming event${myEvents.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          {isOrganizer && (
            <button className="btn-primary btn-ripple" onClick={() => navigate('/dashboard/create-event')}>
              <Zap size={15} /> Create Event
            </button>
          )}
          {!isOrganizer && !isAdmin && (
            <button className="btn-primary btn-ripple" onClick={() => navigate('/events')}>
              <Calendar size={15} /> Browse Events
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={i} className="glass-surface" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: s.color + '18', border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color,
              }}>
                {s.icon}
              </div>
              <TrendingUp size={14} color="#10B981" />
            </div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: '1.6rem', margin: 0, fontFamily: 'Poppins' }}>{s.value}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* My Events section (participant) */}
      {!isOrganizer && !isAdmin && myEvents.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.15rem' }}>Your Upcoming Events</h2>
            <button className="btn-outline" style={{ padding: '7px 14px', fontSize: '0.82rem' }} onClick={() => navigate('/dashboard/my-events')}>
              View All <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {myEvents.slice(0, 3).map(e => <EventCard key={e.id} event={e} compact />)}
          </div>
        </div>
      )}

      {/* Recommended */}
      {!isAdmin && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.15rem' }}>
              {isOrganizer ? 'Recent Events' : 'Recommended for You'}
            </h2>
            <button className="btn-outline" style={{ padding: '7px 14px', fontSize: '0.82rem' }} onClick={() => navigate('/events')}>
              Browse All <ArrowRight size={13} />
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {(recommended.length > 0 ? recommended : fallbackRec).map(e => (
              <EventCard key={e.id} event={e} compact />
            ))}
          </div>
        </div>
      )}

      {/* Admin: all events table */}
      {isAdmin && (
        <div className="glass-surface" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-light)' }}>
            <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>All Events</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-hover)' }}>
                  {['Event', 'Category', 'Date', 'Registered', 'Price', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map(e => (
                  <tr key={e.id} style={{ borderTop: '1px solid var(--border-light)', cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={el => el.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={el => el.currentTarget.style.background = 'transparent'}
                    onClick={() => navigate(`/events/${e.id}`)}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem' }}>{e.title}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}><span className="badge badge-sky">{e.category}</span></td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{e.date}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{e.registered}/{e.totalTickets}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {e.price.type === 'free'
                        ? <span className="badge badge-green">Free</span>
                        : <span style={{ color: '#FCD34D', fontSize: '0.82rem', fontWeight: 600 }}>₹{e.price.amount}</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${e.ticketsLeft > 0 ? 'badge-green' : 'badge-red'}`}>
                        {e.ticketsLeft > 0 ? 'Active' : 'Sold Out'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
