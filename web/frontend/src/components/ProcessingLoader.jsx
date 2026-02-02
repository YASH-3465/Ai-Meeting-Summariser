export default function ProcessingLoader({ label, eta }) {
  return (
    <div className="loader-container">
      <svg className="modern-loader" viewBox="0 0 100 100">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 🔥 ROTATION IS LOCKED HERE */}
        <g className="dot-group">
          {[...Array(12)].map((_, i) => (
            <circle
              key={i}
              className="dot"
              cx={50 + 34 * Math.cos((i * 30 - 90) * Math.PI / 180)}
              cy={50 + 34 * Math.sin((i * 30 - 90) * Math.PI / 180)}
              r="3"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </g>
      </svg>

      <div className="processing-label">{label}</div>

      {/* ✅ ETA FIX (no flicker) */}
      {eta !== null && (
        <div className="eta-label">~ {eta}s remaining</div>
      )}
    </div>
  );
}
