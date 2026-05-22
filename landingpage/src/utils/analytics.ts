const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? '';

let analyticsBooted = false;

export function initializeAnalytics() {
  if (!GA_MEASUREMENT_ID || analyticsBooted || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  analyticsBooted = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
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
  window.gtag('config', GA_MEASUREMENT_ID);
}

export function trackEvent(eventName: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const payload = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  );
  window.gtag('event', eventName, payload);
}

export function analyticsMeasurementId() {
  return GA_MEASUREMENT_ID;
}
