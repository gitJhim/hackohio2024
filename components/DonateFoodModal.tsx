import { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import Modal from "react-native-modal";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useFoodvisor } from "../hooks/useFoodvisor";

const FoodImageModal = ({
  setModalVisible,
  isModalVisible,
}: {
  setModalVisible: () => void;
  isModalVisible: boolean;
}) => {
  const toggleModal = () => {
    setModalVisible();
  };
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
  const { foodNames, analyzeImageWithFoodvisor, loading, error } =
    useFoodvisor();

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

  const handleSubmit = () => {
    // Handle submit logic here
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

            {/* Food Items List */}
            {foodNames.length > 0 && (
              <View className="mt-4 mb-4">
                <Text className="font-bold text-lg mb-2 text-gray-800">
                  Detected Foods:
                </Text>
                <View className="bg-gray-50 rounded-lg p-3 max-h-32">
                  <FlatList
                    data={foodNames}
                    renderItem={({ item }) => (
                      <Text className="text-base mb-1 text-gray-700">
                        • {item}
                      </Text>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              </View>
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
