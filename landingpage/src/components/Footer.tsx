import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface FooterProps {
  readonly className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const { isEnglish, localizePath } = useSiteLanguage();

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = 'Broker Mike';
    const shareText = isEnglish
      ? 'Explore Broker Mike real estate opportunities.'
      : 'Explore las oportunidades inmobiliarias de Broker Mike.';

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      // If sharing is cancelled or unsupported, we silently keep the UI simple.
    }
  };

  return (
    <footer className={`bg-slate-50 w-full py-12 border-t border-slate-200/20 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold text-slate-800 font-headline">Broker Mike</div>
          <div className="font-body text-xs text-slate-500">Copyright © 2026 Broker Mike - {isEnglish ? 'All Rights Reserved.' : 'Todos los derechos reservados.'}</div>
        </div>
        <div className="flex gap-8">
          <a className="font-body text-xs text-slate-500 hover:text-sky-500 transition-opacity" href={localizePath('/aviso-legal', '/en/legal-notice')}>{isEnglish ? 'Legal Notice' : 'Aviso Legal'}</a>
          <a className="font-body text-xs text-slate-500 hover:text-sky-500 transition-opacity" href={localizePath('/privacidad', '/en/privacy')}>{isEnglish ? 'Privacy' : 'Privacidad'}</a>
          <a className="font-body text-xs text-slate-500 hover:text-sky-500 transition-opacity" href={localizePath('/cookies', '/en/cookies')}>Cookies</a>
          <a className="font-body text-xs text-slate-500 hover:text-sky-500 transition-opacity" href={localizePath('/#contacto', '/en/#contacto')}>{isEnglish ? 'Contact' : 'Contacto'}</a>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            aria-label={isEnglish ? 'Share this page' : 'Compartir esta pagina'}
            title={isEnglish ? 'Share this page' : 'Compartir esta pagina'}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer"
            onClick={() => {
              void handleShare();
            }}
          >
            <span className="material-symbols-outlined text-sm">share</span>
          </button>
          <a
            aria-label={isEnglish ? 'Contact by email' : 'Contactar por correo'}
            title={isEnglish ? 'Contact by email' : 'Contactar por correo'}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer"
            href="mailto:mike@brokermikecr.com"
          >
            <span className="material-symbols-outlined text-sm">mail</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
