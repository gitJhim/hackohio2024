import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fastStorage } from "../store";
import { immer } from "zustand/middleware/immer";
import { MapStore, Pickup } from "../../types/map.types";

export const useMapStore = create<MapStore>(
  persist(
    immer((set) => ({
      pickups: [],

      addPickup: (pickup: Pickup) =>
        set((state: MapStore) => ({ pickups: [...state.pickups, pickup] })),
      setPickups: (pickups: Pickup[]) => set({ pickups }),

      currentLocation: null,
      destinationLocation: null,
      setCurrentLocation: (location: Location) =>
        set({ currentLocation: location }),
      setDestinationLocation: (location: Location) =>
        set({ destinationLocation: location }),

      estimatedTime: null,
      setEstimatedTime: (time: number) => set({ estimatedTime: time }),
    })),
    {
      name: "map-storage",
      storage: createJSONStorage(() => fastStorage),
    },
  ) as any,
);
