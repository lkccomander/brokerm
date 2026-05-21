import type { Property } from '../types';

export type PropertyCategoryFilter = 'todas' | 'alquiler' | 'venta' | 'bodegas';

export interface SearchLocationOption {
  value: string;
  label: string;
}

export interface SearchBudgetOption {
  value: string;
  label: string;
}

interface LocationPreset {
  key: string;
  labelEs: string;
  labelEn: string;
  keywords: string[];
}

const LOCATION_PRESETS: LocationPreset[] = [
  { key: 'alajuela', labelEs: 'Alajuela', labelEn: 'Alajuela', keywords: ['alajuela', 'juan santamaria', 'juan santamaría', 'aeropuerto', 'guacima', 'el coco', 'concasa', 'andalus', 'colinas del viento'] },
  { key: 'heredia', labelEs: 'Heredia', labelEn: 'Heredia', keywords: ['heredia', 'cariari', 'barreal', 'ulloa', 'francosta', 'torres san marino', 'torres de heredia', 'khaya ruta 1', 'khaya ruta uno', 'plaza torres de heredia', 'becariari', 'real cariari', 'blue cariari', 'lagunilla', 'san pablo', 'san francisco', 'mercedes', 'santo domingo', 'bellavista', 'malibu', 'oxigeno', 'oxígeno'] },
  { key: 'escazu', labelEs: 'Escazú', labelEn: 'Escazu', keywords: ['escazu', 'escazú'] },
  { key: 'desamparados', labelEs: 'Desamparados', labelEn: 'Desamparados', keywords: ['desamparados'] },
  { key: 'santa-ana', labelEs: 'Santa Ana', labelEn: 'Santa Ana', keywords: ['santa ana', 'villa real'] },
  { key: 'san-jose', labelEs: 'San José', labelEn: 'San Jose', keywords: ['san jose', 'san josé', 'sabana', 'nucleo sabana', 'núcleo sábana'] },
  { key: 'puntarenas', labelEs: 'Puntarenas', labelEn: 'Puntarenas', keywords: ['puntarenas'] },
  { key: 'ubicacion-por-confirmar', labelEs: 'Ubicación por Confirmar', labelEn: 'Location TBD', keywords: ['ubicacion por confirmar', 'ubicación por confirmar'] },
];

const BUDGET_THRESHOLDS = {
  alquiler: {
    USD: [800, 1000, 1500, 2000, 3000, 5000, 10000],
    CRC: [400000, 500000, 750000, 1000000],
  },
  venta: {
    USD: [100000, 150000, 200000, 300000, 500000],
    CRC: [50000000, 75000000, 100000000],
  },
  bodegas: {
    USD: [800, 1000, 1500, 2000, 3000],
    CRC: [400000, 500000, 750000, 1000000],
  },
} as const;

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function titleCaseWords(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function inferBudgetCurrency(property: Property) {
  const label = property.priceLabel?.trim() ?? '';
  if (label.includes('₡')) {
    return 'CRC' as const;
  }
  if (label.includes('$')) {
    return 'USD' as const;
  }
  return property.price >= 1000000 ? ('CRC' as const) : ('USD' as const);
}

function hasReasonableBudgetPrice(property: Property) {
  const currency = inferBudgetCurrency(property);
  const price = Number(property.price);
  if (!Number.isFinite(price) || price <= 0) {
    return false;
  }

  if (property.category === 'venta') {
    return currency === 'USD' ? price >= 50000 : price >= 10000000;
  }

  return currency === 'USD' ? price >= 300 : price >= 100000;
}

function formatBudgetAmount(amount: number, currency: 'USD' | 'CRC', isEnglish: boolean) {
  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US')} USD`;
  }

  if (amount >= 1000000) {
    const millions = Number((amount / 1000000).toFixed(1)).toString().replace(/\.0$/, '');
    return isEnglish ? `CRC ${millions}M` : `₡${millions} millones`;
  }

  if (amount >= 1000) {
    const thousands = Number((amount / 1000).toFixed(0)).toString();
    return isEnglish ? `CRC ${thousands}k` : `₡${thousands} mil`;
  }

  return currency === 'CRC' ? `₡${amount}` : `$${amount}`;
}

function looksLikeDescriptor(value: string) {
  const normalized = normalizeText(value);
  return [
    'piso',
    'planta',
    'vista',
    'incluyendo',
    'frente',
    'equipado',
    'garaje',
    'm2',
    'mts',
    'metros',
    'terraza',
    'sur',
    'norte',
    'este',
    'oeste',
  ].some((keyword) => normalized.includes(keyword));
}

function fallbackLocationFragment(location: string) {
  const parts = location
    .split(/[,\-–]/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) {
    return location.trim();
  }

  const candidate = parts.at(-1) ?? parts[0];
  if (looksLikeDescriptor(candidate) && parts[0]) {
    return parts[0];
  }

  if (candidate.split(/\s+/).length > 6 && parts[0]) {
    return parts[0];
  }

  return candidate;
}

export function inferSearchLocationKey(location: string) {
  const normalized = normalizeText(location);

  for (const preset of LOCATION_PRESETS) {
    if (preset.keywords.some((keyword) => normalized.includes(normalizeText(keyword)))) {
      return preset.key;
    }
  }

  const compact = fallbackLocationFragment(location);
  return normalizeText(compact).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'ubicacion-por-confirmar';
}

export function inferSearchLocationLabel(location: string, isEnglish: boolean) {
  const key = inferSearchLocationKey(location);
  const preset = LOCATION_PRESETS.find((item) => item.key === key);
  if (preset) {
    return isEnglish ? preset.labelEn : preset.labelEs;
  }

  const compact = fallbackLocationFragment(location);
  return titleCaseWords(compact || (isEnglish ? 'Location TBD' : 'Ubicacion por confirmar'));
}

export function buildLocationOptions(
  properties: Property[],
  category: Exclude<PropertyCategoryFilter, 'todas'>,
  isEnglish: boolean,
): SearchLocationOption[] {
  const options = new Map<string, string>();

  properties
    .filter((property) => property.category === category && property.status === 'disponible')
    .forEach((property) => {
      const key = property.searchLocationKey?.trim() || inferSearchLocationKey(property.location);
      const label = inferSearchLocationLabel(property.location, isEnglish);
      if (!options.has(key)) {
        options.set(key, label);
      }
    });

  const dynamicOptions = Array.from(options.entries())
    .map(([value, label]) => ({ value, label }))
    .sort((left, right) => left.label.localeCompare(right.label, 'es'));

  return [
    { value: 'todas', label: isEnglish ? 'All locations' : 'Todas las ubicaciones' },
    ...dynamicOptions,
  ];
}

export function buildBudgetOptions(
  properties: Property[],
  category: Exclude<PropertyCategoryFilter, 'todas'>,
  isEnglish: boolean,
): SearchBudgetOption[] {
  const available = properties.filter(
    (property) => property.category === category && property.status === 'disponible' && hasReasonableBudgetPrice(property)
  );

  const options: SearchBudgetOption[] = [{ value: 'todas', label: isEnglish ? 'All budgets' : 'Todos los presupuestos' }];

  (['USD', 'CRC'] as const).forEach((currency) => {
    const prices = available
      .filter((property) => inferBudgetCurrency(property) === currency)
      .map((property) => Number(property.price))
      .filter((price) => Number.isFinite(price) && price > 0);

    if (!prices.length) {
      return;
    }

    BUDGET_THRESHOLDS[category][currency].forEach((threshold) => {
      if (!prices.some((price) => price <= threshold)) {
        return;
      }

      options.push({
        value: `${currency.toLowerCase()}-${threshold}`,
        label: isEnglish
          ? `Up to ${formatBudgetAmount(threshold, currency, isEnglish)}`
          : `Hasta ${formatBudgetAmount(threshold, currency, isEnglish)}`,
      });
    });
  });

  return options;
}

export function isCatalogCategoryFilter(value: string): value is PropertyCategoryFilter {
  return value === 'todas' || value === 'alquiler' || value === 'venta' || value === 'bodegas';
}

export function matchesSearchLocation(property: Property, locationKey: string) {
  if (!locationKey || locationKey === 'todas') {
    return true;
  }

  return (property.searchLocationKey?.trim() || inferSearchLocationKey(property.location)) === locationKey;
}

export function matchesBudget(property: Property, budgetValue: string) {
  if (!budgetValue || budgetValue === 'todas') {
    return true;
  }

  const [currencyKey, thresholdRaw] = budgetValue.split('-');
  const threshold = Number(thresholdRaw);
  if (!currencyKey || !Number.isFinite(threshold) || threshold <= 0) {
    return true;
  }

  const propertyCurrency = inferBudgetCurrency(property).toLowerCase();
  if (propertyCurrency !== currencyKey.toLowerCase()) {
    return false;
  }

  return hasReasonableBudgetPrice(property) && Number(property.price) <= threshold;
}
