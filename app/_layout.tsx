import React from "react";

import "../global.css";
import "expo-dev-client";
import { Stack } from "expo-router";
import ErrorBoundary from "react-native-error-boundary";
import { Navigator } from "../components/Navigator";

export default function AppLayout() {
  return (
    <>
      <ErrorBoundary>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="inputaddress" options={{ headerShown: false }} />
          <Stack.Screen name="request" options={{ headerShown: false }} />
        </Stack>
        <Navigator />
      </ErrorBoundary>
    </>
  );
}
