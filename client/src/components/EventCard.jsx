import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCard({ event, compact = false }) {
  const pct = Math.round((event.registered / event.totalTickets) * 100);

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Image */}
      <div style={{ position: 'relative', height: compact ? '160px' : '200px', overflow: 'hidden' }}>
        <img
          src={event.image}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="event-image"
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg-deep) 0%, transparent 100%)', opacity: 0.8 }} />

        {/* Badges overlay */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {event.isTeamEvent && <span className="badge badge-amber">Team Event</span>}
          {event.price.type === 'free' ? (
            <span className="badge badge-green">Free</span>
          ) : (
            <span className="badge badge-sky">₹{event.price.amount}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{event.category}</span>
        </div>

        <h3 style={{ fontSize: compact ? '1.1rem' : '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', lineHeight: 1.3 }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <Calendar size={14} color="var(--primary-light)" />
            {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
             {' • '} {event.time}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <MapPin size={14} color="var(--primary-light)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.venue}</span>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span>{event.registered} registered</span>
            <span>{event.ticketsLeft} spots left</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'var(--bg-hover)', borderRadius: '99px', marginBottom: '16px' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, var(--primary), var(--accent))', borderRadius: '99px', transition: 'width 0.5s' }} />
          </div>

          <Link to={`/events/${event.id}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', padding: '10px' }}>
            View Details
          </Link>
        </div>
      </div>
      
      <style>{`
        .glass-card:hover .event-image {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}
