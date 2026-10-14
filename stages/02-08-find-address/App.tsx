import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import {
  geocodeAddress,
  normalizeAddress,
  type FetchImplementation,
  type GeocodedLocation,
} from './src/geocoding';

type AppProps = Readonly<{
  fetchImpl?: FetchImplementation;
}>;

export default function App({ fetchImpl }: AppProps): React.JSX.Element {
  const [addressText, setAddressText] = useState<string>('');
  const [location, setLocation] = useState<GeocodedLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const region: Region | null = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : null;

  async function showAddress(): Promise<void> {
    const normalizedAddress = normalizeAddress(addressText);
    if (!normalizedAddress.ok) {
      setErrorMessage(normalizedAddress.error);
      return;
    }

    const rawApiKey: unknown = process.env.EXPO_PUBLIC_GEOCODING_API_KEY;
    const apiKey = typeof rawApiKey === 'string' ? rawApiKey.trim() : undefined;
    setLoading(true);
    try {
      const result = await geocodeAddress(normalizedAddress.address, apiKey, fetchImpl);
      if (!result.ok) {
        setErrorMessage(result.error);
        return;
      }

      setErrorMessage('');
      setLocation(result.location);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ gap: 12, padding: 16 }}>
      <Text>Address</Text>
      <TextInput
        accessibilityLabel="Address"
        placeholder="e.g. Moscow"
        value={addressText}
        onChangeText={setAddressText}
      />
      <Button title="SHOW" disabled={loading} onPress={showAddress} />
      {loading ? <Text accessibilityLiveRegion="polite">Finding address…</Text> : null}
      {errorMessage ? (
        <Text
          accessibilityLabel="Address error"
          accessibilityRole="alert"
          accessibilityLiveRegion="assertive"
        >
          {errorMessage}
        </Text>
      ) : null}
      {location && region ? (
        <MapView accessibilityLabel="Map" style={{ height: 320, width: '100%' }} region={region}>
          <Marker
            accessibilityLabel="Address marker"
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={location.title}
          />
        </MapView>
      ) : null}
    </View>
  );
}
