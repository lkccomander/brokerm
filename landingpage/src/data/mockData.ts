// src/data/mockData.ts
import type { Property, Testimonial, Stat, NavLink } from '../types';

export const navLinks: NavLink[] = [
  { label: 'Buscar Propiedades', href: '/catalogo' },
  { label: 'Informes de Mercado', href: '/#mercado' },
  { label: 'Sobre Mike', href: '/#sobre-mike' },
  { label: 'Mapa del Sitio', href: '/mapa-del-sitio' },
];

export const heroContent = {
  title: [
    { text: 'Navega Bienes\nRaíces Urbanos con\n', highlight: false },
    { text: 'Datos y Estilo', highlight: true }
  ],
  image: '/images/image-6.jpg'
};

export const marketStats: Stat[] = [
  {
    id: 'stat-1',
    value: '7.4%',
    label: 'Promedio ROI Alquiler Urbano',
    icon: 'trending_up',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
    trend: 'arrow_drop_up',
    trendValue: '+0.8% este mes'
  },
  {
    id: 'stat-2',
    value: '9.2%',
    label: 'Plusvalía Proyectada (Escazú)',
    icon: 'location_city',
    iconBg: 'bg-secondary-fixed',
    iconColor: 'text-on-secondary-fixed',
    subtitle: 'GAM COSTA RICA'
  },
  {
    id: 'stat-3',
    value: '$850M',
    label: 'Inversión en Verticales San José',
    icon: 'finance_chip',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-on-tertiary-fixed'
  }
];

export const featuredProperties: Property[] = [
  {
    id: 'prop-1',
    title: 'Contemporary Escazú Villa',
    location: 'Jaboncillos, Escazú',
    price: 1250000,
    beds: 4,
    baths: 4.5,
    image: '/images/image-7.jpg',
    badge: { text: 'OPORTUNIDAD VIP', variant: 'secondary' }
  },
  {
    id: 'prop-2',
    title: 'Santa Ana Modern Sanctuary',
    location: 'Lindora, Santa Ana',
    price: 895000,
    beds: 3,
    baths: 3.5,
    image: '/images/image-8.jpg',
    badge: { text: 'RECIÉN LISTADA', variant: 'primary' }
  },
  {
    id: 'prop-3',
    title: 'Metropolitan Pool Retreat',
    location: 'Sabana, San José',
    price: 540000,
    beds: 2,
    baths: 2,
    image: '/images/image-9.jpg',
    badge: { text: 'ALTA PLUSVALÍA', variant: 'tertiary' }
  }
];

export const catalogProperties: Property[] = [
  ...featuredProperties,
  {
    id: 'prop-4',
    title: 'Modern Luxury Escazú',
    location: 'Jaboncillos, Escazú',
    price: 1450000,
    beds: 4,
    baths: 5,
    image: '/images/image-1.jpg',
  },
  {
    id: 'prop-5',
    title: 'Contemporary Minimalist',
    location: 'Santa Ana',
    price: 950000,
    beds: 3,
    baths: 3,
    image: '/images/image-2.jpg',
  },
  {
    id: 'prop-6',
    title: 'High-end Geometric House',
    location: 'Escazú',
    price: 1850000,
    beds: 5,
    baths: 5.5,
    image: '/images/image-3.jpg',
  },
  {
    id: 'prop-7',
    title: 'Ultra-modern Tropical',
    location: 'Santa Ana',
    price: 2100000,
    beds: 4,
    baths: 4.5,
    image: '/images/image-4.jpg',
  },
  {
    id: 'prop-8',
    title: 'Apartamento Full Amoblado con Vista a la Ciudad',
    location: 'Torres de la Colina, Escazú',
    price: 1600,
    priceLabel: '$1,600 USD / mes',
    beds: 2,
    baths: 2,
    image: '/images/image-9.jpg',
    details: [
      'Piso 6',
      '1 parqueo bajo techo',
      'Full amoblado',
      'Seguridad 24/7',
      'Piscina',
      'Ascensor',
    ],
    contactPhone: '7112 1318',
    inquiryEnabled: true,
    inquirySource: 'catalogo',
    badge: { text: 'SE RENTA', variant: 'primary' }
  }
];

export const aboutMike = {
  image: '/images/image-5.jpg',
  yearsExperience: '20+',
  clientsTotal: '1500+'
};

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Jose Pablo Zamora Prado',
    title: 'Inversores Privados',
    quote: 'La capacidad de Mike para identificar oportunidades antes de que lleguen al mercado público nos permitió asegurar nuestra villa en Escazú a un valor increíble.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Andres Salas',
    title: 'CEO de Rossi Verticals',
    quote: 'Como desarrollador, valoro la precisión de los datos. Mike entrega informes de mercado que son piezas maestras de inteligencia comercial.',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Ricardo Fonseca',
    title: 'Empresaria',
    quote: 'Encontró el hogar perfecto para mi familia en tiempo récord. Su paciencia y profesionalismo transformaron una mudanza estresante en una aventura emocionante.',
    rating: 5
  }
];

export const contactImage = '/images/image-10.jpg';
export const siteMapHeroImage = '/images/image-11.jpg';
export const mikeBWImage = '/images/image-12.jpg';
