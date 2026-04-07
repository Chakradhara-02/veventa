export default function TicketLogo({ size = 36, glow = true, className = '' }) {
  const s = size;
  const w = s * 1.4;
  const h = s;
  const r = s * 0.15; // corner radius
  const notchR = s * 0.12; // notch radius
  const notchY = h / 2;

  return (
    <div
      className={className}
      style={{
        width: w, height: h,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: glow ? 'drop-shadow(0 0 12px rgba(230,0,0,0.6))' : 'none',
      }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="ticketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E60000" />
            <stop offset="50%" stopColor="#FF0040" />
            <stop offset="100%" stopColor="#CC0000" />
          </linearGradient>
          <linearGradient id="ticketGlassOverlay" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Ticket shape with notches on left and right */}
        <path
          d={`
            M ${r} 0
            L ${w * 0.35} 0
            A ${notchR} ${notchR} 0 0 0 ${w * 0.35} ${notchR * 2}
            L ${w * 0.35} ${h - notchR * 2}
            A ${notchR} ${notchR} 0 0 0 ${w * 0.35} ${h}
            L ${r} ${h}
            A ${r} ${r} 0 0 1 0 ${h - r}
            L 0 ${r}
            A ${r} ${r} 0 0 1 ${r} 0
            Z
            M ${w * 0.35} 0
            L ${w - r} 0
            A ${r} ${r} 0 0 1 ${w} ${r}
            L ${w} ${h - r}
            A ${r} ${r} 0 0 1 ${w - r} ${h}
            L ${w * 0.35} ${h}
          `}
          fill="url(#ticketGrad)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />

        {/* Glass overlay (top half shine) for cartoon effect */}
        <path
          d={`
            M ${r} 0
            L ${w - r} 0
            A ${r} ${r} 0 0 1 ${w} ${r}
            L ${w} ${h * 0.45}
            L 0 ${h * 0.45}
            L 0 ${r}
            A ${r} ${r} 0 0 1 ${r} 0
            Z
          `}
          fill="url(#ticketGlassOverlay)"
        />

        {/* Dashed perforated line */}
        <line
          x1={w * 0.35}
          y1={notchR * 2 + 2}
          x2={w * 0.35}
          y2={h - notchR * 2 - 2}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />

        {/* V letter – cut into the ticket */}
        <text
          x={w * 0.17}
          y={h * 0.72}
          fill="white"
          fontSize={h * 0.55}
          fontWeight="800"
          fontFamily="Poppins, sans-serif"
          textAnchor="middle"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
        >
          V
        </text>

        {/* Small star decorations (White highlights) */}
        <circle cx={w * 0.55} cy={h * 0.3} r={1.5} fill="rgba(255,255,255,0.8)" />
        <circle cx={w * 0.75} cy={h * 0.5} r={1} fill="rgba(255,255,255,0.6)" />
        <circle cx={w * 0.85} cy={h * 0.25} r={1.2} fill="rgba(255,255,255,0.9)" />
        <circle cx={w * 0.65} cy={h * 0.7} r={1} fill="rgba(255,255,255,0.5)" />
      </svg>
    </div>
  );
}
