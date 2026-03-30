import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import SiteMap from './pages/SiteMap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/mapa-del-sitio" element={<SiteMap />} />
        <Route path="/en" element={<Landing />} />
        <Route path="/en/catalog" element={<Catalog />} />
        <Route path="/en/site-map" element={<SiteMap />} />
      </Routes>
    </Router>
  );
}

export default App;
