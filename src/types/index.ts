// ============================================
// API Response Types
// ============================================

export interface NetworksResponse {
  networks: Network[];
}

export interface NetworkDetailResponse {
  network: NetworkWithStations;
}

// ============================================
// Core Types
// ============================================

export interface Network {
  id: string;
  name: string;
  href: string;
  location: Location;
  company: string[];
  gbfs_href?: string;
}

export interface NetworkWithStations extends Network {
  stations: Station[];
  ebikes?: boolean;
}

export interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  free_bikes: number;
  empty_slots: number | null;
  timestamp: string;
  extra?: Record<string, unknown>;
}

export interface Country {
  code: string;
  name: string;
}

// ============================================
// Filter Types
// ============================================

export interface NetworkFilters {
  country?: string;
  search?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface StationSort {
  field: 'free_bikes' | 'empty_slots';
  direction: SortDirection;
}

// ============================================
// Component Props Types
// ============================================

export interface NetworkCardProps {
  network: Network;
  isActive?: boolean;
}

export interface NetworkListProps {
  networks: Network[];
  isLoading?: boolean;
}

export interface NetworkFiltersProps {
  countries: Country[];
  initialCountry?: string;
  initialSearch?: string;
}

export interface MapContainerProps {
  networks: Network[];
  onNetworkSelect?: (networkId: string) => void;
  selectedNetworkId?: string;
}

export interface StationsTableProps {
  stations: Station[];
  isLoading?: boolean;
}

export interface MapPopupProps {
  station: Station;
  onClose: () => void;
}

// Geolocation Types
// ============================================

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

export type GeolocationError =
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'NOT_SUPPORTED';

// ============================================
// Pagination Types
// ============================================

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  startIndex: number; // 1-indexed for display
  endIndex: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: PaginationInfo;
}
