import { useMemo } from 'react';

// Golden floating particles
function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: 3 + (i % 4),
      left: `${(i * 17 + 7) % 100}%`,
      delay: `${(i * 1.3) % 18}s`,
      duration: `${10 + (i * 1.7) % 12}s`,
      opacity: 0.3 + (i % 5) * 0.12,
    }));
  }, []);

  return (
    <div className="cinematic-particles" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="cinematic-particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            opacity: 0,
            ['--particle-opacity' as string]: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// Ornate SVG mandala for corners
function MandalaSVG({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rings — orange, purple, yellow, gold */}
      <circle cx="100" cy="100" r="95" stroke="rgba(245,158,11,0.35)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="88" stroke="rgba(147,51,234,0.3)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="80" stroke="rgba(250,204,21,0.25)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="72" stroke="rgba(212,160,23,0.25)" strokeWidth="0.5" />
      {/* Petal pattern — alternating colors */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 100 + 60 * Math.cos(angle);
        const y1 = 100 + 60 * Math.sin(angle);
        const x2 = 100 + 90 * Math.cos(angle);
        const y2 = 100 + 90 * Math.sin(angle);
        const lineColors = [
          'rgba(245,158,11,0.3)',   // orange
          'rgba(147,51,234,0.25)',  // purple
          'rgba(250,204,21,0.3)',   // yellow
          'rgba(212,160,23,0.25)',  // gold
        ];
        const petalColors = [
          'rgba(147,51,234,0.25)',  // purple
          'rgba(245,158,11,0.25)', // orange
          'rgba(212,160,23,0.2)',  // gold
          'rgba(250,204,21,0.25)', // yellow
        ];
        return (
          <g key={i}>
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={lineColors[i % 4]}
              strokeWidth="0.5"
            />
            <ellipse
              cx={100 + 50 * Math.cos(angle)}
              cy={100 + 50 * Math.sin(angle)}
              rx="8" ry="3"
              transform={`rotate(${i * 30}, ${100 + 50 * Math.cos(angle)}, ${100 + 50 * Math.sin(angle)})`}
              stroke={petalColors[i % 4]}
              strokeWidth="0.5"
              fill="none"
            />
          </g>
        );
      })}
      {/* Inner star — alternating orange/purple/yellow */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const starColors = [
          'rgba(245,158,11,0.25)', // orange
          'rgba(147,51,234,0.2)',  // purple
          'rgba(250,204,21,0.25)', // yellow
          'rgba(212,160,23,0.2)',  // gold
        ];
        return (
          <line
            key={`star-${i}`}
            x1="100" y1="100"
            x2={100 + 35 * Math.cos(angle)}
            y2={100 + 35 * Math.sin(angle)}
            stroke={starColors[i % 4]}
            strokeWidth="0.3"
          />
        );
      })}
      <circle cx="100" cy="100" r="15" stroke="rgba(147,51,234,0.3)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="5" fill="rgba(250,204,21,0.2)" />
    </svg>
  );
}

// Animated border frame with shimmer
function BorderFrame() {
  return <div className="cinematic-border-frame" aria-hidden="true" />;
}

export function CinematicDecorations() {
  return (
    <div className="cinematic-decorations" aria-hidden="true">
      <Particles />

      {/* Rotating mandalas at corners */}
      <MandalaSVG className="cinematic-mandala cinematic-mandala-tl" />
      <MandalaSVG className="cinematic-mandala cinematic-mandala-tr" />
      <MandalaSVG className="cinematic-mandala cinematic-mandala-bl" />
      <MandalaSVG className="cinematic-mandala cinematic-mandala-br" />

      <BorderFrame />
    </div>
  );
}
