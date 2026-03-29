import PropertyCard from './PropertyCard';
import { catalogProperties } from '../data/mockData';

export interface CatalogGridProps {
  readonly className?: string;
}

export const CatalogGrid: React.FC<CatalogGridProps> = ({ className = '' }) => {
  return (
    <section className={`py-12 bg-surface-container-lowest ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        {/* Pagination */ }
        <div className="flex justify-center items-center gap-2 mt-16 cursor-default">
          <button className="w-10 h-10 rounded-full border border-surface-container flex items-center justify-center text-tertiary hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold font-body shadow-sm">1</button>
          <button className="w-10 h-10 rounded-full border border-surface-container text-tertiary hover:bg-surface-container transition-colors font-medium font-body">2</button>
          <button className="w-10 h-10 rounded-full border border-surface-container text-tertiary hover:bg-surface-container transition-colors font-medium font-body">3</button>
          <button className="w-10 h-10 rounded-full border border-surface-container flex items-center justify-center text-tertiary hover:bg-surface-container transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CatalogGrid;
