import type { Property } from '../types';
import { allProperties, featuredProperties, catalogProperties } from './mockData';

export interface CatalogBundle {
  allProperties: Property[];
  featuredProperties: Property[];
  catalogProperties: Property[];
  generatedAt?: string;
  source?: string;
}

export const fallbackCatalogBundle: CatalogBundle = {
  allProperties,
  featuredProperties,
  catalogProperties,
  source: 'mockData',
};
