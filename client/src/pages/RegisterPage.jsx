import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORIES = [
  'Technology', 'Music', 'Business', 'Sports', 'Art', 'Education', 'Lifestyle', 'Food'
];

import FloatingBackground from '../components/FloatingBackground';
import TicketLogo from '../components/TicketLogo';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'participant', interests: [],
  });

  const toggleInterest = (i) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(i) ? prev.interests.filter(x => x !== i) : [...prev.interests, i]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.name || !form.email || !form.password) {
        setError('Please fill in all required fields.');
        return;
      }
      if (!form.email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }

      setError('');
      setStep(2);
      return;
    }

    setIsLoading(true);
    setError('');
    const result = await register(form);
    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Unable to create account. Please try again.');
    }
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <FloatingBackground intensity={0.6} />
      </div>

      <div style={{ maxWidth: '460px', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }} onClick={() => navigate('/')}>
            <TicketLogo size={42} glow />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'Poppins' }}>Join V'eventa</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {step === 1 ? 'Create your account' : 'Tell us what you like'}
          </p>
        </div>

        <div className="glass-card" style={{ padding: '32px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '4px', background: step >= 1 ? 'var(--primary)' : 'var(--bg-hover)', borderRadius: '4px', transition: 'background 0.3s', boxShadow: step >= 1 ? '0 0 8px rgba(14,165,233,0.4)' : 'none' }} />
            <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--primary)' : 'var(--bg-hover)', borderRadius: '4px', transition: 'background 0.3s', boxShadow: step >= 2 ? '0 0 8px rgba(14,165,233,0.4)' : 'none' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#EF4444', fontSize: '0.82rem' }}>
                {error}
              </div>
            )}

            {step === 1 ? (
              <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  {['participant', 'organizer'].map(r => (
                    <button key={r} type="button" onClick={() => setForm({...form, role: r})} style={{
                      flex: 1, padding: '10px', borderRadius: '12px',
                      background: form.role === r ? 'var(--bg-hover)' : 'transparent',
                      border: `1px solid ${form.role === r ? 'var(--primary)' : 'var(--border-light)'}`,
                      color: form.role === r ? 'var(--text-primary)' : 'var(--text-muted)',
                      textTransform: 'capitalize', fontWeight: 600, fontSize: '0.85rem',
                      transition: 'all 0.2s', cursor: 'pointer',
                    }}>
                      {r}
                    </button>
                  ))}
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input required type="text" className="input-field" style={{ paddingLeft: '44px' }} placeholder="Jane Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input required type="email" className="input-field" style={{ paddingLeft: '44px' }} placeholder="jane@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input required type="password" className="input-field" style={{ paddingLeft: '44px' }} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="page-enter" style={{ display: 'flex', flexDirection: 'column' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Select categories you're interested in so we can recommend the best events for you.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                  {CATEGORIES.map(cat => {
                    const sel = form.interests.includes(cat);
                    return (
                      <button key={cat} type="button" onClick={() => toggleInterest(cat)} style={{
                        padding: '8px 16px', borderRadius: '99px',
                        background: sel ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--bg-input)',
                        border: `1px solid ${sel ? 'transparent' : 'var(--border-light)'}`,
                        color: sel ? '#FFF' : 'var(--text-muted)',
                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                      }}>
                        {cat} {sel ? <span style={{ fontSize: '10px' }}>✓</span> : <Plus size={12} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary btn-ripple" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '12px' }}>
              {isLoading ? 'Creating account...' : step === 1 ? 'Continue' : 'Complete Sign Up'}
            </button>
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="btn-outline" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '-8px' }}>Back</button>
            )}
          </form>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '24px' }}>
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} style={{ color: 'var(--primary-light)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Sign In</button>
        </p>
      </div>
    </div>
  );
}
