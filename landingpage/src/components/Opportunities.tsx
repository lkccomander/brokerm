import PropertyCard from './PropertyCard';
import { useSiteLanguage } from '../hooks/useSiteLanguage';
import { usePublishedCatalog } from '../hooks/usePublishedCatalog';

export interface OpportunitiesProps {
  readonly className?: string;
}

export const Opportunities: React.FC<OpportunitiesProps> = ({ className = '' }) => {
  const { isEnglish, localizePath } = useSiteLanguage();
  const { featuredProperties } = usePublishedCatalog();
  return (
    <section id="oportunidades" className={`py-24 bg-surface-container-low ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-4">{isEnglish ? 'Investment Opportunities' : 'Oportunidades de Inversion'}</h2>
          <div className="w-24 h-1 cta-gradient mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="mt-20 text-center">
          <a href={localizePath('/catalogo', '/en/catalog')} className="group inline-flex items-center gap-3 text-secondary font-bold text-sm tracking-widest uppercase hover:gap-5 transition-all">
            {isEnglish ? 'VIEW ALL ACTIVE LISTINGS' : 'VER TODOS LOS LISTADOS URBANOS'}
            <span className="material-symbols-outlined">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Opportunities;
