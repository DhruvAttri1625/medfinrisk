import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage       from './pages/HomePage';
import SearchPage     from './pages/SearchPage';
import ResultsList    from './pages/ResultsList';
import HospitalDetail from './pages/HospitalDetail';
import DiagnosisForm  from './pages/DiagnosisForm';
import Login from './pages/Login';
import Signup from './pages/signup';
import Dashboard      from './pages/Dashboard';
import { TRANSLATIONS } from './data/constants';


// ── Scroll to top on every navigation ────────────────────────
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// ── Inner app wrapper (needs router context for useLocation) ─
function AppInner() {
  const location  = useLocation();
  const isHome    = location.pathname === '/';

  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <>
      <ScrollToTop />
      <Navbar lang={lang} setLang={setLang} t={t} showBack={!isHome} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/"                          element={<HomePage       t={t} />} />
        <Route path="/search/:mode"              element={<SearchPage     t={t} />} />
        <Route path="/results"                   element={<ResultsList    t={t} />} />
        <Route path="/hospital/:id"              element={<HospitalDetail t={t} />} />
        <Route path="/hospital/:id/diagnose"     element={<DiagnosisForm  t={t} />} />
        <Route path="/dashboard"                 element={<Dashboard      t={t} />} />
        {/* Fallback */}
        <Route path="*" element={<div className="page"><h2>Page not found.</h2></div>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
