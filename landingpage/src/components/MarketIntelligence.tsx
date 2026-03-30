import { marketStats } from '../data/mockData';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface MarketIntelligenceProps {
  readonly className?: string;
}

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ className = '' }) => {
  const { isEnglish } = useSiteLanguage();
  return (
    <section id="mercado" className={`py-24 bg-surface ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-xl">
            <h2 className="font-headline text-4xl font-extrabold text-on-surface mb-4">{isEnglish ? 'Market Intelligence' : 'Inteligencia de Mercado'}</h2>
            <p className="text-tertiary text-lg leading-relaxed">{isEnglish ? 'We analyze thousands of data points to give you a clear read on the metropolitan real estate landscape.' : 'Analizamos miles de puntos de datos para ofrecerle una vision clara del panorama inmobiliario metropolitano.'}</p>
          </div>
          <div className="flex gap-2 text-secondary font-bold text-sm tracking-widest items-center">
            {isEnglish ? 'UPDATED: TODAY' : 'ACTUALIZADO: HOY'} <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
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
      </div>
    </section>
  );
};

export default MarketIntelligence;
