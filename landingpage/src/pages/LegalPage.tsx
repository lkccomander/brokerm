import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

type LegalPageType = 'legal' | 'privacy' | 'cookies';

export interface LegalPageProps {
  readonly type: LegalPageType;
}

const legalContent = {
  es: {
    legal: {
      eyebrow: 'Información Legal',
      title: 'Aviso Legal',
      intro:
        'Este sitio web es operado por Broker Mike con fines informativos y comerciales dentro del sector inmobiliario de Costa Rica.',
      sections: [
        {
          title: 'Titular del sitio',
          body: [
            'La marca y operación comercial del sitio corresponden a Broker Mike.',
            'Los canales publicados en esta web se utilizan para atención comercial, seguimiento de clientes potenciales y difusión de inventario inmobiliario.',
          ],
        },
        {
          title: 'Uso del contenido',
          body: [
            'La información publicada en el sitio tiene carácter referencial e informativo.',
            'Los precios, disponibilidad, condiciones de renta, venta o inversión pueden cambiar sin previo aviso.',
            'Las decisiones de inversión o compra deben validarse con asesoría profesional y revisión documental actualizada.',
          ],
        },
        {
          title: 'Limitación de responsabilidad',
          body: [
            'Broker Mike no garantiza que todos los inmuebles, precios o condiciones permanezcan vigentes al momento de la consulta.',
            'El uso de la información del sitio es responsabilidad del usuario y no sustituye debida diligencia financiera, legal o técnica.',
          ],
        },
        {
          title: 'Propiedad intelectual',
          body: [
            'Los textos, estructura del sitio, marca, fotografías propias y materiales editoriales están protegidos y no deben reproducirse sin autorización.',
          ],
        },
      ],
    },
    privacy: {
      eyebrow: 'Protección de Datos',
      title: 'Política de Privacidad',
      intro:
        'Respetamos la privacidad de quienes visitan este sitio y tratamos los datos personales con fines estrictamente comerciales, operativos y de atención.',
      sections: [
        {
          title: 'Datos que recopilamos',
          body: [
            'Nombre, correo electrónico, mensaje y cualquier dato que el usuario comparta voluntariamente en formularios.',
            'Propiedad de interés, ubicación del inmueble y origen del lead cuando la consulta se genera desde una ficha específica.',
          ],
        },
        {
          title: 'Uso de la información',
          body: [
            'Responder consultas y dar seguimiento comercial a oportunidades inmobiliarias.',
            'Relacionar cada lead con la propiedad consultada para acelerar la atención y personalizar la respuesta.',
            'Analizar la demanda comercial del sitio y optimizar la presentación del inventario.',
          ],
        },
        {
          title: 'Terceros y procesamiento',
          body: [
            'El sitio puede apoyarse en proveedores externos para formularios o correo, por ejemplo servicios de envío como FormSubmit.',
            'No vendemos la información personal de los usuarios a terceros.',
          ],
        },
        {
          title: 'Derechos del usuario',
          body: [
            'El usuario puede solicitar corrección, actualización o eliminación de sus datos escribiendo a los canales de contacto del sitio.',
          ],
        },
      ],
    },
    cookies: {
      eyebrow: 'Tecnologías del Sitio',
      title: 'Política de Cookies',
      intro:
        'Este sitio puede utilizar cookies y tecnologías similares para asegurar funcionamiento básico, recordar preferencias y medir rendimiento.',
      sections: [
        {
          title: 'Qué son las cookies',
          body: [
            'Son pequeños archivos que el navegador guarda para recordar información de navegación o mejorar la experiencia del usuario.',
          ],
        },
        {
          title: 'Cómo las usamos',
          body: [
            'Para funcionamiento técnico del sitio y navegación entre páginas.',
            'Para recordar ciertas preferencias de idioma o comportamiento del usuario cuando aplique.',
            'Para integraciones de terceros o elementos incrustados que puedan necesitar almacenamiento temporal en el navegador.',
          ],
        },
        {
          title: 'Control del usuario',
          body: [
            'El usuario puede limitar, bloquear o eliminar cookies desde la configuración de su navegador.',
            'Algunas funciones del sitio podrían verse afectadas si se desactivan cookies esenciales.',
          ],
        },
      ],
    },
  },
  en: {
    legal: {
      eyebrow: 'Legal Information',
      title: 'Legal Notice',
      intro:
        'This website is operated by Broker Mike for informational and commercial purposes within the Costa Rican real estate market.',
      sections: [
        {
          title: 'Site owner',
          body: [
            'The brand and commercial operation behind this website correspond to Broker Mike.',
            'The channels published on this site are used for commercial attention, lead follow-up and inventory promotion.',
          ],
        },
        {
          title: 'Use of content',
          body: [
            'The information published on this website is provided for reference and informational purposes.',
            'Prices, availability, rental terms, sale conditions and investment information may change without prior notice.',
            'Investment and purchase decisions should be validated with professional advice and updated documentation.',
          ],
        },
        {
          title: 'Limitation of liability',
          body: [
            'Broker Mike does not guarantee that every listing, price or condition remains active at the exact moment of the inquiry.',
            'Use of the website information is the responsibility of the user and does not replace financial, legal or technical due diligence.',
          ],
        },
        {
          title: 'Intellectual property',
          body: [
            'Texts, site structure, brand assets, original photography and editorial materials are protected and should not be reproduced without authorization.',
          ],
        },
      ],
    },
    privacy: {
      eyebrow: 'Data Protection',
      title: 'Privacy Policy',
      intro:
        'We respect the privacy of everyone who visits this site and process personal data only for commercial, operational and customer service purposes.',
      sections: [
        {
          title: 'Data we collect',
          body: [
            'Name, email address, message content and any information voluntarily shared through forms.',
            'Property of interest, property location and lead source when an inquiry starts from a specific listing.',
          ],
        },
        {
          title: 'How we use information',
          body: [
            'To answer inquiries and follow up on real estate opportunities.',
            'To connect each lead with the relevant property and speed up response time.',
            'To analyze site demand and improve how inventory is presented.',
          ],
        },
        {
          title: 'Third parties and processing',
          body: [
            'The site may rely on third-party providers for forms or email delivery, including services such as FormSubmit.',
            'We do not sell personal data to third parties.',
          ],
        },
        {
          title: 'User rights',
          body: [
            'Users may request correction, update or deletion of their data through the site contact channels.',
          ],
        },
      ],
    },
    cookies: {
      eyebrow: 'Site Technologies',
      title: 'Cookie Policy',
      intro:
        'This site may use cookies and similar technologies to support basic functionality, remember preferences and measure performance.',
      sections: [
        {
          title: 'What cookies are',
          body: [
            'Cookies are small files stored by the browser to remember navigation details or improve user experience.',
          ],
        },
        {
          title: 'How we use them',
          body: [
            'For technical site functionality and page-to-page navigation.',
            'To remember language or behavior preferences when applicable.',
            'For third-party integrations or embedded elements that may require temporary browser storage.',
          ],
        },
        {
          title: 'User control',
          body: [
            'Users may limit, block or delete cookies from their browser settings.',
            'Some site functionality may be affected if essential cookies are disabled.',
          ],
        },
      ],
    },
  },
} as const;

export default function LegalPage({ type }: LegalPageProps) {
  const { isEnglish, localizePath } = useSiteLanguage();
  const locale = isEnglish ? 'en' : 'es';
  const content = legalContent[locale][type];

  return (
    <>
      <TopNavBar />
      <main className="bg-surface pt-28 pb-20">
        <section className="max-w-4xl mx-auto px-8">
          <div className="rounded-3xl bg-surface-container-lowest border border-surface-container shadow-sm p-8 md:p-12">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-secondary mb-4">{content.eyebrow}</p>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-on-surface mb-6">{content.title}</h1>
            <p className="text-lg text-tertiary leading-relaxed mb-10">{content.intro}</p>

            <div className="space-y-10">
              {content.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-bold text-on-surface mb-4">{section.title}</h2>
                  <div className="space-y-3">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-tertiary leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-2xl bg-surface p-6 border border-surface-container">
              <p className="text-sm text-tertiary leading-relaxed">
                {isEnglish
                  ? 'For legal, privacy or data requests, use the direct contact channels available on the website.'
                  : 'Para consultas legales, privacidad o solicitudes sobre datos, utilice los canales de contacto directo disponibles en el sitio.'}
              </p>
              <a
                href={localizePath('/#contacto', '/en/#contacto')}
                className="inline-flex mt-4 items-center gap-2 font-bold text-primary hover:underline"
              >
                {isEnglish ? 'Go to contact' : 'Ir a contacto'}
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
