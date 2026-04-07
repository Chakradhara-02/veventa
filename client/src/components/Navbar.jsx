import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Search, LogOut, User, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import TicketLogo from './TicketLogo';

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const { isDark, toggleTheme, colors } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = () => setDropdownOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const navLinks = [
    { to: '/events', label: 'Events' },
    { to: '/memories', label: 'Memories' },
    { to: '/chat', label: 'Chat' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav
      id="main-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? colors.navBg : colors.navBgLight,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? colors.border : colors.borderLight}`,
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '64px', gap: '24px' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TicketLogo size={28} glow={isDark} />
          <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.2rem', color: colors.textPrimary }}>
            V<span style={{ color: colors.primaryLight }}>'</span>eventa
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '4px', marginLeft: '16px' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                color: isActive(link.to) ? colors.textPrimary : colors.textMuted,
                background: isActive(link.to) ? colors.bgHover : 'transparent',
                border: isActive(link.to) ? `1px solid ${colors.borderLight}` : '1px solid transparent',
                transition: 'all 0.25s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Search */}
        <button
          id="nav-search-btn"
          onClick={() => navigate('/events')}
          style={{
            background: colors.bgHover,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            padding: '8px 14px',
            color: colors.textMuted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            transition: 'all 0.25s',
          }}
        >
          <Search size={15} />
          <span className="hide-sm">Search events...</span>
        </button>

        {/* Theme Toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          style={{
            background: colors.bgHover,
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            padding: '8px',
            color: isDark ? '#FCD34D' : '#0EA5E9',
            cursor: 'pointer',
            display: 'flex',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              id="nav-notifications-btn"
              style={{
                background: colors.bgHover,
                border: `1px solid ${colors.border}`,
                borderRadius: '10px',
                padding: '8px',
                color: colors.textMuted,
                cursor: 'pointer',
                display: 'flex',
                position: 'relative',
                transition: 'all 0.25s',
              }}
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: 5, right: 5,
                width: '8px', height: '8px',
                background: colors.primary,
                borderRadius: '50%',
                border: `2px solid ${isDark ? '#0B1120' : '#F0F9FF'}`,
                boxShadow: `0 0 8px ${colors.primary}90`,
              }} />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                id="nav-avatar-btn"
                onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <img src={currentUser.avatar} alt={currentUser.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${colors.border}` }}
                />
                <span style={{ color: colors.textPrimary, fontSize: '0.9rem', fontWeight: 500 }} className="hide-sm">
                  {currentUser.name.split(' ')[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div onClick={(e) => e.stopPropagation()} style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '14px',
                  padding: '8px',
                  minWidth: '180px',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                  zIndex: 200,
                  animation: 'scaleIn 0.2s ease',
                }}>
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', color: colors.textPrimary, textDecoration: 'none', fontSize: '0.875rem' }}>
                    <User size={16} /> Dashboard
                  </Link>
                  <button onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '8px', color: '#FCA5A5', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', textAlign: 'left' }}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-outline" style={{ padding: '8px 18px' }} onClick={() => navigate('/login')}>Log In</button>
            <button className="btn-primary btn-ripple" style={{ padding: '8px 18px' }} onClick={() => navigate('/register')}>Sign Up</button>
          </div>
        )}

        <button id="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, display: 'none' }} className="hamburger">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div style={{ background: isDark ? 'rgba(11,17,32,0.96)' : 'rgba(240,249,255,0.96)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${colors.border}`, padding: '16px 24px', animation: 'pageIn 0.3s ease' }}>
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', padding: '12px 0', color: colors.textMuted, textDecoration: 'none', borderBottom: `1px solid ${colors.borderLight}` }}>
              {link.label}
            </Link>
          ))}
          {!currentUser ? (
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn-outline" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Log In</button>
              <button className="btn-primary" onClick={() => { navigate('/register'); setMenuOpen(false); }}>Sign Up</button>
            </div>
          ) : (
            <button className="btn-outline" style={{ marginTop: '16px' }} onClick={handleLogout}>Sign Out</button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
          .hide-sm { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
