import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const SignInScreen = () => {
  const handleGoogleSignIn = () => {
    // Implement Google Sign In logic here
    console.log("Google Sign In pressed");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Main Container */}
      <View className="flex-1 justify-center items-center px-6">
        {/* App Name */}
        <Text className="text-3xl font-bold text-gray-800 mb-12">App Name</Text>

        {/* Google Sign In Button */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          className="flex-row items-center justify-center bg-white px-6 py-3 rounded-full border border-gray-300 w-full max-w-xs"
        >
          {/* Google Icon */}
          <Image
            source={{
              uri: "https://cdn.cdnlogo.com/logos/g/35/google-icon.svg",
            }}
            className="w-5 h-5 mr-3"
          />
          <Text className="text-gray-700 font-semibold text-base">
            Sign in with Google
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignInScreen;
