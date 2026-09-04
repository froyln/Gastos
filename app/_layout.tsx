import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { runSeedIfNeeded } from "@/lib/seed";

export default function RootLayout() {
  useEffect(() => {
    runSeedIfNeeded();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal/new-expense" options={{ presentation: "modal" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
