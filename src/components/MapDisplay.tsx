import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, RouteInfo } from '../types';

interface MapDisplayProps {
  locations: Location[];
  routeInfo: RouteInfo | null;
  mapStyle: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ locations, routeInfo, mapStyle }) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([0, 0], 2);
    }

    const map = mapRef.current;

    // Update map style based on settings
    const tileLayer = L.tileLayer(getMapStyleUrl(mapStyle), {
      attribution: getMapAttribution(mapStyle),
      maxZoom: 19,
    }).addTo(map);

    // Clear existing markers and polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // Add markers for each location
    locations.forEach((location, index) => {
      L.marker([location.lat, location.lon])
        .addTo(map)
        .bindPopup(`Location ${index + 1}: ${location.address}`);
    });

    // Draw polyline if there's route information
    if (routeInfo && routeInfo.coordinates.length > 1) {
      const polyline = L.polyline(routeInfo.coordinates, { color: 'blue', weight: 5 }).addTo(map);
      map.fitBounds(polyline.getBounds());
    } else if (locations.length >= 2) {
      const polyline = L.polyline(locations.map(loc => [loc.lat, loc.lon]), { color: 'red', weight: 3, dashArray: '5, 5' }).addTo(map);
      map.fitBounds(polyline.getBounds());
    } else if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lon], 13);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations, routeInfo, mapStyle]);

  return <div id="map" className="h-full w-full rounded-lg overflow-hidden shadow-md" />;
};

function getMapStyleUrl(style: string): string {
  switch (style) {
    case 'satellite':
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    case 'terrain':
      return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    default:
      return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  }
}

function getMapAttribution(style: string): string {
  switch (style) {
    case 'satellite':
      return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    case 'terrain':
      return 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
    default:
      return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  }
}

export default MapDisplay;