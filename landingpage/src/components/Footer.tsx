import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface FooterProps {
  readonly className?: string;
}

const WHATSAPP_URL = 'https://wa.me/50671121318';

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
            aria-label={isEnglish ? 'Contact on WhatsApp' : 'Contactar por WhatsApp'}
            title={isEnglish ? 'Contact on WhatsApp' : 'Contactar por WhatsApp'}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-500 hover:text-[#25D366] transition-colors cursor-pointer"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current"
            >
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.62 2 2.22 6.4 2.22 11.81c0 1.73.45 3.43 1.3 4.93L2 22l5.42-1.49a9.8 9.8 0 0 0 4.61 1.17h.01c5.4 0 9.8-4.4 9.8-9.81a9.74 9.74 0 0 0-2.79-6.96Zm-7.02 15.11h-.01a8.14 8.14 0 0 1-4.15-1.14l-.3-.18-3.22.89.86-3.14-.2-.32a8.18 8.18 0 0 1-1.25-4.33c0-4.5 3.67-8.16 8.18-8.16a8.1 8.1 0 0 1 5.78 2.4 8.09 8.09 0 0 1 2.38 5.77c0 4.5-3.66 8.17-8.07 8.21Zm4.48-6.1c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.41-.54-.42l-.46-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.61.57.24 1.01.38 1.36.49.57.18 1.09.15 1.5.09.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
            </svg>
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
