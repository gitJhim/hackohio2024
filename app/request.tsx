import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StatusBar } from 'react-native';

interface FoodItem {
  name: string;
  current: number;
  required: number;
}

interface FoodBank {
  id: string;
  name: string;
  requestedItems: FoodItem[];
}

const FoodBankList: React.FC = () => {
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([
    { 
      id: '1', 
      name: 'City Food Bank', 
      requestedItems: [
        { name: 'Canned Soup', current: 50, required: 100 },
        { name: 'Rice', current: 75, required: 150 },
        { name: 'Beans', current: 30, required: 80 }
      ]
    },
    { 
      id: '2', 
      name: 'Community Pantry', 
      requestedItems: [
        { name: 'Pasta', current: 40, required: 60 },
        { name: 'Tomato Sauce', current: 20, required: 40 },
        { name: 'Cereal', current: 15, required: 30 }
      ]
    },
    { 
      id: '3', 
      name: 'Local Hunger Relief', 
      requestedItems: [
        { name: 'Peanut Butter', current: 45, required: 50 },
        { name: 'Jelly', current: 20, required: 40 },
        { name: 'Bread', current: 10, required: 100 }
      ]
    },
  ]);

  const getProgressColor = (current: number, required: number) => {
    const ratio = current / required;
    if (ratio < 0.3) return 'text-red-500';
    if (ratio < 0.7) return 'text-orange-400';
    return 'text-green-500';
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <View className="flex-row justify-between items-center mb-2 bg-indigo-50 p-2 rounded-md">
      <Text className="text-sm text-indigo-700 flex-1 font-medium">• {item.name}</Text>
      <Text className={`text-sm font-bold ${getProgressColor(item.current, item.required)}`}>
        {item.current}/{item.required}
      </Text>
    </View>
  );

  const renderFoodBank = ({ item }: { item: FoodBank }) => (
    <View className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-purple-500">
      <Text className="text-xl font-bold text-purple-800 mb-2">{item.name}</Text>
      <Text className="text-base font-semibold mb-2 text-indigo-600">Requested Items:</Text>
      <View className="bg-white rounded-lg">
        <FlatList
          data={item.requestedItems}
          renderItem={renderFoodItem}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          scrollEnabled={false}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-purple-50">
      <StatusBar backgroundColor="#FAF5FF" barStyle="dark-content" />
      <View className="p-4">
        <Text className="text-2xl font-bold mt-4 text-purple-800 text-center">Food Bank Inventory</Text>
        <FlatList
          data={foodBanks}
          renderItem={renderFoodBank}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
};

export default FoodBankList;