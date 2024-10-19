import React from "react";
import { View, Text } from "react-native";

const LoadingScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-lightBackground dark:bg-darkBackground p-4">
      <Text>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
