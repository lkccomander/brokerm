export interface CatalogHeaderProps {
  readonly onFilterChange?: (filter: string) => void;
  readonly activeFilter?: 'todas' | 'alquiler' | 'venta' | 'bodegas';
  readonly counts?: {
    readonly todas: number;
    readonly alquiler: number;
    readonly venta: number;
    readonly bodegas: number;
  };
  readonly className?: string;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({ 
  onFilterChange,
  activeFilter = 'todas',
  counts,
  className = '' 
}) => {
  const isEnglish = typeof window !== 'undefined' && window.location.pathname.startsWith('/en');
  const filterOptions: Array<{ key: 'todas' | 'alquiler' | 'venta' | 'bodegas'; label: string }> = [
    { key: 'todas', label: isEnglish ? 'All' : 'Todas' },
    { key: 'alquiler', label: isEnglish ? 'Rent' : 'Alquiler' },
    { key: 'venta', label: isEnglish ? 'Sale' : 'Venta' },
    { key: 'bodegas', label: isEnglish ? 'Warehouses' : 'Bodegas' },
  ];

  return (
    <section className={`pt-32 pb-16 bg-surface dark:bg-slate-900 border-b border-surface-container ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-6 font-headline">{isEnglish ? 'Private Property Catalog' : 'Catálogo Privado de Propiedades'}</h1>
            <p className="text-tertiary font-body text-lg md:text-xl leading-relaxed">{isEnglish ? 'Explore active rentals, sales and commercial opportunities with a cleaner, conversion-ready presentation.' : 'Explora alquileres, ventas y oportunidades comerciales activas con un formato claro y directo para convertir más rápido.'}</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-container hover:border-primary text-on-surface font-semibold font-body bg-surface-container-lowest transition-all shadow-sm cursor-pointer"
              onClick={() => onFilterChange?.(activeFilter)}
            >
              <span className="material-symbols-outlined text-xl">tune</span>
              {counts ? `${isEnglish ? 'Filters' : 'Filtros'} (${counts[activeFilter]})` : isEnglish ? 'Filters' : 'Filtros'}
            </button>
            <button 
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold font-body hover:bg-primary-container transition-colors shadow-md cursor-pointer"
            >
              {isEnglish ? 'Contact Advisor' : 'Contactar Asesor'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-12 cursor-default">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => onFilterChange?.(option.key)}
                className={`px-5 py-2.5 rounded-full text-sm border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-surface-container text-on-surface font-semibold border-surface-container'
                    : 'bg-surface-container-lowest text-tertiary font-medium border-surface-container hover:bg-surface-container'
                }`}
              >
                {option.label}{counts ? ` (${counts[option.key]})` : ''}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CatalogHeader;
