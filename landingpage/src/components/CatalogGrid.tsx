import PropertyCard from './PropertyCard';
import type { Property } from '../types';

export interface CatalogGridProps {
  readonly properties?: Property[];
  readonly hasActiveSearchFilters?: boolean;
  readonly className?: string;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({
  properties = [],
  hasActiveSearchFilters = false,
  className = '',
}) => {
  return (
    <section className={`py-12 bg-surface-container-lowest ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        {properties.length === 0 && (
          <div className="mt-12 rounded-3xl border border-surface-container bg-surface-container px-8 py-14 text-center">
            <p className="text-lg font-semibold text-on-surface">No hay propiedades en esta categoría por ahora.</p>
            <p className="mt-2 text-sm text-tertiary">
              {hasActiveSearchFilters
                ? 'Los filtros de ubicación o presupuesto pueden estar ocultando resultados.'
                : 'Cambia el filtro o vuelve a revisar más tarde.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CatalogGrid;
