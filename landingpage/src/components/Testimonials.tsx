import { testimonials } from '../data/mockData';
import { useSiteLanguage } from '../hooks/useSiteLanguage';

export interface TestimonialsProps {
  readonly className?: string;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ className = '' }) => {
  const { isEnglish } = useSiteLanguage();
  return (
    <section id="testimonios" className={`py-24 bg-surface-container ${className}`}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-16">
          <h2 className="font-headline text-3xl font-extrabold text-on-surface">{isEnglish ? 'Client Voices' : 'Voces del Exito'}</h2>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-outline/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-outline/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-surface-container-lowest p-10 rounded-2xl relative">
              <div className="text-primary opacity-20 absolute top-8 right-10">
                <span className="material-symbols-outlined text-6xl">format_quote</span>
              </div>
              <div className="flex gap-1 text-secondary mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined">star</span>
                ))}
              </div>
              <p className="text-on-surface-variant italic mb-8 relative z-10">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200"></div>
                <div>
                  <div className="font-bold text-on-surface">{testimonial.name}</div>
                  <div className="text-xs text-tertiary">{testimonial.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
