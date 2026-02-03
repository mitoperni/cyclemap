'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { NetworkList } from './network-list';
import { NetworksIntro } from './networks-intro';
import { filterNetworks } from '@/lib/api/networks';
import { USE_URL_PARAMS } from '@/lib/constants';
import type { Network } from '@/types';

interface NetworkSidebarProps {
  networks: Network[];
  countries: string[];
}

export function NetworkSidebar({ networks, countries }: NetworkSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current values from URL (source of truth for persistence)
  const urlSearch = searchParams.get('search') || '';
  const urlCountry = searchParams.get('country') || '';

  // Local state for instant input feedback (only for search, as it needs debounce)
  // Key trick: use urlSearch as the key to reset local state when URL changes externally
  const [localSearch, setLocalSearch] = useState(urlSearch);

  // Reset local search when URL changes externally (e.g., browser back/forward)
  // This is done by comparing with URL and resetting if they diverge after debounce settles
  const searchValue = localSearch;
  const countryValue = urlCountry;

  // Filter networks locally with useMemo - instant filtering!
  const filteredNetworks = useMemo(() => {
    return filterNetworks(networks, {
      search: searchValue || undefined,
      country: countryValue || undefined,
    });
  }, [networks, searchValue, countryValue]);

  // Debounced URL update - only for bookmarking/sharing
  const updateUrl = useDebouncedCallback((newSearch: string, newCountry: string) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newCountry) params.set('country', newCountry);

    const queryString = params.toString();
    router.replace(queryString ? `?${queryString}` : '/', { scroll: false });
  }, USE_URL_PARAMS.DEBOUNCE_MS);

  // Handle search input change - instant local state + debounced URL
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setLocalSearch(value);
      updateUrl(value, countryValue);
    },
    [countryValue, updateUrl]
  );

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    updateUrl('', countryValue);
  }, [countryValue, updateUrl]);

  // Handle country change - immediate URL update (no need for local state)
  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      // For country, update URL immediately (no debounce needed for select)
      const params = new URLSearchParams();
      if (searchValue) params.set('search', searchValue);
      if (value) params.set('country', value);

      const queryString = params.toString();
      router.replace(queryString ? `?${queryString}` : '/', { scroll: false });
    },
    [router, searchValue]
  );

  return (
    <div className="flex flex-col gap-6">
      <NetworksIntro />

      {/* Filters */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search network"
          value={searchValue}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          showSearchIcon
          aria-label="Search networks by name or company"
        />
        <Select
          value={countryValue}
          onChange={handleCountryChange}
          showLocationIcon
          aria-label="Filter by country"
        >
          <option value="">Country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </div>

      {/* Network list - receives already filtered data */}
      <NetworkList networks={filteredNetworks} />
    </div>
  );
}
