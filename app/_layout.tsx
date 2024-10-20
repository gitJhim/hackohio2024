import React from "react";

import "../global.css";
import "expo-dev-client";
import { Stack } from "expo-router";
import ErrorBoundary from "react-native-error-boundary";
import { Navigator } from "../components/Navigator";
import Toast, {ErrorToast, BaseToast} from 'react-native-toast-message';
import { useUserStore } from '../state/stores/userStore';

export default function AppLayout() {
  const user = useUserStore((state) => state.user);
  const getHeaderColor = () => {
    switch (user?.type) {
      case 'driver':
        return '#17A773';
      case 'foodbank':
        return '#8B5CF6';
      case 'donor':
        return '#EF4444';
      default:
        return '#808080';
    }
  };

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
          <Stack.Screen name="delivered" options={{ headerShown: false }} />
        </Stack>
        <Navigator />
        <Toast 
          config={{
            success: (props) => (
              <BaseToast
                {...props}
                style={{ borderLeftColor: getHeaderColor() }}
                contentContainerStyle={{ backgroundColor: 'white' }}
                text1Style={{ color: getHeaderColor() }}
              />
            ),
            error: (props) => (
              <ErrorToast
                {...props}
                style={{ borderLeftColor: 'black' }}
                contentContainerStyle={{ backgroundColor: 'pink' }}
                text1Style={{ color: 'darkred' }}
              />
            ),
            // Add more types as needed
          }}
        />
      </ErrorBoundary>
    </>
  );
}
