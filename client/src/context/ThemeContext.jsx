import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('veventa-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('veventa-theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const isDark = theme === 'dark';

  // Color tokens that components use - updated for Red Theme
  const colors = isDark ? {
    // Backgrounds
    bgDeep: '#1A0000',
    bgPage: '#2B0000',
    bgCard: 'rgba(255, 255, 255, 0.08)',
    bgCardSolid: '#2A0000',
    bgSurface: 'rgba(255, 255, 255, 0.05)',
    bgGlass: 'rgba(255, 255, 255, 0.08)',
    bgInput: 'rgba(255, 255, 255, 0.12)',
    bgHover: 'rgba(255, 50, 50, 0.08)',

    // Borders
    border: 'rgba(255, 255, 255, 0.2)',
    borderLight: 'rgba(255, 255, 255, 0.1)',
    borderMedium: 'rgba(255, 255, 255, 0.2)',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#FFD1D1',
    textMuted: '#FF9999',
    textDim: '#803333',

    // Brand (Red)
    primary: '#E60000',
    primaryLight: '#FF3333',
    accent: '#FF0040',
    teal: '#FF4D4D',

    // Navbar
    navBg: 'rgba(26, 0, 0, 0.85)',
    navBgLight: 'rgba(26, 0, 0, 0.6)',

    // Gradient
    heroGradient: 'linear-gradient(135deg, #7F0000 0%, #2B0000 100%)',
    cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',

    // Overlay
    overlay: 'rgba(0,0,0,0.6)',

    // Orb opacity
    orbOpacity: 1,
  } : {
    // LIGHT MODE (Soft red/white gradient)
    bgDeep: '#FFF0F0',
    bgPage: '#FFE6E6',
    bgCard: 'rgba(255, 255, 255, 0.45)',
    bgCardSolid: '#FFFFFF',
    bgSurface: 'rgba(255, 255, 255, 0.6)',
    bgGlass: 'rgba(255, 255, 255, 0.4)',
    bgInput: 'rgba(255, 255, 255, 0.7)',
    bgHover: 'rgba(230, 0, 0, 0.06)',

    // Borders
    border: 'rgba(230, 0, 0, 0.15)',
    borderLight: 'rgba(230, 0, 0, 0.08)',
    borderMedium: 'rgba(230, 0, 0, 0.25)',

    // Text
    textPrimary: '#4D0000',
    textSecondary: '#800000',
    textMuted: '#993333',
    textDim: '#CC8080',

    // Brand (Red)
    primary: '#CC0000',
    primaryLight: '#FF1A1A',
    accent: '#E60039',
    teal: '#E63939',

    // Navbar
    navBg: 'rgba(255, 240, 240, 0.85)',
    navBgLight: 'rgba(255, 240, 240, 0.6)',

    // Gradient
    heroGradient: 'linear-gradient(135deg, #FFF0F0 0%, #FFE6E6 100%)',
    cardGradient: 'linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(255,224,224,0.5) 100%)',

    // Overlay
    overlay: 'rgba(255,255,255,0.6)',

    // Orb opacity
    orbOpacity: 0.4,
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
