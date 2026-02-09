'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { CountrySelect } from '@/components/ui/country-select';
import { useUrlParams } from '@/hooks/use-url-params';
import { useSidebarContext } from '@/contexts/sidebar-context';

interface NetworkFiltersProps {
  countries: string[];
}

export function NetworkFilters({ countries }: NetworkFiltersProps) {
  const { searchValue, countryValue, setSearch, setCountry } = useUrlParams();
  const { close: closeSidebar, isLargeScreen } = useSidebarContext();
  const [localSearch, setLocalSearch] = useState(searchValue);

  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearch(value);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearch('');
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    if (!isLargeScreen && value) {
      closeSidebar();
    }
  };

  return (
    <div className="sticky top-0 bg-white py-2">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search network"
          value={localSearch}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          showSearchIcon
          aria-label="Search networks by name or company"
        />
        <CountrySelect
          value={countryValue}
          onChange={handleCountryChange}
          countries={countries}
          placeholder="Country"
        />
      </div>
    </div>
  );
}
