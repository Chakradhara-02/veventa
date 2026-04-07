import { useState, useCallback } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { trpc } from './lib/trpc';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import LandingAnimation from './components/LandingAnimation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import MemoriesPage from './pages/MemoriesPage';

const queryClient = new QueryClient();
const apiBaseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const trpcUrl = apiBaseUrl ? `${apiBaseUrl}/api/trpc` : '/api/trpc';
const Router = import.meta.env.VITE_USE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: trpcUrl,
      transformer: superjson,
      headers() {
        const token = localStorage.getItem('authToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
  ],
});

function Layout({ children, hideNav }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!hideNav && <Navbar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Notification />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Layout hideNav><LoginPage /></Layout>} />
      <Route path="/register" element={<Layout hideNav><RegisterPage /></Layout>} />
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/events" element={<Layout><EventsPage /></Layout>} />
      <Route path="/events/:id" element={<Layout><EventDetailPage /></Layout>} />
      <Route path="/memories" element={<Layout><MemoriesPage /></Layout>} />
      <Route path="/chat" element={<Layout><ChatPage /></Layout>} />
      <Route path="/chat/:eventId" element={<Layout><ChatPage /></Layout>} />
      <Route path="/dashboard/*" element={<Layout><DashboardPage /></Layout>} />
      <Route path="*" element={
        <Layout>
          <div className="page-enter" style={{
            minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '16px', position: 'relative',
          }}>
            <div style={{ fontSize: '5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>404</div>
            <p style={{ color: 'var(--primary-light)', fontSize: '1.2rem', fontWeight: 600 }}>Page not found</p>
            <a href="/" className="btn-primary" style={{ textDecoration: 'none' }}>Go Home</a>
          </div>
        </Layout>
      } />
    </Routes>
  );
}

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const handleLandingComplete = useCallback(() => setShowLanding(false), []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider>
            <AppProvider>
              {showLanding && <LandingAnimation onComplete={handleLandingComplete} />}
              <AppRoutes />
            </AppProvider>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
