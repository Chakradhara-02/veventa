import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, FileText, Tag, Users, Ticket, Image as ImageIcon, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
  'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent } = useApp();
  const [form, setForm] = useState({
    title: '', description: '', category: 'Technology',
    date: '', time: '09:00 AM', endTime: '06:00 PM',
    venue: '', image: PLACEHOLDER_IMAGES[0],
    priceType: 'free', priceAmount: 0,
    totalTickets: 100,
    isTeamEvent: false, teamMin: 2, teamMax: 4,
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.venue.trim()) e.venue = 'Venue is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const tagArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      date: new Date(form.date),
      time: form.time,
      endTime: form.endTime,
      venue: form.venue,
      image: form.image,
      price: form.priceType === 'free' ? { type: 'free' } : { type: 'paid', amount: Number(form.priceAmount) },
      totalTickets: Number(form.totalTickets),
      isTeamEvent: form.isTeamEvent,
      tags: tagArray,
    };
    
    // Only include teamSize if it's a team event
    if (form.isTeamEvent) {
      payload.teamSize = { min: Number(form.teamMin), max: Number(form.teamMax) };
    }
    
    createEvent(payload);
    setSubmitted(true);
    setTimeout(() => navigate('/dashboard/my-events'), 1500);
  };

  if (submitted) {
    return (
      <div style={{ padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', flexDirection: 'column', gap: '16px' }}>
        <div className="animate-float" style={{ width: '64px', height: '64px', background: 'rgba(16,185,129,0.12)', border: '2px solid #10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(16,185,129,0.2)' }}>
          <Check size={28} color="#10B981" />
        </div>
        <h2 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Event Created!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to your events...</p>
      </div>
    );
  }

  const field = (label, key, children, error) => (
    <div>
      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>{label}</label>
      {children}
      {error && <p style={{ color: '#FCA5A5', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>Create New Event</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fill in the details to publish your event</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Basic info */}
        <div className="glass-surface" style={{ borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color="var(--primary-light)" /> Basic Information
          </h2>

          {field('Event Title *', 'title',
            <input type="text" className="input-field" placeholder="e.g. TechFest 2026" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />,
            errors.title)}

          {field('Description *', 'description',
            <textarea className="input-field" rows={4} placeholder="Describe your event in detail..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical' }} />,
            errors.description)}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {field('Category', 'category',
              <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ appearance: 'none', cursor: 'pointer' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}
            {field('Tags (comma-separated)', 'tags',
              <input type="text" className="input-field" placeholder="React, AI, Cloud" value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })} />
            )}
          </div>
        </div>

        {/* Date & Venue */}
        <div className="glass-surface" style={{ borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="var(--primary-light)" /> Date, Time & Venue
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {field('Date *', 'date',
              <input type="date" className="input-field" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} />,
              errors.date)}
            {field('Start Time', 'time',
              <input type="text" className="input-field" placeholder="09:00 AM" value={form.time}
                onChange={e => setForm({ ...form, time: e.target.value })} />
            )}
            {field('End Time', 'endTime',
              <input type="text" className="input-field" placeholder="06:00 PM" value={form.endTime}
                onChange={e => setForm({ ...form, endTime: e.target.value })} />
            )}
          </div>

          {field('Venue *', 'venue',
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="input-field" style={{ paddingLeft: '40px' }} placeholder="e.g. HICC, Hyderabad, Telangana"
                value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} />
            </div>,
            errors.venue)}
        </div>

        {/* Tickets & Pricing */}
        <div className="glass-surface" style={{ borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={16} color="var(--primary-light)" /> Tickets & Pricing
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>Ticket Type</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['free', 'paid'].map(t => (
                  <button key={t} type="button" onClick={() => setForm({ ...form, priceType: t })} style={{
                    flex: 1, padding: '10px', borderRadius: '12px',
                    background: form.priceType === t ? 'var(--bg-hover)' : 'transparent',
                    border: `1px solid ${form.priceType === t ? 'var(--primary)' : 'var(--border-light)'}`,
                    color: form.priceType === t ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', textTransform: 'capitalize',
                    transition: 'all 0.25s',
                  }}>
                    {t === 'free' ? ' Free' : ' Paid'}
                  </button>
                ))}
              </div>
            </div>
            {form.priceType === 'paid' && field('Price (₹)', 'price',
              <input type="number" className="input-field" placeholder="0" min="0" value={form.priceAmount}
                onChange={e => setForm({ ...form, priceAmount: e.target.value })} />
            )}
          </div>

          {field('Total Tickets', 'tickets',
            <input type="number" className="input-field" min="1" max="10000" value={form.totalTickets}
              onChange={e => setForm({ ...form, totalTickets: e.target.value })} />
          )}
        </div>

        {/* Team settings */}
        <div className="glass-surface" style={{ borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Users size={16} color="var(--primary-light)" /> Team Event
            </h2>
            <button
              type="button"
              onClick={() => setForm({ ...form, isTeamEvent: !form.isTeamEvent })}
              style={{
                width: '44px', height: '24px', borderRadius: '99px',
                background: form.isTeamEvent ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--bg-hover)',
                border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.25s',
              }}
            >
              <div style={{
                position: 'absolute', top: '2px',
                left: form.isTeamEvent ? '22px' : '2px',
                width: '20px', height: '20px', borderRadius: '50%',
                background: '#FFF', transition: 'left 0.25s',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>

          {form.isTeamEvent && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {field('Min Team Size', 'teamMin',
                <input type="number" className="input-field" min="2" max="20" value={form.teamMin}
                  onChange={e => setForm({ ...form, teamMin: e.target.value })} />
              )}
              {field('Max Team Size', 'teamMax',
                <input type="number" className="input-field" min="2" max="20" value={form.teamMax}
                  onChange={e => setForm({ ...form, teamMax: e.target.value })} />
              )}
            </div>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
            Enable to allow team registration. Our auto-matching system will group solo registrants.
          </p>
        </div>

        {/* Image picker */}
        <div className="glass-surface" style={{ borderRadius: '18px', padding: '24px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={16} color="var(--primary-light)" /> Cover Image
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {PLACEHOLDER_IMAGES.map(img => (
              <div
                key={img}
                onClick={() => setForm({ ...form, image: img })}
                style={{
                  borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${form.image === img ? 'var(--primary)' : 'transparent'}`,
                  transition: 'all 0.25s',
                  boxShadow: form.image === img ? '0 0 16px rgba(14,165,233,0.3)' : 'none',
                }}
              >
                <img src={img} alt="" style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="button" className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '13px' }}
            onClick={() => navigate('/dashboard/my-events')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary btn-ripple" style={{ flex: 2, justifyContent: 'center', padding: '13px', fontSize: '0.95rem' }}>
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );
}
