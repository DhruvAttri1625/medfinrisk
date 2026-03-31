import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { DB, TREATMENTS } from '../data/hospitals';
import { INSURERS } from '../data/constants';
import { fmtL, calcRiskScore } from '../utils/formatters';
import { useEffect } from 'react';

const EMPTY_FORM = {
  income: '', emi: '', expenses: '', dependents: '0',
  insurer: '', coverage: '', copay: false, pmjay: false,
};

/**
 * 3-step financial diagnosis form.
 * Route: /hospital/:id/diagnose?treatment=...
 * Props:  t {object}  translations
 */
const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate('/login');
  }
}, []);

export default function DiagnosisForm({ t }) {
  const { id }     = useParams();
  const [params]   = useSearchParams();
  const navigate   = useNavigate();

  const h = DB.find(hosp => hosp.id === id);
  
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState(EMPTY_FORM);
  const [selectedTreatment, setSelectedTreatment] = useState(params.get('treatment') || '');

  const fld = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const treatmentCost = useMemo(() => {
    if (!selectedTreatment) return 0;
    return h.costs[selectedTreatment] || 0;
  }, [h, selectedTreatment]);
  if (!h) return <div className="page"><p>Hospital not found.</p></div>;


  const totalCost = Math.round(treatmentCost * 1.15);

  const handleCalc = async () => {
    const inc       = parseFloat(form.income) || 0;
    const existEMI  = parseFloat(form.emi)    || 0;
    const exp       = parseFloat(form.expenses)|| 0;
    const cov       = parseFloat(form.coverage)|| 0;
    const dep       = parseInt(form.dependents)|| 0;
    const outOfPocket = Math.max(0, totalCost - (form.copay ? cov * 0.8 : cov));

    const { score, disposable, months, toxicity } = calcRiskScore({
      outOfPocket,
      monthlyIncome: inc,
      existingEMI:   existEMI,
      expenses:      exp,
      dependents:    dep,
      pmjay:         form.pmjay,
    });

    const emi = Math.round(outOfPocket / Math.max(months, 1));
    await fetch('https://medfinrisk-backend.onrender.com/api/search/save', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mode: 'treatment',
    treatment: selectedTreatment,
    city: h.city,
    hospitalId: h.id,

    income: inc,
    emi: existEMI,
    expenses: exp,
    dependents: dep,

    insurer: form.insurer,
    coverage: cov,
    copay: form.copay,
    pmjay: form.pmjay,

    totalCost,
    outOfPocket,
    riskScore: score
  })
});
    // Pass result via URL state to Dashboard
    navigate('/dashboard', {
      state: {
        hospital:   h,
        treatment:  selectedTreatment,
        treatmentCost,
        totalCost,
        outOfPocket,
        disposable,
        months,
        score,
        toxicity,
        emi,
        annualInc:  inc * 12,
      },
    });
  };

  const steps = [t.step1, t.step2, t.step3];

  return (
    <div className="page fade">
      <div style={{ maxWidth: 860, margin: '0 auto' }}>

        {/* ── Step indicator ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600, flexShrink: 0,
                  background: step > i + 1 ? 'var(--emerald)' : step === i + 1 ? 'var(--navy)' : '#E2E8F0',
                  color: step >= i + 1 ? 'white' : 'var(--slate)',
                }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: 13, fontWeight: 500, color: step === i + 1 ? 'var(--navy)' : 'var(--slate)' }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: step > i + 1 ? 'var(--emerald)' : '#E2E8F0', borderRadius: 1 }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="two-col">
          {/* ── Form card ── */}
          <div>
            {/* Step 1 – Basics */}
            {step === 1 && (
              <div className="card card-p fade">
                <div style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: 'var(--navy)', marginBottom: 20 }}>{t.step1}</div>

                {/* Treatment selector (if not preselected) */}
                {!params.get('treatment') && (
                  <div style={{ marginBottom: 18 }}>
                    <label className="lbl">TREATMENT</label>
                    <select className="inp" value={selectedTreatment} onChange={e => setSelectedTreatment(e.target.value)}>
                      <option value="">Select a treatment…</option>
                      {TREATMENTS.filter(tr => h.costs[tr] > 0).map(tr => (
                        <option key={tr}>{tr}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label className="lbl">{t.income}</label>
                    <input className="inp" type="number" placeholder="e.g. 75000" value={form.income} onChange={e => fld('income', e.target.value)} />
                  </div>
                  <div>
                    <label className="lbl">{t.emi}</label>
                    <input className="inp" type="number" placeholder="e.g. 15000" value={form.emi} onChange={e => fld('emi', e.target.value)} />
                  </div>
                  <div>
                    <label className="lbl">{t.expenses}</label>
                    <input className="inp" type="number" placeholder="e.g. 25000" value={form.expenses} onChange={e => fld('expenses', e.target.value)} />
                  </div>
                  <div>
                    <label className="lbl">{t.dependents}</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['0', '1', '2', '3', '4', '5+'].map((v, i) => (
                        <button
                          key={v}
                          onClick={() => fld('dependents', String(i))}
                          style={{
                            flex: 1, padding: 10, cursor: 'pointer',
                            border: `1.5px solid ${form.dependents === String(i) ? 'var(--navy)' : 'var(--border)'}`,
                            borderRadius: 9,
                            background: form.dependents === String(i) ? 'var(--navy)' : 'white',
                            color: form.dependents === String(i) ? 'white' : 'var(--slate)',
                            fontSize: 13, fontWeight: 500,
                          }}
                        >{v}</button>
                      ))}
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    disabled={!form.income || !selectedTreatment}
                    style={{ opacity: form.income && selectedTreatment ? 1 : 0.5 }}
                    onClick={() => setStep(2)}
                  >{t.continueBtn}</button>
                </div>
              </div>
            )}

            {/* Step 2 – Insurance */}
            {step === 2 && (
              <div className="card card-p fade">
                <div style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: 'var(--navy)', marginBottom: 20 }}>{t.step2}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div>
                    <label className="lbl">{t.insurer}</label>
                    <select className="inp" value={form.insurer} onChange={e => fld('insurer', e.target.value)}>
                      <option value="">No Insurance</option>
                      {INSURERS.map(ins => <option key={ins}>{ins}</option>)}
                    </select>
                  </div>

                  {form.insurer && (
                    <div className="fade">
                      <label className="lbl">{t.coverage}</label>
                      <input className="inp" type="number" placeholder="e.g. 500000" value={form.coverage} onChange={e => fld('coverage', e.target.value)} />
                    </div>
                  )}

                  {/* Toggles */}
                  {[
                    { key: 'copay', title: t.copayTitle, desc: t.copayDesc, activeCol: 'var(--navy)' },
                    { key: 'pmjay', title: t.pmjayTitle, desc: t.pmjayDesc, activeCol: 'var(--emerald)' },
                  ].map(tog => (
                    <div key={tog.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--navy)' }}>{tog.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>{tog.desc}</div>
                      </div>
                      <div
                        className="tog"
                        style={{ background: form[tog.key] ? tog.activeCol : '#CBD5E1' }}
                        onClick={() => fld(tog.key, !form[tog.key])}
                      >
                        <div className="tog-knob" style={{ left: form[tog.key] ? '22px' : '2px' }} />
                      </div>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>{t.backBtn}</button>
                    <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 2 }}>{t.continueBtn}</button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 – Buffer check */}
            {step === 3 && (
              <div className="card card-p fade">
                <div style={{ fontFamily: 'DM Serif Display', fontSize: 20, color: 'var(--navy)', marginBottom: 20 }}>{t.step3}</div>
                <div style={{ background: '#F8FAFC', borderRadius: 12, padding: 20, marginBottom: 20, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 13, color: 'var(--slate)' }}>{t.selTreat}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--navy)' }}>{selectedTreatment}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: 'var(--slate)' }}>{t.baseCostLbl}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--navy)' }}>{fmtL(treatmentCost)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <span style={{ fontSize: 13, color: 'var(--slate)' }}>{t.bufferLbl}</span>
                      <div style={{ fontSize: 10, color: '#94A3B8' }}>{t.bufferNote}</div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--amber)' }}>+{fmtL(totalCost - treatmentCost)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1.5px solid var(--border)' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--navy)' }}>{t.totalLbl}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--navy)' }}>{fmtL(totalCost)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn-ghost" onClick={() => setStep(2)} style={{ flex: 1 }}>{t.backBtn}</button>
                  <button className="btn-em" onClick={handleCalc} style={{ flex: 2 }}>{t.calcBtn}</button>
                </div>
              </div>
            )}
          </div>

          {/* ── Summary sidebar ── */}
          <div className="card card-p" style={{ height: 'fit-content' }}>
            <div style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--navy)', marginBottom: 16 }}>Summary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '14px 16px', background: '#EFF6FF', borderRadius: 10, border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 11, color: '#1D4ED8', fontWeight: 600, marginBottom: 4 }}>HOSPITAL</div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{h.name}</div>
                <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>{h.city} · ★{h.rating} · {h.beds} beds</div>
                <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>{h.acc.split(';')[0].trim()}</div>
              </div>
              {selectedTreatment && (
                <div style={{ padding: '14px 16px', background: '#F0FDF4', borderRadius: 10, border: '1px solid #A7F3D0' }}>
                  <div style={{ fontSize: 11, color: '#065F46', fontWeight: 600, marginBottom: 4 }}>TREATMENT COST</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--emerald)' }}>{fmtL(treatmentCost)}</div>
                  <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>{fmtL(totalCost)} with 15% buffer</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
