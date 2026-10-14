export type GeocodedLocation = Readonly<{
  title: string;
  latitude: number;
  longitude: number;
}>;

export type AddressResult =
  | { readonly ok: true; readonly address: string }
  | { readonly ok: false; readonly error: string };

export type CoordinatesResult =
  | { readonly ok: true; readonly latitude: number; readonly longitude: number }
  | { readonly ok: false; readonly error: string };

export type GeocodeResult =
  | { readonly ok: true; readonly location: GeocodedLocation }
  | { readonly ok: false; readonly error: string };

export type FetchResponse = Readonly<{
  ok: boolean;
  json: () => Promise<unknown>;
}>;

export type FetchImplementation = (input: string) => Promise<FetchResponse>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseCoordinate(value: unknown, minimum: number, maximum: number): number | null {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : null;
}

export function normalizeAddress(value: unknown): AddressResult {
  if (typeof value !== 'string') {
    return { ok: false, error: 'Enter an address.' };
  }

  const address = value.trim();
  return address === ''
    ? { ok: false, error: 'Enter an address.' }
    : { ok: true, address };
}

export function parseCoordinates(location: unknown): CoordinatesResult {
  if (!isRecord(location)) {
    return { ok: false, error: 'The location has invalid coordinates.' };
  }

  const latitude = parseCoordinate(location.lat, -90, 90);
  const longitude = parseCoordinate(location.lon, -180, 180);
  return latitude === null || longitude === null
    ? { ok: false, error: 'The location has invalid coordinates.' }
    : { ok: true, latitude, longitude };
}

export async function geocodeAddress(
  address: string,
  apiKey: string | undefined,
  fetchImpl: FetchImplementation = fetch,
): Promise<GeocodeResult> {
  const normalizedApiKey = apiKey?.trim();
  if (!normalizedApiKey) {
    return { ok: false, error: 'Add EXPO_PUBLIC_GEOCODING_API_KEY to .env.' };
  }

  try {
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(address)}&api_key=${encodeURIComponent(normalizedApiKey)}`;
    const response = await fetchImpl(url);
    if (!response.ok) {
      return { ok: false, error: 'Could not find the address. Check the key and connection.' };
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
      return { ok: false, error: 'The geocoding response is invalid.' };
    }
    if (payload.length === 0) {
      return { ok: false, error: 'No address was found.' };
    }

    const first: unknown = payload[0];
    if (!isRecord(first) || typeof first.display_name !== 'string' || first.display_name.trim() === '') {
      return { ok: false, error: 'The geocoding response is invalid.' };
    }

    const coordinates = parseCoordinates(first);
    if (!coordinates.ok) {
      return coordinates;
    }

    return {
      ok: true,
      location: {
        title: first.display_name.trim(),
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    };
  } catch {
    return { ok: false, error: 'Could not find the address. Check the key and connection.' };
  }
}
