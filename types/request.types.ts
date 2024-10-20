export type RequestStore = {
  request: Request | null;

  setRequests: (request: Request) => void;
  addRequest: (request: Request) => void;

  removeRequest: (requestId: string) => void;
};

export type Request = {
  id: string;
  user_id: string;
  created_at?: string;
  food_item: string;
  current: number;
  required: number;
};

export type FoodBank = {
  name: string;
  requestedItems: Request[];
};
