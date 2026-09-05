import { useMemo } from "react";
import { View } from "react-native";

import { Card } from "@/shared/ui/Card";
import { Text } from "@/shared/ui/Text";
import { currentPeriod, isInPeriod } from "@/shared/lib/date";
import { formatAmount } from "@/shared/lib/money";
import { useCategoryStore } from "@/features/categories/useCategoryStore";
import { useExpenseStore } from "@/features/expenses/useExpenseStore";
import { useSettingsStore } from "@/features/settings/useSettingsStore";

export function CategoryBreakdown() {
  const categories = useCategoryStore((s) => s.categories);
  const expenses = useExpenseStore((s) => s.expenses);
  const currency = useSettingsStore((s) => s.currency);
  const monthStartDay = useSettingsStore((s) => s.monthStartDay);

  const rows = useMemo(() => {
    const period = currentPeriod(monthStartDay);
    const periodExpenses = expenses.filter((expense) => isInPeriod(expense.date, period, monthStartDay));
    const total = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return categories
      .map((category) => {
        const amount = periodExpenses
          .filter((expense) => expense.categoryId === category.id)
          .reduce((sum, expense) => sum + expense.amount, 0);
        return { category, amount, percent: total > 0 ? amount / total : 0 };
      })
      .filter((row) => row.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  }, [categories, expenses, monthStartDay]);

  if (rows.length === 0) return null;

  return (
    <Card className="gap-sm">
      <Text variant="subtitle">By category</Text>
      {rows.map(({ category, amount, percent }) => (
        <View key={category.id} className="gap-xs">
          <View className="flex-row justify-between">
            <Text variant="body">{category.name}</Text>
            <Text variant="body" className="font-semibold">
              {formatAmount(amount, currency)}
            </Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-border">
            <View
              className="h-2 rounded-full"
              style={{ width: `${Math.round(percent * 100)}%`, backgroundColor: category.color }}
            />
          </View>
        </View>
      ))}
    </Card>
  );
}
