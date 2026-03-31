import { useEffect } from 'react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RadialGauge from '../components/RadialGauge';
import RepaymentChart from '../components/RepaymentChart';
import HospCompare from '../components/HospCompare';
import EMICalc from '../components/EMICalc';
import { DB } from '../data/hospitals';
import { fmt, fmtL } from '../utils/formatters';

/**
 * Risk Intelligence Dashboard.
 * Route: /dashboard  (receives state from DiagnosisForm via navigate)
 * Props:  t {object}  translations
 */

const token = localStorage.getItem("token");

if (!token) navigate('/login');
export default function Dashboard({ t }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('risk');

  const result = location.state;
  if (!result) {
    // No state – redirect home
    navigate('/');
    return null;
  }

  const { hospital: h, treatment, totalCost, outOfPocket, disposable, months, score, toxicity, emi } = result;

  const isLow  = score < 35;
  const isMed  = score >= 35 && score < 65;
  const isHigh = score >= 65;

  // Hospitals in the same city for comparison tab
  const cityHospitals = DB.filter(hosp => hosp.city === h.city);

  const statBoxes = [
    { l: 'TOTAL WITH BUFFER',      v: fmtL(totalCost),    sub: 'Estimated cost',     c: 'var(--navy)' },
    { l: 'OUT-OF-POCKET',          v: fmtL(outOfPocket),  sub: 'After insurance',    c: 'var(--coral)' },
    { l: 'MONTHLY DISPOSABLE',     v: fmt(disposable),    sub: 'Available for EMI',  c: 'var(--emerald)' },
    { l: 'REPAYMENT PERIOD',       v: months < 12 ? `${months}m` : `${(months / 12).toFixed(1)}y`, sub: 'To clear debt', c: 'var(--amber)' },
  ];

  const lowRecs = [
    { ti: 'Top-Up Health Insurance',   d: 'Add ₹10L coverage for ~₹800/month. Star Health Super Surplus or HDFC ERGO Optima Super.' },
    { ti: 'Bajaj Finserv EMI Card',    d: '0% interest EMI for medical expenses up to ₹4 lakh at 5500+ hospitals.' },
    { ti: 'Hospital Payment Plan',     d: "Ask your hospital's finance desk for in-house 0% EMI — 3-6 month plans available." },
  ];
  const medRecs = [
    { ti: 'CareNow Health Finance',    d: 'Loans up to ₹15L @ 13% p.a. | Instant approval | Direct hospital disbursement' },
    { ti: 'SaveIn Medical Credit',     d: 'Pay hospital directly | Flexible EMI from ₹1,499/mo | No collateral' },
    { ti: 'Bajaj Finserv Medical Loan',d: 'No-cost EMI at 2000+ hospitals | Up to ₹25L | 96-hour disbursal' },
  ];

  return (
    <div className="page fade">
      {/* ── Page header ── */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate)', letterSpacing: '.08em', marginBottom: 4 }}>RISK INTELLIGENCE DASHBOARD</div>
          <h2 style={{ fontFamily: 'DM Serif Display', fontSize: 28, color: 'var(--navy)' }}>{h.name}</h2>
        </div>
      </div>

      {/* ── High toxicity alert ── */}
      {toxicity > 0.5 && (
        <div style={{ padding: '16px 20px', background: '#FFF1F2', border: '1.5px solid #FECDD3', borderRadius: 12, marginBottom: 20, display: 'flex', gap: 14, alignItems: 'center' }}>
          <span style={{ fontSize: 24 }}>🚨</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#9F1239' }}>{t.highAlert}</div>
            <div style={{ fontSize: 13, color: '#BE123C' }}>{t.highAlertBody} {Math.round(toxicity * 100)}% {t.highAlertBody2}</div>
          </div>
        </div>
      )}

      {/* ── KPI stat boxes ── */}
      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {statBoxes.map(s => (
          <div key={s.l} className="card" style={{ padding: '20px 18px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--slate)', letterSpacing: '.07em', marginBottom: 8 }}>{s.l}</div>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 26, color: s.c, marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: 'var(--slate)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tab navigation ── */}
      <div className="tab-row" style={{ marginBottom: 20 }}>
        {[['Risk Dashboard', 'risk'], ['Hospital Comparison', 'compare'], ['EMI Calculator', 'emi']].map(([label, key]) => (
          <button key={key} className={`tab ${activeTab === key ? 'on' : ''}`} onClick={() => setActiveTab(key)} style={{ flex: '1 1 auto', textAlign: 'center' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Risk Dashboard ── */}
      {activeTab === 'risk' && (
        <div className="two-col fade" style={{ gap: 24 }}>
          {/* Gauge + chart */}
          <div className="card card-p">
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              <RadialGauge score={score} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate)', letterSpacing: '.07em', marginBottom: 10 }}>REPAYMENT FORECAST</div>
                <RepaymentChart months={months} emi={emi} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 2 }}>Monthly EMI</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>{fmt(emi)}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 2 }}>Clear in</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--navy)' }}>
                      {months < 12 ? `${months}m` : `${(months / 12).toFixed(1)}y`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card card-p">
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: 'var(--navy)', marginBottom: 16 }}>Smart Recommendations</div>

            {isLow && (
              <div>
                <span className="badge badge-em" style={{ marginBottom: 14, fontSize: 12 }}>✓ Low Risk</span>
                {lowRecs.map(r => (
                  <div key={r.ti} style={{ padding: '14px 16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #A7F3D0', marginBottom: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#065F46', marginBottom: 4 }}>{r.ti}</div>
                    <div style={{ fontSize: 13, color: '#047857', lineHeight: 1.5 }}>{r.d}</div>
                  </div>
                ))}
              </div>
            )}

            {isMed && (
              <div>
                <span className="badge badge-am" style={{ marginBottom: 14, fontSize: 12 }}>⚡ Medium Risk</span>
                {medRecs.map(r => (
                  <div key={r.ti} style={{ padding: '14px 16px', background: '#FFFBEB', borderRadius: 10, border: '1px solid #FDE68A', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#92400E', marginBottom: 4 }}>{r.ti}</div>
                      <div style={{ fontSize: 12, color: '#B45309', lineHeight: 1.5 }}>{r.d}</div>
                    </div>
                    <button style={{ padding: '8px 14px', background: 'var(--amber)', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer' }}>
                      Check →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isHigh && (
              <div>
                <span className="badge badge-co" style={{ marginBottom: 14, fontSize: 12 }}>🚨 High Risk</span>
                <div style={{ padding: 18, background: '#FFF1F2', borderRadius: 12, border: '1px solid #FECDD3', marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#9F1239', marginBottom: 6 }}>🏥 Ayushman Bharat PM-JAY</div>
                  <div style={{ fontSize: 13, color: '#BE123C', lineHeight: 1.5, marginBottom: 12 }}>
                    Covers up to ₹5L/year for 10+ crore eligible families at empanelled hospitals.
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ flex: 1, padding: 10, background: 'var(--coral)', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Check PM-JAY Eligibility
                    </button>
                    <button style={{ flex: 1, padding: 10, background: 'white', color: 'var(--coral)', border: '1.5px solid var(--coral)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      CM Relief Fund
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Schemes at this hospital */}
            {h.schemes && h.schemes !== 'None' && (
              <div style={{ marginTop: 12, padding: '14px 16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #A7F3D0' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#065F46', marginBottom: 8 }}>✓ Schemes accepted at {h.name}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {h.schemes.split(';').map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} className="badge badge-em" style={{ fontSize: 10 }}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Hospital Comparison ── */}
      {activeTab === 'compare' && (
        <div className="card card-p fade">
          <div style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>Hospital Comparison</div>
          <div style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 20 }}>
            All hospitals for <strong>{treatment}</strong> in <strong>{h.city}</strong>
          </div>
          <HospCompare treatment={treatment} hospitals={cityHospitals} t={t} onSelect={null} />
        </div>
      )}

      {/* ── Tab: EMI Calculator ── */}
      {activeTab === 'emi' && (
        <div className="card card-p fade">
          <div style={{ fontFamily: 'DM Serif Display', fontSize: 22, color: 'var(--navy)', marginBottom: 4 }}>EMI Calculator</div>
          <div style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 20 }}>
            Calculate repayment for out-of-pocket amount of <strong>{fmtL(outOfPocket)}</strong>
          </div>
          <EMICalc outOfPocket={outOfPocket} t={t} />
        </div>
      )}

      {/* ── Disclaimer ── */}
      <div style={{ marginTop: 28, fontSize: 12, color: '#94A3B8', textAlign: 'center', lineHeight: 1.7, padding: '16px 24px', background: 'white', borderRadius: 12, border: '1px solid var(--border)' }}>
        ⚠️ <strong>Disclaimer:</strong> {t.disclaimer}
      </div>
    </div>
  );
}
