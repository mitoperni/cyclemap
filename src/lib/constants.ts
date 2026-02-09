export const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(
  /\/$/,
  ''
);

export const API_BASE = 'https://api.citybik.es/v2';

export const CACHE_TIMES = {
  NETWORKS: 300, // 5 minutes
  NETWORK_DETAIL: 60, // 1 minute
} as const;

export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 40.4168, lng: -3.7038 }, // Madrid
  DEFAULT_ZOOM: 2,
  DETAIL_ZOOM: 11,
  MIN_ZOOM: 1,
  MAX_ZOOM: 18,
  FIT_BOUNDS_PADDING: 50,
  FIT_BOUNDS_MAX_ZOOM: 12,
  ANIMATION_DURATION: 1500,
} as const;

export const MAPBOX_CONFIG = {
  STYLE: 'mapbox://styles/mapbox/light-v11',
  LANGUAGE: 'en',
} as const;

export const CLUSTER_CONFIG = {
  MAX_ZOOM: 14, // Stop clustering at this zoom level
  RADIUS: 50, // Cluster radius in pixels
  ZOOM_ANIMATION_DURATION: 500,
  COLORS: {
    SMALL: '#f37b44', // grenadier-400: < 10 points
    MEDIUM: '#de3e15', // grenadier-600: 10-99 points
    LARGE: '#942618', // grenadier-800: 100+ points
  },
  LAYER_IDS: {
    CLUSTERS: ['clusters-large', 'clusters-medium', 'clusters-small'] as const,
  },
} as const;

export const STATION_CLUSTER_CONFIG = {
  MAX_ZOOM: 16, // Stop clustering at higher zoom for station detail
  RADIUS: 40, // Slightly smaller radius for denser station maps
  ZOOM_ANIMATION_DURATION: 500,
  COLORS: {
    SMALL: '#5b7ec1', // torea-bay-400: < 5 stations
    MEDIUM: '#3956a3', // torea-bay-600: 5-19 stations
    LARGE: '#243a6e', // torea-bay-800: 20+ stations
  },
  LAYER_IDS: {
    CLUSTERS: [
      'station-clusters-large',
      'station-clusters-medium',
      'station-clusters-small',
    ] as const,
  },
} as const;

export const COUNTRY_SELECT = {
  CLEAR_INDEX: -2, // Virtual index for "All countries" option in keyboard navigation
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
} as const;

export const NETWORK_CARD = {
  MAX_VISIBLE_COMPANIES: 2,
} as const;

export const USE_URL_PARAMS = {
  DEBOUNCE_MS: 300,
} as const;

export const GEOLOCATION_CONFIG = {
  MANUAL_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  },
  NETWORK_ZOOM: 11,
  STATION_ZOOM: 16,
  ERROR_MESSAGES: {
    PERMISSION_DENIED:
      'Location access was denied. Please enable location permissions in your browser settings.',
    POSITION_UNAVAILABLE: 'Unable to determine your location. Please try again.',
    TIMEOUT: 'Location request timed out. Please try again.',
    NOT_SUPPORTED: 'Geolocation is not supported by your browser.',
  },
} as const;

export const STATION_NAME_PATTERNS = {
  // Matches numeric prefixes with optional letter suffix: "377 - ", "25A - ", "04. "
  // Excludes ordinal suffixes (1st, 2nd, 3rd, 4th) via negative lookahead
  NUMERIC_PREFIX: /^\d+(?!(?:st|nd|rd|th)\b)[A-Za-z]{0,2}[\s\-\.]+\s*/i,
  // Matches short uppercase code prefixes: "AUH - ", "NYC - "
  CODE_PREFIX: /^[A-Z]{2,4}\s*-\s*/,
  // Matches leading underscores
  LEADING_UNDERSCORES: /^_+/,
  // Matches any underscore (for replacing with spaces)
  UNDERSCORES: /_/g,
  // Matches multiple consecutive spaces
  MULTIPLE_SPACES: /\s{2,}/g,
  // Validates a strict roman numeral (I to MMMCMXCIX)
  ROMAN_NUMERAL: /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,
  // Lowercase particles: prepositions, articles and conjunctions (ES, FR, PT, EN, IT, DE, NL, CA)
  LOWERCASE_PARTICLES: new Set([
    'de',
    'del',
    'la',
    'las',
    'el',
    'los',
    'con',
    'y',
    'e',
    'o',
    'en',
    'al', // ES
    'du',
    'des',
    'le',
    'les',
    'et',
    'au',
    'aux', // FR
    'da',
    'do',
    'das',
    'dos',
    'na',
    'no',
    'nas',
    'nos', // PT
    'of',
    'the',
    'and',
    'at',
    'by',
    'for',
    'in',
    'on',
    'to', // EN
    'di',
    'il',
    'lo',
    'gli',
    'le',
    'della',
    'dello',
    'degli',
    'delle', // IT
    'der',
    'die',
    'das',
    'und',
    'von',
    'am',
    'im',
    'an', // DE
    'van',
    'het',
    'een', // NL
    'els',
    'amb', // CA
  ]),
} as const;

export const BREAKPOINTS = {
  XL: 1280, // Sidebar collapses below this width
} as const;

// Top popular bike sharing networks worldwide (2025-2026 data)
// Used for static generation at build time
export const POPULAR_NETWORK_IDS = [
  // North America
  'citi-bike-nyc',
  'capital-bikeshare',
  'divvy',
  'bay-wheels',
  'blue-bikes',
  'bixi-toronto',
  'citi-bike-miami',
  'indego',
  'biketown',
  'mobibikes',
  'ecobici',
  // Europe - Western
  'velib',
  'santander-cycles',
  'bicimad',
  'bicing',
  'bikemi',
  'velov',
  'velo-antwerpen',
  'dublinbikes',
  'gira',
  'valenbisi',
  // Europe - Central & Northern
  'citybikes-helsinki',
  'oslo-bysykkel',
  'bubi',
  // Asia-Pacific
  'youbike-taipei',
  'youbike-new-taipei',
  'docomo-cycle-tokyo',
  'docomo-cycle-osaka',
  'docomo-cycle-kyoto',
  'seoul-bike',
  'telofun',
  // Latin America
  'ecobici-buenos-aires',
  'bikesantiago',
  'bikerio',
  'citybike-lima',
] as const;
