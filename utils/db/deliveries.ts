import { Delivery } from "../../types/deliveries.types";
import { supabase } from "../supabase";

export const getDeliveries = async () => {
  const { data, error } = await supabase.from("deliveries").select("*");

  if (error) console.log(error);
  return { data, error };
};

export const addDelivery = async (delivery: Delivery) => {
  const { data, error } = await supabase
    .from("deliveries")
    .insert([
      {
        user_id: delivery.user_id,
        items: delivery.items,
        status: delivery.status,
      },
    ])
    .select("*")
    .single();

  if (error) console.log(error);
  return { data, error };
};
