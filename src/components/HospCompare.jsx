import React, { useState, useMemo } from 'react';
import { fmtL } from '../utils/formatters';

/**
 * Side-by-side hospital cost comparison table.
 * Props:
 *  - treatment  {string}
 *  - hospitals  {array}   subset of DB
 *  - t          {object}  translations
 *  - onSelect   {function(hospital, cost) | null}  null = read-only mode
 */
export default function HospCompare({ treatment, hospitals, t, onSelect }) {
  const [sort, setSort] = useState('cost');

  const data = useMemo(() => {
    const rows = hospitals
      .map(h => ({ h, cost: h.costs[treatment] || 0, buf: Math.round((h.costs[treatment] || 0) * 1.15) }))
      .filter(r => r.cost > 0);

    if (sort === 'cost')   rows.sort((a, b) => a.cost - b.cost);
    if (sort === 'rating') rows.sort((a, b) => b.h.rating - a.h.rating);
    if (sort === 'beds')   rows.sort((a, b) => b.h.beds - a.h.beds);
    return rows;
  }, [hospitals, treatment, sort]);

  const maxCost = Math.max(...data.map(d => d.cost), 1);

  return (
    <div>
      {/* Sort controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontSize: 13, color: 'var(--slate)' }}>
          Showing <strong>{data.length}</strong> hospitals for <strong>{treatment}</strong>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--slate)' }}>Sort:</span>
          {[['cost', 'Cost'], ['rating', 'Rating'], ['beds', 'Beds']].map(([k, l]) => (
            <button key={k} className={`tab ${sort === k ? 'on' : ''}`} style={{ padding: '5px 14px', fontSize: 12 }} onClick={() => setSort(k)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="hosp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Hospital</th>
              <th>City</th>
              <th>Cost</th>
              <th>With Buffer</th>
              <th style={{ minWidth: 120 }}>Range</th>
              <th>Rating</th>
              <th>Beds</th>
              <th>Accreditation</th>
              {onSelect && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => {
              const isCheap = i === 0;
              const isExp   = i === data.length - 1;
              const acc = d.h.acc.split(';')[0].trim().split('(')[0].trim();

              return (
                <tr key={d.h.id}>
                  <td style={{ fontWeight: 700, color: 'var(--slate)', fontSize: 13 }}>#{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: 14, maxWidth: 180 }}>{d.h.name}</div>
                    <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
                      {isCheap && <span className="badge badge-em" style={{ fontSize: 10 }}>✓ Lowest</span>}
                      {isExp   && <span className="badge badge-co" style={{ fontSize: 10 }}>↑ Highest</span>}
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--slate)' }}>{d.h.city}</td>
                  <td style={{ fontWeight: 700, fontSize: 15, color: isCheap ? '#065F46' : isExp ? '#9F1239' : 'var(--navy)' }}>
                    {fmtL(d.cost)}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--slate)' }}>{fmtL(d.buf)}</td>
                  <td style={{ width: 120 }}>
                    <div className="pbar-wrap">
                      <div
                        className="pbar"
                        style={{
                          width: `${Math.round((d.cost / maxCost) * 100)}%`,
                          background: isCheap ? 'var(--emerald)' : isExp ? 'var(--coral)' : 'var(--amber)',
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#F59E0B', fontSize: 14 }}>★</span>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{d.h.rating}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--slate)' }}>{d.h.beds.toLocaleString()}</td>
                  <td><span className="badge badge-bl" style={{ fontSize: 10 }}>{acc}</span></td>
                  {onSelect && (
                    <td>
                      <button
                        onClick={() => onSelect(d.h, d.cost)}
                        style={{ padding: '7px 14px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer' }}
                      >
                        Select →
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
