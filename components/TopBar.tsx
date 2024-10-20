import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useUserStore } from "../state/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useMapStore } from "../state/stores/mapStore";
import Toast from "react-native-toast-message";

export default function TopBar() {
  const [activeButton, setActiveButton] = useState("Car");
  const [showButtons, setShowButtons] = useState(false);
  const user = useUserStore((state) => state.user);
  const estimatedTime = useMapStore((state) => state.estimatedTime);

  useEffect(() => {
    if (user?.type === "driver") {
      setShowButtons(true);
    }
  }, [user?.type]);

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

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "",
      text2: "",
    });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: themeColor,
      height: showButtons ? 144 : 100,
      paddingTop: 36,
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 28,
      padding: 2,
      marginTop: 2,
      width: "80%",
      justifyContent: "space-around",
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
        <View className="flex-row items-center p-2 pr-3">
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
              {estimatedTime}
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
