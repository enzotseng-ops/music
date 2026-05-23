import { forwardRef } from 'react';

const ARM_GROUP_STYLE = {
  transformOrigin: '120px 260px',
  willChange: 'transform',
} as const;

export const Pendulum = forwardRef<SVGGElement>(function Pendulum(_props, ref) {
  return (
    <svg
      viewBox="-15 0 270 320"
      className="pendulum"
      role="img"
      aria-label="Metronome pendulum"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--body-light)" />
          <stop offset="100%" stopColor="var(--body-dark)" />
        </linearGradient>
        <radialGradient id="weightGrad" cx="0.35" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="var(--weight-light)" />
          <stop offset="100%" stopColor="var(--weight-dark)" />
        </radialGradient>
      </defs>

      <polygon
        points="30,300 120,40 210,300"
        fill="url(#bodyGrad)"
        stroke="var(--body-stroke)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <rect
        x="80"
        y="80"
        width="80"
        height="180"
        rx="6"
        fill="var(--window)"
        stroke="var(--window-stroke)"
        strokeWidth="1.5"
      />

      <line x1="80" y1="170" x2="160" y2="170" stroke="var(--tick-mark)" strokeWidth="1" strokeDasharray="3 3" />

      <g ref={ref} style={ARM_GROUP_STYLE}>
        <line
          x1="120"
          y1="260"
          x2="120"
          y2="13"
          stroke="var(--arm)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle
          cx="120"
          cy="78"
          r="14"
          fill="url(#weightGrad)"
          stroke="var(--weight-stroke)"
          strokeWidth="1.5"
        />
      </g>

      <circle cx="120" cy="260" r="7" fill="var(--pivot)" stroke="var(--body-stroke)" strokeWidth="1.5" />

      <rect x="20" y="295" width="200" height="14" rx="3" fill="var(--base)" stroke="var(--body-stroke)" strokeWidth="1.5" />
    </svg>
  );
});
