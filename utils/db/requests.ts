import { supabase } from "../supabase";
import { Request } from "../../types/request.types";

export const createRequest = async (userId: string, request: Request) => {
  const { data, error } = await supabase
    .from("requests")
    .insert([
      {
        user_id: userId,
        food_item: request.food_item,
        current: request.current,
        required: request.required,
      },
    ])
    .select("*")
    .single();

  return { data, error };
};

export const getRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
};

export const getAllFoodBanks = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("type", "foodbank");

  if (error) console.log(error);

  return { data, error };
};
