import { useEffect, useMemo, useRef, useState } from 'react';
import { heroContent } from '../data/mockData';
import { usePublishedCatalog } from '../hooks/usePublishedCatalog';
import { useSiteLanguage } from '../hooks/useSiteLanguage';
import { buildBudgetOptions, buildLocationOptions } from '../utils/catalogSearch';

export interface HeroProps {
  readonly className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  const { isEnglish, localizePath } = useSiteLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;
      if (motionPreference.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {
          // Keep the poster visible when the browser blocks autoplay.
        });
      }
    };

    syncPlayback();
    motionPreference.addEventListener('change', syncPlayback);
    return () => motionPreference.removeEventListener('change', syncPlayback);
  }, []);

  const { catalogProperties } = usePublishedCatalog();
  const [selectedCategory, setSelectedCategory] = useState<'alquiler' | 'venta' | 'bodegas'>('alquiler');
  const locationOptions = useMemo(
    () => buildLocationOptions(catalogProperties, selectedCategory, isEnglish),
    [catalogProperties, isEnglish, selectedCategory]
  );
  const budgetOptions = useMemo(
    () => buildBudgetOptions(catalogProperties, selectedCategory, isEnglish),
    [catalogProperties, isEnglish, selectedCategory]
  );
  const [selectedLocation, setSelectedLocation] = useState('todas');
  const [selectedBudget, setSelectedBudget] = useState('todas');

  useEffect(() => {
    if (locationOptions.some((option) => option.value === selectedLocation)) {
      return;
    }

    setSelectedLocation('todas');
  }, [locationOptions, selectedLocation]);

  useEffect(() => {
    if (budgetOptions.some((option) => option.value === selectedBudget)) {
      return;
    }

    setSelectedBudget('todas');
  }, [budgetOptions, selectedBudget]);

  const catalogSearchHref = useMemo(() => {
    const path = localizePath('/catalogo', '/en/catalog');
    const params = new URLSearchParams();
    params.set('tipo', selectedCategory);
    if (selectedLocation !== 'todas') {
      params.set('ubicacion', selectedLocation);
    }
    if (selectedBudget !== 'todas') {
      params.set('presupuesto', selectedBudget);
    }
    return `${path}?${params.toString()}`;
  }, [localizePath, selectedBudget, selectedCategory, selectedLocation]);

  return (
    <header className={`relative min-h-screen flex items-center pt-20 overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
          src={heroContent.image}
        />
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster={heroContent.image}
          onPlay={() => setIsVideoPlaying(true)}
          onPause={() => setIsVideoPlaying(false)}
          onEnded={() => setIsVideoPlaying(false)}
          onError={(event) => { event.currentTarget.hidden = true; }}
        >
          <source src="/videos/escazu-santa-ana-dusk.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 via-on-background/40 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="max-w-5xl">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-8 whitespace-pre-line">
            {isEnglish ? 'Navigate Urban\nReal Estate with\n' : heroContent.title[0].text}
            <span className="text-primary-fixed">{isEnglish ? 'Data & Style' : heroContent.title[1].text}</span>
          </h1>
          <div className="bg-surface-container-lowest/10 glass-effect p-2 rounded-2xl border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.45fr_1.45fr_1.1fr] gap-2">
              <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group">
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">{isEnglish ? 'Property type' : 'Tipo de propiedad'}</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-transparent text-white font-medium outline-none cursor-pointer pr-8"
                    value={selectedCategory}
                    onChange={(event) => setSelectedCategory(event.target.value as 'alquiler' | 'venta' | 'bodegas')}
                    aria-label={isEnglish ? 'Property type' : 'Tipo de propiedad'}
                  >
                    <option value="alquiler" className="text-slate-900">{isEnglish ? 'Rent' : 'Alquiler'}</option>
                    <option value="venta" className="text-slate-900">{isEnglish ? 'Sale' : 'Venta'}</option>
                    <option value="bodegas" className="text-slate-900">{isEnglish ? 'Warehouses' : 'Bodegas'}</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white text-sm">expand_more</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group">
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">{isEnglish ? 'Location' : 'Ubicación'}</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-transparent text-white font-medium outline-none cursor-pointer pr-8"
                    value={selectedLocation}
                    onChange={(event) => setSelectedLocation(event.target.value)}
                    aria-label={isEnglish ? 'Location' : 'Ubicación'}
                  >
                    {locationOptions.length ? locationOptions.map((option) => (
                      <option key={option.value} value={option.value} className="text-slate-900">
                        {option.label}
                      </option>
                    )) : (
                      <option value="todas" className="text-slate-900">
                        {isEnglish ? 'All locations' : 'Todas las ubicaciones'}
                      </option>
                    )}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white text-sm">expand_more</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group">
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">{isEnglish ? 'Budget' : 'Presupuesto'}</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-transparent text-white font-medium outline-none cursor-pointer pr-8"
                    value={selectedBudget}
                    onChange={(event) => setSelectedBudget(event.target.value)}
                    aria-label={isEnglish ? 'Budget' : 'Presupuesto'}
                  >
                    {budgetOptions.map((option) => (
                      <option key={option.value} value={option.value} className="text-slate-900">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white text-sm">payments</span>
                </div>
              </div>
              <a href={catalogSearchHref} className="cta-gradient text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                <span className="material-symbols-outlined">search</span>
                {isEnglish ? 'Explore Now' : 'Explorar Ahora'}
              </a>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-sm hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        onClick={() => {
          const video = videoRef.current;
          if (!video) return;
          if (video.paused) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        }}
      >
        <span className="material-symbols-outlined" aria-hidden="true">{isVideoPlaying ? 'pause' : 'play_arrow'}</span>
        {isVideoPlaying ? (isEnglish ? 'Pause video' : 'Pausar video') : (isEnglish ? 'Play video' : 'Reproducir video')}
      </button>
    </header>
  );
};

export default Hero;
