export type MapStore = {
  pickups: Pickup[];
  selectedPickup: Pickup | null;

  setSelectedPickup: (pickup: Pickup | null) => void;
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
  weight: number | undefined;
  created_at?: string | null;
};
