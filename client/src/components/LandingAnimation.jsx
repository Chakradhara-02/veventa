import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TicketLogo from './TicketLogo';

const particles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 5 + 1.5,
  delay: Math.random() * 1.5,
  duration: Math.random() * 3 + 2,
}));

export default function LandingAnimation({ onComplete }) {
  const [phase, setPhase] = useState('logo'); // 'logo' | 'done'

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('done');
      setTimeout(onComplete, 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="landing"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'linear-gradient(135deg, #4D0000 0%, #1A0000 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Floating spheres / particles */}
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [-20, -70],
                x: [0, (Math.random() - 0.5) * 50],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: 'rgba(255,51,51,0.6)',
                boxShadow: '0 0 8px rgba(255,51,51,0.5)',
              }}
            />
          ))}

          {/* Glow ring */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.6, 1.3], opacity: [0, 0.4, 0] }}
            transition={{ duration: 2, delay: 0.3, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: 200, height: 200,
              borderRadius: '50%',
              border: '2px solid rgba(255,0,64,0.4)',
              boxShadow: '0 0 60px rgba(230,0,0,0.3)',
            }}
          />

          {/* Logo with smooth zoom-in */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.2, 1],
              opacity: [0, 1, 1],
            }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <TicketLogo size={72} glow />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ marginTop: 20, textAlign: 'center' }}
          >
            <h1 style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 800,
              fontSize: '2.5rem',
              background: 'linear-gradient(135deg, #FFFFFF, #FF9999, #FF3333)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
            }}>
              V'eventa
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              style={{ color: '#FFD1D1', fontSize: '0.9rem', marginTop: 8 }}
            >
              Connect. Participate. Experience.
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            transition={{ duration: 2.2, delay: 0.5, ease: 'easeInOut' }}
            style={{
              height: 3, borderRadius: 99, marginTop: 32,
              background: 'linear-gradient(90deg, #E60000, #FF0040, #FF4D4D)',
              boxShadow: '0 0 12px rgba(230,0,0,0.5)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
