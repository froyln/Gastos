import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { rescheduleAll } from "@/lib/notifications";
import { runSeedIfNeeded } from "@/lib/seed";
import { useRecurringStore } from "@/store/useRecurringStore";
import { useSettingsStore } from "@/store/useSettingsStore";

export default function RootLayout() {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    runSeedIfNeeded();
    rescheduleAll(useRecurringStore.getState().recurringPayments);
  }, []);

  useEffect(() => {
    colorScheme.set(theme);
  }, [theme]);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal/new-expense" options={{ presentation: "modal" }} />
        <Stack.Screen name="modal/edit-expense" options={{ presentation: "modal" }} />
        <Stack.Screen name="modal/wallet-form" options={{ presentation: "modal" }} />
        <Stack.Screen name="modal/recurring-form" options={{ presentation: "modal" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
