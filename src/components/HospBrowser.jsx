import React, { useState, useMemo, useEffect } from 'react';
import { DB, CITIES, HOSP_TYPES } from '../data/hospitals';

const PER_PAGE = 12;

const TYPE_BADGE = {
  'Private Corporate Chain': 'badge-bl',
  'Government/Public':       'badge-em',
  'Teaching/Medical College':'badge-am',
  'Trust/NGO':               'badge-pu',
  'Private Independent':     'badge-co',
};

/**
 * Full 375-hospital browser with search + filters + pagination.
 * Props:
 *  - onSelect {function(hospital)} called when user picks a hospital
 */
export default function HospBrowser({ onSelect }) {
  const [search,     setSearch]     = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterAcc,  setFilterAcc]  = useState('');
  const [sortBy,     setSortBy]     = useState('rating');
  const [page,       setPage]       = useState(1);

  const accOptions = useMemo(() => {
    const s = new Set();
    DB.forEach(h => h.acc.split(';').forEach(a => {
      const trimmed = a.trim().split('(')[0].trim();
      if (trimmed) s.add(trimmed);
    }));
    return [...s].sort();
  }, []);

  const filtered = useMemo(() => {
    let res = [...DB];
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.specialties.toLowerCase().includes(q)
      );
    }
    if (filterCity) res = res.filter(h => h.city === filterCity);
    if (filterType) res = res.filter(h => h.type === filterType);
    if (filterAcc)  res = res.filter(h => h.acc.includes(filterAcc));

    if (sortBy === 'rating') res.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'beds')   res.sort((a, b) => b.beds   - a.beds);
    if (sortBy === 'name')   res.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'year')   res.sort((a, b) => b.year   - a.year);
    return res;
  }, [search, filterCity, filterType, filterAcc, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => setPage(1), [search, filterCity, filterType, filterAcc, sortBy]);

  return (
    <div>
      {/* ── Filters ── */}
      <div className="filter-bar">
        <div style={{ flex: '2 1 200px' }}>
          <input
            className="inp" style={{ margin: 0 }}
            placeholder="Search hospitals, cities, specialties..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="inp" style={{ flex: '1 1 140px', margin: 0 }} value={filterCity} onChange={e => setFilterCity(e.target.value)}>
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select className="inp" style={{ flex: '1 1 160px', margin: 0 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {HOSP_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="inp" style={{ flex: '1 1 140px', margin: 0 }} value={filterAcc} onChange={e => setFilterAcc(e.target.value)}>
          <option value="">Any Accreditation</option>
          {accOptions.map(a => <option key={a}>{a}</option>)}
        </select>
        <select className="inp" style={{ flex: '1 1 120px', margin: 0 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="rating">Sort: Rating</option>
          <option value="beds">Sort: Beds</option>
          <option value="name">Sort: Name</option>
          <option value="year">Sort: Newest</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--slate)' }}>
          Showing <strong>{(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> hospitals
        </div>
        {filterCity && <span className="badge badge-bl">{filterCity}</span>}
      </div>

      {/* ── Cards grid ── */}
      <div className="hosp-grid">
        {paged.map(h => {
          const tc = TYPE_BADGE[h.type] || 'badge-am';
          const accShort = h.acc.split(';')[0].trim().split('(')[0].trim();
          return (
            <div key={h.id} className="hosp-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)', flex: 1, marginRight: 8 }}>{h.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                  <span style={{ color: '#F59E0B', fontSize: 14 }}>★</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)' }}>{h.rating}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                <span className="badge badge-bl" style={{ fontSize: 10 }}>{h.city}</span>
                <span className={`badge ${tc}`} style={{ fontSize: 10 }}>{h.type.replace('Private ', '').replace('/Public', '')}</span>
                <span className="badge badge-em" style={{ fontSize: 10 }}>{accShort}</span>
              </div>

              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                {[['beds', 'Beds'], ['icu', 'ICU'], ['ots', 'OTs'], ['year', 'Est.']].map(([k, l]) => (
                  <div key={k} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>{h[k].toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{l}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 10, lineHeight: 1.5 }}>
                <strong>Specialties:</strong> {h.specialties.split(';').slice(0, 3).join(', ')}…
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                {h.emergency && <span style={{ fontSize: 10, padding: '2px 8px', background: '#FEF2F2', color: '#DC2626', borderRadius: 10, border: '1px solid #FECACA' }}>🚨 Emergency</span>}
                {h.pharmacy  && <span style={{ fontSize: 10, padding: '2px 8px', background: '#F0FDF4', color: '#16A34A', borderRadius: 10, border: '1px solid #BBF7D0' }}>💊 Pharmacy</span>}
                {h.blood     && <span style={{ fontSize: 10, padding: '2px 8px', background: '#FFF7ED', color: '#C2410C', borderRadius: 10, border: '1px solid #FED7AA' }}>🩸 Blood Bank</span>}
                {h.tele      && <span style={{ fontSize: 10, padding: '2px 8px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: 10, border: '1px solid #BFDBFE' }}>📱 Telemedicine</span>}
              </div>

              {onSelect && (
                <button
                  onClick={() => onSelect(h)}
                  style={{ width: '100%', padding: 10, background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                >
                  Select Hospital →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pg-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pg;
            if (totalPages <= 7)        pg = i + 1;
            else if (page <= 4)         pg = i + 1;
            else if (page >= totalPages - 3) pg = totalPages - 6 + i;
            else                        pg = page - 3 + i;
            return pg >= 1 && pg <= totalPages ? (
              <button key={pg} className={`pg-btn ${page === pg ? 'on' : ''}`} onClick={() => setPage(pg)}>{pg}</button>
            ) : null;
          })}
          <button className="pg-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
        </div>
      )}
    </div>
  );
}
