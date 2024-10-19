import React from "react";
import { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { usePathname, useRouter } from "expo-router";
import { useUserStore } from "../state/stores/userStore";

export const Navigator = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const [visible, isVisible] = useState(true);
  const rotation = useSharedValue(0);
  const offset1 = useSharedValue({ x: 0, y: 0 });
  const offset2 = useSharedValue({ x: 0, y: 0 });
  const offset3 = useSharedValue({ x: 0, y: 0 });

  useEffect(() => {
    if (pathName == "/onboarding" || pathName == "/") {
      isVisible(false);
    } else {
      isVisible(true);
    }
  }, [pathName]);

  const handlePress = () => {
    setOpen(!open);
    rotation.value = withTiming(open ? 0 : 90);

    if (open) {
      offset1.value = withTiming(
        { x: 0, y: 0 },
        { duration: 300, easing: Easing.out(Easing.exp) },
      );
      offset2.value = withTiming(
        { x: 0, y: 0 },
        { duration: 400, easing: Easing.out(Easing.exp) },
      );
      offset3.value = withTiming(
        { x: 0, y: 0 },
        { duration: 500, easing: Easing.out(Easing.exp) },
      );
    } else {
      offset1.value = withTiming(
        { x: -60, y: -60 },
        { duration: 300, easing: Easing.out(Easing.exp) },
      );
      offset2.value = withTiming(
        { x: 0, y: -85 },
        { duration: 400, easing: Easing.out(Easing.exp) },
      );
      offset3.value = withTiming(
        { x: 60, y: -60 },
        { duration: 500, easing: Easing.out(Easing.exp) },
      );
    }
  };

  const onLinkPress = (path: string) => {
    handlePress();
    router.push(path);
  };

  const isActive = (path: string) => {
    return pathName === path;
  };

  const getButtonStyle = () => {
    switch (user?.type) {
      case "foodbank":
        return styles.foodbankbutton;
      case "driver":
        return styles.driverbutton;
      case "donor":
        return styles.donatorbutton;
      default:
        return styles.driverbutton;
    }
  };

  const getActiveButtonStyle = () => {
    switch (user?.type) {
      case "foodbank":
        return styles.foodbankactiveButton;
      case "driver":
        return styles.driveractiveButton;
      case "donor":
        return styles.donatoractiveButton;
      default:
        return styles.driveractiveButton;
    }
  };

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset1.value.x },
      { translateY: offset1.value.y },
    ],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset2.value.x },
      { translateY: offset2.value.y },
    ],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset3.value.x },
      { translateY: offset3.value.y },
    ],
  }));

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <>
      {visible && (
        <View style={styles.container}>
          <TouchableOpacity
            onPress={handlePress}
            style={[getButtonStyle(), styles.mainButton]}
          >
            <Animated.View style={animatedStyles}>
              <MaterialCommunityIcons
                name={open ? "close" : "map"}
                size={30}
                color="#fff"
              />
            </Animated.View>
          </TouchableOpacity>
          <>
            <Animated.View style={[styles.subButton, animatedStyle1]}>
              <TouchableOpacity
                style={
                  isActive("/home") ? getActiveButtonStyle() : getButtonStyle()
                }
                onPress={() => onLinkPress("/home")}
              >
                <MaterialCommunityIcons name="map" size={25} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.subButton, animatedStyle2]}>
              <TouchableOpacity
                style={
                  isActive("/ranking")
                    ? getActiveButtonStyle()
                    : getButtonStyle()
                }
                onPress={() => onLinkPress("/ranking")}
              >
                <MaterialCommunityIcons
                  name="chart-areaspline"
                  size={25}
                  color="#fff"
                />
              </TouchableOpacity>
            </Animated.View>
            <Animated.View style={[styles.subButton, animatedStyle3]}>
              <TouchableOpacity
                style={
                  isActive("/profile")
                    ? getActiveButtonStyle()
                    : getButtonStyle()
                }
                onPress={() => onLinkPress("/profile")}
              >
                <MaterialCommunityIcons name="account" size={25} color="#fff" />
              </TouchableOpacity>
            </Animated.View>
          </>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  foodbankbutton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8B5CF6", // Purple for food bank
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  foodbankactiveButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7C3AED", // Darker purple for active state
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  driverbutton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#17A773", // Green for driver
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  driveractiveButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#217557", // Darker green for active state
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  donatorbutton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444", // Red for donator
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  donatoractiveButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626", // Darker red for active state
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButton: {
    zIndex: 1,
  },
  subButton: {
    position: "absolute",
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
