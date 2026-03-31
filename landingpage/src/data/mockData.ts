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
    value: '6% - 8%',
    label: 'ROI promedio en alquiler residencial urbano',
    icon: 'trending_up',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
    trend: 'arrow_drop_up',
    trendValue: 'San José, Escazú y Santa Ana'
  },
  {
    id: 'stat-2',
    value: '7% - 10%',
    label: 'Plusvalía anual en zonas premium',
    icon: 'location_city',
    iconBg: 'bg-secondary-fixed',
    iconColor: 'text-on-secondary-fixed',
    subtitle: 'Escazú y Santa Ana'
  },
  {
    id: 'stat-3',
    value: '$700M - $1B+',
    label: 'Inversión en desarrollos verticales GAM',
    icon: 'finance_chip',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-on-tertiary-fixed'
  }
];

const leadDefaults = {
  contactPhone: '7112 1318',
  inquiryEnabled: true,
  inquirySource: 'catalogo',
} as const;

const allProperties: Property[] = [
  {
    id: 'prop-8',
    category: 'alquiler',
    title: 'Apartamento Full Amoblado con Vista a la Ciudad',
    location: 'Torres de la Colina, Escazú',
    price: 1600,
    priceLabel: '$1,600 USD / mes',
    beds: 2,
    baths: 2,
    image: '/images/prop-8-thumbnail.png',
    details: [
      'Piso 6',
      '1 parqueo bajo techo',
      'Full amoblado',
      'Seguridad 24/7',
      'Piscina',
      'Ascensor',
    ],
    badge: { text: 'SE RENTA', variant: 'primary' },
    translations: {
      en: {
        title: 'Fully Furnished Apartment with City View',
        location: 'Torres de la Colina, Escazu',
        priceLabel: '$1,600 USD / month',
        details: ['6th floor', '1 covered parking space', 'Fully furnished', '24/7 security', 'Pool', 'Elevator'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-9',
    category: 'alquiler',
    title: 'Apartamento Amueblado con Vista en Torres San Marino',
    location: 'Torres San Marino, San Francisco de Heredia',
    price: 1100,
    priceLabel: '$1,100 USD / mes',
    beds: 3,
    baths: 2,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/656004530_2191261808351166_6148399968691955575_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=105&ig_cache_key=Mzg1NzI1ODg2MjA5Nzg0MzI2MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=8bvB4_1RPnQQ7kNvwGY2Sy4&_nc_oc=AdqWloNJblEBm2ivsDQU4IPMNCCp1grOcaRPdY47oV_5or-3dcUolUSdgd9OvUifGiA&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_AfzwP_lIyHV-gddC5PxKJtjqlwstVUSZplD6UJdqPBJQFA&oe=69D09E3A',
    details: ['Piso 5', '2 parqueos', 'Piscina', 'BBQ', 'Mini gym', 'Fut 5'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Furnished Apartment with View at Torres San Marino',
        location: 'Torres San Marino, San Francisco de Heredia',
        priceLabel: '$1,100 USD / month',
        details: ['5th floor', '2 parking spaces', 'Pool', 'BBQ area', 'Mini gym', 'Five-a-side court'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-10',
    category: 'venta',
    title: 'Apartamento Esquinero Full Amoblado en Khaya Ruta Uno',
    location: 'Khaya Ruta Uno, Torres de Heredia',
    price: 125000,
    priceLabel: '$125,000 USD',
    beds: 1,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/655312696_1228864946065722_7952721626604119294_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=Mzg1NTc1NTMwODUxMDA3ODQ3Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=lxw8vpDWtHoQ7kNvwFIbfzK&_nc_oc=AdpgTsdnWWJW2RsGqE08cC6O09WJUEsa_p-bsCDdVQ43_2lYXlJAarIPkobfc-ti9FE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_AfyhLHZ3mKwltctQ8irBJ8v1blue2OJhcBvj66jywYrdoQ&oe=69D0CC6A',
    details: ['Piso 7', 'Esquinero', '1 parqueo', 'Piscina', 'Jacuzzi', 'Lobby 24/7'],
    badge: { text: 'SE VENDE', variant: 'secondary' },
    translations: {
      en: {
        title: 'Corner Fully Furnished Apartment at Khaya Ruta Uno',
        location: 'Khaya Ruta Uno, Torres de Heredia',
        priceLabel: '$125,000 USD',
        details: ['7th floor', 'Corner unit', '1 parking space', 'Pool', 'Jacuzzi', '24/7 lobby'],
        badgeText: 'FOR SALE',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-11',
    category: 'alquiler',
    title: 'Apartamento con Patio Privado en Robledal Flats',
    location: 'Robledal Flats',
    price: 1100,
    priceLabel: '$1,100 USD / mes',
    beds: 2,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/641292384_899752016011489_7518385841643226975_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=106&ig_cache_key=Mzg0NjI4MDM1NDc3NzM1Mzk1MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=YZybysmQokgQ7kNvwFsoKJC&_nc_oc=Adrz-3Vy20q2gEMTrP0qhtM5pYh66GKG7dzcgPuMQP_mBjzREVA99CU6kBM3XSVvpSA&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_Afx9oS3Pbh_EIK10tPdig9uPi6J2_DVcseyhW-DjFIshuQ&oe=69D0AEF0',
    details: ['Primer piso', 'Patio privado', '1 parqueo', 'Incluye cuota condominal', 'Solicitar video'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Apartment with Private Patio at Robledal Flats',
        location: 'Robledal Flats',
        priceLabel: '$1,100 USD / month',
        details: ['Ground floor', 'Private patio', '1 parking space', 'Condo fee included', 'Video available on request'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-12',
    category: 'alquiler',
    title: 'Casa Full Amoblada con Doble Portón Eléctrico',
    location: 'San Juan de Dios, Desamparados',
    price: 400000,
    priceLabel: '₡400,000 / mes',
    beds: 2,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/645717501_913650304731401_345112908962944558_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=110&ig_cache_key=Mzg0MzQ1NDkwNDgyOTAyMTIyMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=ilyd0nXlhMcQ7kNvwFH5L2u&_nc_oc=AdoSEswETLDDFIXzIIDZB9h4s3OqSmqumF-XizxGqbLzxvypYh752d3PPoInZmg_rTI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_Afx810yA0t_NiOfAT50Z4zGOs3FGdsWebiqLP_d1vHmtZA&oe=69D0B22C',
    details: ['Garaje para 2 vehículos', 'Doble portón eléctrico', 'Amplio cuarto de pilas', 'Walk-in clóset en patio'],
    badge: { text: 'SE RENTA', variant: 'primary' },
    translations: {
      en: {
        title: 'Fully Furnished House with Double Electric Gate',
        location: 'San Juan de Dios, Desamparados',
        priceLabel: 'CRC 400,000 / month',
        details: ['Garage for 2 vehicles', 'Double electric gate', 'Large laundry room', 'Outdoor walk-in closet'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-13',
    category: 'alquiler',
    title: 'Apartamento Esquinero con Walk-In Closet',
    location: 'Torres de Heredia, Barreal de Heredia',
    price: 850,
    priceLabel: '$850 USD / mes',
    beds: 1,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/631785649_1996695554589473_1121546415761597153_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=100&ig_cache_key=MzgzNDcwMzI2OTAyMTcyNDA1Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=aYewiFPEVgkQ7kNvwFWFfR8&_nc_oc=AdoTc7sEbcRURS7dvFdKZ7VxErDT5eJxWydKek7f7P6km_P5rxbh_CmefY1CW3fn7gc&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_AfzEkqvqbKx1NnQa-1G17QVAz-U6FXOM61scAVKiMrwEUA&oe=69D09E7E',
    details: ['Piso 11', 'Walk-in closet', '1 parqueo', 'Lavaseca', 'Piscina', 'Jacuzzi'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Corner Apartment with Walk-In Closet',
        location: 'Torres de Heredia, Barreal de Heredia',
        priceLabel: '$850 USD / month',
        details: ['11th floor', 'Walk-in closet', '1 parking space', 'Washer-dryer', 'Pool', 'Jacuzzi'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-14',
    category: 'alquiler',
    title: 'Apartamento de 2 Habitaciones con 2 Balcones',
    location: 'Torres de Heredia',
    price: 1350,
    priceLabel: '$1,350 USD / mes',
    beds: 2,
    baths: 2,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/628457702_2474867376597654_5421242908712196832_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=103&ig_cache_key=MzgzMjU4NzI0MDcxNTkyMTIzNg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=3Tte5Vs6s0cQ7kNvwGISFMZ&_nc_oc=AdpzSFy5DzqLulbptaJpexV1Mk6ZRAM-Gkpb-p8lfrJJ6K5pmosEwd4RtKG2HJQxeKs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_Afxjuakz5LHRRN8WXx1XDWCmL7NQn21eSHpyK5BxIDyv-A&oe=69D0A881',
    details: ['Full amoblado', 'Aires acondicionados', 'Línea blanca de alta gama', '2 balcones'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Two-Bedroom Apartment with Two Balconies',
        location: 'Torres de Heredia',
        priceLabel: '$1,350 USD / month',
        details: ['Fully furnished', 'Air conditioning', 'High-end appliances', '2 balconies'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-15',
    category: 'alquiler',
    title: 'Apartamento Full Amoblado con Balcón al Atardecer',
    location: 'Torres de Heredia, Barreal de Heredia',
    price: 1000,
    priceLabel: '$1,000 USD / mes',
    beds: 1,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/625194171_1950991449149372_1994253312298143210_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=110&ig_cache_key=MzgyMzcyNjAyMDc1NTgxNjkxMQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=fpVBZjI8Dm8Q7kNvwF_R-OO&_nc_oc=AdrQdkrtIbxdNA8I92UaK3DvgDLgUTWgfFLhRV1IY9L8-ZiLqGHSSP68XKAsjDfUMa4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_AfxulQ-zhVW_SR7FU8U9lyKZO_lYnqv6TUnnOOCq89D88Q&oe=69D0D15A',
    details: ['Full amoblado', 'Piso 12', 'Balcón', '1 parqueo', 'Recepción', 'Gimnasio'],
    badge: { text: 'SE RENTA', variant: 'primary' },
    translations: {
      en: {
        title: 'Fully Furnished Apartment with Sunset Balcony',
        location: 'Torres de Heredia, Barreal de Heredia',
        priceLabel: '$1,000 USD / month',
        details: ['Fully furnished', '12th floor', 'Balcony', '1 parking space', 'Reception', 'Gym'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-16',
    category: 'alquiler',
    title: 'Apartamento con Línea Blanca en Ubicación Privilegiada',
    location: 'Torres de Heredia',
    price: 430000,
    priceLabel: '₡430,000 / mes',
    beds: 1,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/626565499_3374413572723566_475184433930986093_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=108&ig_cache_key=MzgyMzAwMzM5NDU2MzQ1NTk1MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=Poxao8pu-yMQ7kNvwEcZ2Kh&_nc_oc=AdqMtq7hwPrGD8jyHWOK0eoX3qi-uV59ViMp_7UZ6EOY29BSXEuZ7Jr0hl4ivEex8dc&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_Afy1EM-qQ9EJPK3ITFq78E_c_OfVm1exaOMbZXYZjGkWtA&oe=69D0B4B4',
    details: ['4to piso', '1 parqueo bajo techo', 'Línea blanca completa', 'Blackout', 'Rooftop', 'Parqueo de visitas'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Apartment with Appliances in a Prime Location',
        location: 'Torres de Heredia',
        priceLabel: 'CRC 430,000 / month',
        details: ['4th floor', '1 covered parking space', 'Full appliance package', 'Blackout blinds', 'Rooftop', 'Visitor parking'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-17',
    category: 'venta',
    title: 'Casa de Dos Niveles en Condominio Francosta',
    location: 'Francosta, Ulloa de Heredia',
    price: 349000,
    priceLabel: '$349,000 USD',
    beds: 2,
    baths: 3,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/619882153_1259237512933290_5838787327923053255_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzgxNDQwMjIzNTgzNzc5ODc0MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=nGA5q_QO5gQQ7kNvwHu2bJV&_nc_oc=AdqO_6QfMNxHpHI_OYrrbue7z6DfqG2m9n8lseNBlU3_QvbGi4F9Qw2sOmyKLw-2TnI&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_AfwkqUs4Du835NVsA72_OhVF96sGjQ9FykvLc6i9AJHBTA&oe=69D0A287',
    details: ['Lote 372 m2', 'Construcción 258 m2', '2 niveles', 'A/C', 'Canchas de tenis', 'Cuota condominal ₡85 mil'],
    badge: { text: 'SE VENDE', variant: 'secondary' },
    translations: {
      en: {
        title: 'Two-Story Home in Francosta Condominium',
        location: 'Francosta, Ulloa de Heredia',
        priceLabel: '$349,000 USD',
        details: ['372 m2 lot', '258 m2 construction', '2 levels', 'A/C', 'Tennis courts', 'HOA fee CRC 85,000'],
        badgeText: 'FOR SALE',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-18',
    category: 'alquiler',
    title: 'Casa Full Amoblada en Condominio Blue Cariari',
    location: 'Condominio Blue Cariari',
    price: 1650,
    priceLabel: '$1,650 USD / mes',
    beds: 2,
    baths: 2,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/618141909_1560754941809275_2980667036061249249_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=100&ig_cache_key=MzgxMjI5ODQ2OTI2MTA0MzA0OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=zGanGeeDErgQ7kNvwH2V6yq&_nc_oc=Adpl_ctT4riJawJPzHHDREjP6sd_YUQZf6Hynqbkw6l6bgOt442MHYyT8mrE6WoytxY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_AfxABjBmyxSGCG42vcsrgxZqUExrcwPPtKXwZbenQOVRGg&oe=69D0B486',
    details: ['Full amoblada', 'Piscina', 'Cancha de tenis', 'BBQ', 'Gimnasio', 'Seguridad 24/7'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Fully Furnished House in Blue Cariari Condominium',
        location: 'Blue Cariari Condominium',
        priceLabel: '$1,650 USD / month',
        details: ['Fully furnished', 'Pool', 'Tennis court', 'BBQ area', 'Gym', '24/7 security'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-19',
    category: 'alquiler',
    title: 'Apartamento Full Amoblado en Primera Planta',
    location: 'Torres de Heredia',
    price: 1000,
    priceLabel: '$1,000 USD / mes',
    beds: 1,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/610688784_1949523352661462_303829292909878359_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=103&ig_cache_key=MzgwNjM4NTAxMzQ5MjEyNDk5Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=IRNcVXcR-_MQ7kNvwGGW5Ve&_nc_oc=AdpjrlRMS4jV4l6uS2Bqx9OfKL2KRo5PAZ_5cPhVKwXlls4KkQou8_9OsIYn5j3FjKY&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_Afyc-zw4kbfTvJhXxety0l6kLuUIEK8qJZStqF7FcEiscg&oe=69D0D309',
    details: ['Primera planta', 'Full amoblado', 'Piscina', 'Parqueo', 'BBQ', 'Lobby con recepción'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Fully Furnished Ground-Floor Apartment',
        location: 'Torres de Heredia',
        priceLabel: '$1,000 USD / month',
        details: ['Ground floor', 'Fully furnished', 'Pool', 'Parking', 'BBQ area', 'Lobby with reception'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-20',
    category: 'alquiler',
    title: 'Apartamento de 1 Habitación con Vista al Atardecer',
    location: 'Torres de Heredia, Barreal de Heredia',
    price: 430000,
    priceLabel: '₡430,000 / mes',
    beds: 1,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/609108858_1315757766906278_6603660266752824584_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=108&ig_cache_key=Mzc5OTQwNTAyNDk0MzEyNTU2OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=NTrutWVpUT0Q7kNvwHN-VHc&_nc_oc=AdrJDsK_MStd_osJXvT0uYapGxW12Xp1CMh4I-M1xPTi4AsPMv37xdYgkswPmB6Lqjs&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_Afwg4eG0h2BxxwzgGLah1KnAe8YKlKJc8zRNGSrXk4wt1A&oe=69D0ADE4',
    details: ['55m2 + 15m2 parqueo', 'Piso 8', 'Vista atardeceres', 'Lavaseca', 'Piscinas', 'Jacuzzis'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'One-Bedroom Apartment with Sunset View',
        location: 'Torres de Heredia, Barreal de Heredia',
        priceLabel: 'CRC 430,000 / month',
        details: ['55 m2 + 15 m2 parking', '8th floor', 'Sunset view', 'Washer-dryer', 'Pools', 'Jacuzzis'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-21',
    category: 'alquiler',
    title: 'Apartamento Full Amoblado con Vista al Bosque',
    location: 'Torres de Heredia, Barreal de Heredia',
    price: 900,
    priceLabel: '$900 USD / mes',
    beds: 1,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/608229985_3110326062503309_1440364455107456926_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=100&ig_cache_key=Mzc5OTExOTgxMTY3NTUwMTg0MQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=ipPmV2kC2l0Q7kNvwE7hEOF&_nc_oc=Adq2hLR6gZSPeE1crPyLtrb3UxfqgShJoqisVP08O07Vhht6-AsDejia-eqD0sfkd54&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_AfzK2q6qkLRjxOhOCzI2dk_YybWAGYKJtYzyOPCRfQz-lQ&oe=69D09E8A',
    details: ['55 m2 + 15 m2 de parqueo', 'Piso 2', 'Vista al bosque', 'Se acepta mascota pequeña', 'Piscinas', 'Gimnasio'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Fully Furnished Apartment with Forest View',
        location: 'Torres de Heredia, Barreal de Heredia',
        priceLabel: '$900 USD / month',
        details: ['55 m2 + 15 m2 parking', '2nd floor', 'Forest view', 'Small pets allowed', 'Pools', 'Gym'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-22',
    category: 'alquiler',
    title: 'Apartamento Tipo Estudio Full Amoblado',
    location: 'Torres de Heredia, Barreal de Heredia',
    price: 800,
    priceLabel: '$800 USD / mes',
    beds: 1,
    baths: 1,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/607008035_1423350502784156_4523889885533342773_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=104&ig_cache_key=Mzc5NzcyMTA2MDYxNjU1NDE5MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=ShOldExei1QQ7kNvwHW7fdA&_nc_oc=AdqYoEdDmJkZ6G0CyiCB1DVzIijjHcWepO0F8dWSoTpghRZiYD1gsqRlDTxKYavTwI8&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_Afy93ReWy1UqI8WI3e2LlcDmoSO317UGseGaAnSpVIWT0g&oe=69D0A599',
    details: ['Tipo estudio', '40 m2 + 15 m2 de parqueo', 'Piso 6', 'Vista a la piscina', 'Aire acondicionado', 'No mascotas'],
    badge: { text: 'SE ALQUILA', variant: 'primary' },
    translations: {
      en: {
        title: 'Fully Furnished Studio Apartment',
        location: 'Torres de Heredia, Barreal de Heredia',
        priceLabel: '$800 USD / month',
        details: ['Studio layout', '40 m2 + 15 m2 parking', '6th floor', 'Pool view', 'Air conditioning', 'No pets'],
        badgeText: 'FOR RENT',
      },
    },
    ...leadDefaults,
  },
  {
    id: 'prop-23',
    category: 'bodegas',
    title: 'Bodegas Cerca del Aeropuerto Juan Santamaría',
    location: 'A la par del Aeropuerto Juan Santamaría',
    price: 800,
    priceLabel: 'Desde $800 USD / mes',
    beds: 0,
    baths: 0,
    image: 'https://instagram.fsyq8-1.fna.fbcdn.net/v/t51.71878-15/601785473_25547681771536870_8168317921271865437_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=104&ig_cache_key=Mzc5MTMzMTI0ODExMjIyMDY2OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjY0MHgxMTM2LnNkci5DMyJ9&_nc_ohc=clfz48Mo6T0Q7kNvwHt7Wax&_nc_oc=AdrFrR7Ft2ab091xlVyWPC38fJbmZNxBl5A1-II7ZUtyPkqInsvIwwrXwh9Od8URNNw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fsyq8-1.fna&_nc_gid=Y9SX9wY0eIrgHrgyoTgG6Q&_nc_ss=7a32e&oh=00_Afxr-3FkC3YQjXCJL4sVWFFsbesS9OfDFUl1qDpDlgs-ZQ&oe=69D0B0DC',
    details: ['3 bodegas disponibles', '90 m2 a 100 m2', 'Incluye agua y luz', 'Portón eléctrico', 'Lugar privado', 'Con seguridad'],
    badge: { text: 'SE ALQUILAN', variant: 'tertiary' },
    translations: {
      en: {
        title: 'Warehouses Near Juan Santamaria Airport',
        location: 'Next to Juan Santamaria Airport',
        priceLabel: 'From $800 USD / month',
        details: ['3 warehouses available', '90 m2 to 100 m2', 'Water and electricity included', 'Electric gate', 'Private location', 'Security'],
        badgeText: 'FOR LEASE',
      },
    },
    ...leadDefaults,
  },
];

export const featuredProperties: Property[] = [
  allProperties[0],
  allProperties[1],
  allProperties[2],
  allProperties[3],
];

export const catalogProperties: Property[] = allProperties;

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
