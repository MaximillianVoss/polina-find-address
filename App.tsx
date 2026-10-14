import { useState } from 'react';
import { Button, Keyboard, Platform, Text, TextInput, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { coordinates, type Coordinates } from './src/coordinates';
import { styles } from './src/styles';

const HELSINKI: Coordinates = { latitude: 60.1699, longitude: 24.9384 };

export default function App() {
  const [address, setAddress] = useState('Ratapihantie 13, Helsinki');
  const [result, setResult] = useState<(Coordinates & { address: string }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function showAddress() {
    const query = address.trim();
    if (!query) {
      setError('Enter an address first.');
      return;
    }
    if (loading) return;
    setLoading(true);
    setError('');
    setResult(null);
    Keyboard.dismiss();
    try {
      // Android requires foreground permission even for address geocoding.
      if (Platform.OS === 'android') {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) {
          throw new Error('Location permission was denied. Enable it in device settings.');
        }
      }
      const matches = await Location.geocodeAsync(query);
      const first = matches[0];
      if (!first) throw new Error('Address not found. Add a city or country and try again.');
      setResult({ ...coordinates(first.latitude, first.longitude), address: query });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not find the address.');
    } finally {
      setLoading(false);
    }
  }

  const centre = result ?? HELSINKI;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.title}>Find the address</Text>
          <Text style={styles.hint}>Type a full address, then press Show.</Text>
          <TextInput
            accessibilityLabel="Address"
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            editable={!loading}
            returnKeyType="search"
            onSubmitEditing={() => { void showAddress(); }}
          />
          <Button title={loading ? 'Searching…' : 'Show'} disabled={loading}
            onPress={() => { void showAddress(); }} />
          {error !== '' && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <MapView
            style={styles.map}
            region={{ latitude: centre.latitude, longitude: centre.longitude,
              latitudeDelta: 0.012, longitudeDelta: 0.012 }}
          >
            {result && <Marker coordinate={result} title={result.address} />}
          </MapView>
          {result && <Text style={styles.hint}>
            {result.address}: {result.latitude.toFixed(5)}, {result.longitude.toFixed(5)}
          </Text>}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
