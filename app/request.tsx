import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useUserStore } from "../state/stores/userStore";
import { Request, FoodBank } from "../types/request.types";
import { getAllFoodBanks } from "../utils/db/requests";

const FoodBankList: React.FC = () => {
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const requests = useUserStore((state) => state.requests);

  const getProgressColor = (current: number, required: number) => {
    const ratio = current / required;
    if (ratio < 0.3) return "text-red-500";
    if (ratio < 0.7) return "text-orange-400";
    return "text-green-500";
  };

  const processFoodBanks = async () => {
    try {
      setError(null);
      const { data: foodBanksData, error: fetchError } =
        await getAllFoodBanks();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (!foodBanksData) {
        throw new Error("No food banks found");
      }

      const processedBanks: FoodBank[] = foodBanksData
        .map((bank: any) => {
          const bankRequests = requests.filter(
            (request: Request) => request.user_id === bank.id,
          );

          if (bankRequests.length > 0) {
            return {
              name: bank.foodbank_name,
              requestedItems: bankRequests,
            };
          }
          return null;
        })
        .filter((bank): bank is FoodBank => bank !== null);

      return processedBanks;
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Failed to process food banks",
      );
    }
  };

  const loadFoodBanks = async () => {
    try {
      setLoading(true);
      const data = await processFoodBanks();
      setFoodBanks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFoodBanks();
    setRefreshing(false);
  };

  useEffect(() => {
    loadFoodBanks();
  }, [requests]);

  const renderFoodItem = ({ item }: { item: Request }) => (
    <View className="flex-row justify-between items-center mb-2 bg-indigo-50 p-2 rounded-md">
      <Text className="text-sm text-indigo-700 flex-1 font-medium">
        • {item.food_item}
      </Text>
      <Text
        className={`text-sm font-bold ${getProgressColor(
          item.current,
          item.required,
        )}`}
      >
        {item.current}/{item.required}
      </Text>
    </View>
  );

  const renderFoodBank = ({ item }: { item: FoodBank }) => (
    <View className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-purple-500">
      <Text className="text-xl font-bold text-purple-800 mb-2">
        {item.name}
      </Text>
      <Text className="text-base font-semibold mb-2 text-indigo-600">
        Requested Items:
      </Text>
      <View className="bg-white rounded-lg">
        <FlatList
          data={item.requestedItems}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-purple-50 justify-center items-center">
        <StatusBar backgroundColor="#FAF5FF" barStyle="dark-content" />
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text className="mt-2 text-purple-800">Loading food banks...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-purple-50 justify-center items-center">
        <StatusBar backgroundColor="#FAF5FF" barStyle="dark-content" />
        <Text className="text-red-500 text-center px-4">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <StatusBar backgroundColor="#FAF5FF" barStyle="dark-content" />
      <View className="p-4">
        <Text className="text-2xl font-bold mt-4 text-purple-800 text-center mb-4">
          Food Bank Inventory
        </Text>
        {foodBanks.length === 0 ? (
          <Text className="text-center text-purple-600 mt-4">
            No food banks found
          </Text>
        ) : (
          <FlatList
            data={foodBanks}
            renderItem={renderFoodBank}
            keyExtractor={(item) => item.name}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default FoodBankList;
