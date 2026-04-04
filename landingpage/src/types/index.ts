// src/types/index.ts

export interface Property {
  id: string;
  title: string;
  location: string;
  category?: 'alquiler' | 'venta' | 'bodegas';
  status?: 'disponible' | 'rentada' | 'vendida';
  featured?: boolean;
  price: number;
  priceLabel?: string;
  beds: number;
  baths: number;
  image: string;
  embedUrl?: string;
  sourceUrl?: string;
  details?: string[];
  contactPhone?: string;
  inquiryEnabled?: boolean;
  inquirySource?: string;
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'tertiary';
  };
  translations?: {
    en?: {
      title?: string;
      location?: string;
      priceLabel?: string;
      details?: string[];
      badgeText?: string;
    };
  };
}

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  image?: string;
  rating: number;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  icon: string;
  trend?: string;
  trendValue?: string;
  subtitle?: string;
  iconBg: string;
  iconColor: string;
}

export interface NavLink {
  label: string;
  href: string;
}
