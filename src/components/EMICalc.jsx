import React, { useState, useMemo } from 'react';
import { fmt, calcEMI } from '../utils/formatters';
import { LOAN_PRODUCTS } from '../data/constants';

/**
 * Standalone EMI calculator with loan-product comparison.
 * Props:
 *  - outOfPocket {number}  pre-fills the loan amount
 *  - t           {object}  translations
 */
export default function EMICalc({ outOfPocket, t }) {
  const [amt,    setAmt]    = useState(outOfPocket || 500000);
  const [rate,   setRate]   = useState(13);
  const [tenure, setTenure] = useState(36);

  const emi      = useMemo(() => calcEMI(amt, rate, tenure),    [amt, rate, tenure]);
  const total    = emi * tenure;
  const interest = total - amt;

  return (
    <div>
      {/* ── Inputs ── */}
      <div className="three-col" style={{ marginBottom: 24 }}>
        <div>
          <label className="lbl">{t.loanAmt}</label>
          <input className="inp" type="number" value={amt} onChange={e => setAmt(+e.target.value)} min="10000" />
        </div>
        <div>
          <label className="lbl">{t.interestRate} (%)</label>
          <input className="inp" type="number" value={rate} onChange={e => setRate(+e.target.value)} min="8" max="30" step="0.5" />
        </div>
        <div>
          <label className="lbl">{t.tenure} (months)</label>
          <input className="inp" type="number" value={tenure} onChange={e => setTenure(+e.target.value)} min="3" max="120" />
        </div>
      </div>

      {/* ── Summary boxes ── */}
      <div className="three-col" style={{ marginBottom: 24 }}>
        {[
          { l: t.monthlyEmiLbl, v: fmt(emi),      c: 'var(--navy)' },
          { l: t.totalInterest, v: fmt(interest),  c: 'var(--coral)' },
          { l: t.totalPayable,  v: fmt(total),     c: 'var(--emerald)' },
        ].map(s => (
          <div key={s.l} style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 6, fontWeight: 600 }}>{s.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* ── Loan products ── */}
      <div>
        <div style={{ fontFamily: 'DM Serif Display', fontSize: 18, color: 'var(--navy)', marginBottom: 14 }}>{t.loanProducts}</div>
        {LOAN_PRODUCTS.map(lp => {
          const ok   = amt >= lp.minAmt && amt <= lp.maxAmt;
          const lEmi = ok ? calcEMI(amt, lp.rate, tenure) : 0;
          return (
            <div key={lp.name} className="loan-row" style={{ marginBottom: 10, opacity: ok ? 1 : 0.5 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--navy)', marginBottom: 4 }}>{lp.name}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span className="badge badge-bl" style={{ fontSize: 10 }}>{lp.badge}</span>
                  <span style={{ fontSize: 12, color: 'var(--slate)' }}>{lp.rate}% p.a. · up to {tenure}mo</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: ok ? 'var(--emerald)' : 'var(--slate)', marginBottom: 6 }}>
                  {ok ? fmt(lEmi) + '/mo' : '—'}
                </div>
                <button
                  style={{ padding: '7px 16px', background: ok ? 'var(--navy)' : '#CBD5E1', color: 'white', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: ok ? 'pointer' : 'default' }}
                >
                  {ok ? t.applyNow : t.notEligible}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
