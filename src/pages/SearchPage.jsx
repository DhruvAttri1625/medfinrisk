import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Autocomplete from '../components/Autocomplete';
import HospBrowser from '../components/HospBrowser';
import { DB, TREATMENTS, CITIES } from '../data/hospitals';

/**
 * Search step-2 page.
 * Route: /search/:mode   where mode ∈ { treatment | hospital | city }
 * Props:  t {object}  translations
 */
export default function SearchPage({ t }) {
  const { mode }   = useParams();
  const navigate   = useNavigate();
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');

  /* ── Hospital browser mode ── */
  if (mode === 'hospital') {
    return (
      <div className="page fade">
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate)', letterSpacing: '.08em', marginBottom: 6 }}>BROWSE DATABASE</div>
          <div className="sec-title">375 Hospitals across India</div>
          <div className="sec-sub">Filter by city, type, or accreditation. Click any hospital to run a Financial Diagnosis.</div>
        </div>
        <HospBrowser onSelect={h => navigate('/hospital/' + h.id)} />
      </div>
    );
  }

  /* ── Treatment or City search ── */
  const isTreatment = mode === 'treatment';
  const steps = [
    { step: '1', title: isTreatment ? 'Select your treatment' : 'Enter your city', done: !!q1 },
    { step: '2', title: 'Narrow down the results', done: !!q2 },
    { step: '3', title: 'View real hospital costs', done: false },
    { step: '4', title: 'Run Financial Diagnosis',  done: false },
  ];

  const handleSearch = () => {
    const city      = isTreatment ? q2 : q1;
    const treatment = isTreatment ? q1 : q2;
    navigate(`/results?treatment=${encodeURIComponent(treatment)}&city=${encodeURIComponent(city)}`);
  };

  return (
    <div className="page fade">
      <div className="sidebar-layout">
        {/* Left panel */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate)', letterSpacing: '.08em', marginBottom: 6 }}>
              {isTreatment ? 'SEARCH BY TREATMENT' : 'SEARCH BY CITY'}
            </div>
            <div className="sec-title">{isTreatment ? t.enterTreatment : t.enterCity}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* First input */}
            <div>
              <label className="lbl">{isTreatment ? 'TREATMENT' : 'CITY'}</label>
              {isTreatment ? (
                <select className="inp" value={q1} onChange={e => setQ1(e.target.value)}>
                  <option value="">{t.phSelectTreat}</option>
                  {TREATMENTS.map(tr => <option key={tr}>{tr}</option>)}
                </select>
              ) : (
                <Autocomplete value={q1} onChange={setQ1} options={CITIES} placeholder={t.phCity} />
              )}
            </div>

            {/* Second input – appears after first is filled */}
            {q1 && (isTreatment || CITIES.includes(q1)) && (
              <div className="fade">
                {!isTreatment && (
                  <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: '#1D4ED8' }}>
                      <strong>{DB.filter(h => h.city === q1).length}</strong> hospitals in <strong>{q1}</strong>
                    </div>
                  </div>
                )}
                <label className="lbl">{isTreatment ? t.selectCity : t.selectTreatment}</label>
                {isTreatment ? (
                  <select className="inp" value={q2} onChange={e => setQ2(e.target.value)}>
                    <option value="">All Cities</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                ) : (
                  <select className="inp" value={q2} onChange={e => setQ2(e.target.value)}>
                    <option value="">{t.phSelectTreat}</option>
                    {TREATMENTS.map(tr => <option key={tr}>{tr}</option>)}
                  </select>
                )}
              </div>
            )}

            <button
              className="btn-primary"
              disabled={isTreatment ? !q1 : !q1 || !q2}
              style={{ opacity: (isTreatment ? !!q1 : !!q1 && !!q2) ? 1 : 0.5 }}
              onClick={handleSearch}
            >
              {t.searchBtn}
            </button>
          </div>
        </div>

        {/* Right panel – quick guide */}
        <div className="card card-p">
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)', letterSpacing: '.07em', marginBottom: 16 }}>QUICK GUIDE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: s.done ? 'var(--emerald)' : '#E2E8F0',
                  color: s.done ? 'white' : 'var(--slate)',
                  fontSize: 13, fontWeight: 600,
                }}>
                  {s.done ? '✓' : s.step}
                </div>
                <div style={{ fontWeight: 500, fontSize: 14, color: 'var(--navy)', paddingTop: 4 }}>{s.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
