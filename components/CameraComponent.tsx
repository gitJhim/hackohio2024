import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList} from "react-native";
import * as ImagePicker from "expo-image-picker";
import useFoodvisor from "../hooks/useFoodvisor";

export default function Test() {
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset>();
    const { foodNames, analyzeImageWithFoodvisor, loading, error } = useFoodvisor();

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
        <View className="">
          <TouchableOpacity
            onPress={takePhoto}
            className="bg-black py-3 px-4 rounded-lg mb-2"
          >
            <Text className="text-white font-semibold text-center">
              Take Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={pickImage}
            className="bg-black py-3 px-4 rounded-lg mb-2"
          >
            <Text className="text-white font-semibold text-center">
              Choose from Gallery
            </Text>
          </TouchableOpacity>

          {image && (
            <View className="mt-2">
              <Image
                source={{ uri: image.uri }}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text className="text-center mt-1 text-green-600">
                Photo Preview
              </Text>
            </View>
          )}

          {loading && <Text className="text-center mt-2">Analyzing image...</Text>}

          {error && <Text className="text-center mt-2 text-red-500">Error: {error}</Text>}

          {foodNames.length > 0 && (
            <View className="mt-4">
              <Text className="font-bold text-lg mb-2">Detected Foods:</Text>
              <FlatList
                data={foodNames}
                renderItem={({ item }) => <Text className="text-base mb-1">• {item}</Text>}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </View>
        
    );
}
