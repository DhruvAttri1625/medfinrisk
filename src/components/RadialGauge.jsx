import React from 'react';

/**
 * SVG radial risk gauge.
 * Props:
 *  - score {number} 0–100
 */
export default function RadialGauge({ score }) {
  const r = 52, cx = 64, cy = 64;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score, 100) / 100;
  const col = score < 35 ? '#10B981' : score < 65 ? '#F59E0B' : '#F43F5E';
  const label = score < 35 ? 'LOW RISK' : score < 65 ? 'MEDIUM RISK' : 'HIGH RISK';

  return (
    <div className="risk-ring-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={col} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 64 64)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={col} fontSize="22" fontWeight="700" fontFamily="DM Sans">
          {score}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="DM Sans">
          /100
        </text>
      </svg>
      <div style={{ fontSize: 12, fontWeight: 600, color: col }}>{label}</div>
    </div>
  );
}
