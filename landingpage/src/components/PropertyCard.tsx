import { useMemo, useState } from 'react';
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
  const [showReelModal, setShowReelModal] = useState(false);
  const { isEnglish, localizePath } = useSiteLanguage();
  const localizedTitle = isEnglish ? property.translations?.en?.title ?? property.title : property.title;
  const localizedLocation = isEnglish ? property.translations?.en?.location ?? property.location : property.location;
  const localizedDetails = isEnglish ? property.translations?.en?.details ?? property.details : property.details;
  const localizedPriceLabel = isEnglish ? property.translations?.en?.priceLabel ?? property.priceLabel : property.priceLabel;
  const reelEmbedUrl = useMemo(() => {
    if (property.embedUrl) {
      return property.embedUrl;
    }

    if (!property.sourceUrl) {
      return '';
    }

    try {
      const parsed = new URL(property.sourceUrl);
      if (!parsed.hostname.includes('instagram.com')) {
        return '';
      }

      const parts = parsed.pathname.split('/').filter(Boolean);
      const mediaIndex = parts.findIndex((part) => ['reel', 'p'].includes(part));
      if (mediaIndex === -1 || parts.length <= mediaIndex + 1) {
        return '';
      }

      const mediaType = parts[mediaIndex];
      const mediaId = parts[mediaIndex + 1];
      return `https://www.instagram.com/${mediaType}/${mediaId}/embed/captioned/`;
    } catch {
      return '';
    }
  }, [property.embedUrl, property.sourceUrl]);
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
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={localizedTitle}
          src={property.image}
        />
        {reelEmbedUrl && (
          <button
            type="button"
            className="absolute inset-x-0 bottom-4 mx-auto inline-flex w-fit items-center gap-2 rounded-full bg-black/65 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-black/80"
            onClick={() => setShowReelModal(true)}
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
            {isEnglish ? 'Play reel' : 'Ver reel'}
          </button>
        )}
        {property.badge && (
          <div className="absolute top-14 left-4">
            <span className={`${badgeClasses[property.badge.variant]} text-[10px] font-bold px-3 py-1 rounded-full tracking-tighter uppercase`}>
              {isEnglish ? (property.translations?.en?.badgeText ?? badgeTextMap[property.badge.text] ?? property.badge.text) : property.badge.text}
            </span>
          </div>
        )}
      </div>
      {showReelModal && reelEmbedUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-surface-container shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-container px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-tertiary">
                  {isEnglish ? 'Instagram Reel' : 'Reel de Instagram'}
                </p>
                <h4 className="mt-1 text-lg font-bold text-on-surface">{localizedTitle}</h4>
              </div>
              <button
                type="button"
                className="rounded-full bg-surface-container-high px-3 py-2 text-xs font-bold uppercase tracking-wide text-on-surface transition hover:brightness-110"
                onClick={() => setShowReelModal(false)}
              >
                {isEnglish ? 'Close' : 'Cerrar'}
              </button>
            </div>
            <div className="aspect-[4/5] w-full bg-black">
              <iframe
                className="h-full w-full"
                src={reelEmbedUrl}
                title={`${localizedTitle} reel`}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowTransparency={true}
                frameBorder="0"
                scrolling="no"
              />
            </div>
            {(property.contactPhone || property.inquiryEnabled) && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-surface-container px-5 py-4">
                {property.contactPhone ? (
                  <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
                    <span className="material-symbols-outlined text-base">call</span>
                    {property.contactPhone}
                  </div>
                ) : (
                  <div />
                )}
                {property.inquiryEnabled && (
                  <Link
                    className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-on-primary shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:brightness-110"
                    to={`${localizePath('/', '/en')}?propiedad=${encodeURIComponent(property.id)}&origen=${encodeURIComponent(property.inquirySource ?? 'catalogo')}#contacto`}
                    onClick={() => setShowReelModal(false)}
                  >
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    {isEnglish ? 'I am interested' : 'Me interesa'}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="p-8">
        <h3 className="font-headline text-xl font-bold text-on-surface mb-2">{localizedTitle}</h3>
        <p className="text-tertiary text-sm mb-6 flex items-center gap-1">
          <span className="material-symbols-outlined text-base">location_on</span> {localizedLocation}
        </p>
        {localizedDetails && localizedDetails.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {localizedDetails.map((detail) => (
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
            {localizedPriceLabel ?? `$${property.price.toLocaleString()}`}
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
