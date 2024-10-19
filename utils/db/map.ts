import { Pickup } from "../../types/map.types";
import { supabase } from "../supabase";

export const getPickups = async () => {};

export const addPickup = async (pickup: Pickup) => {
  const { data, error } = await supabase
    .from("pickups")
    .insert(pickup)
    .select("*");

  if (error) {
    console.error("Error adding pickup:", error.message);
  }

  return { data: data as Pickup[], error };
};
