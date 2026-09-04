import { useMemo } from "react";
import { View } from "react-native";

import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Text } from "@/components/ui/Text";
import { daysUntilNextOccurrence } from "@/lib/date";
import { formatAmount } from "@/lib/money";
import { useRecurringStore } from "@/store/useRecurringStore";
import { useSettingsStore } from "@/store/useSettingsStore";

const DUE_WINDOW_DAYS = 7;

export function UpcomingPayments() {
  const recurringPayments = useRecurringStore((s) => s.recurringPayments);
  const currency = useSettingsStore((s) => s.currency);

  const upcoming = useMemo(
    () =>
      recurringPayments
        .filter((payment) => payment.active)
        .map((payment) => ({ payment, daysUntil: daysUntilNextOccurrence(payment.dayStart, payment.dayEnd) }))
        .filter(({ daysUntil }) => daysUntil <= DUE_WINDOW_DAYS)
        .sort((a, b) => a.daysUntil - b.daysUntil),
    [recurringPayments],
  );

  return (
    <Card className="gap-sm">
      <Text variant="subtitle">Upcoming payments</Text>
      {upcoming.length === 0 ? (
        <EmptyState title="Nothing due soon" description="Recurring bills will appear here as they come up." />
      ) : (
        upcoming.map(({ payment, daysUntil }) => (
          <View key={payment.id} className="min-h-11 flex-row items-center justify-between py-xs">
            <Text variant="body">{payment.name}</Text>
            <View className="items-end">
              <Text variant="amount">{formatAmount(payment.amount, currency)}</Text>
              <Text variant="caption">{daysUntil === 0 ? "Due now" : `In ${daysUntil} day${daysUntil === 1 ? "" : "s"}`}</Text>
            </View>
          </View>
        ))
      )}
    </Card>
  );
}
