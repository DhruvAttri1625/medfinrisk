import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Sticky top navbar.
 * Props:
 *  - lang        {string}   current language code ('en' | 'hi')
 *  - setLang     {function} language toggle handler
 *  - t           {object}   translations for current lang
 *  - showBack    {boolean}  whether to render a "New Search" button
 */
export default function Navbar({ lang, setLang, t, showBack }) {
  const navigate = useNavigate();

  return (
    <nav className="topnav">
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(255,255,255,.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div>
          <div className="topnav-brand">{t.brand}</div>
          <div className="topnav-sub">{t.tagline}</div>
        </div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center' }}>
        {[['en', 'EN'], ['hi', 'हि']].map(([code, label]) => (
          <button
            key={code}
            className={`lang-pill ${lang === code ? 'active' : ''}`}
            onClick={() => setLang(code)}
          >
            {label}
          </button>
        ))}

        {showBack && (
          <button
            onClick={() => navigate('/')}
            style={{
              marginLeft: 12, padding: '6px 16px',
              background: 'rgba(255,255,255,.1)', color: 'white',
              border: '1px solid rgba(255,255,255,.2)', borderRadius: 8, fontSize: 13,
            }}
          >
            ← {t.newSearch}
          </button>
        )}
      </div>
    </nav>
  );
}
