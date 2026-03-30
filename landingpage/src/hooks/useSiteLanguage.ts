import { useLocation } from 'react-router-dom';

export type SiteLanguage = 'es' | 'en';

export function useSiteLanguage() {
  const location = useLocation();
  const isEnglish = location.pathname === '/en' || location.pathname.startsWith('/en/');
  const language: SiteLanguage = isEnglish ? 'en' : 'es';

  const localizePath = (esPath: string, enPath: string) => (isEnglish ? enPath : esPath);

  const switchLanguagePath = () => {
    if (isEnglish) {
      if (location.pathname === '/en') {
        return '/';
      }

      return `${location.pathname.replace(/^\/en/, '') || '/'}${location.search}${location.hash}`;
    }

    if (location.pathname === '/') {
      return `/en${location.search}${location.hash}`;
    }

    const englishPath =
      location.pathname === '/catalogo'
        ? '/en/catalog'
        : location.pathname === '/mapa-del-sitio'
          ? '/en/site-map'
          : `/en${location.pathname}`;

    return `${englishPath}${location.search}${location.hash}`;
  };

  return {
    language,
    isEnglish,
    localizePath,
    switchLanguagePath,
  };
}
