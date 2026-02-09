'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { Source, Layer, useMap } from 'react-map-gl/mapbox';
import type { Network } from '@/types';
import { CLUSTER_CONFIG } from '@/lib/constants';
import { NetworkPin } from './network-pin';

interface ClusterMarkersProps {
  networks: Network[];
  onNetworkClick: (networkId: string) => void;
}

function networksToGeoJSON(networks: Network[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: networks.map((network) => ({
      type: 'Feature',
      id: network.id,
      geometry: {
        type: 'Point',
        coordinates: [network.location.longitude, network.location.latitude],
      },
      properties: {
        id: network.id,
        name: network.name,
        city: network.location.city,
        country: network.location.country,
      },
    })),
  };
}

interface UnclusteredNetwork {
  id: string;
  name: string;
  city: string;
  longitude: number;
  latitude: number;
}

export function ClusterMarkers({ networks, onNetworkClick }: ClusterMarkersProps) {
  const { current: map } = useMap();
  const [unclusteredNetworks, setUnclusteredNetworks] = useState<UnclusteredNetwork[]>([]);

  const geojsonData = useMemo(() => networksToGeoJSON(networks), [networks]);

  const networkLookup = useMemo(() => {
    const lookup = new Map<string, Network>();
    networks.forEach((network) => lookup.set(network.id, network));
    return lookup;
  }, [networks]);

  const updateUnclusteredNetworks = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    const features = map.querySourceFeatures('networks', {
      filter: ['!', ['has', 'point_count']],
    });

    const unclustered: UnclusteredNetwork[] = features
      .map((feature) => {
        const props = feature.properties;
        if (!props?.id) return null;

        const network = networkLookup.get(props.id);
        if (!network) return null;

        return {
          id: network.id,
          name: network.name,
          city: network.location.city,
          longitude: network.location.longitude,
          latitude: network.location.latitude,
        };
      })
      .filter((n): n is UnclusteredNetwork => n !== null);

    const uniqueNetworks = Array.from(new Map(unclustered.map((n) => [n.id, n])).values());

    setUnclusteredNetworks(uniqueNetworks);
  }, [map, networkLookup]);

  useEffect(() => {
    if (!map) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let rafId: number | null = null;

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateUnclusteredNetworks();
      });
    };

    const immediateUpdate = () => {
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      scheduleUpdate();
    };

    const debouncedUpdate = () => {
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;
        scheduleUpdate();
      }, 100);
    };

    map.on('moveend', immediateUpdate);
    map.on('sourcedata', debouncedUpdate);
    map.on('style.load', immediateUpdate);

    if (map.isStyleLoaded()) {
      scheduleUpdate();
    }

    return () => {
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      map.off('moveend', immediateUpdate);
      map.off('sourcedata', debouncedUpdate);
      map.off('style.load', immediateUpdate);
    };
  }, [map, updateUnclusteredNetworks]);

  return (
    <>
      <Source
        id="networks"
        type="geojson"
        data={geojsonData}
        cluster={true}
        clusterMaxZoom={CLUSTER_CONFIG.MAX_ZOOM}
        clusterRadius={CLUSTER_CONFIG.RADIUS}
      >
        {/* Clustered circles - large clusters (100+) */}
        <Layer
          id="clusters-large"
          type="circle"
          filter={['all', ['has', 'point_count'], ['>=', ['get', 'point_count'], 100]]}
          paint={{
            'circle-color': CLUSTER_CONFIG.COLORS.LARGE,
            'circle-radius': 30,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />

        {/* Clustered circles - medium clusters (10-99) */}
        <Layer
          id="clusters-medium"
          type="circle"
          filter={[
            'all',
            ['has', 'point_count'],
            ['>=', ['get', 'point_count'], 10],
            ['<', ['get', 'point_count'], 100],
          ]}
          paint={{
            'circle-color': CLUSTER_CONFIG.COLORS.MEDIUM,
            'circle-radius': 24,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />

        {/* Clustered circles - small clusters (<10) */}
        <Layer
          id="clusters-small"
          type="circle"
          filter={['all', ['has', 'point_count'], ['<', ['get', 'point_count'], 10]]}
          paint={{
            'circle-color': CLUSTER_CONFIG.COLORS.SMALL,
            'circle-radius': 18,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />

        {/* Cluster count labels */}
        <Layer
          id="cluster-count"
          type="symbol"
          filter={['has', 'point_count']}
          layout={{
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': '#ffffff',
          }}
        />
      </Source>

      {/* Individual network pins with tooltips */}
      {unclusteredNetworks.map((network) => (
        <NetworkPin
          key={network.id}
          id={network.id}
          name={network.name}
          city={network.city}
          longitude={network.longitude}
          latitude={network.latitude}
          onClick={onNetworkClick}
        />
      ))}
    </>
  );
}
