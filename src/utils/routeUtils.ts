import axios from 'axios';
import { Location, RouteInfo, RouteStep } from '../types';

export async function geocodeAddress(address: string): Promise<Location> {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon, display_name } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon), address: display_name };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw new Error('Error geocoding address');
  }
}

export async function calculateRoute(locations: Location[], units: string): Promise<RouteInfo> {
  if (locations.length < 2) {
    throw new Error('At least two locations are required to calculate a route');
  }

  const waypoints = locations.map(point => `${point.lon},${point.lat}`).join(';');

  try {
    const response = await axios.get(`https://router.project-osrm.org/route/v1/driving/${waypoints}`, {
      params: {
        steps: true,
        geometries: 'geojson',
        overview: 'full',
      },
    });

    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const steps: RouteStep[] = route.legs.flatMap((leg: any) =>
        leg.steps.map((step: any) => ({
          instruction: step.maneuver.instruction,
          distance: step.distance,
          duration: step.duration,
        }))
      );

      return {
        totalDistance: route.distance,
        totalDuration: route.duration,
        coordinates: route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]),
        steps,
      };
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.error('Error calculating route:', error);
    throw new Error('Error calculating route');
  }
}