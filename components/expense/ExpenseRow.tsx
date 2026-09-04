import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { useThemeColors } from "@/constants/theme";
import { formatDate } from "@/lib/date";
import { formatAmount } from "@/lib/money";
import type { Category, Expense, Wallet } from "@/types";

type IconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
  expense: Expense;
  category: Category | undefined;
  wallet: Wallet | undefined;
  currency: string;
};

export function ExpenseRow({ expense, category, wallet, currency }: Props) {
  const colors = useThemeColors();
  const iconName = (category?.icon ?? "help-circle") as IconName;

  return (
    <View className="min-h-11 flex-row items-center gap-sm py-sm">
      <View
        className="h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: category ? `${category.color}1A` : colors.border }}
      >
        <Ionicons name={iconName} size={18} color={category?.color ?? colors.muted} />
      </View>
      <View className="flex-1">
        <Text variant="body">{expense.merchant ?? category?.name ?? "Expense"}</Text>
        <Text variant="caption">
          {wallet?.name ?? "Unknown wallet"} · {formatDate(expense.date)}
        </Text>
      </View>
      <Text variant="amount">{formatAmount(expense.amount, currency)}</Text>
    </View>
  );
}
