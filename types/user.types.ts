import { Session } from "@supabase/supabase-js";
import { Pickup } from "./map.types";
import { Delivery } from "./deliveries.types";
export type UserStore = {
  user: User | null;
  setUser: (user: User) => void;

  logs: Event[];
  setLogs: (logs: Event[]) => void;
  addLog: (log: Event) => void;

  session: Session | null;
  setSession: (session: Session | null) => void;

  pickups: Pickup[];
  addNewPickup: (pickup: Pickup) => void;
  setPickups: (pickups: Pickup[]) => void;

  requests: Request[];
  addNewRequest: (request: Request) => void;
  setRequests: (requests: Request[]) => void;

  deliveries: Delivery[];
  addNewDelivery: (delivery: Delivery) => void;
  setDeliveries: (deliveries: Delivery[]) => void;
};

export type User = {
  id: string | null;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
  last_sign_in: string | null;
  type: UserType;
  latitude: number | null;
  longitude: number | null;
  foodbank_name: string | null;
};

export type UserType = "driver" | "foodbank" | "donor";

export type Event = {
  id: string | null;
  user_id: string | null;
  data_id: string | null;
  type: LogEventType;
  created_at: string | null;
};

export enum LogEventType {
  FOOD_BANK_REQUEST = "FOOD_BANK_REQUEST",
  FOOD_DELIEVERED = "FOOD_DELIEVERED",
}
