import { useEffect, useState } from 'react';
import type { CatalogBundle } from '../data/catalogData';
import { fallbackCatalogBundle } from '../data/catalogData';

const PUBLISHED_CATALOG_URL = '/assets/property-catalog.json';

export function usePublishedCatalog() {
  const [catalogBundle, setCatalogBundle] = useState<CatalogBundle>(fallbackCatalogBundle);

  useEffect(() => {
    let cancelled = false;

    const loadPublishedCatalog = async () => {
      try {
        const response = await fetch(PUBLISHED_CATALOG_URL, {
          cache: 'no-store',
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as Partial<CatalogBundle>;
        if (!payload || !Array.isArray(payload.catalogProperties) || !Array.isArray(payload.allProperties) || !Array.isArray(payload.featuredProperties)) {
          return;
        }

        if (!cancelled) {
          setCatalogBundle({
            allProperties: payload.allProperties,
            featuredProperties: payload.featuredProperties,
            catalogProperties: payload.catalogProperties,
            generatedAt: payload.generatedAt,
            source: payload.source ?? 'published-json',
          });
        }
      } catch {
        // Keep the in-repo fallback catalog when the published JSON is not available.
      }
    };

    void loadPublishedCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  return catalogBundle;
}
