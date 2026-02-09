import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchNetworks, filterNetworks } from '../networks';
import { API_BASE, CACHE_TIMES } from '@/lib/constants';
import type { Network } from '@/types';

describe('filterNetworks', () => {
  const mockNetworks: Network[] = [
    {
      id: 'bicing',
      name: 'Bicing',
      href: '/v2/networks/bicing',
      location: {
        city: 'Barcelona',
        country: 'ES',
        latitude: 41.3850639,
        longitude: 2.1734035,
      },
      company: ['Barcelona de Serveis Municipals, S.A. (BSM)', 'CESPA', 'PBSC'],
    },
    {
      id: 'velib',
      name: "Vélib' Métropole",
      href: '/v2/networks/velib',
      location: {
        city: 'Paris',
        country: 'FR',
        latitude: 48.8566,
        longitude: 2.3522,
      },
      company: ['Smovengo'],
    },
    {
      id: 'divvy',
      name: 'Divvy',
      href: '/v2/networks/divvy',
      location: {
        city: 'Chicago',
        country: 'US',
        latitude: 41.8781,
        longitude: -87.6298,
      },
      company: ['Lyft'],
    },
    {
      id: 'citybike-wien',
      name: 'Citybike Wien',
      href: '/v2/networks/citybike-wien',
      location: {
        city: 'Vienna',
        country: 'AT',
        latitude: 48.2082,
        longitude: 16.3738,
      },
      company: ['Gewista'],
    },
  ];

  it('should return all networks when no filters applied', () => {
    const result = filterNetworks(mockNetworks, {});
    expect(result).toHaveLength(4);
    expect(result).toEqual(mockNetworks);
  });

  describe('country filter', () => {
    it('should filter networks by country code', () => {
      const result = filterNetworks(mockNetworks, { country: 'ES' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('bicing');
      expect(result[0].location.country).toBe('ES');
    });

    it('should return empty array when no networks match country', () => {
      const result = filterNetworks(mockNetworks, { country: 'JP' });
      expect(result).toHaveLength(0);
    });

    it('should be case-sensitive for country codes', () => {
      const result = filterNetworks(mockNetworks, { country: 'fr' });
      expect(result).toHaveLength(0);
    });
  });

  describe('search filter', () => {
    it('should filter networks by name (case-insensitive)', () => {
      const result = filterNetworks(mockNetworks, { search: 'bicing' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('bicing');
    });

    it('should filter networks by name with uppercase search', () => {
      const result = filterNetworks(mockNetworks, { search: 'BICING' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('bicing');
    });

    it('should filter networks by partial name match', () => {
      const result = filterNetworks(mockNetworks, { search: 'bike' });
      expect(result).toHaveLength(1);
      expect(result.map((n) => n.id)).toContain('citybike-wien');
    });

    it('should filter networks by company name', () => {
      const result = filterNetworks(mockNetworks, { search: 'lyft' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('divvy');
    });

    it('should filter networks by partial company match', () => {
      const result = filterNetworks(mockNetworks, { search: 'BSM' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('bicing');
    });

    it('should return empty array when no networks match search', () => {
      const result = filterNetworks(mockNetworks, { search: 'nonexistent' });
      expect(result).toHaveLength(0);
    });

    it('should handle special characters in search', () => {
      const result = filterNetworks(mockNetworks, { search: 'vélib' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('velib');
    });
  });

  describe('combined filters', () => {
    it('should apply both country and search filters', () => {
      const networksWithMultipleInES: Network[] = [
        ...mockNetworks,
        {
          id: 'sevici',
          name: 'Sevici',
          href: '/v2/networks/sevici',
          location: {
            city: 'Seville',
            country: 'ES',
            latitude: 37.3886,
            longitude: -5.9823,
          },
          company: ['JCDecaux'],
        },
      ];

      const result = filterNetworks(networksWithMultipleInES, {
        country: 'ES',
        search: 'bicing',
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('bicing');
    });

    it('should return empty array when filters exclude all networks', () => {
      const result = filterNetworks(mockNetworks, {
        country: 'ES',
        search: 'lyft',
      });

      expect(result).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('should handle empty networks array', () => {
      const result = filterNetworks([], { search: 'test' });
      expect(result).toHaveLength(0);
    });

    it('should handle networks with empty company array', () => {
      const networksWithEmptyCompany: Network[] = [
        {
          id: 'test',
          name: 'Test Network',
          href: '/v2/networks/test',
          location: {
            city: 'Test City',
            country: 'TC',
            latitude: 0,
            longitude: 0,
          },
          company: [],
        },
      ];

      const result = filterNetworks(networksWithEmptyCompany, { search: 'test' });
      expect(result).toHaveLength(1);
    });

    it('should not mutate original networks array', () => {
      const originalLength = mockNetworks.length;
      filterNetworks(mockNetworks, { country: 'ES' });
      expect(mockNetworks).toHaveLength(originalLength);
    });

    it('should handle empty string search', () => {
      const result = filterNetworks(mockNetworks, { search: '' });
      expect(result).toHaveLength(4);
    });

    it('should handle whitespace-only search', () => {
      const result = filterNetworks(mockNetworks, { search: '   ' });
      expect(result).toHaveLength(0);
    });
  });
});

describe('fetchNetworks', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should fetch and parse networks successfully', async () => {
    const mockResponse = {
      networks: [
        {
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
        },
        {
          id: 'velib',
          name: 'Vélib',
          href: '/v2/networks/velib',
          location: {
            city: 'Paris',
            country: 'FR',
            latitude: 48.8566,
            longitude: 2.3522,
          },
          company: ['Smovengo'],
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworks();

    expect(global.fetch).toHaveBeenCalledWith(`${API_BASE}/networks`, {
      next: { revalidate: CACHE_TIMES.NETWORKS },
    });
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('bicing');
    expect(result[1].id).toBe('velib');
  });

  it('should fetch networks with optional gbfs_href field', async () => {
    const mockResponse = {
      networks: [
        {
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
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworks();

    expect(result[0].gbfs_href).toBe('https://example.com/gbfs.json');
  });

  it('should transform null company to empty array', async () => {
    const mockResponse = {
      networks: [
        {
          id: 'test-network',
          name: 'Test Network',
          href: '/v2/networks/test-network',
          location: {
            city: 'Test City',
            country: 'TC',
            latitude: 0,
            longitude: 0,
          },
          company: null,
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworks();

    expect(result[0].company).toEqual([]);
  });

  it('should throw error when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchNetworks()).rejects.toThrow('Failed to fetch networks: 500');
  });

  it('should throw error when response has invalid schema', async () => {
    const invalidResponse = {
      networks: [
        {
          id: 'bicing',
          // Missing required fields
        },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => invalidResponse,
    });

    await expect(fetchNetworks()).rejects.toThrow();
  });

  it('should throw error when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(fetchNetworks()).rejects.toThrow('Network error');
  });

  it('should use correct cache revalidation time', async () => {
    const mockResponse = {
      networks: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    await fetchNetworks();

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        next: { revalidate: CACHE_TIMES.NETWORKS },
      })
    );
    expect(CACHE_TIMES.NETWORKS).toBe(86400); // Verify it's 24 hours
  });

  it('should handle empty networks array', async () => {
    const mockResponse = {
      networks: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchNetworks();

    expect(result).toEqual([]);
  });
});
