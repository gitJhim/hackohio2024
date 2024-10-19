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
          <Stack.Screen name="signin" options={{ headerShown: false }} />
        </Stack>
      </ErrorBoundary>
    </>
  );
}
