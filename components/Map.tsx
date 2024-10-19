import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useMapStore } from "../state/stores/mapStore";
import { useUserStore } from "../state/stores/userStore";
import { getPickups } from "../utils/db/map";
import { LucideCalendarDays, LucideCar } from "lucide-react-native";
import Geocoder from "react-native-geocoding";
import { GOOGLE_MAPS_API_KEY } from "@env";

export default function Map() {
  Geocoder.init(`${GOOGLE_MAPS_API_KEY}`);
  const pickups = useMapStore((state) => state.pickups);
  const setPickups = useMapStore((state) => state.setPickups);
  const user = useUserStore((state) => state.user);
  const initialLocation = {
    latitude: 39.75,
    longitude: -84.19,
  };
  const [myLocation, setMyLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [region, setRegion] = useState({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const mapRef = useRef<MapView>(null);
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      console.warn("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setMyLocation(location.coords);
  };

  useEffect(() => {
    const loadMarkers = async () => {
      const { data: markers, error } = await getPickups();
      if (error) {
        console.error("Error loading markers:", error.message);
      } else {
        setPickups(markers);
      }
    };

    loadMarkers();
    getCurrentLocation();
  }, []);

  const goToCurrentLocation = () => {
    if (myLocation) {
      const newRegion = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      mapRef.current?.animateToRegion(newRegion);
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => {
    return (
      <View className="flex-row justify-between items-center">
        <Text className="text-sm font-semibold text-gray-600">{label}:</Text>
        <Text className="text-sm font-bold text-gray-800">{value}</Text>
      </View>
    );
  };

  const renderMarkers = () => {
    if (!pickups) return;
    return pickups.map((marker) => (
      <BinMarker marker={marker} key={marker.id} />
    ));
  };

  const BinMarker = ({ marker }: { marker: MarkerType }) => {
    return (
      <Marker
        key={marker.id}
        coordinate={{
          latitude: marker.latitude,
          longitude: marker.longitude,
        }}
        onPress={() => setSelectedMarker(marker)}
        onDeselect={() => setSelectedMarker(null)}
      >
        <Callout onPress={() => setRecycleModalVisible(true)}>
          <View className="bg-white rounded-2xl overflow-hidden shadow-lg w-72">
            <Text className=""></Text>
            <View className="p-4">
              <Text className="text-2xl font-bold mb-3 text-center text-green-700">
                {marker.title}
              </Text>
              <View className="space-y-2">
                <InfoRow label="Estimated Capacity" value={"0%"} />
                <InfoRow label="Items Recycled" value={"0%"} />
                <InfoRow label="Est. Weight Recycled" value={"0 kg"} />
              </View>
              <View className="bg-green-600 py-3 px-4 rounded-xl mt-4 shadow-md">
                <Text className="text-white font-bold text-center text-lg">
                  Recycle Now
                </Text>
              </View>
            </View>
          </View>
        </Callout>
      </Marker>
    );
  };
  return (
    <View className="flex flex-col justify-center items-center">
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        onMapReady={() => {
          getCurrentLocation();
          goToCurrentLocation();
        }}
      >
        {renderMarkers()}
      </MapView>
      <TouchableOpacity
        onPress={goToCurrentLocation}
        style={styles.relocateButton}
      >
        <LucideCar />
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton}>
        <LucideCalendarDays />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  addButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.18,
    right: Dimensions.get("window").width * 0.05,
    backgroundColor: "#17A773",
    padding: 16,
    borderRadius: 24,
  },
  relocateButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.3,
    right: Dimensions.get("window").width * 0.05,
    backgroundColor: "#e2e8f0",
    padding: 16,
    borderRadius: 24,
  },
});
