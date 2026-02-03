'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useUrlParams } from '@/hooks/use-url-params';

interface NetworkFiltersProps {
  countries: string[];
}

export function NetworkFilters({ countries }: NetworkFiltersProps) {
  const { searchValue, countryValue, setSearch, setCountry } = useUrlParams();
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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(e.target.value);
  };

  return (
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
      <Select
        value={countryValue}
        onChange={handleCountryChange}
        showLocationIcon
        aria-label="Filter by country"
      >
        <option value="">Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </Select>
    </div>
  );
}
