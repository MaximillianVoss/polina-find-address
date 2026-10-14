export type Coordinates = { latitude: number; longitude: number };

// APIs can supply numbers or numeric strings; the native map needs numbers.
export function coordinates(latitude: unknown, longitude: unknown): Coordinates {
  const read = (value: unknown): number => {
    if (typeof value !== 'number' && typeof value !== 'string') {
      throw new Error('The geocoder returned invalid coordinates.');
    }
    if (typeof value === 'string' && value.trim() === '') {
      throw new Error('The geocoder returned empty coordinates.');
    }
    return Number(value);
  };
  const lat = read(latitude);
  const lon = read(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
      Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error('The geocoder returned coordinates outside the allowed range.');
  }
  return { latitude: lat, longitude: lon };
}
