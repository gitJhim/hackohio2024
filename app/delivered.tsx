import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";
import { useUserStore } from "../state/stores/userStore";
import { useRouter } from "expo-router";

const DeliveredScreen = () => {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const scaleAnim = useRef(new Animated.Value(0)).current();
    const rotateAnim = useRef(new Animated.Value(0)).current();
    const opacityAnim = useRef(new Animated.Value(0)).current();
    
    useEffect(() => {
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.elastic(1),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => router.back(), 3000);
        });
      }, []);




}