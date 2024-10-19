export type RequestStore = {
  request: Request | null;

  setRequests: (request: Request) => void;
  addRequest: (request: Request) => void;

  removeRequest: (requestId: string) => void;
};

export type Request = {
  id: string;
  user_id: string;
  data_id: string;
  created_at: string;
};

export type FoodItem = {
  id: string;
  name: string;
};
