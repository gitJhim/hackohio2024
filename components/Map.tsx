import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { LucideLocate, LucidePlus } from "lucide-react-native";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { Pickup } from "../types/map.types";
import DonateFoodModal from "./DonateFoodModal";
import MapViewDirections from "react-native-maps-directions";
import FoodRequestModal from "./RequestFoodModal";
import { useRouter } from "expo-router";

export default function Map() {
  const {
    pickups,
    setPickups,
    destinationLocation: destination,
    setDestinationLocation: setDestination,
    setEstimatedTime,
  } = useMapStore();
  const { user } = useUserStore();
  const [travelInfo, setTravelInfo] = useState<{ distance: string } | null>(
    null,
  );
  const [isDonateModalVisible, setIsDonateModalVisible] = useState(false);
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);
  const [myLocation, setMyLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  const initialLocation = {
    latitude: 39.75,
    longitude: -84.19,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState(initialLocation);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setMyLocation(location.coords);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  }, []);

  const getThemeColor = useCallback(() => {
    switch (user?.type) {
      case "driver":
        return "#17A773";
      case "foodbank":
        return "#8B5CF6";
      case "donor":
        return "#EF4444";
      default:
        return "#808080";
    }
  }, [user?.type]);

  const updateTravelInfo = useCallback(
    (result: any) => {
      setTravelInfo({
        distance: `${result.distance.toFixed(1)} miles`,
      });
      setEstimatedTime(formatDuration(result.duration));
    },
    [setEstimatedTime],
  );

  const formatDuration = useCallback((minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  }, []);

  const goToCurrentLocation = useCallback(() => {
    if (myLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...myLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [myLocation]);

  useEffect(() => {
    const loadPickups = async () => {
      try {
        const { data, error } = await getPickups();
        if (error) {
          console.error("Error loading markers:", error.message);
        } else {
          setPickups(data);
        }
      } catch (error) {
        console.error("Error in loadPickups:", error);
      }
    };

    if (user?.type === "driver") {
      loadPickups();
    }
    getCurrentLocation();
  }, [getCurrentLocation, setPickups, user?.type]);

  const PickupMarker = useCallback(
    ({ pickup }: { pickup: Pickup }) => {
      if (!myLocation) return null;

      return (
        <Marker
          key={pickup.id}
          coordinate={{
            latitude: pickup.latitude,
            longitude: pickup.longitude,
          }}
          image={require("../assets/package.png")}
        >
          <Callout
            onPress={() => {
              setDestination({
                latitude: pickup.latitude,
                longitude: pickup.longitude,
              });
            }}
          >
            <View className="bg-white rounded-2xl overflow-hidden shadow-lg w-72">
              <View className="p-4">
                <View className="bg-green-600 py-3 px-4 rounded-xl mt-4 shadow-md">
                  <Text className="text-white font-bold text-center text-lg">
                    Start Pickup
                  </Text>
                </View>
              </View>
            </View>
          </Callout>
        </Marker>
      );
    },
    [myLocation, setDestination],
  );

  const renderPickupMarkers = useCallback(() => {
    if (!pickups) return null;
    return pickups.map((pickup) => (
      <PickupMarker pickup={pickup} key={pickup.id} />
    ));
  }, [pickups, PickupMarker]);

  return (
    <View className="flex flex-col justify-center items-center">
      {user?.type === "donor" && (
        <DonateFoodModal
          setModalVisible={setIsDonateModalVisible}
          isModalVisible={isDonateModalVisible}
          latitude={myLocation?.latitude}
          longitude={myLocation?.longitude}
        />
      )}

      {user?.type === "foodbank" && (
        <FoodRequestModal
          setModalVisible={setIsRequestModalVisible}
          isModalVisible={isRequestModalVisible}
        />
      )}

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        onMapReady={goToCurrentLocation}
      >
        {myLocation && destination && user?.type === "driver" && (
          <MapViewDirections
            origin={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            destination={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={4}
            strokeColor="red"
            mode="TRANSIT"
            onReady={updateTravelInfo}
          />
        )}

        {myLocation && (
          <Marker
            key="user"
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            image={require("../assets/you.png")}
          />
        )}

        {user?.type === "driver" && renderPickupMarkers()}
      </MapView>

      {user?.type === "driver" && travelInfo && (
        <View className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg">
          <Text className="font-bold text-lg">Route Information</Text>
          <Text className="text-gray-700">Distance: {travelInfo.distance}</Text>
        </View>
      )}

      {user?.type === "driver" && (
        <TouchableOpacity
          onPress={goToCurrentLocation}
          style={[styles.relocateButton, { borderColor: getThemeColor() }]}
        >
          <LucideLocate size={24} color={getThemeColor()} />
        </TouchableOpacity>
      )}

      {user?.type === "donor" && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: getThemeColor() }]}
          onPress={() => setIsDonateModalVisible(true)}
        >
          <LucidePlus size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {user?.type === "foodbank" && (
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: getThemeColor() }]}
          onPress={() => setIsRequestModalVisible(true)}
        >
          <LucidePlus size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  addButton: {
    position: "absolute",
    bottom: Dimensions.get("window").height * 0.18,
    right: Dimensions.get("window").width * 0.05,
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
