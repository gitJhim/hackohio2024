import React from "react";

import "../global.css";
import "expo-dev-client";
import { Stack } from "expo-router";
import ErrorBoundary from "react-native-error-boundary";

export default function AppLayout() {
  return (
    <>
      <ErrorBoundary>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack>
      </ErrorBoundary>
    </>
  );
}
