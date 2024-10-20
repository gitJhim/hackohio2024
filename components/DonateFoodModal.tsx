import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import Modal from "react-native-modal";
import { Camera, Trash2 } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useFoodvisor } from "../hooks/useFoodvisor";
import { useUserStore } from "../state/stores/userStore";
import { Pickup } from "../types/map.types";
import { addPickup } from "../utils/db/map";
import uuid from "react-native-uuid";

const FoodImageModal = ({
  setModalVisible,
  isModalVisible,
  latitude,
  longitude,
}: {
  setModalVisible: any;
  isModalVisible: boolean;
  latitude: number | undefined;
  longitude: number | undefined;
}) => {
  const user = useUserStore((state) => state.user);
  const addNewPickup = useUserStore((state) => state.addNewPickup);
  const toggleModal = () => {
    setModalVisible();
  };
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const { sumWeight, foodNames, analyzeImageWithFoodvisor, loading, error } =
    useFoodvisor();
  const [foodList, setFoodList] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    setFoodList(foodNames);
  }, [foodNames]);

  const addItem = () => {
    if (newItem.trim()) {
      setFoodList([...foodList, newItem.trim()]);
      setNewItem("");
    }
  };

  const deleteItem = (index: number) => {
    setFoodList(foodList.filter((_, i) => i !== index));
  };

  const processImage = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.canceled) {
      setImage(result.assets[0]);
      await analyzeImageWithFoodvisor(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    await processImage(result);
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    await processImage(result);
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!user || !user.id) return;
    if (!latitude || !longitude) return;

    const pickup: Pickup = {
      id: uuid.v4().toString(),
      user_id: user.id,
      latitude: latitude,
      longitude: longitude,
      food_items: foodList,
      status: "pending",
    };

    await addPickup(pickup);
    addNewPickup(pickup);
    toggleModal();
  };

  const isSubmitEnabled = image && foodNames.length > 0;

  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={toggleModal}
        className="bg-red-600 p-4 rounded-lg m-4"
      >
        <Text className="text-white text-center font-bold text-lg">
          Add Food Image
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
          {/* Header */}
          <View className="bg-red-600 p-4">
            <Text className="text-white text-center font-bold text-xl">
              Add Food Photo
            </Text>
          </View>

          {/* Content */}
          <View className="p-6">
            {/* Camera Buttons */}
            <View className="flex-row justify-around mb-6">
              <TouchableOpacity
                onPress={takePhoto}
                className="bg-red-600 p-4 rounded-lg flex-row items-center w-36"
              >
                <Camera color="white" size={24} />
                <Text className="text-white font-semibold ml-2">
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={pickImage}
                className="bg-red-600 p-4 rounded-lg flex-row items-center w-36"
              >
                <Camera color="white" size={24} />
                <Text className="text-white font-semibold ml-2">Gallery</Text>
              </TouchableOpacity>
            </View>

            {/* Image Preview */}
            {image && (
              <View className="mb-4 bg-gray-100 rounded-lg p-2">
                <Image
                  source={{ uri: image.uri }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}

            {/* Loading State */}
            {loading && (
              <Text className="text-center mt-2 text-gray-600">
                Analyzing image...
              </Text>
            )}

            {/* Error State */}
            {error && (
              <Text className="text-center mt-2 text-red-500">
                Error: {error}
              </Text>
            )}

            {(image || foodList.length > 0) && (
              <>
                <View className="mt-4 mb-4">
                  <Text className="font-bold text-lg mb-2 text-gray-800">
                    Detected Foods:
                  </Text>
                  <View className="bg-gray-50 rounded-lg p-3 max-h-32">
                    <FlatList
                      data={foodList}
                      renderItem={({ item, index }) => (
                        <View className="flex-row justify-between items-center mb-1">
                          <Text className="text-base text-gray-700">
                            • {item}
                          </Text>
                          <TouchableOpacity onPress={() => deleteItem(index)}>
                            <Trash2 color="red" size={20} />
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                </View>

                {/* Manual Item Addition */}
                <View className="flex-row mt-2">
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-l-lg p-2"
                    value={newItem}
                    onChangeText={setNewItem}
                    placeholder="Add item manually"
                  />
                  <TouchableOpacity
                    onPress={addItem}
                    className="bg-red-600 rounded-r-lg p-2 justify-center"
                  >
                    <Text className="text-white font-bold">Add</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!isSubmitEnabled}
              className={`mt-4 p-4 rounded-lg ${
                isSubmitEnabled ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  isSubmitEnabled ? "text-white" : "text-gray-500"
                }`}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FoodImageModal;
