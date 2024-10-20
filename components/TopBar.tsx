import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useUserStore } from "../state/stores/userStore";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons

interface TopBarProps {
  showButtons?: boolean;
}

export default function TopBar({ showButtons = true }: TopBarProps) {
  const [activeButton, setActiveButton] = useState("Car");
  const user = useUserStore((state) => state.user);

  if (!user) {
    showButtons = false;
  }

  const getThemeColor = (): string => {
    switch (user?.type) {
      case "driver":
        return "#17A773";
      case "foodbank":
        return "#8B5CF6";
      case "donor":
        return "#EF4444";
      default:
        return "#4285F4"; // Default to Google Maps blue
    }
  };

  const getButtonColor = (): string => {
    return "#FFFFFF"; // White background for buttons
  };

  const themeColor = getThemeColor();
  const buttonColor = getButtonColor();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: themeColor,
      height: 144,
      paddingTop: 36,
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 28,
      padding: 2,
      marginTop: 2,
      width: '80%',
      justifyContent: 'space-around'
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      minWidth: 60,
    },
    activeButton: {
      backgroundColor: buttonColor,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 14,
      marginLeft: 4,
    },
    activeButtonText: {
      color: themeColor,
    },
  });

  return (
    <View style={styles.container}>
      <View className="flex-row items-center w-11/12">
        <View className="flex-row items-center p-2">
          <Image
            source={require("../assets/dummyProfile.png")}
            alt="profile"
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </View>
        <View
          style={{ backgroundColor: buttonColor }}
          className="flex-initial max-w-32 h-12 items-center justify-center p-2 rounded-full ml-2"
        >
          <Text style={{ color: themeColor, fontWeight: "bold" }}>
            {user?.name}
          </Text>
        </View>
      </View>

      {showButtons && (
        <View style={styles.buttonContainer} className="md-4">
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "Car" && styles.activeButton,
            ]}
            onPress={() => setActiveButton("Car")}
          >
            <Ionicons
              name="car"
              size={24}
              color={activeButton === "Car" ? themeColor : "#FFFFFF"}
            />
            <Text
              style={[
                styles.buttonText,
                activeButton === "Car" && styles.activeButtonText,
              ]}
            >
              4 min
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "Walk" && styles.activeButton,
            ]}
            onPress={() => setActiveButton("Walk")}
          >
            <Ionicons
              name="walk"
              size={24}
              color={activeButton === "Walk" ? themeColor : "#FFFFFF"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              activeButton === "Bike" && styles.activeButton,
            ]}
            onPress={() => setActiveButton("Bike")}
          >
            <Ionicons
              name="bicycle"
              size={24}
              color={activeButton === "Bike" ? themeColor : "#FFFFFF"}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

