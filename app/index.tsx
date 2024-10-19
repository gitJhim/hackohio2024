import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import CameraComponent from "../components/CameraComponent";
import TopBar from "../components/TopBar";

export default function App() {
  return (
    <CameraComponent/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
