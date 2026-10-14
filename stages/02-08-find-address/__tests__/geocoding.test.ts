import {
  geocodeAddress,
  normalizeAddress,
  parseCoordinates,
  type FetchImplementation,
  type FetchResponse,
} from '../src/geocoding';

function response(payload: unknown, ok = true): FetchResponse {
  return { ok, json: async (): Promise<unknown> => payload };
}

test('normalizes a non-empty address and rejects a blank or non-string input', () => {
  expect(normalizeAddress('  Moscow  ')).toEqual({ ok: true, address: 'Moscow' });
  expect(normalizeAddress('   ')).toEqual({ ok: false, error: 'Enter an address.' });
  expect(normalizeAddress(null)).toEqual({ ok: false, error: 'Enter an address.' });
});

test('accepts finite coordinate strings and numbers within geographic ranges', () => {
  expect(parseCoordinates({ lat: '55.7558', lon: '37.6173' })).toEqual({
    ok: true,
    latitude: 55.7558,
    longitude: 37.6173,
  });
  expect(parseCoordinates({ lat: -90, lon: 180 })).toEqual({
    ok: true,
    latitude: -90,
    longitude: 180,
  });
});

test.each<unknown>([
  null,
  { lat: null, lon: '37.6173' },
  { lat: '55.7558', lon: true },
  { lat: ['55.7558'], lon: '37.6173' },
  { lat: '55.7558', lon: { value: '37.6173' } },
  { lat: '', lon: '37.6173' },
  { lat: 91, lon: 37.6173 },
  { lat: 55.7558, lon: -181 },
])('rejects malformed or out-of-range coordinates: %p', (location) => {
  expect(parseCoordinates(location)).toEqual({
    ok: false,
    error: 'The location has invalid coordinates.',
  });
});

test('encodes the query and returns a validated first location', async () => {
  const fetchImpl = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  fetchImpl.mockResolvedValue(response([
    { display_name: 'Moscow, Russia', lat: '55.7558', lon: '37.6173' },
  ]));

  await expect(geocodeAddress('Moscow & #1', 'test key', fetchImpl)).resolves.toEqual({
    ok: true,
    location: { title: 'Moscow, Russia', latitude: 55.7558, longitude: 37.6173 },
  });
  expect(fetchImpl).toHaveBeenCalledWith(
    'https://geocode.maps.co/search?q=Moscow%20%26%20%231&api_key=test%20key',
  );
});

const invalidPayloads: Array<[unknown, string]> = [
  [null, 'The geocoding response is invalid.'],
  [{ unexpected: true }, 'The geocoding response is invalid.'],
  [[], 'No address was found.'],
  [[{ lat: '55.7558', lon: '37.6173' }], 'The geocoding response is invalid.'],
  [[{ display_name: ' ', lat: '55.7558', lon: '37.6173' }], 'The geocoding response is invalid.'],
  [[{ display_name: 'Moscow', lat: 'north', lon: '37.6173' }], 'The location has invalid coordinates.'],
];

test.each(invalidPayloads)('rejects an invalid geocoding payload', async (payload, error) => {
  const fetchImpl = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  fetchImpl.mockResolvedValue(response(payload));

  await expect(geocodeAddress('Moscow', 'test-key', fetchImpl)).resolves.toEqual({
    ok: false,
    error,
  });
});

test('rejects a missing key and an HTTP or network failure', async () => {
  const missingKeyFetch = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  const httpFetch = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  httpFetch.mockResolvedValue(response({}, false));
  const offlineFetch = jest.fn<Promise<FetchResponse>, Parameters<FetchImplementation>>();
  offlineFetch.mockRejectedValue(new Error('offline'));

  await expect(geocodeAddress('Moscow', undefined, missingKeyFetch)).resolves.toEqual({
    ok: false,
    error: 'Add EXPO_PUBLIC_GEOCODING_API_KEY to .env.',
  });
  await expect(geocodeAddress('Moscow', 'test-key', httpFetch)).resolves.toEqual({
    ok: false,
    error: 'Could not find the address. Check the key and connection.',
  });
  await expect(geocodeAddress('Moscow', 'test-key', offlineFetch)).resolves.toEqual({
    ok: false,
    error: 'Could not find the address. Check the key and connection.',
  });
});
