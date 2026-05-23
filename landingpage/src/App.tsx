import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import SiteMap from './pages/SiteMap';
import LegalNotice from './pages/LegalNotice';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import { trackPageView } from './utils/analytics';

function AnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}${location.hash}`);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

function App() {
  return (
    <Router>
      <AnalyticsRouteTracker />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/mapa-del-sitio" element={<SiteMap />} />
        <Route path="/aviso-legal" element={<LegalNotice />} />
        <Route path="/privacidad" element={<PrivacyPolicy />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
        <Route path="/en" element={<Landing />} />
        <Route path="/en/catalog" element={<Catalog />} />
        <Route path="/en/site-map" element={<SiteMap />} />
        <Route path="/en/legal-notice" element={<LegalNotice />} />
        <Route path="/en/privacy" element={<PrivacyPolicy />} />
        <Route path="/en/cookies" element={<CookiesPolicy />} />
      </Routes>
    </Router>
  );
}

export default App;
