const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? '';
const UMAMI_WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim() ?? '';
const UMAMI_SRC = import.meta.env.VITE_UMAMI_SRC?.trim() ?? '';

let analyticsBooted = false;

export function initializeAnalytics() {
  if (analyticsBooted || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  analyticsBooted = true;

  if (UMAMI_WEBSITE_ID && UMAMI_SRC) {
    const existingUmamiScript = document.querySelector(`script[data-website-id="${UMAMI_WEBSITE_ID}"]`);
    if (!existingUmamiScript) {
      const script = document.createElement('script');
      script.defer = true;
      script.src = UMAMI_SRC;
      script.dataset.websiteId = UMAMI_WEBSITE_ID;
      document.head.appendChild(script);
    }
  }

  if (!GA_MEASUREMENT_ID) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  const existingScript = document.querySelector(`script[data-ga-id="${GA_MEASUREMENT_ID}"]`);
  if (!existingScript) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
    script.dataset.gaId = GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackEvent(eventName: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );

  if (GA_MEASUREMENT_ID && typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }

  if (typeof window.umami?.track === 'function') {
    window.umami.track(eventName, payload);
  }
}

export function trackPageView(pagePath: string) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function analyticsMeasurementId() {
  return GA_MEASUREMENT_ID;
}

export function umamiWebsiteId() {
  return UMAMI_WEBSITE_ID;
}
