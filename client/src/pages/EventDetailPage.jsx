import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, Clock, ArrowLeft, MessageSquare, Share2, Tag, CheckCircle } from 'lucide-react';
import { trpc } from '../lib/trpc';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, registerForEvent, cancelRegistration, showNotification } = useApp();
  const { isDark } = useTheme();

  const eventQuery = trpc.events.getById.useQuery(id);
  const isRegisteredQuery = trpc.registrations.isRegistered.useQuery(id, {
    enabled: !!currentUser,
  });

  const event = eventQuery.data;
  const registered = isRegisteredQuery.data;

  if (eventQuery.isLoading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Loading event details...</p>
    </div>
  );

  if (!event) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--primary-light)', fontSize: '1.2rem' }}>Event not found</p>
        <button className="btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/events')}>Back to Events</button>
      </div>
    </div>
  );

  const pct = Math.round((event.registered / event.totalTickets) * 100);
  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const handleRegister = async () => {
    if (!currentUser) { showNotification('Please log in to register.', 'info'); navigate('/login'); return; }
    if (registered) {
      await cancelRegistration(event._id || event.id);
    } else {
      await registerForEvent(event._id || event.id);
    }
    eventQuery.refetch();
    isRegisteredQuery.refetch();
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Hero image */}
      <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
        <img src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80'} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--bg-deep) 0%, var(--bg-deep) 100%)', opacity: isDark ? 0.7 : 0.3 }} />

        {/* Back button */}
        <button
          id="event-back-btn"
          onClick={() => navigate(-1)}
          className="glass-card"
          style={{
            position: 'absolute', top: '24px', left: '24px',
            padding: '8px 14px', color: 'var(--text-primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.875rem', fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Category + type badges */}
        <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
          <span className="badge badge-sky">{event.category}</span>
          {event.price.type === 'free' && <span className="badge badge-green">FREE</span>}
          {event.isTeamEvent && <span className="badge badge-amber">TEAM EVENT</span>}
        </div>

        {/* Title at bottom of hero */}
        <div style={{ position: 'absolute', bottom: '28px', left: '0', right: '0', padding: '0 32px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, color: 'var(--text-primary)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px' }}>
        {/* Left col */}
        <div>
          {/* Organizer */}
          <div className="glass-surface" style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            borderRadius: '16px', padding: '16px', marginBottom: '24px',
          }}>
            <img src={event.organizer.avatar || 'https://i.pravatar.cc/150'} alt={event.organizer.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-medium)' }} />
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>Organized by</p>
              <p style={{ color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>{event.organizer.name}</p>
            </div>
            <button
              onClick={() => { if (!currentUser) navigate('/login'); else navigate(`/chat/${event._id || event.id}`); }}
              className="btn-outline"
              style={{ marginLeft: 'auto', padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <MessageSquare size={15} /> Open Chat
            </button>
          </div>

          {/* Details grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { icon: <Calendar size={16} />, label: 'Date', value: formatDate(event.date) },
              { icon: <Clock size={16} />, label: 'Time', value: `${event.time} – ${event.endTime || 'Late'}` },
              { icon: <MapPin size={16} />, label: 'Venue', value: event.venue },
              { icon: <Users size={16} />, label: 'Capacity', value: `${event.registered}/${event.totalTickets} registered` },
            ].map((item, i) => (
              <div key={i} className="glass-surface" style={{ borderRadius: '14px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.78rem' }}>
                  {item.icon} {item.label}
                </div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="glass-surface" style={{ borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px' }}>About This Event</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9rem' }}>{event.description}</p>
          </div>

          {/* Tags */}
          <div className="glass-surface" style={{ borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Tag size={16} color="var(--text-muted)" />
              <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Topics</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {event.tags?.map(tag => (
                <span key={tag} className="badge badge-sky">{tag}</span>
              ))}
            </div>
          </div>

          {/* Team info */}
          {event.isTeamEvent && (
            <div className="glass-surface" style={{ borderColor: 'rgba(245,158,11,0.3)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={18} color="#FCD34D" />
                <h3 style={{ color: '#FCD34D', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Team Event</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                Team size: <strong style={{ color: '#FCD34D' }}>{event.teamSize?.min || 2}–{event.teamSize?.max || 4} members</strong>.
                Register solo and our auto-matching system will assign you to a compatible team based on your interests!
              </p>
            </div>
          )}
        </div>

        {/* Right col – sticky registration card */}
        <div>
          <div className="glass-card" style={{ position: 'sticky', top: '80px', padding: '24px' }}>
            {/* Price */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {event.price.type === 'free' ? (
                <div>
                  <p style={{ color: '#10B981', fontWeight: 800, fontSize: '2rem', margin: 0 }}>FREE</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>No ticket fee</p>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#FCD34D', fontWeight: 800, fontSize: '2rem', margin: 0 }}>
                    <span style={{ fontSize: '1.2rem', verticalAlign: 'top', lineHeight: 2 }}>₹</span>
                    {event.price.amount}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>per ticket</p>
                </div>
              )}
            </div>

            {/* Availability */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.registered} registered</span>
                <span style={{ fontSize: '0.8rem', color: event.ticketsLeft < 20 ? '#F59E0B' : 'var(--text-muted)' }}>
                  {event.ticketsLeft} spots left
                </span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-hover)', borderRadius: '99px' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: pct > 80 ? 'linear-gradient(90deg,#F59E0B,#EF4444)' : 'linear-gradient(90deg,var(--primary),var(--accent))',
                  borderRadius: '99px',
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </div>

            {/* CTA button */}
            <button
              onClick={handleRegister}
              className={registered ? 'btn-outline' : 'btn-primary'}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.95rem', marginBottom: '12px' }}
            >
              {registered ? (
                <><CheckCircle size={16} /> Cancel Registration</>
              ) : event.ticketsLeft === 0 ? 'Sold Out' : (
                <><Ticket size={16} /> {event.price.type === 'free' ? 'Register for Free' : `Register for ₹${event.price.amount}`}</>
              )}
            </button>

            {registered && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '12px', padding: '10px', marginBottom: '12px',
                color: '#10B981', fontSize: '0.82rem',
              }}>
                <CheckCircle size={14} /> You're registered!
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '9px' }} onClick={() => showNotification('Link copied!', 'success')}>
                <Share2 size={14} /> Share
              </button>
              <button className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '9px' }} onClick={() => navigate(`/chat/${event._id || event.id}`)}>
                <MessageSquare size={14} /> Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
