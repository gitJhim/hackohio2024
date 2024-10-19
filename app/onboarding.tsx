import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Building2, Truck, Heart } from "lucide-react-native";
import { setUserType } from "../utils/db/auth";
import { useUserStore } from "../state/stores/userStore";
import { useRouter } from "expo-router";

const OnboardingScreen = () => {
  const user = useUserStore((state) => state.user);
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();

  const handleTypeSelect = async (type: string) => {
    if (!user || !user.id) {
      return;
    }

    setSelectedRole(type);
  };

  const handleContinue = async () => {
    if (!user || !user.id) {
      return;
    }

    await setUserType(user.id, selectedRole);
    router.navigate("/home");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-3xl font-bold text-gray-800 mb-10">
          I am a...
        </Text>

        <View className="w-full items-center">
          <View className="w-full max-w-xs mb-4">
            <TouchableOpacity
              onPress={() => handleTypeSelect("donor")}
              className={`
                p-6 rounded-2xl border-2
                ${
                  selectedRole === "donor"
                    ? "bg-red-50 border-red-500"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <View className="items-center space-y-4">
                <View
                  className={`
                  p-4 rounded-full 
                  ${selectedRole === "donor" ? "bg-red-100" : "bg-gray-100"}
                `}
                >
                  <Heart
                    size={32}
                    color={selectedRole === "donor" ? "#EF4444" : "#4B5563"}
                  />
                </View>
                <View className="space-y-2">
                  <Text className="text-xl font-semibold text-center text-gray-800">
                    Donor
                  </Text>
                  <Text className="text-sm text-center text-gray-600 max-w-xs mx-auto">
                    I want to donate food to those in need
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          <View className="w-full flex-row justify-evenly space-x-4">
            <TouchableOpacity
              onPress={() => handleTypeSelect("foodbank")}
              className={`
                flex-1 p-6 rounded-2xl border-2 mr-2
                ${
                  selectedRole === "foodbank"
                    ? "bg-purple-50 border-purple-500"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <View className="items-center space-y-4">
                <View
                  className={`
                  p-4 rounded-full 
                  ${selectedRole === "foodbank" ? "bg-purple-100" : "bg-gray-100"}
                `}
                >
                  <Building2
                    size={32}
                    color={selectedRole === "foodbank" ? "#8B5CF6" : "#4B5563"}
                  />
                </View>
                <View className="space-y-2">
                  <Text className="text-xl font-semibold text-center text-gray-800">
                    Food Bank
                  </Text>
                  <Text className="text-sm text-center text-gray-600">
                    I need help with deliveries
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleTypeSelect("driver")}
              className={`
                flex-1 p-6 rounded-2xl border-2 ml-2
                ${
                  selectedRole === "driver"
                    ? "bg-green-50 border-green-500"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <View className="items-center space-y-4">
                <View
                  className={`
                  p-4 rounded-full 
                  ${selectedRole === "driver" ? "bg-green-100" : "bg-gray-100"}
                `}
                >
                  <Truck
                    size={32}
                    color={selectedRole === "driver" ? "#22C55E" : "#4B5563"}
                  />
                </View>
                <View className="space-y-2">
                  <Text className="text-xl font-semibold text-center text-gray-800">
                    Driver
                  </Text>
                  <Text className="text-sm text-center text-gray-600">
                    I deliver food
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <View className="w-full mt-10">
            <TouchableOpacity
              disabled={!selectedRole}
              onPress={handleContinue}
              className={`
                py-4 rounded-xl 
                ${
                  selectedRole === "foodbank"
                    ? "bg-purple-500"
                    : selectedRole === "driver"
                      ? "bg-green-500"
                      : selectedRole === "donor"
                        ? "bg-red-500"
                        : "bg-gray-200"
                }
              `}
            >
              <Text
                className={`
                text-center font-semibold text-base
                ${selectedRole ? "text-white" : "text-gray-400"}
              `}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;
