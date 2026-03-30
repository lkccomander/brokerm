import { aboutMike } from '../data/mockData';
import { editableContent } from '../content/editableContent';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface AboutMikeProps {
  readonly className?: string;
}

export const AboutMike: React.FC<AboutMikeProps> = ({ className = '' }) => {
  const { isEnglish, localizePath } = useSiteLanguage();
  return (
    <section id="sobre-mike" className={`py-32 bg-white overflow-hidden ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-fixed rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-fixed rounded-full mix-blend-multiply blur-3xl opacity-30"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-[600px] object-cover"
                alt="Broker Mike"
                src={aboutMike.image}
              />
            </div>
            <div className="absolute bottom-10 right-10 bg-surface-container-lowest p-6 rounded-xl shadow-xl max-w-[200px]">
              <div className="text-3xl font-extrabold text-primary mb-1">{editableContent.aboutMike.salesTotal}</div>
              <div className="text-[10px] font-bold text-tertiary uppercase tracking-widest">{isEnglish ? 'IN TOTAL SALES' : 'EN VENTAS TOTALES'}</div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-secondary font-bold text-xs tracking-[0.3em] uppercase mb-6 block">{isEnglish ? 'YOUR STRATEGIC GUIDE' : 'EL GUIA ESTRATEGICO'}</span>
            <h2 className="font-headline text-5xl font-extrabold text-on-surface leading-tight mb-8">{isEnglish ? 'The Strategic Mind Behind Your Urban Investment' : 'El Guia Estrategico Detras de su Inversion Urbana'}</h2>
            <p className="text-tertiary text-lg leading-relaxed mb-6">
              {isEnglish ? 'With more than two decades at the center of the premium property market, Mike does more than sell real estate. He designs investment portfolios built to last, combining data-driven precision with a deeply connected network across Greater San Jose.' : 'Con mas de dos decadas en el corazon del mercado inmobiliario premium, Mike no solo vende propiedades; disena carteras de inversion que perduran. Su enfoque combina la precision del analisis de datos con una red de contactos inigualable en el Gran Area Metropolitana.'}
            </p>
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <div className="text-3xl font-extrabold text-on-surface">{aboutMike.yearsExperience}</div>
                <div className="text-xs font-medium text-tertiary">{isEnglish ? 'YEARS OF EXPERIENCE' : 'ANOS DE EXPERIENCIA'}</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-on-surface">{aboutMike.clientsTotal}</div>
                <div className="text-xs font-medium text-tertiary">{isEnglish ? 'SATISFIED CLIENTS' : 'CLIENTES SATISFECHOS'}</div>
              </div>
            </div>
            <a href={localizePath('/#contacto', '/en/#contacto')} className="cta-gradient inline-flex text-on-primary px-10 py-4 rounded-xl font-bold shadow-xl shadow-primary/30 hover:-translate-y-1 transition-transform">
              {isEnglish ? 'Meet Mike' : 'Conoce a Mike'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMike;
