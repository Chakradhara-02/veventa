import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket, ArrowRight, Activity, Smile, Heart, Star, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import EventCard from '../components/EventCard';
import FloatingBackground from '../components/FloatingBackground';

export default function HomePage() {
  const navigate = useNavigate();
  const { events, currentUser } = useApp();
  const { isDark, colors } = useTheme();

  const featured = events.filter(e => e.featured).slice(0, 3);
  const upcoming = events.filter(e => !e.featured).slice(0, 3);

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Hero Section with Floating spheres */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <FloatingBackground intensity={isDark ? 1 : 0.6} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--bg-hover)', border: '1px solid var(--border-medium)',
            borderRadius: '999px', padding: '6px 16px', marginBottom: '24px',
            color: 'var(--primary-light)', fontWeight: 600, fontSize: '0.85rem',
            animation: 'scaleIn 0.5s ease',
          }}>
            <Sparkles size={14} /> The Future of Events
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '24px',
            fontFamily: 'Poppins, sans-serif',
            color: 'var(--text-primary)'
          }}>
            Connect. Participate.<br />
            <span className="text-gradient">Experience Together.</span>
          </h1>
          
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}>
            V'eventa is the premium platform for discovering experiences across India, building teams, chatting in real-time, and capturing memories.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!currentUser && (
              <button className="btn-primary btn-ripple" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={() => navigate('/register')}>
                Get Started Free <ArrowRight size={18} />
              </button>
            )}
            <button className="btn-outline" style={{ padding: '14px 28px', fontSize: '1rem' }} onClick={() => navigate('/events')}>
              Browse Events
            </button>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-glass)', backdropFilter: 'blur(10px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '32px 24px', gap: '24px' }}>
          {[
            { value: '500+', label: 'Events Hosted across India' },
            { value: '50K+', label: 'Active Users' },
            { value: '25', label: 'Cities Covered' },
            { value: '98%', label: 'Match Rate' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Poppins' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Events */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Featured Experiences</h2>
            <p style={{ color: 'var(--text-muted)' }}>Top events happening across India right now.</p>
          </div>
          <button className="btn-outline" onClick={() => navigate('/events')}>
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {featured.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* How it Works / Features using glass-card */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <FloatingBackground intensity={isDark ? 0.3 : 0.1} />
        </div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Why Choose <span className="text-gradient">V'eventa</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {[
              { icon: <MapPin size={24} />, title: 'Indian Coverage', desc: 'Find events precisely located across major Indian cities.' },
              { icon: <Activity size={24} />, title: 'Auto-Matching', desc: 'Register solo for team events and let our AI match you with perfect teammates.' },
              { icon: <Heart size={24} />, title: 'Share Memories', desc: 'Upload photos and relive the best moments on our Memory Wall.' },
              { icon: <Smile size={24} />, title: 'Real-time Chat', desc: 'Connect with organizers and participants instantly before the event begins.' },
            ].map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: 'var(--bg-hover)', border: '1px solid var(--border-medium)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary-light)', margin: '0 auto 20px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-light)', padding: '40px 24px', background: 'var(--bg-glass)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              V<span style={{ color: 'var(--primary-light)' }}>'</span>eventa
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            © 2026 V'eventa India. All rights reserved. Connect. Participate. Experience.
          </p>
        </div>
      </footer>
    </div>
  );
}
