import React from "react";
import { Text, View } from "react-native";
import { useUserStore } from "../state/stores/userStore";
import Map from "../components/Map";

const HomeScreen = () => {
  const user = useUserStore((state) => state.user);

  return <Map />;
};

export default HomeScreen;
