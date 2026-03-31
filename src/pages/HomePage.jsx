import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Landing page – hero + search mode selector.
 * Props:  t {object} translations
 */
export default function HomePage({ t }) {
  const navigate = useNavigate();

  const modes = [
    { mode: 'treatment', icon: '💊', title: t.byTreatment, desc: t.byTreatmentDesc, col: '#EFF6FF', bor: '#BFDBFE' },
    { mode: 'hospital',  icon: '🏥', title: t.byHospital,  desc: t.byHospitalDesc,  col: '#F0FDF4', bor: '#A7F3D0' },
    { mode: 'city',      icon: '🏙️', title: t.byCity,      desc: t.byCityDesc,      col: '#FEF3C7', bor: '#FDE68A' },
  ];

  const stats = [
    { n: '375', l: t.statHosp },
    { n: '25',  l: t.statCities },
    { n: '20',  l: t.statTreat },
    { n: '100%',l: t.statAcc },
  ];

  return (
    <div className="page fade">
      <div className="hero-section">
        <div className="two-col" style={{ gap: 60, alignItems: 'center' }}>

          {/* ── Left: hero text + stats ── */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--emerald-light)', border: '1px solid #A7F3D0', borderRadius: 20, padding: '5px 14px', marginBottom: 20 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#065F46', letterSpacing: '.05em' }}>REAL DATA · 375 HOSPITALS · 25 CITIES</span>
            </div>

            <h1 style={{ fontFamily: 'DM Serif Display', fontSize: 'clamp(32px,3.5vw,52px)', fontWeight: 400, color: 'var(--navy)', lineHeight: 1.18, marginBottom: 18 }}>
              {t.heroTitle1}<br />
              <em style={{ color: 'var(--emerald)' }}>{t.heroEm}</em> {t.heroTitle2}
            </h1>

            <p style={{ fontSize: 16, color: 'var(--slate)', lineHeight: 1.7, marginBottom: 32, maxWidth: 500 }}>
              {t.heroDesc}
            </p>

            <div className="stat-grid">
              {stats.map(s => (
                <div key={s.l} className="stat-box">
                  <div style={{ fontFamily: 'DM Serif Display', fontSize: 24, color: 'var(--navy)', marginBottom: 4 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: mode cards ── */}
          <div className="card card-p">
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)', marginBottom: 20, letterSpacing: '.03em' }}>{t.howToSearch}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {modes.map(({ mode, icon, title, desc, col, bor }) => (
                <div
                  key={mode}
                  onClick={() => navigate(`/search/${mode}`)}
                  style={{ padding: '18px 20px', border: `2px solid ${bor}`, borderRadius: 14, background: col, cursor: 'pointer', transition: 'all .2s', display: 'flex', gap: 16, alignItems: 'flex-start' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--navy)', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--slate)', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--slate)', fontSize: 18, alignSelf: 'center' }}>›</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
