import React from "react";
import { useUserStore } from "../state/stores/userStore";
import Map from "../components/Map";
import TopBar from "../components/TopBar";

const HomeScreen = () => {
  const user = useUserStore((state) => state.user);

  return (
    <>
      <TopBar />
      <Map />
    </>
  );
};

export default HomeScreen;
