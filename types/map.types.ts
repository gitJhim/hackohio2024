export type MapStore = {
  pickups: Pickup[];

  addPickup: (foodBank: Pickup) => void;
  setPickups: (foodBanks: Pickup[]) => void;

  currentLocation: Location | null;
  destinationLocation: Location | null;
  setCurrentLocation: (location: Location) => void;
  setDestinationLocation: (location: Location) => void;
};

export type Location = {
  latitude: number;
  longitude: number;
};

export type Pickup = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
};
