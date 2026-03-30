import type { Property } from '../types';
import { Link } from 'react-router-dom';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface PropertyCardProps {
  readonly property: Property;
  readonly className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  className = '' 
}) => {
  const { isEnglish, localizePath } = useSiteLanguage();
  const badgeClasses = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    tertiary: 'bg-tertiary text-white',
  } as const;
  const badgeTextMap: Record<string, string> = {
    'SE RENTA': 'FOR RENT',
    'SE ALQUILA': 'FOR RENT',
    'SE VENDE': 'FOR SALE',
    'SE ALQUILAN': 'FOR LEASE',
  };

  return (
    <div className={`group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 ${className}`}>
      <div className="relative h-72 overflow-hidden">
        {property.embedUrl ? (
          <iframe
            className="h-full w-full bg-surface-container"
            src={property.embedUrl}
            title={property.title}
            loading="lazy"
            allowTransparency={true}
            frameBorder="0"
            scrolling="no"
          />
        ) : (
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            alt={property.title}
            src={property.image}
          />
        )}
        {property.badge && (
          <div className="absolute top-14 left-4">
            <span className={`${badgeClasses[property.badge.variant]} text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter uppercase`}>
              {isEnglish ? (badgeTextMap[property.badge.text] ?? property.badge.text) : property.badge.text}
            </span>
          </div>
        )}
      </div>
      <div className="p-8">
        <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{property.title}</h3>
        <p className="text-tertiary text-sm mb-6 flex items-center gap-1">
          <span className="material-symbols-outlined text-base">location_on</span> {property.location}
        </p>
        {property.details && property.details.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {property.details.map((detail) => (
              <span
                key={detail}
                className="rounded-full bg-surface-container px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-tertiary"
              >
                {detail}
              </span>
            ))}
          </div>
        )}
        <div className="flex justify-between items-center py-4 border-t border-surface-container">
          <div className="text-2xl font-extrabold text-primary">
            {property.priceLabel ?? `$${property.price.toLocaleString()}`}
          </div>
          {(property.beds > 0 || property.baths > 0) && (
            <div className="flex gap-4 text-tertiary">
              {property.beds > 0 && (
                <div className="flex items-center gap-1 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm">bed</span> {property.beds}
                </div>
              )}
              {property.baths > 0 && (
                <div className="flex items-center gap-1 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm">shower</span> {property.baths}
                </div>
              )}
            </div>
          )}
        </div>
        {(property.contactPhone || property.inquiryEnabled) && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {property.contactPhone && (
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                <span className="material-symbols-outlined text-base">call</span>
                {property.contactPhone}
              </div>
            )}
            {property.inquiryEnabled && (
              <Link
                className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:brightness-110"
                to={`${localizePath('/', '/en')}?propiedad=${encodeURIComponent(property.id)}&origen=${encodeURIComponent(property.inquirySource ?? 'catalogo')}#contacto`}
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                {isEnglish ? 'I am interested' : 'Me interesa'}
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
