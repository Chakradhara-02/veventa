import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Shield, Briefcase, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import FloatingBackground from '../components/FloatingBackground';
import TicketLogo from '../components/TicketLogo';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();
  const { isDark } = useTheme();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    { role: 'Participant', email: 'arjun@example.com', icon: <User size={16} /> },
    { role: 'Organizer', email: 'techspacekl@example.com', icon: <Briefcase size={16} /> },
    { role: 'Admin', email: 'admin@veventa.com', icon: <Shield size={16} /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    if (!form.email.includes('@')) { setError('Please enter a valid email'); return; }

    setError('');
    setIsLoading(true);

    const result = await login(form.email, form.password);
    setIsLoading(false);
    if (result.success) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--bg-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <FloatingBackground intensity={isDark ? 0.7 : 0.3} />
      </div>

      <div style={{ maxWidth: '420px', width: '100%', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }} onClick={() => navigate('/')} className="cursor-pointer">
            <TicketLogo size={42} glow={isDark} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px', fontFamily: 'Poppins' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in to continue to V'eventa</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ width: '100%', padding: '32px', borderRadius: '24px' }}>
          {/* Demo accts */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Accounts</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {demoAccounts.map(acc => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => setForm({ email: acc.email, password: 'password123' })}
                  style={{
                    background: 'var(--bg-hover)', border: '1px solid var(--border-light)',
                    borderRadius: '12px', padding: '8px', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    color: 'var(--text-secondary)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {acc.icon}
                  <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{acc.role}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ height: '1px', flex: 1, background: 'var(--border-light)' }} />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600 }}>OR SIGN IN MANUALLY</span>
            <div style={{ height: '1px', flex: 1, background: 'var(--border-light)' }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: '#EF4444', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={14} /> {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="input-field"
                  style={{ paddingLeft: '44px' }}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary btn-ripple"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '8px', fontSize: '1rem', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#FFF', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '24px' }}>
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            style={{ color: 'var(--primary-light)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign Up
          </button>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
}
