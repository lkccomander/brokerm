import { Link } from 'react-router-dom';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface TopNavBarProps {
  readonly className?: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ className = '' }) => {
  const { isEnglish, localizePath, switchLanguagePath } = useSiteLanguage();
  const navLinks = isEnglish
    ? [
        { label: 'Browse Properties', href: '/en/catalog' },
        { label: 'Market Intelligence', href: '/en/#mercado' },
        { label: 'About Mike', href: '/en/#sobre-mike' },
      ]
    : [
        { label: 'Buscar Propiedades', href: '/catalogo' },
        { label: 'Informes de Mercado', href: '/#mercado' },
        { label: 'Sobre Mike', href: '/#sobre-mike' },
      ];

  return (
    <nav className={`fixed top-0 w-full z-50 bg-white/70 backdrop-blur-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center h-20 px-8 max-w-7xl mx-auto">
        <Link to={localizePath('/', '/en')} className="text-xl font-extrabold tracking-tighter text-slate-900 font-headline">Broker Mike</Link>
        <div className="hidden md:flex gap-8 items-center">
          {navLinks.slice(0, 3).map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className={index === 0
                ? 'font-headline text-sm font-medium tracking-tight text-sky-700 border-b-2 border-sky-600 pb-1'
                : 'font-headline text-sm font-medium tracking-tight text-slate-600 hover:text-sky-600 transition-colors'}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link to={switchLanguagePath()} className="text-sm font-medium text-slate-600 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">
            {isEnglish ? 'ES' : 'EN'}
          </Link>
          <a href={localizePath('/#contacto', '/en/#contacto')} className="cta-gradient text-on-primary px-6 py-2.5 rounded-xl font-semibold text-sm scale-95 active:scale-100 transition-transform shadow-lg shadow-primary/20">
            {isEnglish ? 'Contact' : 'Contactar'}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
