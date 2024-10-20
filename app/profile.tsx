import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useUserStore } from "../state/stores/userStore";
import {
  Trash2,
  Edit2,
  Clock,
  CheckCircle,
  TruckIcon,
  RefrigeratorIcon,
  HeartHandshakeIcon,
} from "lucide-react-native";
import { Pickup } from "../types/map.types";
import { Request } from "../types/request.types";
import { getRequests } from "../utils/db/requests";
import { getDeliveries } from "../utils/db/deliveries";
interface Delivery {
  id: string;
  route: string;
  items: string;
  date: string;
  status: "in-progress" | "completed";
}

const Profile = () => {
  const user = useUserStore((state) => state.user);
  const pickups = useUserStore((state) => state.pickups);
  const requests = useUserStore((state) => state.requests);
  const setRequests = useUserStore((state) => state.setRequests);
  const deliveries = useUserStore((state) => state.deliveries);
  const setDeliveries = useUserStore((state) => state.setDeliveries);

  const getHeaderColor = () => {
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

  const getIcon = () => {
    switch (user?.type) {
      case "driver":
        return <TruckIcon size={20} color="#17A773" />;
      case "foodbank":
        return <RefrigeratorIcon size={20} color="#8B5CF6" />;
      case "donor":
        return <HeartHandshakeIcon size={20} color="#EF4444" />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!user || !user.id) return;
      const requests = await getRequests();
      const deliveries = await getDeliveries();
      setRequests(requests.data);
      setDeliveries(deliveries.data);
    };

    loadData();
  }, []);
  const renderRequestedItem = ({ item }: { item: Request }) => (
    <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <Text className="text-lg font-bold text-purple-600">
        {item.food_item}
      </Text>

      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-sm text-gray-700">
          Quantity: {item.current}/{item.required}
        </Text>
        <View className="flex-row">
          <TouchableOpacity className="mr-2">
            <Edit2 color="#8B5CF6" size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Trash2 color="#8B5CF6" size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderDonationItem = ({ item }: { item: Pickup }) => (
    <View className="mb-4 p-4 bg-white rounded-lg shadow-md border-l-4 border-[#EF4444]">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-red-600">Donation</Text>
        <View className="flex-row items-center">
          {item.status === "pending" ? (
            <Clock color="#EF4444" size={15} />
          ) : (
            <CheckCircle color="#10B981" size={15} />
          )}
          <Text
            className={`ml-1 ${item.status === "pending" ? "text-red-500" : "text-green-500"}`}
          >
            {item.status === "pending" ? "Pending" : "Complete"}
          </Text>
        </View>
      </View>
      <Text className="text-sm text-gray-700 mt-1">{item.food_items}</Text>
      <Text className="text-xs text-gray-500 mt-2">{item.created_at}</Text>
    </View>
  );

  const renderDeliveryItem = ({ item }: { item: Delivery }) => (
    <View className="mb-4 p-4 bg-white rounded-lg shadow-md">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-green-600">Delivery</Text>
        <View className="flex-row items-center">
          {item.status === "in-progress" ? (
            <Clock color="#eab308" size={15} />
          ) : (
            <CheckCircle color="#10B981" size={15} />
          )}
          <Text
            className={`ml-1 ${item.status === "in-progress" ? "text-yellow-500" : "text-green-500"}`}
          >
            {item.status === "in-progress" ? "In Progress" : "Completed"}
          </Text>
        </View>
      </View>
      <Text className="text-sm font-semibold text-gray-700 mt-1">
        {item.route}
      </Text>
      <Text className="text-sm text-gray-600 mt-1">{item.items}</Text>
      <Text className="text-xs text-gray-500 mt-2">{item.created_at}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View
          className="h-56 items-center justify-end"
          style={{ backgroundColor: getHeaderColor() }}
        />
        <View className="flex-1 bg-gray-100 px-4 pt-4">
          <View className="items-center mb-6">
            <Image
              source={{
                uri: user?.avatar_url || "https://via.placeholder.com/120",
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: "white",
                marginTop: -60,
              }}
              className="bg-white"
            />
            <Text className="text-xl font-bold mt-4 text-gray-800">
              @{user?.name || "Username"}
            </Text>
            <View className="flex-row items-center  bg-white h-10 justify-center p-2 rounded-full">
              <Text className="text-lg capitalize font-bold mr-1">
                {user?.type || "User"}
              </Text>
              <View className="flex items-center justify-center pt-4">
                {getIcon()}
              </View>
            </View>
          </View>

          {user?.type === "foodbank" && (
            <View>
              <Text className="text-2xl font-bold mb-4 text-purple-700">
                Requested Items
              </Text>
              <FlatList
                data={requests}
                renderItem={renderRequestedItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {user?.type === "donor" && (
            <View className="mt-4">
              <Text className="text-2xl font-bold mb-4 text-red-700">
                Donor Dashboard
              </Text>
              <FlatList
                data={pickups}
                renderItem={renderDonationItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {user?.type === "driver" && (
            <View className="mt-4">
              <Text className="text-2xl font-bold mb-4 text-green-700">
                Driver Dashboard
              </Text>
              <FlatList
                data={deliveries}
                renderItem={renderDeliveryItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
