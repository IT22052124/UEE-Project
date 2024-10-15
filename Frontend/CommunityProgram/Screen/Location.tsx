import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function MapScreen() {
  const route = useRoute();
  const { location } = route.params; // Extract the location from the route parameters
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const geocodeLocation = async () => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
          params: {
            q: location,
            format: 'json',
            limit: 1, // Get only one result
          },
        });

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0]; // Get the latitude and longitude
          setCoordinates({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        } else {
          console.warn('Location not found');
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    geocodeLocation();
  }, [location]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!coordinates) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Could not find location</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={coordinates}>
          <View style={styles.markerContainer}>
            <Ionicons name="location" size={24} color="#fff" />
          </View>
        </Marker>
      </MapView>
      <View style={styles.locationInfo}>
        <Text style={styles.locationTitle}>LOCATION</Text>
        <Text style={styles.locationAddress}>{location}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
    padding: 8,
  },
  locationInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  locationTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  locationAddress: {
    color: '#6b7280',
  },
  errorText: {
    textAlign: 'center',
    margin: 20,
    color: 'red',
  },
});
