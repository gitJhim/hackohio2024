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
import { Star, Package } from "lucide-react-native";
import { useMapStore } from "../state/stores/mapStore";

const NUM_STARS = 5;

const DeliveredScreen = () => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const selectedPickup = useMapStore((state) => state.selectedPickup);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const logoSpinAnim = useRef(new Animated.Value(0)).current;
  const logoPulsateAnim = useRef(new Animated.Value(1)).current;
  const cardBounceAnim = useRef(new Animated.Value(0)).current;
  const starAnims = [...Array(NUM_STARS)].map(() => ({
    scale: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
    position: useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
  }));

  useEffect(() => {
    const starAnimations = starAnims.map((anim, index) => {
      const angle = (index / NUM_STARS) * 2 * Math.PI;
      const radius = 100;
      return Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: 500,
            easing: Easing.back(2),
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim.position, {
            toValue: {
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
            },
            duration: 1000,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

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
      Animated.loop(
        Animated.timing(logoSpinAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(logoPulsateAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(logoPulsateAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.sequence([
        Animated.delay(500),
        Animated.spring(cardBounceAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      ...starAnimations,
    ]).start();

    const timer = setTimeout(() => {
      router.push("/profile");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const logoSpin = logoSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const cardTranslateY = cardBounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [200, 0],
  });

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/bg.png")}
    >
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }, { rotate: spin }],
            },
          ]}
        >
          <Animated.Image
            source={require("../assets/logo.png")}
            style={[
              styles.levelUpImage,
              {
                transform: [{ rotate: logoSpin }, { scale: logoPulsateAnim }],
              },
            ]}
          />
          {starAnims.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.star,
                {
                  opacity: anim.opacity,
                  transform: [
                    { scale: anim.scale },
                    { translateX: anim.position.x },
                    { translateY: anim.position.y },
                  ],
                },
              ]}
            >
              <Star size={24} color="#FFD700" />
            </Animated.View>
          ))}
        </Animated.View>
        <Animated.Text style={[styles.levelUpText, { opacity: opacityAnim }]}>
          Delivered!
        </Animated.Text>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: cardBounceAnim,
              transform: [{ translateY: cardTranslateY }],
            },
          ]}
        >
          <View style={styles.cardContent}>
            <Package size={24} color="#4A90E2" style={styles.cardIcon} />
            <View>
              <Text style={styles.cardTitle}>Package Info</Text>
              <Text style={styles.cardText}>Donation</Text>
              <Text style={styles.cardText}>weight: 2.5 kg</Text>
              <Text style={styles.cardText}>{selectedPickup?.food_items}</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "",
  },
  contentContainer: {
    alignItems: "center",
  },
  animatedContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: 200,
    height: 200,
  },
  levelUpImage: {
    width: 150,
    height: 150,
  },
  levelUpText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  star: {
    position: "absolute",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 20,
    width: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
});

export default DeliveredScreen;

