import { Session } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import { useUserStore } from "../../state/stores/userStore";
import { Event, User } from "../../types/user.types";

export const insertNewUser = async (session: Session) => {
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        id: session.user.id,
        email: session.user.email,
        name: session.user.user_metadata.full_name,
        avatar_url: session.user.user_metadata.avatar_url,
        last_sign_in: session.user.last_sign_in_at,
      },
    ])
    .select("*")
    .single();

  return { user: data, error };
};

export const signInUserWithToken = async (token: string) => {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: token,
  });

  return { data, error };
};

export const doesUserExistById = async (userId: string) => {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId);

  const user = users?.length ? users[0] : null;

  return { user, error };
};

export const updateUser = async (session: Session) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      email: session.user.email,
      name: session.user.user_metadata.full_name,
      avatar_url: session.user.user_metadata.avatar_url,
      last_sign_in: session.user.last_sign_in_at,
    })
    .eq("id", session.user.id)
    .select("*");

  return { user: data, error };
};

export const setUserType = async (userId: string, type: string) => {
  const { data, error } = await supabase
    .from("users")
    .update({
      type: type,
    })
    .eq("id", userId)
    .select("*");

  return { user: data, error };
};

export const loadLogs = async (userId: string) => {
  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .eq("user_id", userId);

  useUserStore.getState().setLogs(data as Event[]);

  return { data: data as Event[], error };
};
