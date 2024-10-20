import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import { Trash2, Plus } from "lucide-react-native";
import { useUserStore } from "../state/stores/userStore";
import uuid from "react-native-uuid";
import { Request } from "../types/request.types";
import { createRequest } from "../utils/db/requests";

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
}

const FoodRequestModal = ({
  setModalVisible,
  isModalVisible,
}: {
  setModalVisible: any;
  isModalVisible: boolean;
}) => {
  const user = useUserStore((state) => state.user);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const addItem = () => {
    if (newItemName.trim() && newItemQuantity.trim()) {
      setFoodItems([
        ...foodItems,
        {
          id: uuid.v4().toString(),
          name: newItemName.trim(),
          quantity: newItemQuantity.trim(),
        },
      ]);
      setNewItemName("");
      setNewItemQuantity("");
    }
  };

  const deleteItem = (id: string) => {
    setFoodItems(foodItems.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    if (foodItems.length === 0) return;

    foodItems.forEach(async (item) => {
      if (!user || !user.id) return;
      const request: Request = {
        id: uuid.v4().toString(),
        user_id: user?.id,
        food_item: foodItems[0].name,
        current: 0,
        required: parseInt(item.quantity),
      };
      await createRequest(user?.id, request);
    });
    toggleModal();
    setFoodItems([]);
  };

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={toggleModal}
        className="bg-purple-600 p-4 rounded-lg m-4"
      >
        <Text className="text-white text-center font-bold text-lg">
          Request Food Items
        </Text>
      </TouchableOpacity>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        className="m-4"
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <View className="bg-white rounded-2xl overflow-hidden">
          <View className="bg-purple-600 p-4">
            <Text className="text-white text-center font-bold text-xl">
              Food Request
            </Text>
          </View>

          <View className="p-6">
            <View className="mb-6">
              <Text className="font-bold text-lg mb-2 text-gray-800">
                Add Food Item:
              </Text>
              <View className="flex-row space-x-2 mb-2">
                <TextInput
                  className="flex-1 border border-gray-300 rounded-lg p-2"
                  value={newItemName}
                  onChangeText={setNewItemName}
                  placeholder="Food item name"
                />
                <TextInput
                  className="w-24 border border-gray-300 rounded-lg p-2"
                  value={newItemQuantity}
                  onChangeText={setNewItemQuantity}
                  placeholder="Qty"
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity
                onPress={addItem}
                className="bg-purple-600 rounded-lg p-3 flex-row justify-center items-center"
              >
                <Plus color="white" size={20} />
                <Text className="text-white font-bold ml-2">Add Item</Text>
              </TouchableOpacity>
            </View>

            {/* Food Items List */}
            {foodItems.length > 0 && (
              <View className="mb-6">
                <Text className="font-bold text-lg mb-2 text-gray-800">
                  Requested Items:
                </Text>
                <View className="bg-gray-50 rounded-lg p-3 max-h-48">
                  <FlatList
                    data={foodItems}
                    renderItem={({ item }) => (
                      <View className="flex-row justify-between items-center mb-2 bg-white p-3 rounded-lg shadow-sm">
                        <View className="flex-1">
                          <Text className="text-base text-gray-700 font-medium">
                            {item.name}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => deleteItem(item.id)}
                          className="ml-2"
                        >
                          <Trash2 color="#9333ea" size={20} />
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={foodItems.length === 0}
              className={`mt-4 p-4 rounded-lg ${
                foodItems.length > 0 ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  foodItems.length > 0 ? "text-white" : "text-gray-500"
                }`}
              >
                Submit Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FoodRequestModal;
