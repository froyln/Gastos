import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { requestPermissions } from "@/features/recurring/notifications";
import { useSettingsStore } from "@/features/settings/useSettingsStore";
import { Text } from "@/shared/ui/Text";
import type { Settings } from "@/shared/types";

const THEMES: Settings["theme"][] = ["system", "light", "dark"];

export default function SettingsScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const monthStartDay = useSettingsStore((s) => s.monthStartDay);
  const setMonthStartDay = useSettingsStore((s) => s.setMonthStartDay);

  const [permissionDenied, setPermissionDenied] = useState(false);

  async function handleRequestPermissions() {
    const granted = await requestPermissions();
    setPermissionDenied(!granted);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="gap-lg p-lg">
        <Text variant="title">Settings</Text>

        <View className="gap-sm">
          <Text variant="subtitle">Notifications</Text>
          <Pressable
            onPress={handleRequestPermissions}
            className="min-h-11 justify-center rounded-xl border border-border bg-surface px-md"
          >
            <Text variant="body">Enable reminders</Text>
          </Pressable>
          {permissionDenied ? (
            <Text variant="caption">
              Notifications are disabled. The app still works, but you won't get payment reminders.
            </Text>
          ) : null}
        </View>

        <View className="gap-sm">
          <Text variant="subtitle">Theme</Text>
          <View className="flex-row gap-sm">
            {THEMES.map((option) => (
              <Pressable
                key={option}
                onPress={() => setTheme(option)}
                className={`min-h-11 flex-1 items-center justify-center rounded-xl border px-md ${
                  theme === option ? "border-accent bg-accent" : "border-border bg-surface"
                }`}
              >
                <Text variant="body" className={theme === option ? "text-white" : "text-text"}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="gap-sm">
          <Text variant="subtitle">Month start day</Text>
          <View className="flex-row items-center gap-md">
            <Pressable
              onPress={() => setMonthStartDay(monthStartDay - 1)}
              className="min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-surface"
            >
              <Text variant="body">-</Text>
            </Pressable>
            <Text variant="subtitle">{monthStartDay}</Text>
            <Pressable
              onPress={() => setMonthStartDay(monthStartDay + 1)}
              className="min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-surface"
            >
              <Text variant="body">+</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
