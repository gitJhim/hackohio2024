import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
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
        className="m-0 mt-16 justify-end"
      >
        <View className="bg-white rounded-t-3xl p-6 h-5/6">
          <View className="items-center mb-6">
            <View className="w-16 h-1 bg-gray-300 rounded-full mb-4" />
            <Text className="text-2xl font-bold text-red-600">
              Add Food Photo
            </Text>
          </View>

          <View className="flex-row justify-around mb-6">
            <TouchableOpacity
              onPress={takePhoto}
              className="bg-red-600 p-4 rounded-lg flex-row items-center w-36"
            >
              <Camera className="text-white mr-2" size={24} />
              <Text className="text-white font-semibold">Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              className="bg-red-600 p-4 rounded-lg flex-row items-center w-36"
            >
              <Camera className="text-white mr-2" size={24} />
              <Text className="text-white font-semibold">Gallery</Text>
            </TouchableOpacity>
          </View>

          {image && (
            <View className="mb-4">
              <Image
                source={{ uri: image.uri }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
            </View>
          )}
          {loading && (
            <Text className="text-center mt-2">Analyzing image...</Text>
          )}

          {error && (
            <Text className="text-center mt-2 text-red-500">
              Error: {error}
            </Text>
          )}

          {foodNames.length > 0 && (
            <View className="mt-4">
              <Text className="font-bold text-lg mb-2">Detected Foods:</Text>
              <FlatList
                data={foodNames}
                renderItem={({ item }) => (
                  <Text className="text-base mb-1">• {item}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default FoodImageModal;
