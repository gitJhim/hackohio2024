import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { useMapStore } from "../state/stores/mapStore";
import { useUserStore } from "../state/stores/userStore";
import { getPickups } from "../utils/db/map";
import { LucideLocate, LucidePlus, PackageOpen } from "lucide-react-native";
import { GOOGLE_MAPS_API_KEY } from "@env";
import { Pickup } from "../types/map.types";
import DonateFoodModal from "./DonateFoodModal";
import MapViewDirections from "react-native-maps-directions";
import { getDistance } from "geolib";
import FoodRequestModal from "./RequestFoodModal";
import { useRouter } from "expo-router";

export default function Map() {
  const pickups = useMapStore((state) => state.pickups);
  const setPickups = useMapStore((state) => state.setPickups);
  const user = useUserStore((state) => state.user);
  const destination = useMapStore((state) => state.destinationLocation);
  const setDestination = useMapStore((state) => state.setDestinationLocation);
  const [travelInfo, setTravelInfo] = useState<{
    distance: string;
  } | null>(null);
  const [isDonateModalVisible, setIsDonateModalVisible] = useState(false);
  const [isRequestModalVisible, setIsRequestModalVisible] = useState(false);

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
  const setEstimatedTime = useMapStore((state) => state.setEstimatedTime);
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

  const getThemeColor = () => {
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
  };

  const router = useRouter();

  const onDelivered = async () => {
    router.push("/delivered");
  };

  const updateTravelInfo = (result: any) => {
    setTravelInfo({
      distance: `${result.distance.toFixed(1)} miles`,
    });
    setEstimatedTime(formatDuration(result.duration));
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  useEffect(() => {
    console.log(myLocation);
    const loadPickups = async () => {
      const { data: pickups, error } = await getPickups();
      if (error) {
        console.error("Error loading markers:", error.message);
      } else {
        setPickups(pickups);
      }
    };

    loadPickups();
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

  const renderPickupMarkers = () => {
    if (!pickups) return;
    return pickups.map((pickup) => (
      <PickupMarker pickup={pickup} key={pickup.id} />
    ));
  };

  const renderFoodMarkers = () => {
    if (!user?.latitude || !user?.longitude) return;
    return (
      <Marker
        key={user.id}
        coordinate={{
          latitude: user.latitude,
          longitude: user.longitude,
        }}
        onPress={() => {}}
        onDeselect={() => {}}
        image={require("../assets/foodbank.png")}
      />
    );
  };

  const PickupMarker = ({ pickup }: { pickup: Pickup }) => {
    if (!myLocation) return;

    return (
      <Marker
        key={pickup.id}
        coordinate={{
          latitude: pickup.latitude,
          longitude: pickup.longitude,
        }}
        onPress={() => {}}
        onDeselect={() => {}}
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
  };
  return (
    <View className="flex flex-col justify-center items-center">
      <DonateFoodModal
        setModalVisible={setIsDonateModalVisible}
        isModalVisible={isDonateModalVisible}
        latitude={myLocation?.latitude}
        longitude={myLocation?.longitude}
      />
      <FoodRequestModal
        setModalVisible={setIsRequestModalVisible}
        isModalVisible={isRequestModalVisible}
        latitude={myLocation?.latitude}
        longitude={myLocation?.longitude}
      />

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
        {myLocation && destination && user?.type === "driver" && (
          <>
            <MapViewDirections
              origin={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              destination={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              apikey={`${GOOGLE_MAPS_API_KEY}`}
              strokeWidth={4}
              strokeColor="red"
              mode={"TRANSIT"}
              onReady={(result) => {
                updateTravelInfo(result);
              }}
            />
          </>
        )}

        {myLocation && (
          <Marker
            key={"user"}
            coordinate={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
            }}
            onPress={() => {}}
            onDeselect={() => {}}
            image={require("../assets/you.png")}
          />
        )}

        {user?.type === "driver" && renderPickupMarkers()}
        {user?.type === "foodbank" && renderFoodMarkers()}
      </MapView>
      {travelInfo && (
        <View className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg">
          <Text className="font-bold text-lg">Route Information</Text>
          <Text className="text-gray-700">Distance: {travelInfo.distance}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={goToCurrentLocation}
        style={[styles.relocateButton, { borderColor: getThemeColor() }]}
      >
        <LucideLocate size={24} color={getThemeColor()} />
      </TouchableOpacity>
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
    backgroundColor: "#8B5CF6",
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
