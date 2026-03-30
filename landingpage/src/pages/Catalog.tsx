import { useMemo, useState } from 'react';
import TopNavBar from '../components/TopNavBar';
import CatalogHeader from '../components/CatalogHeader';
import CatalogGrid from '../components/CatalogGrid';
import Footer from '../components/Footer';
import { catalogProperties } from '../data/mockData';

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState<'todas' | 'alquiler' | 'venta' | 'bodegas'>('todas');

  const counts = useMemo(
    () => ({
      todas: catalogProperties.length,
      alquiler: catalogProperties.filter((property) => property.category === 'alquiler').length,
      venta: catalogProperties.filter((property) => property.category === 'venta').length,
      bodegas: catalogProperties.filter((property) => property.category === 'bodegas').length,
    }),
    []
  );

  const filteredProperties = useMemo(() => {
    if (activeFilter === 'todas') {
      return catalogProperties;
    }

    return catalogProperties.filter((property) => property.category === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <TopNavBar />
      <CatalogHeader activeFilter={activeFilter} counts={counts} onFilterChange={(filter) => setActiveFilter(filter as 'todas' | 'alquiler' | 'venta' | 'bodegas')} />
      <CatalogGrid properties={filteredProperties} />
      <Footer />
    </>
  );
}
