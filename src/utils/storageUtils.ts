import { Location } from '../types';

const ROUTES_STORAGE_KEY = 'savedRoutes';

export function saveRoute(name: string, locations: Location[]): void {
  const savedRoutes = JSON.parse(localStorage.getItem(ROUTES_STORAGE_KEY) || '{}');
  savedRoutes[name] = locations;
  localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(savedRoutes));
}

export function loadRoute(name: string): Location[] | null {
  const savedRoutes = JSON.parse(localStorage.getItem(ROUTES_STORAGE_KEY) || '{}');
  return savedRoutes[name] || null;
}

export function getSavedRoutes(): string[] {
  const savedRoutes = JSON.parse(localStorage.getItem(ROUTES_STORAGE_KEY) || '{}');
  return Object.keys(savedRoutes);
}