import { Link } from 'react-router-dom';
import { siteMapHeroImage, mikeBWImage } from '../data/mockData';

export interface SiteDirectoryProps {
  readonly className?: string;
}

export const SiteDirectory: React.FC<SiteDirectoryProps> = ({ className = '' }) => {
  return (
    <>
      <section className="pt-24 bg-surface">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="w-full h-[40vh] min-h-[300px] rounded-3xl overflow-hidden relative mb-12 shadow-2xl">
            <img 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              alt="modern villa with sunset sky" 
              src={siteMapHeroImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-12 left-12">
              <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-xs tracking-widest uppercase mb-4 w-fit">Directorio</div>
              <h1 className="text-5xl font-extrabold tracking-tighter text-white font-headline">Mapa del Sitio</h1>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-16 bg-surface-container-lowest ${className}`}>
        <div className="max-w-7xl mx-auto px-8 w-full cursor-default">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold font-headline text-on-surface border-b-2 border-primary pb-3 inline-block w-fit">Principal</h3>
              <ul className="flex flex-col gap-4 font-body">
                <li><Link to="/" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Inicio</Link></li>
                <li><Link to="/catalogo" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Catálogo de Propiedades</Link></li>
                <li><a href="/#mercado" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Informes de Mercado</a></li>
                <li><a href="/#contacto" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Contacto Directo</a></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold font-headline text-on-surface border-b-2 border-primary pb-3 inline-block w-fit">Zonas (GAM)</h3>
              <ul className="flex flex-col gap-4 font-body">
                <li><a href="/catalogo" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Escazú (Jaboncillos, Guachipelín)</a></li>
                <li><a href="/catalogo" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Santa Ana (Lindora, Pozos)</a></li>
                <li><a href="/catalogo" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> San José (Sabana, Nunciatura)</a></li>
                <li><a href="/catalogo" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Desarrollos Fuera del GAM</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-bold font-headline text-on-surface border-b-2 border-primary pb-3 inline-block w-fit">Asesoría</h3>
              <ul className="flex flex-col gap-4 font-body">
                <li><a href="/#sobre-mike" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Sobre Broker Mike</a></li>
                <li><a href="/#mercado" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Metodología Data-Driven</a></li>
                <li><a href="/#testimonios" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Casos de Éxito / Testimonios</a></li>
                <li><a href="/#contacto" className="text-tertiary hover:text-primary transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span> Consultoría de Inversión</a></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="flex flex-col gap-6">
              <div className="bg-surface rounded-2xl p-6 border border-surface-container flex flex-col items-center text-center">
                <img 
                  className="w-14 h-14 rounded-full object-cover grayscale mb-4" 
                  alt="profesional real estate broker Mike" 
                  src={mikeBWImage}
                />
                <h4 className="font-bold font-headline text-on-surface mb-1">¿No encuentra lo que busca?</h4>
                <p className="text-sm text-tertiary font-body mb-4">Nuestro inventario privado cambia a diario.</p>
                <a href="/#contacto" className="text-sm font-bold text-primary hover:underline group flex items-center justify-center gap-1 w-full bg-surface-container-lowest py-2 rounded-lg border border-surface-container hover:border-primary transition-colors">
                  Contactar Soporte
                  <span className="material-symbols-outlined text-[1rem]">arrow_outward</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default SiteDirectory;
