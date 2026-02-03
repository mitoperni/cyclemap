import { NetworksResponseSchema } from '@/lib/schemas/network';
import { API_BASE, CACHE_TIMES } from '@/lib/constants';
import type { Network, NetworkFilters } from '@/types';

export async function fetchNetworks(): Promise<Network[]> {
  const response = await fetch(`${API_BASE}/networks`, {
    next: { revalidate: CACHE_TIMES.NETWORKS },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch networks: ${response.status}`);
  }

  const data = await response.json();
  const validated = NetworksResponseSchema.parse(data);

  return validated.networks;
}

export function filterNetworks(networks: Network[], filters: NetworkFilters): Network[] {
  let filtered = [...networks];

  if (filters.country) {
    filtered = filtered.filter((n) => n.location.country === filters.country);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        n.name.toLowerCase().includes(searchLower) ||
        n.company.some((c) => c.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
}
