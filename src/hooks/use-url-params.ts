'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import type { NetworkFilters } from '@/types';
import { USE_URL_PARAMS } from '@/lib/constants';

export function useUrlParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getFilters = useCallback((): NetworkFilters => {
    return {
      country: searchParams.get('country') || undefined,
      search: searchParams.get('search') || undefined,
    };
  }, [searchParams]);

  const updateParams = useCallback(
    (updates: Partial<NetworkFilters>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : '/', { scroll: false });
    },
    [router, searchParams]
  );

  const setSearch = useDebouncedCallback((search: string) => {
    updateParams({ search: search || undefined });
  }, USE_URL_PARAMS.DEBOUNCE_MS);

  const setCountry = useCallback(
    (country: string) => {
      updateParams({ country: country || undefined });
    },
    [updateParams]
  );

  const clearFilters = useCallback(() => {
    router.push('/', { scroll: false });
  }, [router]);

  return {
    filters: getFilters(),
    searchValue: searchParams.get('search') || '',
    countryValue: searchParams.get('country') || '',
    setSearch,
    setCountry,
    clearFilters,
  };
}
