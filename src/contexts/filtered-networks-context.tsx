'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { filterNetworks } from '@/lib/api/networks';
import type { Network } from '@/types';

interface FilteredNetworksContextValue {
  networks: Network[];
  filteredNetworks: Network[];
  searchValue: string;
  countryValue: string;
}

const FilteredNetworksContext = createContext<FilteredNetworksContextValue | null>(null);

interface FilteredNetworksProviderProps {
  networks: Network[];
  children: ReactNode;
}

export function FilteredNetworksProvider({ networks, children }: FilteredNetworksProviderProps) {
  const searchParams = useSearchParams();

  const searchValue = searchParams.get('search') || '';
  const countryValue = searchParams.get('country') || '';

  const filteredNetworks = useMemo(() => {
    if (!countryValue && !searchValue) {
      return networks;
    }

    return filterNetworks(networks, {
      country: countryValue || undefined,
      search: searchValue || undefined,
    });
  }, [networks, countryValue, searchValue]);

  const value = useMemo(
    () => ({
      networks,
      filteredNetworks,
      searchValue,
      countryValue,
    }),
    [networks, filteredNetworks, searchValue, countryValue]
  );

  return (
    <FilteredNetworksContext.Provider value={value}>{children}</FilteredNetworksContext.Provider>
  );
}

export function useFilteredNetworks(): FilteredNetworksContextValue {
  const context = useContext(FilteredNetworksContext);

  if (!context) {
    throw new Error('useFilteredNetworks must be used within a FilteredNetworksProvider');
  }

  return context;
}
