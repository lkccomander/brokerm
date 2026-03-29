import TopNavBar from '../components/TopNavBar';
import Hero from '../components/Hero';
import MarketIntelligence from '../components/MarketIntelligence';
import Opportunities from '../components/Opportunities';
import AboutMike from '../components/AboutMike';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <>
      <TopNavBar />
      <Hero />
      <MarketIntelligence />
      <Opportunities />
      <AboutMike />
      <Testimonials />
      <ContactForm />
      <Footer />
    </>
  );
}
