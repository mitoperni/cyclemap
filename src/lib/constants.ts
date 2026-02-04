export const API_BASE = 'https://api.citybik.es/v2';

export const CACHE_TIMES = {
  NETWORKS: 300, // 5 minutes
  NETWORK_DETAIL: 60, // 1 minute
} as const;

export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 40.4168, lng: -3.7038 }, // Madrid
  DEFAULT_ZOOM: 2,
  DETAIL_ZOOM: 13,
  MIN_ZOOM: 1,
  MAX_ZOOM: 18,
  FIT_BOUNDS_PADDING: 50,
  FIT_BOUNDS_MAX_ZOOM: 12,
  ANIMATION_DURATION: 1500,
} as const;

export const MAPBOX_CONFIG = {
  STYLE: 'mapbox://styles/mapbox/light-v11',
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
