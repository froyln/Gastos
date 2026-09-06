import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RecurringCard } from "@/features/recurring/RecurringCard";
import { requestPermissions } from "@/features/recurring/notifications";
import { selectIsPaidInPeriod, useRecurringStore } from "@/features/recurring/useRecurringStore";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Text } from "@/shared/ui/Text";
import { currentPeriod } from "@/shared/lib/date";
import { formatAmount } from "@/shared/lib/money";
import { hapticSuccess } from "@/shared/lib/haptics";
import { useExpenseStore } from "@/features/expenses/useExpenseStore";
import { useSettingsStore } from "@/features/settings/useSettingsStore";
import { useWalletStore } from "@/features/wallets/useWalletStore";
import type { RecurringPayment } from "@/shared/types";

export default function RecurringScreen() {
  const recurringPayments = useRecurringStore((s) => s.recurringPayments);
  const markPaid = useRecurringStore((s) => s.markPaid);
  const expenses = useExpenseStore((s) => s.expenses);
  const wallets = useWalletStore((s) => s.wallets);
  const currency = useSettingsStore((s) => s.currency);
  const monthStartDay = useSettingsStore((s) => s.monthStartDay);

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

  function handleMarkPaid(payment: RecurringPayment) {
    const walletName = wallets.find((item) => item.id === payment.walletId)?.name ?? "its wallet";

    Alert.alert(
      `Mark ${payment.name} as paid`,
      `Records an expense of ${formatAmount(payment.amount, currency)} from ${walletName}.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            try {
              markPaid(payment.id, period);
              hapticSuccess();
            } catch {
              Alert.alert("Couldn't record payment", "Check that its category and wallet still exist.");
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlatList
        data={sortedPayments}
        keyExtractor={(item: RecurringPayment) => item.id}
        contentContainerClassName="gap-sm p-lg"
        ListHeaderComponent={
          <View className="gap-lg pb-lg">
            <View className="flex-row items-center justify-between">
              <Text variant="title">Recurring</Text>
              <Pressable onPress={() => router.push("/recurring-form")} className="min-h-11 justify-center">
                <Text variant="body" className="font-medium text-accent">
                  Add
                </Text>
              </Pressable>
            </View>

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
            isPaidThisPeriod={selectIsPaidInPeriod(expenses, item.id, period, monthStartDay)}
            onPress={() => router.push({ pathname: "/recurring-form", params: { id: item.id } })}
            onMarkPaid={() => handleMarkPaid(item)}
          />
        )}
      />
    </SafeAreaView>
  );
}
