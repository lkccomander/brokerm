// src/types/index.ts

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  beds: number;
  baths: number;
  image: string;
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'tertiary';
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
