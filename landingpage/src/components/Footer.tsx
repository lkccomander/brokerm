export interface FooterProps {
  readonly className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-slate-50 w-full py-12 border-t border-slate-200/20 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold text-slate-800 font-headline">Broker Mike</div>
          <div className="font-body text-xs text-slate-500">Copyright © 2026 Broker Mike - All Rights Reserved.</div>
        </div>
        <div className="flex gap-8">
          <a className="font-body text-xs text-slate-500 hover:text-sky-500 transition-opacity" href="/mapa-del-sitio">Aviso Legal</a>
          <a className="font-body text-xs text-slate-500 hover:text-sky-500 transition-opacity" href="/#contacto">Privacidad</a>
          <a className="font-body text-xs text-slate-500 hover:text-sky-500 transition-opacity" href="/#contacto">Cookies</a>
          <a className="font-body text-xs text-slate-500 hover:text-sky-500 transition-opacity" href="/#contacto">Contacto</a>
        </div>
        <div className="flex gap-4">
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">share</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-500 hover:text-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">mail</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
