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

  const searchFilteredProperties = useMemo(
    () =>
      catalogProperties.filter(
        (property) => matchesSearchLocation(property, selectedLocation) && matchesBudget(property, selectedBudget)
      ),
    [catalogProperties, selectedBudget, selectedLocation]
  );

  const counts = useMemo(
    () => ({
      todas: searchFilteredProperties.length,
      alquiler: searchFilteredProperties.filter((property) => property.category === 'alquiler').length,
      venta: searchFilteredProperties.filter((property) => property.category === 'venta').length,
      bodegas: searchFilteredProperties.filter((property) => property.category === 'bodegas').length,
    }),
    [searchFilteredProperties]
  );

  const filteredProperties = useMemo(() => {
    const categoryFiltered = activeFilter === 'todas'
      ? searchFilteredProperties
      : searchFilteredProperties.filter((property) => property.category === activeFilter);

    return categoryFiltered;
  }, [activeFilter, searchFilteredProperties]);

  const hasSearchFilters = Boolean(
    (selectedLocation && selectedLocation !== 'todas') || (selectedBudget && selectedBudget !== 'todas')
  );

  return (
    <>
      <TopNavBar />
      <CatalogHeader activeFilter={activeFilter} counts={counts} onFilterChange={(filter) => setActiveFilter(filter as 'todas' | 'alquiler' | 'venta' | 'bodegas')} />
      <CatalogGrid properties={filteredProperties} hasActiveSearchFilters={hasSearchFilters} />
      <Footer />
    </>
  );
}
