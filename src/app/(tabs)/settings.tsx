import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RecurringCard } from "@/features/recurring/RecurringCard";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Text } from "@/shared/ui/Text";
import { currentPeriod } from "@/shared/lib/date";
import { hapticImpact } from "@/shared/lib/haptics";
import { requestPermissions } from "@/features/recurring/notifications";
import { useRecurringStore } from "@/features/recurring/useRecurringStore";
import { useSettingsStore } from "@/features/settings/useSettingsStore";
import type { RecurringPayment, Settings } from "@/shared/types";

const THEMES: Settings["theme"][] = ["system", "light", "dark"];

export default function SettingsScreen() {
  const recurringPayments = useRecurringStore((s) => s.recurringPayments);
  const markPaid = useRecurringStore((s) => s.markPaid);
  const currency = useSettingsStore((s) => s.currency);
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const monthStartDay = useSettingsStore((s) => s.monthStartDay);
  const setMonthStartDay = useSettingsStore((s) => s.setMonthStartDay);

  const [permissionDenied, setPermissionDenied] = useState(false);

  const period = currentPeriod(monthStartDay);
  const sortedPayments = useMemo(
    () => [...recurringPayments].sort((a, b) => a.dayStart - b.dayStart),
    [recurringPayments],
  );

  async function handleRequestPermissions() {
    const granted = await requestPermissions();
    setPermissionDenied(!granted);
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={sortedPayments}
        keyExtractor={(item: RecurringPayment) => item.id}
        contentContainerClassName="gap-sm p-lg"
        ListHeaderComponent={
          <View className="gap-lg pb-lg">
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

            <View className="flex-row items-center justify-between">
              <Text variant="subtitle">Recurring payments</Text>
              <Pressable onPress={() => router.push("/recurring-form")} className="min-h-11 justify-center">
                <Text variant="body" className="font-medium text-accent">
                  Add
                </Text>
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No recurring payments"
            description="Add your rent, utilities or subscriptions to get reminders."
          />
        }
        renderItem={({ item }) => (
          <RecurringCard
            payment={item}
            currency={currency}
            isPaidThisPeriod={item.lastPaidPeriod === period}
            onPress={() => router.push({ pathname: "/recurring-form", params: { id: item.id } })}
            onMarkPaid={() => {
              markPaid(item.id, period);
              hapticImpact();
            }}
          />
        )}
      />
    </SafeAreaView>
  );
}
