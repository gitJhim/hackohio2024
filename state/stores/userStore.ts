import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fastStorage } from "../store";
import { immer } from "zustand/middleware/immer";
import { UserStore } from "../../types/user.types";
import { Event } from "../../types/user.types";
import { Pickup } from "../../types/map.types";
import { Delivery } from "../../types/deliveries.types";

export const useUserStore = create<UserStore>(
  persist(
    immer((set) => ({
      user: null,
      logs: [],
      session: null,
      pickups: [],
      requests: [],
      deliveries: [],

      setLogs: (logs: Event[]) => set({ logs }),
      addLog: (log: Event) =>
        set((state: { logs: Event[] }) => {
          [...state.logs, log];
        }),
      setSession: (session: null) => set({ session }),
      setUser: (user: null) => set({ user }),
      setPickups: (pickups: Pickup[]) => set({ pickups }),
      addNewPickup: (pickup: Pickup) =>
        set((state: { pickups: Pickup[] }) => {
          [...state.pickups, pickup];
        }),
      setRequests: (requests: Request[]) => set({ requests }),
      addNewRequest: (request: Request) =>
        set((state: { requests: Request[] }) => {
          [...state.requests, request];
        }),
      setDeliveries: (deliveries: Delivery[]) => set({ deliveries }),
      addNewDelivery: (delivery: Delivery) =>
        set((state: { deliveries: Delivery[] }) => {
          [...state.deliveries, delivery];
        }),
    })),
    {
      name: "user-storage",
      storage: createJSONStorage(() => fastStorage),
    },
  ) as any,
);
