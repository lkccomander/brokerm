import { heroContent } from '../data/mockData';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface HeroProps {
  readonly className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  const { isEnglish, localizePath } = useSiteLanguage();
  return (
    <header className={`relative min-h-screen flex items-center pt-20 overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="ultra-modern luxury villa"
          src={heroContent.image}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 via-on-background/40 to-transparent"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-8 whitespace-pre-line">
            {isEnglish ? 'Navigate Urban\nReal Estate with\n' : heroContent.title[0].text}
            <span className="text-primary-fixed">{isEnglish ? 'Data & Style' : heroContent.title[1].text}</span>
          </h1>
          <div className="bg-surface-container-lowest/10 glass-effect p-2 rounded-2xl border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors group">
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">{isEnglish ? 'Property type' : 'Tipo de propiedad'}</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none bg-transparent text-white font-medium outline-none cursor-pointer pr-8"
                    defaultValue="alquiler"
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
                    defaultValue="heredia"
                    aria-label={isEnglish ? 'Location' : 'Ubicación'}
                  >
                    <option value="heredia" className="text-slate-900">Heredia</option>
                    <option value="escazu" className="text-slate-900">Escazú</option>
                    <option value="desamparados" className="text-slate-900">Desamparados</option>
                  </select>
                  <span className="material-symbols-outlined pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-white text-sm">expand_more</span>
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer group">
                <label className="block text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">{isEnglish ? 'Budget' : 'Presupuesto'}</label>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{isEnglish ? 'From $800 USD or CRC 400k' : 'Desde $800 USD o ₡400 mil'}</span>
                  <span className="material-symbols-outlined text-white text-sm">payments</span>
                </div>
              </div>
              <a href={localizePath('/catalogo', '/en/catalog')} className="cta-gradient text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                <span className="material-symbols-outlined">search</span>
                {isEnglish ? 'Explore Now' : 'Explorar Ahora'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
