import { Pickup } from "../../types/map.types";
import { supabase } from "../supabase";

export const addPickup = async (pickup: Pickup) => {
  const { data, error } = await supabase
    .from("pickups")
    .insert(pickup)
    .select("*");

  if (error) {
    console.error("Error adding pickup:", error.message);
  }
};

export const getPickups = async () => {
  const { data, error } = await supabase
    .from("pickups")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
  }

  console.log(data);

  return { data: data as Pickup[], error };
};
