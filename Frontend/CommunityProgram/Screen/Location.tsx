import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 7.2906,
          longitude: 80.6337,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 7.2906, longitude: 80.6337 }}
        >
          <View style={styles.markerContainer}>
            <Ionicons name="location" size={24} color="#fff" />
          </View>
        </Marker>
      </MapView>
      <View style={styles.locationInfo}>
        <Text style={styles.locationTitle}>LOCATION</Text>
        <Text style={styles.locationAddress}>No. 45, Temple Road, Kandy, 20000, Sri Lanka</Text>
      </View>
      <View style={styles.bottomNav}>
        {['cash-outline', 'sync-outline', 'people-outline', 'briefcase-outline', 'settings-outline'].map((icon, index) => (
          <View key={index} style={styles.navItem}>
            <Ionicons name={icon} size={24} color={index === 2 ? '#3b82f6' : '#6b7280'} />
          </View>
        ))}
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
});