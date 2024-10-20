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

  return { data: data as Pickup[], error };
};

export const setPickupStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from("pickups")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.log(error);
  }

  return { data, error };
};
