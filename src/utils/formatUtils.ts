export function formatDistance(meters: number, units: string): string {
  if (units === 'imperial') {
    const miles = meters / 1609.34;
    return `${miles.toFixed(1)} mi`;
  } else {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  } else {
    return `${minutes} min`;
  }
}