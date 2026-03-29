
export interface CatalogHeaderProps {
  readonly onFilterChange?: (filter: string) => void;
  readonly className?: string;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({ 
  onFilterChange,
  className = '' 
}) => {
  return (
    <section className={`pt-32 pb-16 bg-surface dark:bg-slate-900 border-b border-surface-container ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-6 font-headline">Catálogo Privado de Propiedades</h1>
            <p className="text-tertiary font-body text-lg md:text-xl leading-relaxed">Explora nuestra colección curada de propiedades de alto estándar en Escazú, Santa Ana y las zonas más exclusivas de la capital.</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-surface-container hover:border-primary text-on-surface font-semibold font-body bg-surface-container-lowest transition-all shadow-sm cursor-pointer"
              onClick={() => onFilterChange?.('filter')}
            >
              <span className="material-symbols-outlined text-xl">tune</span>
              Filtros (2)
            </button>
            <button 
              className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold font-body hover:bg-primary-container transition-colors shadow-md cursor-pointer"
            >
              Contactar Asesor
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-12 cursor-default">
          <div className="px-5 py-2.5 rounded-full bg-surface-container text-on-surface font-semibold text-sm border border-surface-container cursor-pointer">Todas</div>
          <div className="px-5 py-2.5 rounded-full bg-surface-container-lowest text-tertiary font-medium text-sm border border-surface-container hover:bg-surface-container transition-colors cursor-pointer">Casas & Villas</div>
          <div className="px-5 py-2.5 rounded-full bg-surface-container-lowest text-tertiary font-medium text-sm border border-surface-container hover:bg-surface-container transition-colors cursor-pointer">Apartamentos & Penthouses</div>
          <div className="px-5 py-2.5 rounded-full bg-surface-container-lowest text-tertiary font-medium text-sm border border-surface-container hover:bg-surface-container transition-colors cursor-pointer">Lotes & Terrenos</div>
          <div className="px-5 py-2.5 rounded-full bg-surface-container-lowest text-tertiary font-medium text-sm border border-surface-container hover:bg-surface-container transition-colors cursor-pointer">Comercial</div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHeader;
