import { useState, useCallback } from "react";
import axios from "axios";
import { FOOD_API } from "@env";

interface FoodvisorResponse {
  items: {
    food: Array<{
      food_info: {
        display_name: string;
      };
    }>;
  }[];
}

export const useFoodvisor = () => {
  const [foodNames, setFoodNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImageWithFoodvisor = useCallback(async (imageUri: string) => {
    const apiUrl = "https://vision.foodvisor.io/api/1.0/en/analysis/";
    const apiKey = FOOD_API;

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpg",
      name: "photo.jpg",
    } as any); // 'as any' is used here because FormData expects a different type than what we're providing

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<FoodvisorResponse>(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Api-Key ${apiKey}`,
        },
      });

      const names: string[] = [];
      for (let i = 0; i < response.data.items.length; i++) {
        const item = response.data.items[i];
        if (item.food && item.food.length > 0) {
          names.push(item.food[0].food_info.display_name);
        }
      }

      setFoodNames(names);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setError("Failed to analyze image");
    } finally {
      setLoading(false);
    }
  }, []);

  return { foodNames, analyzeImageWithFoodvisor, loading, error };
};

