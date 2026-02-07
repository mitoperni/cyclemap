'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { Source, Layer, useMap } from 'react-map-gl/mapbox';
import type { MapMouseEvent } from 'react-map-gl/mapbox';
import type { Station } from '@/types';
import { STATION_CLUSTER_CONFIG } from '@/lib/constants';
import { StationPin } from './station-pin';

interface StationClusterMarkersProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationClick: (station: Station) => void;
}

function stationsToGeoJSON(stations: Station[]): GeoJSON.FeatureCollection<GeoJSON.Point> {
  return {
    type: 'FeatureCollection',
    features: stations.map((station) => ({
      type: 'Feature',
      id: station.id,
      geometry: {
        type: 'Point',
        coordinates: [station.longitude, station.latitude],
      },
      properties: {
        id: station.id,
        name: station.name,
        free_bikes: station.free_bikes,
        empty_slots: station.empty_slots,
      },
    })),
  };
}

interface UnclusteredStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  free_bikes: number;
  empty_slots: number | null;
}

export function StationClusterMarkers({
  stations,
  selectedStation,
  onStationClick,
}: StationClusterMarkersProps) {
  const { current: map } = useMap();
  const [unclusteredStations, setUnclusteredStations] = useState<UnclusteredStation[]>([]);

  const geojsonData = useMemo(() => stationsToGeoJSON(stations), [stations]);

  const stationLookup = useMemo(() => {
    const lookup = new Map<string, Station>();
    stations.forEach((station) => lookup.set(station.id, station));
    return lookup;
  }, [stations]);

  const updateUnclusteredStations = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    const features = map.querySourceFeatures('stations', {
      filter: ['!', ['has', 'point_count']],
    });

    const unclustered: UnclusteredStation[] = features
      .map((feature) => {
        const props = feature.properties;
        if (!props?.id) return null;

        const station = stationLookup.get(props.id);
        if (!station) return null;

        return {
          id: station.id,
          name: station.name,
          latitude: station.latitude,
          longitude: station.longitude,
          free_bikes: station.free_bikes,
          empty_slots: station.empty_slots,
        };
      })
      .filter((s): s is UnclusteredStation => s !== null);

    const uniqueStations = Array.from(new Map(unclustered.map((s) => [s.id, s])).values());

    setUnclusteredStations(uniqueStations);
  }, [map, stationLookup]);

  useEffect(() => {
    if (!map) return;

    let rafId: number | null = null;

    const handleUpdate = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateUnclusteredStations);
    };

    map.on('moveend', handleUpdate);
    map.on('zoomend', handleUpdate);
    map.on('sourcedata', handleUpdate);
    map.on('style.load', handleUpdate);

    if (map.isStyleLoaded()) {
      handleUpdate();
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      map.off('moveend', handleUpdate);
      map.off('zoomend', handleUpdate);
      map.off('sourcedata', handleUpdate);
      map.off('style.load', handleUpdate);
    };
  }, [map, updateUnclusteredStations]);

  const handleClusterClick = useCallback(
    (e: MapMouseEvent) => {
      if (!map || !map.isStyleLoaded()) return;

      const features = map.queryRenderedFeatures(e.point, {
        layers: [...STATION_CLUSTER_CONFIG.LAYER_IDS.CLUSTERS],
      });

      if (features.length === 0) return;

      const feature = features[0];
      const clusterId = feature.properties?.cluster_id;

      if (clusterId === undefined) return;

      const source = map.getSource('stations') as mapboxgl.GeoJSONSource;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom == null) return;

        const geometry = feature.geometry as GeoJSON.Point;
        map.easeTo({
          center: geometry.coordinates as [number, number],
          zoom: zoom,
          duration: STATION_CLUSTER_CONFIG.ZOOM_ANIMATION_DURATION,
        });
      });
    },
    [map]
  );

  const handleMouseEnter = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = 'pointer';
    }
  }, [map]);

  const handleMouseLeave = useCallback(() => {
    if (map) {
      map.getCanvas().style.cursor = '';
    }
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const layers = STATION_CLUSTER_CONFIG.LAYER_IDS.CLUSTERS;

    layers.forEach((layerId) => {
      map.on('click', layerId, handleClusterClick);
      map.on('mouseenter', layerId, handleMouseEnter);
      map.on('mouseleave', layerId, handleMouseLeave);
    });

    return () => {
      layers.forEach((layerId) => {
        map.off('click', layerId, handleClusterClick);
        map.off('mouseenter', layerId, handleMouseEnter);
        map.off('mouseleave', layerId, handleMouseLeave);
      });
    };
  }, [map, handleClusterClick, handleMouseEnter, handleMouseLeave]);

  const handleStationClick = useCallback(
    (station: UnclusteredStation) => {
      const fullStation = stationLookup.get(station.id);
      if (fullStation) {
        onStationClick(fullStation);
      }
    },
    [stationLookup, onStationClick]
  );

  return (
    <>
      <Source
        id="stations"
        type="geojson"
        data={geojsonData}
        cluster={true}
        clusterMaxZoom={STATION_CLUSTER_CONFIG.MAX_ZOOM}
        clusterRadius={STATION_CLUSTER_CONFIG.RADIUS}
      >
        {/* Clustered circles - large clusters (20+) */}
        <Layer
          id="station-clusters-large"
          type="circle"
          filter={['all', ['has', 'point_count'], ['>=', ['get', 'point_count'], 20]]}
          paint={{
            'circle-color': STATION_CLUSTER_CONFIG.COLORS.LARGE,
            'circle-radius': 28,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />

        {/* Clustered circles - medium clusters (5-19) */}
        <Layer
          id="station-clusters-medium"
          type="circle"
          filter={[
            'all',
            ['has', 'point_count'],
            ['>=', ['get', 'point_count'], 5],
            ['<', ['get', 'point_count'], 20],
          ]}
          paint={{
            'circle-color': STATION_CLUSTER_CONFIG.COLORS.MEDIUM,
            'circle-radius': 22,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />

        {/* Clustered circles - small clusters (<5) */}
        <Layer
          id="station-clusters-small"
          type="circle"
          filter={['all', ['has', 'point_count'], ['<', ['get', 'point_count'], 5]]}
          paint={{
            'circle-color': STATION_CLUSTER_CONFIG.COLORS.SMALL,
            'circle-radius': 16,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          }}
        />

        {/* Cluster count labels */}
        <Layer
          id="station-cluster-count"
          type="symbol"
          filter={['has', 'point_count']}
          layout={{
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 11,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': '#ffffff',
          }}
        />
      </Source>

      {/* Individual station pins */}
      {unclusteredStations.map((station) => {
        const fullStation = stationLookup.get(station.id);
        if (!fullStation) return null;

        return (
          <StationPin
            key={station.id}
            station={fullStation}
            isSelected={selectedStation?.id === station.id}
            onClick={() => handleStationClick(station)}
          />
        );
      })}
    </>
  );
}
