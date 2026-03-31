import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import HospCompare from '../components/HospCompare';
import { DB } from '../data/hospitals';

/**
 * Results list page – shows all hospitals for a treatment (optionally in a city).
 * Route: /results?treatment=...&city=...
 * Props:  t {object}  translations
 */
export default function ResultsList({ t }) {
  const [params]  = useSearchParams();
  const navigate  = useNavigate();
  const treatment = params.get('treatment') || '';
  const city      = params.get('city') || '';

  const hospitals = city ? DB.filter(h => h.city === city) : DB;
  const count     = hospitals.filter(h => h.costs[treatment] > 0).length;

  const handleSelect = (hospital) => {
    // Navigate to hospital detail, carrying treatment in URL
    navigate(`/hospital/${hospital.id}?treatment=${encodeURIComponent(treatment)}`);
  };

  return (
    <div className="page fade">
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--slate)', letterSpacing: '.08em', marginBottom: 6 }}>HOSPITAL RESULTS</div>
        <h2 className="sec-title" style={{ marginBottom: 4 }}>
          Hospitals for <em style={{ color: 'var(--emerald)' }}>{treatment}</em>
          {city && <span style={{ fontSize: 18, color: 'var(--slate)', fontFamily: 'DM Sans' }}> in {city}</span>}
        </h2>
        <div className="sec-sub">{count} hospitals found with real cost data</div>
      </div>

      <div className="card card-p">
        <HospCompare
          treatment={treatment}
          hospitals={hospitals}
          t={t}
          onSelect={handleSelect}
        />
      </div>
    </div>
  );
}
