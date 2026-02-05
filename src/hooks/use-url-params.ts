'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import type { NetworkFilters } from '@/types';
import { USE_URL_PARAMS } from '@/lib/constants';
import { parsePageParam } from '@/lib/utils';

interface UrlParamsUpdate extends Partial<NetworkFilters> {
  page?: number;
}

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
    (updates: UrlParamsUpdate) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      // Don't include page=1 in URL (it's the default)
      if (params.get('page') === '1') {
        params.delete('page');
      }

      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : '/', { scroll: false });
    },
    [router, searchParams]
  );

  const setSearch = useDebouncedCallback((search: string) => {
    // Reset page to 1 when search changes
    updateParams({ search: search || undefined, page: undefined });
  }, USE_URL_PARAMS.DEBOUNCE_MS);

  const setCountry = useCallback(
    (country: string) => {
      // Reset page to 1 when country changes
      updateParams({ country: country || undefined, page: undefined });
    },
    [updateParams]
  );

  const setPage = useCallback(
    (page: number) => {
      updateParams({ page: page > 1 ? page : undefined });
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
    page: parsePageParam(searchParams.get('page')),
    setSearch,
    setCountry,
    setPage,
    clearFilters,
  };
}
