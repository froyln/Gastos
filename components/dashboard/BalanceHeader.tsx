import { useMemo } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui/Text";
import { currentPeriod, isInPeriod } from "@/lib/date";
import { formatAmount } from "@/lib/money";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useWalletStore } from "@/store/useWalletStore";

export function BalanceHeader() {
  const wallets = useWalletStore((s) => s.wallets);
  const expenses = useExpenseStore((s) => s.expenses);
  const incomes = useExpenseStore((s) => s.incomes);
  const currency = useSettingsStore((s) => s.currency);
  const monthStartDay = useSettingsStore((s) => s.monthStartDay);

  const { balance, spent, earned } = useMemo(() => {
    const period = currentPeriod(monthStartDay);
    const balance = wallets.filter((wallet) => !wallet.archived).reduce((sum, wallet) => sum + wallet.balance, 0);
    const spent = expenses
      .filter((expense) => isInPeriod(expense.date, period, monthStartDay))
      .reduce((sum, expense) => sum + expense.amount, 0);
    const earned = incomes
      .filter((income) => isInPeriod(income.date, period, monthStartDay))
      .reduce((sum, income) => sum + income.amount, 0);
    return { balance, spent, earned };
  }, [wallets, expenses, incomes, monthStartDay]);

  return (
    <View className="gap-xs px-lg pt-lg">
      <Text variant="caption">Balance</Text>
      <Text variant="amountLarge">{formatAmount(balance, currency)}</Text>
      <View className="flex-row gap-lg pt-sm">
        <View>
          <Text variant="caption">Spent this period</Text>
          <Text variant="subtitle">{formatAmount(spent, currency)}</Text>
        </View>
        <View>
          <Text variant="caption">Earned this period</Text>
          <Text variant="subtitle">{formatAmount(earned, currency)}</Text>
        </View>
      </View>
    </View>
  );
}
