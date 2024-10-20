export type MapStore = {
  pickups: Pickup[];

  addPickup: (foodBank: Pickup) => void;
  setPickups: (foodBanks: Pickup[]) => void;

  currentLocation: Location | null;
  destinationLocation: Location | null;
  setCurrentLocation: (location: Location) => void;
  setDestinationLocation: (location: Location) => void;

  estimatedTime: string | null;
  setEstimatedTime: (time: string) => void;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type Pickup = {
  id: string | null;
  user_id: string;
  latitude: number;
  longitude: number;
  food_items: string[];
  status: "pending" | "completed";
  created_at?: string | null;
};
