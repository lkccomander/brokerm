import { marketStats } from '../data/mockData';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface MarketIntelligenceProps {
  readonly className?: string;
}

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ className = '' }) => {
  const { isEnglish } = useSiteLanguage();
  const trendCards = isEnglish
    ? [
        {
          title: 'Verticalization',
          description: 'More towers, fewer houses. Mixed-use projects continue concentrating demand in premium urban nodes.',
        },
        {
          title: 'Nearshoring Demand',
          description: 'Corporate relocation and expat demand keep supporting rental absorption in strategic GAM districts.',
        },
        {
          title: 'Stable Returns',
          description: 'The market looks mature rather than explosive, with moderate appreciation and consistent rental ROI.',
        },
      ]
    : [
        {
          title: 'Verticalización',
          description: 'Más torres, menos casas. Los proyectos de uso mixto siguen concentrando demanda en nodos urbanos premium.',
        },
        {
          title: 'Nearshoring',
          description: 'La relocalización corporativa y la demanda expatriada sostienen la absorción de alquiler en distritos clave del GAM.',
        },
        {
          title: 'Rentabilidad estable',
          description: 'El mercado luce maduro más que explosivo, con plusvalía moderada y ROI residencial consistente.',
        },
      ];
  const considerations = isEnglish
    ? [
        'Interest rates still affect purchase demand and financing speed.',
        'Some submarkets already show higher inventory pressure than others.',
        'Short-term rental regulation can affect Airbnb-style yield assumptions.',
      ]
    : [
        'Las tasas de interés todavía impactan la demanda de compra y la velocidad de colocación.',
        'Algunos submercados ya muestran más presión de inventario que otros.',
        'La regulación de alquiler de corta estancia puede alterar supuestos tipo Airbnb.',
      ];

  return (
    <section id="mercado" className={`py-24 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-4">{isEnglish ? 'Market Intelligence' : 'Inteligencia de Mercado'}</h2>
            <p className="text-tertiary text-lg leading-relaxed">{isEnglish ? 'Based on the latest 2024-2025 reports available for Costa Rica, the GAM shows moderate appreciation, resilient urban rental returns and sustained institutional appetite for vertical product.' : 'Con base en los últimos reportes disponibles de 2024-2025 para Costa Rica, el GAM muestra plusvalía moderada, retornos sólidos en alquiler urbano y apetito institucional sostenido por producto vertical.'}</p>
          </div>
          <div className="flex gap-2 text-secondary font-bold text-sm tracking-widest items-center">
            {isEnglish ? 'UPDATED: 2024-2025' : 'ACTUALIZADO: 2024-2025'} <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {marketStats.map((stat) => (
            <div key={stat.id} className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/10">
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center mb-6`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div className="text-4xl font-extrabold text-on-surface mb-2">{stat.value}</div>
              <div className="text-tertiary font-medium mb-4">{stat.label}</div>
              {stat.trend && (
                <div className="flex items-center gap-2 text-secondary text-sm font-bold">
                  <span className="material-symbols-outlined text-sm">arrow_drop_up</span>
                  {stat.trendValue}
                </div>
              )}
              {stat.subtitle && (
                <div className="text-on-surface-variant text-xs font-bold tracking-widest uppercase opacity-60">{stat.subtitle}</div>
              )}
              {!stat.trend && !stat.subtitle && (
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 mt-10">
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-transparent hover:border-primary/10 transition-all">
            <h3 className="text-2xl font-extrabold text-on-surface mb-6">{isEnglish ? 'Key Trends' : 'Tendencias Clave'}</h3>
            <div className="grid gap-5">
              {trendCards.map((item) => (
                <div key={item.title} className="rounded-2xl border border-surface-container bg-surface p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-secondary mb-2">{item.title}</p>
                  <p className="text-tertiary leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-transparent hover:border-primary/10 transition-all">
            <h3 className="text-2xl font-extrabold text-on-surface mb-6">{isEnglish ? 'Current Considerations' : 'Consideraciones Actuales'}</h3>
            <div className="space-y-4">
              {considerations.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary"></span>
                  <p className="text-tertiary leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketIntelligence;
