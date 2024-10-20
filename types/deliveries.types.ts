export type Delivery = {
  id: string;
  user_id: string;
  items: string[];
  status: "in-progress" | "completed";
  created_at?: string;
};
