import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { contactImage } from '../data/mockData';
import { useSiteLanguage } from '../hooks/useSiteLanguage';
import { usePublishedCatalog } from '../hooks/usePublishedCatalog';

export interface ContactFormProps {
  readonly className?: string;
}

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/mike@brokermikecr.com';
const PUBLIC_SITE_URL = 'https://www.brokermikecr.com';

export const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const location = useLocation();
  const { isEnglish } = useSiteLanguage();
  const { catalogProperties } = usePublishedCatalog();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresFinancing, setRequiresFinancing] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const selectedPropertyId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('propiedad')?.trim() ?? '';
  }, [location.search]);
  const selectedProperty = useMemo(() => {
    if (!selectedPropertyId) {
      return null;
    }

    return catalogProperties.find((property) => property.id === selectedPropertyId) ?? null;
  }, [catalogProperties, selectedPropertyId]);
  const inquirySource = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('origen')?.trim() ?? 'sitio-web';
  }, [location.search]);
  const selectedPropertyTitle = isEnglish ? selectedProperty?.translations?.en?.title ?? selectedProperty?.title ?? '' : selectedProperty?.title ?? '';
  const selectedPropertyLocation = isEnglish ? selectedProperty?.translations?.en?.location ?? selectedProperty?.location ?? '' : selectedProperty?.location ?? '';

  useEffect(() => {
    if (location.hash === '#contacto') {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set('_subject', 'Nuevo lead desde brokermikecr.com');
    formData.set('_template', 'table');
    formData.set('origen_del_lead', inquirySource);
    formData.set('requiere_financiamiento', requiresFinancing ? (isEnglish ? 'yes' : 'si') : (isEnglish ? 'no' : 'no'));
    if (!requiresFinancing) {
      formData.set('numero_cedula', '');
    }
    if (selectedProperty) {
      formData.set('propiedad_id', selectedProperty.id);
      formData.set('propiedad_de_interes', selectedPropertyTitle);
      formData.set('propiedad_ubicacion', selectedPropertyLocation);
      formData.set('propiedad_link', `${PUBLIC_SITE_URL}/catalogo?propiedad=${encodeURIComponent(selectedProperty.id)}`);
    }

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el formulario.');
      }

      form.reset();
      setRequiresFinancing(false);
      setStatus({
        type: 'success',
        message: isEnglish ? 'Thank you. Your request was sent and Mike will receive it by email.' : 'Gracias. Su solicitud fue enviada y Mike recibira el mensaje por correo.',
      });
    } catch {
      setStatus({
        type: 'error',
        message: isEnglish ? 'We could not send your request right now. Please try again in a few minutes.' : 'No pudimos enviar su solicitud en este momento. Intente de nuevo en unos minutos.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" ref={sectionRef} className={`relative py-32 overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="dramatic city skyline"
          src={contactImage}
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <h2 className="font-headline text-5xl font-extrabold text-white mb-6">{isEnglish ? 'Start Your Search' : 'Comience su Viaje'}</h2>
        <p className="text-white/80 text-lg mb-12">{isEnglish ? 'We are ready to turn your vision into a tangible investment. Share your details and a senior advisor will reach out in under 12 hours.' : 'Estamos listos para transformar su vision en una inversion tangible. Complete los detalles y un estratega senior se pondra en contacto en menos de 12 horas.'}</p>
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-left">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="hidden" name="propiedad_id" value={selectedProperty?.id ?? ''} />
            <input type="hidden" name="propiedad_de_interes" value={selectedPropertyTitle} />
            <input type="hidden" name="propiedad_ubicacion" value={selectedPropertyLocation} />
            <input type="hidden" name="propiedad_link" value={selectedProperty ? `${PUBLIC_SITE_URL}/catalogo?propiedad=${encodeURIComponent(selectedProperty.id)}` : ''} />
            <input type="hidden" name="origen_del_lead" value={inquirySource} />
            <input type="hidden" name="requiere_financiamiento" value={requiresFinancing ? (isEnglish ? 'yes' : 'si') : (isEnglish ? 'no' : 'no')} />
            {selectedProperty ? (
              <div className="rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary/80">{isEnglish ? 'Selected Property' : 'Propiedad Seleccionada'}</p>
                <p className="mt-2 text-base font-semibold text-on-surface">{selectedPropertyTitle}</p>
                <p className="mt-1 text-sm text-tertiary">{selectedPropertyLocation}</p>
                <p className="mt-1 text-sm text-tertiary">{isEnglish ? 'Your inquiry will be internally linked to this property for faster follow-up.' : 'Su consulta llegara internamente asociada a esta propiedad para dar seguimiento mas rapido.'}</p>
              </div>
            ) : null}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{isEnglish ? 'FULL NAME' : 'NOMBRE COMPLETO'}</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4"
                  placeholder={isEnglish ? 'Ex: John Smith' : 'Ej: Juan Perez'}
                  type="text"
                  name="nombre"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{isEnglish ? 'EMAIL ADDRESS' : 'CORREO ELECTRONICO'}</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4"
                  placeholder="juan@inversion.com"
                  type="email"
                  name="email"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{isEnglish ? 'PHONE NUMBER' : 'NUMERO TELEFONICO'}</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4"
                  placeholder={isEnglish ? 'Ex: +506 8888 8888' : 'Ej: +506 8888 8888'}
                  type="tel"
                  name="telefono"
                />
              </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{isEnglish ? 'INVESTMENT GOAL' : 'INTERES DE INVERSION'}</label>
              <select
                className="w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4"
                name="interes"
                required
                defaultValue={isEnglish ? 'Luxury Residential' : 'Residencial de Lujo'}
              >
                <option>{isEnglish ? 'Luxury Residential' : 'Residencial de Lujo'}</option>
                <option>{isEnglish ? 'Commercial / Vertical' : 'Comercial / Verticales'}</option>
                <option>{isEnglish ? 'Portfolio Advisory' : 'Consultoria de Cartera'}</option>
              </select>
            </div>
            <div className="rounded-2xl bg-surface-container-high px-5 py-4">
              <label className="flex items-center gap-3 text-sm font-medium text-on-surface">
                <input
                  className="h-4 w-4 accent-primary"
                  type="checkbox"
                  checked={requiresFinancing}
                  onChange={(event) => setRequiresFinancing(event.target.checked)}
                />
                <span>{isEnglish ? 'Needs financing' : 'Requiere financiamiento'}</span>
              </label>
            </div>
            {requiresFinancing ? (
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{isEnglish ? 'ID NUMBER' : 'NUMERO DE CEDULA'}</label>
                <input
                  className="w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4"
                  placeholder={isEnglish ? 'Example: 1-2345-6789' : 'Ej: 1-2345-6789'}
                  type="text"
                  name="numero_cedula"
                  required={requiresFinancing}
                />
              </div>
            ) : null}
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">{isEnglish ? 'MESSAGE' : 'MENSAJE'}</label>
              <textarea
                className="w-full min-h-36 bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4 resize-y"
                placeholder={isEnglish ? 'Share location, budget, property type or any relevant detail.' : 'Comparta ubicacion, presupuesto, tipo de propiedad o cualquier detalle relevante.'}
                name="mensaje"
                required
              />
            </div>
            {status ? (
              <p className={status.type === 'success' ? 'text-sm font-medium text-emerald-700' : 'text-sm font-medium text-red-700'}>
                {status.message}
              </p>
            ) : null}
            <button
              className="w-full cta-gradient text-on-primary font-bold py-5 rounded-xl shadow-lg hover:shadow-primary/40 transition-all text-lg disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isEnglish ? 'SENDING...' : 'ENVIANDO...') : isEnglish ? 'REQUEST PRIVATE ADVISORY' : 'SOLICITAR CONSULTORIA PRIVADA'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
