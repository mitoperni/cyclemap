export const API_BASE = 'https://api.citybik.es/v2';

export const CACHE_TIMES = {
  NETWORKS: 300, // 5 minutes
  NETWORK_DETAIL: 60, // 1 minute
} as const;

export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 40.4168, lng: -3.7038 }, // Madrid
  DEFAULT_ZOOM: 2,
  DETAIL_ZOOM: 13,
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
