import { contactImage } from '../data/mockData';

export interface ContactFormProps {
  readonly className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  return (
    <section id="contacto" className={`relative py-32 overflow-hidden ${className}`}>
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt="dramatic city skyline"
          src={contactImage}
        />
        <div className="absolute inset-0 bg-primary/80 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
        <h2 className="font-headline text-5xl font-extrabold text-white mb-6">Comience su Viaje</h2>
        <p className="text-white/80 text-lg mb-12">Estamos listos para transformar su vision en una inversion tangible. Complete los detalles y un estratega senior se pondra en contacto en menos de 12 horas.</p>
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-left">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">NOMBRE COMPLETO</label>
                <input className="w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4" placeholder="Ej: Juan Perez" type="text" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">CORREO ELECTRONICO</label>
                <input className="w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4" placeholder="juan@inversion.com" type="email" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">INTERES DE INVERSION</label>
              <select className="w-full bg-surface-container-high border-none rounded-xl focus:ring-2 focus:ring-primary p-4">
                <option>Residencial de Lujo</option>
                <option>Comercial / Verticales</option>
                <option>Consultoria de Cartera</option>
              </select>
            </div>
            <button className="w-full cta-gradient text-on-primary font-bold py-5 rounded-xl shadow-lg hover:shadow-primary/40 transition-all text-lg" type="submit">
              SOLICITAR CONSULTORIA PRIVADA
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
