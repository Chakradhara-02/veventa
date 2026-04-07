import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const spheres = [
  { size: 300, x: '10%', y: '-5%', color: 'rgba(230,0,0,0.15)', delay: 0, duration: 8 },
  { size: 200, x: '75%', y: '10%', color: 'rgba(255,0,64,0.12)', delay: 1, duration: 10 },
  { size: 250, x: '60%', y: '65%', color: 'rgba(255,51,51,0.1)', delay: 2, duration: 9 },
  { size: 180, x: '5%', y: '60%', color: 'rgba(230,0,0,0.12)', delay: 0.5, duration: 11 },
  { size: 120, x: '40%', y: '30%', color: 'rgba(255,0,64,0.08)', delay: 3, duration: 7 },
  { size: 160, x: '85%', y: '75%', color: 'rgba(230,0,0,0.1)', delay: 1.5, duration: 12 },
  { size: 90, x: '25%', y: '80%', color: 'rgba(255,51,51,0.08)', delay: 2.5, duration: 8 },
  { size: 220, x: '50%', y: '-10%', color: 'rgba(255,0,64,0.11)', delay: 0.8, duration: 10 },
];

export default function FloatingBackground({ intensity = 1, children }) {
  const { isDark, colors } = useTheme();

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Spheres */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: colors.orbOpacity * intensity,
      }}>
        {spheres.map((s, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, x: 0, scale: 1 }}
            animate={{
              y: [0, -25, 15, -20, 0],
              x: [0, 15, -10, 8, 0],
              scale: [1, 1.08, 0.95, 1.04, 1],
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              borderRadius: '50%',
              background: isDark
                ? `radial-gradient(circle, ${s.color}, transparent 70%)`
                : `radial-gradient(circle, ${s.color.replace(/[\d.]+\)$/, match => parseFloat(match) * 0.5 + ')')}, transparent 70%)`,
              filter: `blur(${s.size * 0.15}px)`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
