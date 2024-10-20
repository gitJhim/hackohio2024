import React, { useEffect } from "react";
import { useUserStore } from "../state/stores/userStore";
import Map from "../components/Map";
import TopBar from "../components/TopBar";
import { getUserPickups } from "../utils/db/auth";

const HomeScreen = () => {
  const user = useUserStore((state) => state.user);
  const setPickups = useUserStore((state) => state.setPickups);

  useEffect(() => {
    const loadPickups = async () => {
      if (!user || !user.id) return;
      const pickups = await getUserPickups(user?.id);
      setPickups(pickups.data);
    };

    loadPickups();
  }, [user]);

  return (
    <>
      <TopBar />
      <Map />
    </>
  );
};

export default HomeScreen;
