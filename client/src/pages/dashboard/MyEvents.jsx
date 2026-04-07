import { useNavigate } from 'react-router-dom';
import { Calendar, MessageSquare, Trash2, Edit, PlusCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EventCard from '../../components/EventCard';

export default function MyEvents() {
  const navigate = useNavigate();
  const { currentUser, events, getUserEvents, deleteEvent, cancelRegistration } = useApp();

  const isOrganizer = currentUser?.role === 'organizer';

  const myEvents = isOrganizer
    ? events.filter(e => e.organizer.id === currentUser.id)
    : getUserEvents();

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isOrganizer ? 'My Events' : 'Registered Events'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {isOrganizer
              ? `${myEvents.length} events created`
              : `${myEvents.length} events registered`}
          </p>
        </div>
        {isOrganizer && (
          <button className="btn-primary btn-ripple" onClick={() => navigate('/dashboard/create-event')}>
            <PlusCircle size={16} /> New Event
          </button>
        )}
      </div>

      {myEvents.length === 0 ? (
        <div className="glass-surface" style={{
          textAlign: 'center', padding: '80px 0',
          borderRadius: '20px',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}></div>
          <p style={{ color: 'var(--primary-light)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
            {isOrganizer ? 'No events yet' : 'No registered events'}
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            {isOrganizer ? 'Create your first event and start building a community!'
              : 'Browse and register for upcoming events.'}
          </p>
          <button
            className="btn-primary btn-ripple"
            onClick={() => navigate(isOrganizer ? '/dashboard/create-event' : '/events')}
          >
            {isOrganizer ? <><PlusCircle size={15} /> Create Event</> : <><ArrowRight size={15} /> Browse Events</>}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {myEvents.map(event => (
            <div key={event.id} style={{ position: 'relative' }}>
              <EventCard event={event} />
              {isOrganizer && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button
                    className="btn-outline"
                    style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.82rem' }}
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <Edit size={13} /> Edit
                  </button>
                  <button
                    className="btn-outline"
                    style={{ flex: 1, justifyContent: 'center', padding: '8px', fontSize: '0.82rem' }}
                    onClick={() => navigate(`/chat/${event.id}`)}
                  >
                    <MessageSquare size={13} /> Chat
                  </button>
                  <button
                    style={{
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)',
                      borderRadius: '12px', padding: '8px 12px',
                      color: '#FCA5A5', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      transition: 'all 0.25s',
                    }}
                    onClick={() => deleteEvent(event.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              )}
              {!isOrganizer && (
                <button
                  onClick={() => cancelRegistration(event.id)}
                  style={{
                    width: '100%', marginTop: '8px',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                    borderRadius: '12px', padding: '9px',
                    color: '#EF4444', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                    transition: 'all 0.25s',
                  }}
                >
                  Cancel Registration
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
