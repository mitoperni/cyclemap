import { describe, it, expect } from 'vitest';
import {
  LocationSchema,
  NetworkSchema,
  StationSchema,
  NetworksResponseSchema,
  NetworkDetailResponseSchema,
} from '../network';

describe('LocationSchema', () => {
  it('should validate a valid location', () => {
    const validLocation = {
      city: 'Barcelona',
      country: 'ES',
      latitude: 41.3850639,
      longitude: 2.1734035,
    };

    const result = LocationSchema.parse(validLocation);
    expect(result).toEqual(validLocation);
  });

  it('should reject invalid location data', () => {
    const invalidLocation = {
      city: 'Barcelona',
      country: 'ES',
      latitude: 'not-a-number',
      longitude: 2.1734035,
    };

    expect(() => LocationSchema.parse(invalidLocation)).toThrow();
  });
});

describe('NetworkSchema', () => {
  it('should validate a network without optional fields', () => {
    const validNetwork = {
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
    };

    const result = NetworkSchema.parse(validNetwork);
    expect(result).toEqual(validNetwork);
  });

  it('should validate a network with gbfs_href', () => {
    const networkWithGbfs = {
      id: 'abu-dhabi-careem-bike',
      name: 'Abu Dhabi Careem BIKE',
      href: '/v2/networks/abu-dhabi-careem-bike',
      location: {
        city: 'Abu Dhabi',
        country: 'AE',
        latitude: 24.4866,
        longitude: 54.3728,
      },
      company: ['Careem'],
      gbfs_href: 'https://dubai.publicbikesystem.net/customer/gbfs/v2/en/gbfs.json',
    };

    const result = NetworkSchema.parse(networkWithGbfs);
    expect(result.gbfs_href).toBe('https://dubai.publicbikesystem.net/customer/gbfs/v2/en/gbfs.json');
  });

  it('should transform null company to empty array', () => {
    const networkWithNullCompany = {
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
    };

    const result = NetworkSchema.parse(networkWithNullCompany);
    expect(result.company).toEqual([]);
  });
});

describe('StationSchema', () => {
  it('should validate a station with all fields', () => {
    const validStation = {
      id: '00028670e3d01438515caba403ffd680',
      name: 'PL JOANIC - C / BRUNIQUER, 59',
      latitude: 41.4055198,
      longitude: 2.1622548,
      free_bikes: 6,
      empty_slots: 7,
      timestamp: '2026-02-02T20:22:30.986446+00:00Z',
      extra: {
        uid: 106,
        online: true,
        normal_bikes: 0,
        has_ebikes: true,
        ebikes: 6,
      },
    };

    const result = StationSchema.parse(validStation);
    expect(result).toEqual(validStation);
  });

  it('should validate a station with null empty_slots', () => {
    const stationWithNullSlots = {
      id: 'test-station',
      name: 'Test Station',
      latitude: 0,
      longitude: 0,
      free_bikes: 5,
      empty_slots: null,
      timestamp: '2026-02-02T20:00:00Z',
    };

    const result = StationSchema.parse(stationWithNullSlots);
    expect(result.empty_slots).toBeNull();
  });

  it('should validate a station without extra field', () => {
    const stationWithoutExtra = {
      id: 'test-station',
      name: 'Test Station',
      latitude: 0,
      longitude: 0,
      free_bikes: 5,
      empty_slots: 10,
      timestamp: '2026-02-02T20:00:00Z',
    };

    const result = StationSchema.parse(stationWithoutExtra);
    expect(result.extra).toBeUndefined();
  });
});

describe('NetworksResponseSchema', () => {
  it('should validate a networks response', () => {
    const validResponse = {
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
          gbfs_href: 'https://example.com/gbfs.json',
        },
      ],
    };

    const result = NetworksResponseSchema.parse(validResponse);
    expect(result.networks).toHaveLength(2);
    expect(result.networks[1].gbfs_href).toBe('https://example.com/gbfs.json');
  });

  it('should reject invalid networks response', () => {
    const invalidResponse = {
      networks: 'not-an-array',
    };

    expect(() => NetworksResponseSchema.parse(invalidResponse)).toThrow();
  });
});

describe('NetworkDetailResponseSchema', () => {
  it('should validate a network detail response with ebikes', () => {
    const validResponse = {
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
        ebikes: true,
        stations: [
          {
            id: 'station-1',
            name: 'Station 1',
            latitude: 41.4055198,
            longitude: 2.1622548,
            free_bikes: 5,
            empty_slots: 10,
            timestamp: '2026-02-02T20:00:00Z',
          },
        ],
      },
    };

    const result = NetworkDetailResponseSchema.parse(validResponse);
    expect(result.network.ebikes).toBe(true);
    expect(result.network.stations).toHaveLength(1);
  });

  it('should validate a network detail response without ebikes', () => {
    const responseWithoutEbikes = {
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

    const result = NetworkDetailResponseSchema.parse(responseWithoutEbikes);
    expect(result.network.ebikes).toBeUndefined();
  });
});
