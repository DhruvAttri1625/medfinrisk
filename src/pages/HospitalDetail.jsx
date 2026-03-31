import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { DB } from '../data/hospitals';
import { fmtL } from '../utils/formatters';

/**
 * Full hospital detail page.
 * Route: /hospital/:id?treatment=...
 * Props:  t {object}  translations
 */
export default function HospitalDetail({ t }) {
  const { id }     = useParams();
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const preselectedTreatment = params.get('treatment') || '';

  const h = DB.find(hosp => hosp.id === id);
  if (!h) return <div className="page"><p>Hospital not found.</p></div>;

  const accShort = h.acc.split(';')[0].trim().split('(')[0].trim();

  return (
    <div className="page fade">
      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <button className="btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
          ← Back
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 'clamp(24px,3vw,36px)', color: 'var(--navy)', marginBottom: 8 }}>
              {h.name}
            </h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-bl">{h.city}, {h.state}</span>
              <span className="badge badge-em">{h.type}</span>
              <span className="badge badge-am">{accShort}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: 'var(--amber)' }}>
                <span>★</span>{h.rating}/5
              </span>
            </div>
          </div>
          <button
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 24px' }}
            onClick={() => navigate(`/hospital/${h.id}/diagnose`)}
          >
            Run Financial Diagnosis →
          </button>
        </div>
      </div>

      <div className="two-col">
        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Overview */}
          <div className="card card-p">
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--navy)', marginBottom: 16 }}>Hospital Overview</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { l: 'Bed Capacity', v: h.beds.toLocaleString() },
                { l: 'ICU Beds',     v: h.icu },
                { l: 'Op. Theatres', v: h.ots },
                { l: 'Established',  v: h.year },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center', padding: 14, background: '#F8FAFC', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)' }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {h.emergency && <span style={{ fontSize: 11, padding: '4px 10px', background: '#FEF2F2', color: '#DC2626', borderRadius: 10, border: '1px solid #FECACA' }}>🚨 Emergency</span>}
              {h.pharmacy  && <span style={{ fontSize: 11, padding: '4px 10px', background: '#F0FDF4', color: '#16A34A', borderRadius: 10, border: '1px solid #BBF7D0' }}>💊 Pharmacy</span>}
              {h.blood     && <span style={{ fontSize: 11, padding: '4px 10px', background: '#FFF7ED', color: '#C2410C', borderRadius: 10, border: '1px solid #FED7AA' }}>🩸 Blood Bank</span>}
              {h.tele      && <span style={{ fontSize: 11, padding: '4px 10px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: 10, border: '1px solid #BFDBFE' }}>📱 Telemedicine</span>}
            </div>
          </div>

          {/* Specialties */}
          <div className="card card-p">
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--navy)', marginBottom: 12 }}>Specialties</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {h.specialties.split(';').map(s => s.trim()).filter(Boolean).map(s => (
                <span key={s} className="badge badge-bl" style={{ fontSize: 11 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Top doctor */}
          <div className="card card-p">
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--navy)', marginBottom: 12 }}>Top Doctor</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18, fontWeight: 700, flexShrink: 0 }}>
                {h.topDoc.split(' ').pop()[0]}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--navy)' }}>{h.topDoc}</div>
                <div style={{ fontSize: 13, color: 'var(--slate)' }}>{h.topDocSpec}</div>
              </div>
            </div>
          </div>

          {/* Government schemes */}
          <div className="card card-p">
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--navy)', marginBottom: 12 }}>Government Schemes Accepted</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {h.schemes.split(';').map(s => s.trim()).filter(Boolean).map(s => (
                <span key={s} className="badge badge-em" style={{ fontSize: 11 }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column: Treatment costs ── */}
        <div>
          <div className="card card-p">
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--navy)', marginBottom: 16 }}>Treatment Costs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(h.costs).map(([tr, cost]) => (
                <div
                  key={tr}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer',
                    background: tr === preselectedTreatment ? '#F0FDF4' : 'transparent',
                    borderRadius: tr === preselectedTreatment ? 8 : 0,
                    paddingLeft: tr === preselectedTreatment ? 8 : 0,
                    paddingRight: tr === preselectedTreatment ? 8 : 0,
                  }}
                  onClick={() => navigate(`/hospital/${h.id}/diagnose?treatment=${encodeURIComponent(tr)}`)}
                >
                  <span style={{ fontSize: 13.5, color: 'var(--navy)' }}>{tr}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--emerald)' }}>{fmtL(cost)}</span>
                    <button style={{ padding: '5px 12px', background: 'var(--navy)', color: 'white', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
                      Diagnose →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
