import React, { useMemo } from 'react';

/**
 * SVG area chart showing outstanding balance declining over months.
 * Props:
 *  - months {number}
 *  - emi    {number}
 */
export default function RepaymentChart({ months, emi }) {
  const pts = useMemo(() => {
    const n = Math.min(months, 60);
    return Array.from({ length: n + 1 }, (_, i) => ({ x: i, y: Math.round(emi * (n - i)) }));
  }, [months, emi]);

  if (!pts.length) return null;

  const W = 240, H = 70, pad = 8;
  const maxY = pts[0].y || 1;
  const last = pts[pts.length - 1].x || 1;

  const toSvg = ({ x, y }) => ({
    sx: pad + (x / last) * (W - 2 * pad),
    sy: pad + (1 - y / maxY) * (H - 2 * pad),
  });

  const path = pts
    .map((p, i) => { const { sx, sy } = toSvg(p); return `${i === 0 ? 'M' : 'L'}${sx},${sy}`; })
    .join(' ');

  const { sx: lastX } = toSvg(pts[pts.length - 1]);

  return (
    <svg
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto' }}
    >
      <defs>
        <linearGradient id="repGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L${lastX},${H - pad} L${pad},${H - pad} Z`}
        fill="url(#repGrad)"
      />
      <path d={path} fill="none" stroke="#10B981" strokeWidth="2" />
    </svg>
  );
}
