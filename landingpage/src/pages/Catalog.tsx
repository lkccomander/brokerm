import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import CatalogHeader from '../components/CatalogHeader';
import CatalogGrid from '../components/CatalogGrid';
import Footer from '../components/Footer';
import { usePublishedCatalog } from '../hooks/usePublishedCatalog';
import { isCatalogCategoryFilter, matchesBudget, matchesSearchLocation } from '../utils/catalogSearch';

export default function Catalog() {
  const location = useLocation();
  const { catalogProperties } = usePublishedCatalog();
  const [activeFilter, setActiveFilter] = useState<'todas' | 'alquiler' | 'venta' | 'bodegas'>('todas');
  const selectedLocation = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('ubicacion')?.trim() ?? '';
  }, [location.search]);
  const selectedBudget = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('presupuesto')?.trim() ?? '';
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const requestedType = params.get('tipo')?.trim() ?? 'todas';
    setActiveFilter(isCatalogCategoryFilter(requestedType) ? requestedType : 'todas');
  }, [location.search]);

  const counts = useMemo(
    () => ({
      todas: catalogProperties.length,
      alquiler: catalogProperties.filter((property) => property.category === 'alquiler').length,
      venta: catalogProperties.filter((property) => property.category === 'venta').length,
      bodegas: catalogProperties.filter((property) => property.category === 'bodegas').length,
    }),
    [catalogProperties]
  );

  const filteredProperties = useMemo(() => {
    const categoryFiltered = activeFilter === 'todas'
      ? catalogProperties
      : catalogProperties.filter((property) => property.category === activeFilter);

    return categoryFiltered.filter(
      (property) => matchesSearchLocation(property, selectedLocation) && matchesBudget(property, selectedBudget)
    );
  }, [activeFilter, catalogProperties, selectedBudget, selectedLocation]);

  return (
    <>
      <TopNavBar />
      <CatalogHeader activeFilter={activeFilter} counts={counts} onFilterChange={(filter) => setActiveFilter(filter as 'todas' | 'alquiler' | 'venta' | 'bodegas')} />
      <CatalogGrid properties={filteredProperties} />
      <Footer />
    </>
  );
}
