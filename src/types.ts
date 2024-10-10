export interface Location {
  lat: number;
  lon: number;
  address: string;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

export interface RouteInfo {
  totalDistance: number;
  totalDuration: number;
  coordinates: [number, number][];
  steps: RouteStep[];
}