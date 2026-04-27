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
          <a
            aria-label="Instagram"
            title="Instagram"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer"
            href="https://www.instagram.com/brokermike.cr/"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current"
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5Zm5.38-2.13a1.12 1.12 0 1 1 0 2.25 1.12 1.12 0 0 1 0-2.25Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
