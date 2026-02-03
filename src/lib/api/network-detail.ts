import { NetworkDetailResponseSchema } from '@/lib/schemas/network';
import { API_BASE, CACHE_TIMES } from '@/lib/constants';
import type { NetworkWithStations } from '@/types';

export async function fetchNetworkDetail(
  networkId: string
): Promise<NetworkWithStations> {
  const response = await fetch(`${API_BASE}/networks/${networkId}`, {
    next: { revalidate: CACHE_TIMES.NETWORK_DETAIL },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch network: ${response.status}`);
  }

  const data = await response.json();
  const validated = NetworkDetailResponseSchema.parse(data);

  return validated.network;
}
