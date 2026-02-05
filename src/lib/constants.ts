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
} as const;

export const CLUSTER_CONFIG = {
  MAX_ZOOM: 14, // Stop clustering at this zoom level
  RADIUS: 50, // Cluster radius in pixels
  ZOOM_ANIMATION_DURATION: 500, // ms for zoom animation when clicking cluster
  // Grenadier color scale - darker = more networks
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
  // Torea-bay color scale for stations
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

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
} as const;

export const NETWORK_CARD = {
  MAX_VISIBLE_COMPANIES: 2,
} as const;

export const USE_URL_PARAMS = {
  DEBOUNCE_MS: 300,
} as const;
