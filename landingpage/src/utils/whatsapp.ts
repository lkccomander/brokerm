import { trackEvent } from './analytics';

export interface WhatsAppClickContext {
  readonly locale: 'es' | 'en';
  readonly placement: string;
  readonly pagePath: string;
  readonly propertyId?: string;
  readonly propertyTitle?: string;
}

const DEFAULT_WHATSAPP_PHONE = '50671121318';

function normalizePhone(phone?: string) {
  const digits = phone?.replace(/\D/g, '') ?? DEFAULT_WHATSAPP_PHONE;
  if (!digits) {
    return DEFAULT_WHATSAPP_PHONE;
  }
  return digits.length === 8 ? `506${digits}` : digits;
}

export function buildWhatsAppLeadMessage(context: WhatsAppClickContext) {
  if (context.locale === 'en') {
    const propertyLine = context.propertyId
      ? ` Property: ${context.propertyId}${context.propertyTitle ? ` (${context.propertyTitle})` : ''}.`
      : '';
    return `Hi Mike, I'm coming from the Broker Mike website and I would like more information.${propertyLine} Page: ${context.pagePath}. Source: site.`;
  }

  const propertyLine = context.propertyId
    ? ` Propiedad: ${context.propertyId}${context.propertyTitle ? ` (${context.propertyTitle})` : ''}.`
    : '';
  return `Hola Mike, vengo del sitio web de Broker Mike y me gustaría recibir más información.${propertyLine} Página: ${context.pagePath}. Origen: sitio-web.`;
}

export function buildWhatsAppUrl(context: WhatsAppClickContext, phone?: string) {
  const baseUrl = `https://wa.me/${normalizePhone(phone)}`;
  const text = buildWhatsAppLeadMessage(context);
  return `${baseUrl}?text=${encodeURIComponent(text)}`;
}

export function trackWhatsAppClick(context: WhatsAppClickContext) {
  trackEvent('whatsapp_click', {
    source: 'site',
    placement: context.placement,
    page_path: context.pagePath,
    property_id: context.propertyId,
    property_title: context.propertyTitle,
    locale: context.locale,
  });
}
