import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fastStorage } from "../store";
import { immer } from "zustand/middleware/immer";
import { MapStore } from "../../types/map.types";

export const useMapStore = create<MapStore>(
  persist(
    immer((set) => ({
      currentLocation: null,
      destinationLocation: null,
      setCurrentLocation: (location: Location) =>
        set({ currentLocation: location }),
      setDestinationLocation: (location: Location) =>
        set({ destinationLocation: location }),
    })),
    {
      name: "map-storage",
      storage: createJSONStorage(() => fastStorage),
    },
  ) as any,
);
