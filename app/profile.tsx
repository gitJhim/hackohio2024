import { ScrollView, Text, View, Image } from "react-native";
import { useUserStore } from "../state/stores/userStore";
import React from "react";

const Profile = () => {
  const user = useUserStore((state) => state.user);

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

  return (
    <View className="h-full">
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View
          className="h-56 items-center justify-end"
          style={{ backgroundColor: getHeaderColor() }}
        />
        <View className="flex-1 bg-white dark:bg-gray-900 bg-opacity-10 items-center">
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
          <Text className="text-black dark:text-white text-xl mt-4">
            @{user?.name || "Username"}
          </Text>
          <Text className="text-black dark:text-white text-xl mt-2 capitalize">
            {user?.type || "User"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
