import { useMemo } from "react";
import { FlatList } from "react-native";

import { ExpenseRow } from "@/features/expenses/ExpenseRow";
import { Card } from "@/shared/ui/Card";
import { EmptyState } from "@/shared/ui/EmptyState";
import { Text } from "@/shared/ui/Text";
import { useCategoryStore } from "@/features/categories/useCategoryStore";
import { useExpenseStore } from "@/features/expenses/useExpenseStore";
import { useSettingsStore } from "@/features/settings/useSettingsStore";
import { useWalletStore } from "@/features/wallets/useWalletStore";
import type { Expense } from "@/shared/types";

const RECENT_COUNT = 5;

export function RecentExpenses() {
  const expenses = useExpenseStore((s) => s.expenses);
  const categories = useCategoryStore((s) => s.categories);
  const wallets = useWalletStore((s) => s.wallets);
  const currency = useSettingsStore((s) => s.currency);

  const recent = useMemo(
    () => [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, RECENT_COUNT),
    [expenses],
  );
  const categoryById = useMemo(() => new Map(categories.map((category) => [category.id, category])), [categories]);
  const walletById = useMemo(() => new Map(wallets.map((wallet) => [wallet.id, wallet])), [wallets]);

  return (
    <Card className="gap-sm">
      <Text variant="subtitle">Recent expenses</Text>
      {recent.length === 0 ? (
        <EmptyState title="No expenses yet" description="Your recent expenses will show up here." />
      ) : (
        <FlatList
          data={recent}
          keyExtractor={(item: Expense) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <ExpenseRow
              expense={item}
              category={categoryById.get(item.categoryId)}
              wallet={walletById.get(item.walletId)}
              currency={currency}
            />
          )}
        />
      )}
    </Card>
  );
}
