import { ScrollView, Text, View, Image } from "react-native";
import { useUserStore } from "../state/stores/userStore";
import React from "react";

const Profile = () => {
  const user = useUserStore((state) => state.user);

  return (
    <View className="h-full">
      <ScrollView
        className="flex-1 bg-backgroundLight dark:bg-backgroundDark"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View
          className={`h-56 ${user?.type == "driver" ? " bg-[#17A773]" : "bg-[#8B5CF6]"} items-center justify-end `}
        ></View>
        <View className="flex-1 bg-backgroundLight dark:bg-backgroundDark bg-opacity-10 items-center">
          <Image
            source={{ uri: user?.avatar_url || "" }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              borderWidth: 4,
              borderColor: "white",
              top: -60,
            }}
            className="bg-white"
          />
          <Text className="text-black text-xl -mt-16">@{user?.name}</Text>
          <Text className="text-black text-xl">{user?.type || ""}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
