import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { rescheduleAll } from "@/features/recurring/notifications";
import { runSeedIfNeeded } from "@/shared/seed";
import { useRecurringStore } from "@/features/recurring/useRecurringStore";
import { useSettingsStore } from "@/features/settings/useSettingsStore";

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
        <Stack.Screen name="(modals)/new-expense" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/edit-expense" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/wallet-form" options={{ presentation: "modal" }} />
        <Stack.Screen name="(modals)/recurring-form" options={{ presentation: "modal" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
