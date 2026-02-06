import type { NetworkWithStations } from '@/types';
import { BASE_URL } from '@/lib/constants';

interface JsonLdProps {
  network?: NetworkWithStations;
}

export function JsonLd({ network }: JsonLdProps) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CycleMap',
    applicationCategory: 'TravelApplication',
    operatingSystem: 'Web',
    description: 'Explore bicycle sharing networks around the world',
    url: BASE_URL,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const networkSchema = network
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${BASE_URL}/network/${network.id}`,
        name: network.name,
        description: `Bike sharing network in ${network.location.city}, ${network.location.country}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: network.location.city,
          addressCountry: network.location.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: network.location.latitude,
          longitude: network.location.longitude,
        },
        url: `${BASE_URL}/network/${network.id}`,
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }}
      />
      {networkSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(networkSchema) }}
        />
      )}
    </>
  );
}
