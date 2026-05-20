import { Link } from 'react-router-dom';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface TopNavBarProps {
  readonly className?: string;
}

const WHATSAPP_URL = 'https://wa.me/50671121318';

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
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            aria-label={isEnglish ? 'Contact on WhatsApp' : 'Contactar por WhatsApp'}
            title={isEnglish ? 'Contact on WhatsApp' : 'Contactar por WhatsApp'}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105 active:scale-100"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.62 2 2.22 6.4 2.22 11.81c0 1.73.45 3.43 1.3 4.93L2 22l5.42-1.49a9.8 9.8 0 0 0 4.61 1.17h.01c5.4 0 9.8-4.4 9.8-9.81a9.74 9.74 0 0 0-2.79-6.96Zm-7.02 15.11h-.01a8.14 8.14 0 0 1-4.15-1.14l-.3-.18-3.22.89.86-3.14-.2-.32a8.18 8.18 0 0 1-1.25-4.33c0-4.5 3.67-8.16 8.18-8.16a8.1 8.1 0 0 1 5.78 2.4 8.09 8.09 0 0 1 2.38 5.77c0 4.5-3.66 8.17-8.07 8.21Zm4.48-6.1c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42l-.46-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.61.57.24 1.01.38 1.36.49.57.18 1.09.15 1.5.09.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
