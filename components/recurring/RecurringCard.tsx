import { Pressable, View } from "react-native";

import { Card } from "@/components/ui/Card";
import { Text } from "@/components/ui/Text";
import { formatAmount } from "@/lib/money";
import type { RecurringPayment } from "@/types";

type Props = {
  payment: RecurringPayment;
  currency: string;
  isPaidThisPeriod: boolean;
  onPress: () => void;
  onMarkPaid: () => void;
};

export function RecurringCard({ payment, currency, isPaidThisPeriod, onPress, onMarkPaid }: Props) {
  return (
    <Pressable onPress={onPress}>
      <Card className="gap-xs">
        <View className="flex-row items-center justify-between">
          <Text variant="body">{payment.name}</Text>
          <Text variant="amount">{formatAmount(payment.amount, currency)}</Text>
        </View>
        <Text variant="caption">
          Days {payment.dayStart}-{payment.dayEnd} · {payment.active ? "Active" : "Inactive"}
        </Text>
        {isPaidThisPeriod ? (
          <Text variant="caption" className="text-accent">
            Paid this period
          </Text>
        ) : (
          <Pressable onPress={onMarkPaid} className="min-h-11 justify-center self-start">
            <Text variant="body" className="font-medium text-accent">
              Mark as paid
            </Text>
          </Pressable>
        )}
      </Card>
    </Pressable>
  );
}
