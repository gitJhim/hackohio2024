import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ecwdckdsgzoenuilksne.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjd2Rja2RzZ3pvZW51aWxrc25lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzNTE2NDksImV4cCI6MjA0NDkyNzY0OX0.7M7_bhJihsZoTnedMZO9Oq4EuvUicmw7csL6ybdjHB8",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
