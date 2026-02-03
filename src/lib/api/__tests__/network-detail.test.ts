import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchNetworkDetail } from '../network-detail';
import { API_BASE, CACHE_TIMES } from '@/lib/constants';

describe('fetchNetworkDetail', () => {
  const mockNetworkId = 'bicing';

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should fetch and parse network detail successfully', async () => {
    const mockResponse = {
      network: {
        id: 'bicing',
        name: 'Bicing',
        href: '/v2/networks/bicing',
        location: {
          city: 'Barcelona',
          country: 'ES',
          latitude: 41.3850639,
          longitude: 2.1734035,
        },
        company: ['Barcelona de Serveis Municipals, S.A. (BSM)'],
        ebikes: true,
        stations: [
          {
            id: 'station-1',
            name: 'Test Station',
            latitude: 41.4055198,
            longitude: 2.1622548,
            free_bikes: 5,
            empty_slots: 10,
            timestamp: '2026-02-02T20:00:00Z',
            extra: {
              uid: 106,
              online: true,
            },
          },
        ],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworkDetail(mockNetworkId);

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE}/networks/${mockNetworkId}`,
      {
        next: { revalidate: CACHE_TIMES.NETWORK_DETAIL },
      }
    );
    expect(result).toEqual(mockResponse.network);
    expect(result.ebikes).toBe(true);
    expect(result.stations).toHaveLength(1);
  });

  it('should fetch network detail without optional ebikes field', async () => {
    const mockResponse = {
      network: {
        id: 'test-network',
        name: 'Test Network',
        href: '/v2/networks/test-network',
        location: {
          city: 'Test City',
          country: 'TC',
          latitude: 0,
          longitude: 0,
        },
        company: ['Test Company'],
        stations: [],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworkDetail('test-network');

    expect(result.ebikes).toBeUndefined();
    expect(result.stations).toHaveLength(0);
  });

  it('should fetch network with gbfs_href field', async () => {
    const mockResponse = {
      network: {
        id: 'test-network',
        name: 'Test Network',
        href: '/v2/networks/test-network',
        location: {
          city: 'Test City',
          country: 'TC',
          latitude: 0,
          longitude: 0,
        },
        company: ['Test Company'],
        gbfs_href: 'https://example.com/gbfs.json',
        stations: [],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworkDetail('test-network');

    expect(result.gbfs_href).toBe('https://example.com/gbfs.json');
  });

  it('should handle stations with null empty_slots', async () => {
    const mockResponse = {
      network: {
        id: 'bicing',
        name: 'Bicing',
        href: '/v2/networks/bicing',
        location: {
          city: 'Barcelona',
          country: 'ES',
          latitude: 41.3850639,
          longitude: 2.1734035,
        },
        company: ['BSM'],
        stations: [
          {
            id: 'station-1',
            name: 'Test Station',
            latitude: 41.4055198,
            longitude: 2.1622548,
            free_bikes: 5,
            empty_slots: null,
            timestamp: '2026-02-02T20:00:00Z',
          },
        ],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworkDetail(mockNetworkId);

    expect(result.stations[0].empty_slots).toBeNull();
  });

  it('should handle stations with extra data', async () => {
    const mockResponse = {
      network: {
        id: 'bicing',
        name: 'Bicing',
        href: '/v2/networks/bicing',
        location: {
          city: 'Barcelona',
          country: 'ES',
          latitude: 41.3850639,
          longitude: 2.1734035,
        },
        company: ['BSM'],
        stations: [
          {
            id: 'station-1',
            name: 'Test Station',
            latitude: 41.4055198,
            longitude: 2.1622548,
            free_bikes: 5,
            empty_slots: 10,
            timestamp: '2026-02-02T20:00:00Z',
            extra: {
              uid: 106,
              online: true,
              has_ebikes: true,
              ebikes: 3,
              payment: ['key', 'creditcard'],
              'payment-terminal': true,
            },
          },
        ],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworkDetail(mockNetworkId);

    expect(result.stations[0].extra).toBeDefined();
    expect(result.stations[0].extra?.uid).toBe(106);
    expect(result.stations[0].extra?.has_ebikes).toBe(true);
    expect(result.stations[0].extra?.ebikes).toBe(3);
    expect(result.stations[0].extra?.payment).toEqual(['key', 'creditcard']);
  });

  it('should throw error when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(fetchNetworkDetail(mockNetworkId)).rejects.toThrow(
      'Failed to fetch network: 404'
    );
  });

  it('should throw error when response has invalid schema', async () => {
    const invalidResponse = {
      network: {
        id: 'bicing',
        // Missing required fields
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => invalidResponse,
    });

    await expect(fetchNetworkDetail(mockNetworkId)).rejects.toThrow();
  });

  it('should throw error when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchNetworkDetail(mockNetworkId)).rejects.toThrow(
      'Network error'
    );
  });

  it('should use correct cache revalidation time', async () => {
    const mockResponse = {
      network: {
        id: 'bicing',
        name: 'Bicing',
        href: '/v2/networks/bicing',
        location: {
          city: 'Barcelona',
          country: 'ES',
          latitude: 41.3850639,
          longitude: 2.1734035,
        },
        company: ['BSM'],
        stations: [],
      },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchNetworkDetail(mockNetworkId);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: { revalidate: CACHE_TIMES.NETWORK_DETAIL },
      })
    );
    expect(CACHE_TIMES.NETWORK_DETAIL).toBe(60); // Verify it's 1 minute
  });
});
